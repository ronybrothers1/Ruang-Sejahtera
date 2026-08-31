import { and, desc, eq, isNull } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { auditLogs, financialReports } from '@/lib/db/schema';
import type { PublicationStatus } from '@/lib/models';

export type FinancialReportRecord = {
  id: string;
  period: string;
  title: string;
  totalIncome: number;
  totalDisbursement: number;
  operationalCost: number;
  balance: number;
  status: PublicationStatus;
  createdBy: string;
  publishedAt: string | null;
  publishedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FinancialReportInput = {
  period: string;
  title: string;
  totalIncome: number;
  totalDisbursement: number;
  operationalCost: number;
};

function amount(value: string | number | null | undefined) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toRecord(row: typeof financialReports.$inferSelect): FinancialReportRecord {
  const totalIncome = amount(row.totalIncome);
  const totalDisbursement = amount(row.totalDisbursement);
  const operationalCost = amount(row.operationalCost);
  return {
    id: row.id,
    period: row.period,
    title: row.title,
    totalIncome,
    totalDisbursement,
    operationalCost,
    balance: totalIncome - totalDisbursement - operationalCost,
    status: row.status,
    createdBy: row.createdBy,
    publishedAt: row.publishedAt?.toISOString() || null,
    publishedBy: row.publishedBy,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export async function listFinancialReports(options: { publishedOnly?: boolean } = {}) {
  const conditions = [isNull(financialReports.deletedAt)];
  if (options.publishedOnly) conditions.push(eq(financialReports.status, 'published'));
  const rows = await getDb()
    .select()
    .from(financialReports)
    .where(and(...conditions))
    .orderBy(desc(financialReports.publishedAt), desc(financialReports.period), desc(financialReports.createdAt));
  return rows.map(toRecord);
}

export async function getFinancialReport(id: string) {
  const rows = await getDb()
    .select()
    .from(financialReports)
    .where(and(eq(financialReports.id, id), isNull(financialReports.deletedAt)))
    .limit(1);
  return rows[0] ? toRecord(rows[0]) : null;
}

function validateInput(input: FinancialReportInput) {
  if (!input.period.trim() || input.period.length > 80) throw new Error('FINANCE_PERIOD_INVALID');
  if (!input.title.trim() || input.title.length > 180) throw new Error('FINANCE_TITLE_INVALID');
  if (![input.totalIncome, input.totalDisbursement, input.operationalCost].every((value) => Number.isSafeInteger(value) && value >= 0)) {
    throw new Error('FINANCE_AMOUNT_INVALID');
  }
}

export async function createFinancialReport(input: FinancialReportInput & { actorUserId: string }) {
  validateInput(input);
  const inserted = await getDb().insert(financialReports).values({
    period: input.period.trim(),
    title: input.title.trim(),
    totalIncome: String(input.totalIncome),
    totalDisbursement: String(input.totalDisbursement),
    operationalCost: String(input.operationalCost),
    createdBy: input.actorUserId,
    status: 'draft',
  }).returning();
  const report = inserted[0];
  await getDb().insert(auditLogs).values({
    actorUserId: input.actorUserId,
    actorRole: 'super_admin',
    action: 'finance.report_created',
    resourceType: 'financial_report',
    resourceId: report.id,
    metadata: { status: 'draft' },
  });
  return toRecord(report);
}

export async function updateFinancialReport(input: FinancialReportInput & { id: string; actorUserId: string }) {
  validateInput(input);
  const updated = await getDb().update(financialReports).set({
    period: input.period.trim(),
    title: input.title.trim(),
    totalIncome: String(input.totalIncome),
    totalDisbursement: String(input.totalDisbursement),
    operationalCost: String(input.operationalCost),
    updatedAt: new Date(),
  }).where(and(eq(financialReports.id, input.id), isNull(financialReports.deletedAt))).returning();
  const report = updated[0];
  if (!report) throw new Error('FINANCE_REPORT_NOT_FOUND');
  if (report.status === 'published') {
    await getDb().update(financialReports).set({
      status: 'draft',
      publishedAt: null,
      publishedBy: null,
      updatedAt: new Date(),
    }).where(eq(financialReports.id, report.id));
  }
  await getDb().insert(auditLogs).values({
    actorUserId: input.actorUserId,
    actorRole: 'super_admin',
    action: 'finance.report_updated',
    resourceType: 'financial_report',
    resourceId: report.id,
    metadata: { status: report.status === 'published' ? 'draft' : report.status },
  });
  const refreshed = await getFinancialReport(report.id);
  if (!refreshed) throw new Error('FINANCE_REPORT_NOT_FOUND');
  return refreshed;
}

export async function publishFinancialReport(id: string, actorUserId: string) {
  const updated = await getDb().update(financialReports).set({
    status: 'published',
    publishedAt: new Date(),
    publishedBy: actorUserId,
    updatedAt: new Date(),
  }).where(and(eq(financialReports.id, id), isNull(financialReports.deletedAt))).returning();
  const report = updated[0];
  if (!report) throw new Error('FINANCE_REPORT_NOT_FOUND');
  await getDb().insert(auditLogs).values({
    actorUserId,
    actorRole: 'super_admin',
    action: 'finance.report_published',
    resourceType: 'financial_report',
    resourceId: report.id,
    metadata: { status: 'published' },
  });
  return toRecord(report);
}

export async function archiveFinancialReport(id: string, actorUserId: string) {
  const updated = await getDb().update(financialReports).set({
    status: 'archived',
    updatedAt: new Date(),
  }).where(and(eq(financialReports.id, id), isNull(financialReports.deletedAt))).returning();
  const report = updated[0];
  if (!report) throw new Error('FINANCE_REPORT_NOT_FOUND');
  await getDb().insert(auditLogs).values({
    actorUserId,
    actorRole: 'super_admin',
    action: 'finance.report_archived',
    resourceType: 'financial_report',
    resourceId: report.id,
    metadata: { status: 'archived' },
  });
  return toRecord(report);
}
