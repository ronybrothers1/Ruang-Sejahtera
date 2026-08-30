import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { and, desc, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import {
  examAnswers,
  examAttempts,
  examQuestions,
  examSettings,
  memberCards,
  users,
  type UserRow,
} from '@/lib/db/schema';

export const defaultExamQuestions = [
  {
    dimension: 'Nilai dasar',
    prompt: 'Apa tujuan utama Yayasan Ruang Sejahtera?',
    options: [
      { id: 'a', label: 'Melayani kebutuhan masyarakat dan memperkuat kesejahteraan bersama.', score: 20 },
      { id: 'b', label: 'Mendahulukan kepentingan pribadi pengurus.', score: 0 },
      { id: 'c', label: 'Menggunakan data anggota untuk kepentingan lain.', score: 0 },
    ],
  },
  {
    dimension: 'Integritas',
    prompt: 'Bagaimana sikap anggota ketika mengelola informasi penerima manfaat?',
    options: [
      { id: 'a', label: 'Menjaga kerahasiaan dan menggunakan informasi hanya untuk tujuan yang sah.', score: 20 },
      { id: 'b', label: 'Membagikannya kepada siapa saja agar cepat dikenal.', score: 0 },
      { id: 'c', label: 'Mengubah data agar terlihat lebih banyak.', score: 0 },
    ],
  },
  {
    dimension: 'Konten',
    prompt: 'Apa yang harus dilakukan sebelum berita anggota tampil di website publik?',
    options: [
      { id: 'a', label: 'Berita dikirim sebagai draft untuk melalui proses kurasi.', score: 20 },
      { id: 'b', label: 'Berita langsung terbit tanpa pemeriksaan.', score: 0 },
      { id: 'c', label: 'Menghapus nama dan sumber informasi.', score: 0 },
    ],
  },
  {
    dimension: 'Perlindungan',
    prompt: 'Apa yang perlu diperhatikan ketika mengunggah foto penerima manfaat?',
    options: [
      { id: 'a', label: 'Memastikan penggunaan foto layak, relevan, dan memiliki persetujuan yang diperlukan.', score: 20 },
      { id: 'b', label: 'Mengunggah semua foto tanpa pertimbangan.', score: 0 },
      { id: 'c', label: 'Menambahkan keterangan yang tidak sesuai kenyataan.', score: 0 },
    ],
  },
  {
    dimension: 'Tanggung jawab',
    prompt: 'Jika menemukan kesalahan dalam berita yang dikirim, apa tindakan yang tepat?',
    options: [
      { id: 'a', label: 'Melaporkan dan memperbaikinya secara terbuka melalui alur yang tersedia.', score: 20 },
      { id: 'b', label: 'Membiarkannya selama belum ada yang bertanya.', score: 0 },
      { id: 'c', label: 'Menyalahkan anggota lain tanpa pemeriksaan.', score: 0 },
    ],
  },
] as const;

export type ActiveExam = {
  settings: typeof examSettings.$inferSelect;
  questions: Array<typeof examQuestions.$inferSelect>;
};

export async function getMemberProfile(userId: string): Promise<UserRow | null> {
  const rows = await getDb().select().from(users).where(eq(users.id, userId)).limit(1);
  return rows[0] || null;
}

export async function getActiveExam(createdBy: string): Promise<ActiveExam> {
  const db = getDb();
  let settings = (await db.select().from(examSettings).where(eq(examSettings.isActive, true)).limit(1))[0];

  if (!settings) {
    settings = (await db.insert(examSettings).values({
      version: 1,
      passingScore: 75,
      durationMinutes: 30,
      maximumAttempts: 3,
      retryDelayDays: 0,
      isActive: true,
      createdBy,
    }).returning())[0];
  }

  let questions = await db.select().from(examQuestions)
    .where(and(eq(examQuestions.settingsId, settings.id), eq(examQuestions.isActive, true)))
    .orderBy(examQuestions.displayOrder);

  if (!questions.length) {
    questions = await db.insert(examQuestions).values(defaultExamQuestions.map((question, index) => ({
      settingsId: settings.id,
      dimension: question.dimension,
      prompt: question.prompt,
      options: [...question.options],
      displayOrder: index + 1,
      isActive: true,
    }))).returning();
  }

  return { settings, questions };
}

export async function getLatestExamAttempt(userId: string) {
  const rows = await getDb().select().from(examAttempts)
    .where(eq(examAttempts.userId, userId))
    .orderBy(desc(examAttempts.createdAt))
    .limit(1);
  return rows[0] || null;
}

export async function hasPassedExam(userId: string) {
  const rows = await getDb().select({ id: examAttempts.id })
    .from(examAttempts)
    .where(and(eq(examAttempts.userId, userId), eq(examAttempts.passed, true)))
    .limit(1);
  return Boolean(rows[0]);
}

export async function getMemberCard(userId: string) {
  const rows = await getDb().select().from(memberCards).where(eq(memberCards.userId, userId)).limit(1);
  return rows[0] || null;
}

export async function issueMemberCard(userId: string) {
  const existing = await getMemberCard(userId);
  if (existing) return existing;

  const suffix = randomBytes(3).toString('hex').toUpperCase();
  const memberNumber = `RS-${new Date().getFullYear()}-${suffix}`;
  const verificationTokenHash = createHash('sha256').update(randomUUID()).digest('hex');
  const inserted = await getDb().insert(memberCards).values({
    userId,
    memberNumber,
    verificationTokenHash,
    joinedAt: new Date().toISOString().slice(0, 10),
    status: 'active',
    issuedBy: userId,
  }).returning();
  return inserted[0];
}

export async function submitMembershipExam(input: {
  userId: string;
  answers: Record<string, string>;
}) {
  const db = getDb();
  const exam = await getActiveExam(input.userId);
  const previousAttempts = await db.select().from(examAttempts).where(eq(examAttempts.userId, input.userId));
  if (previousAttempts.some((attempt) => attempt.passed)) {
    throw new Error('EXAM_ALREADY_PASSED');
  }
  if (previousAttempts.length >= exam.settings.maximumAttempts) {
    throw new Error('EXAM_ATTEMPTS_EXHAUSTED');
  }

  const answerRows = exam.questions.map((question) => {
    const selectedOptionId = input.answers[question.id];
    const selected = question.options.find((option) => option.id === selectedOptionId);
    if (!selected) throw new Error('EXAM_INCOMPLETE');
    return { questionId: question.id, selectedOptionId, awardedScore: selected.score };
  });
  const automaticScore = answerRows.reduce((total, answer) => total + answer.awardedScore, 0);
  const passed = automaticScore >= exam.settings.passingScore;
  const attempt = (await db.insert(examAttempts).values({
    userId: input.userId,
    settingsId: exam.settings.id,
    attemptNumber: previousAttempts.length + 1,
    status: 'submitted',
    automaticScore,
    finalScore: automaticScore,
    passed,
    submittedAt: new Date(),
    gradedAt: new Date(),
  }).returning())[0];

  await db.insert(examAnswers).values(answerRows.map((answer) => ({
    attemptId: attempt.id,
    questionId: answer.questionId,
    selectedOptionId: answer.selectedOptionId,
    awardedScore: answer.awardedScore,
  })));

  if (passed) {
    await db.update(users).set({
      membershipStatus: 'passed',
      updatedAt: new Date(),
    }).where(eq(users.id, input.userId));
    await issueMemberCard(input.userId);
  } else {
    await db.update(users).set({
      membershipStatus: 'failed',
      updatedAt: new Date(),
    }).where(eq(users.id, input.userId));
  }

  return { attempt, passed, score: automaticScore, passingScore: exam.settings.passingScore };
}
