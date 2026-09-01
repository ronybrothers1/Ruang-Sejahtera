import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/admin-session';
import { isDatabaseConfigured } from '@/lib/auth/config';
import { submitMembershipExam } from '@/lib/membership';
import { hasAllowedFormContentType, isDeclaredBodyWithinLimit } from '@/lib/security/request-limits';
import { isSameOriginRequest } from '@/lib/security/same-origin';

export const dynamic = 'force-dynamic';

function resultRedirect(request: Request, result: string) {
  return NextResponse.redirect(new URL(`/akun/keanggotaan?result=${result}`, request.url), 303);
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Permintaan ditolak.' }, { status: 403 });
  if (!hasAllowedFormContentType(request)) return NextResponse.json({ error: 'Content-Type tidak didukung.' }, { status: 415 });
  if (!isDeclaredBodyWithinLimit(request, 16_384)) return NextResponse.json({ error: 'Payload terlalu besar.' }, { status: 413 });
  if (!isDatabaseConfigured()) return resultRedirect(request, 'error');

  const session = await getAdminSession();
  if (!session || session.role !== 'member' || !session.identityProviderId) {
    return NextResponse.json({ error: 'Akun anggota diperlukan.' }, { status: 403 });
  }

  try {
    const form = await request.formData();
    const attemptId = String(form.get('attemptId') || '');
    if (!attemptId) return resultRedirect(request, 'error');

    const answers: Record<string, string> = {};
    for (const [key, value] of form.entries()) {
      if (key.startsWith('question-') && typeof value === 'string') {
        answers[key.slice('question-'.length)] = value;
      }
    }

    const result = await submitMembershipExam({
      userId: session.id,
      attemptId,
      answers,
    });
    return resultRedirect(request, result.passed ? 'passed' : 'failed');
  } catch (error) {
    const reason = error instanceof Error ? error.message : '';
    if (reason === 'EXAM_TIME_EXPIRED') return resultRedirect(request, 'expired');
    if (reason === 'EXAM_WEEKLY_LIMIT') return resultRedirect(request, 'limit');
    if (reason === 'EXAM_ALREADY_PASSED') return resultRedirect(request, 'passed');
    if (reason === 'EXAM_INCOMPLETE') return resultRedirect(request, 'error');
    return resultRedirect(request, 'error');
  }
}
