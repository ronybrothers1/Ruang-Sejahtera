import { NextResponse } from 'next/server';
import { getAdminSession, hasControlPlaneAccess } from '@/lib/auth/admin-session';
import { can } from '@/lib/auth/permissions';
import { findUserByEmail, seedInitialSuperAdmin } from '@/lib/db/users';
import type { AdminSession } from '@/lib/auth/admin-session';
import { archiveFinancialReport, createFinancialReport, publishFinancialReport, updateFinancialReport } from '@/lib/finance';
import { isDatabaseConfigured } from '@/lib/auth/config';
import { hasAllowedFormContentType, readFormDataWithinLimit, RequestBodyTooLargeError } from '@/lib/security/request-limits';
import { isSameOriginRequest } from '@/lib/security/same-origin';

export const dynamic = 'force-dynamic';

async function resolveActorId(session: AdminSession) {
  if (session.authMethod !== 'bootstrap') return session.id;
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase() || '';
  if (!email) throw new Error('BOOTSTRAP_EMAIL_NOT_CONFIGURED');
  const existing = await findUserByEmail(email);
  if (existing?.role === 'super_admin' && existing.isActive && !existing.deletedAt) return existing.id;
  const admin = await seedInitialSuperAdmin({ email, fullName: 'Super Admin Ruang Sejahtera' });
  return admin.id;
}

function positiveInteger(form: FormData, key: string) {
  const raw = String(form.get(key) || '').trim();
  if (!/^\d+$/.test(raw)) throw new Error('FINANCE_AMOUNT_INVALID');
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 0) throw new Error('FINANCE_AMOUNT_INVALID');
  return value;
}

function reportInput(form: FormData) {
  return {
    period: String(form.get('period') || '').trim(),
    reportDate: String(form.get('reportDate') || '').trim(),
    title: String(form.get('title') || '').trim(),
    description: String(form.get('description') || '').trim(),
    totalIncome: positiveInteger(form, 'totalIncome'),
    totalDisbursement: positiveInteger(form, 'totalDisbursement'),
    operationalCost: positiveInteger(form, 'operationalCost'),
  };
}

function redirectWith(request: Request, query: string) {
  return NextResponse.redirect(new URL(`/admin/transparansi?${query}`, request.url), 303);
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Permintaan ditolak.' }, { status: 403 });
  if (!hasAllowedFormContentType(request)) return NextResponse.json({ error: 'Content-Type tidak didukung.' }, { status: 415 });
  if (!isDatabaseConfigured()) return redirectWith(request, 'error=database');

  const session = await getAdminSession();
  if (!session || session.role !== 'super_admin' || !can(session.role, 'finance.manage') || !(await hasControlPlaneAccess(session))) {
    return NextResponse.json({ error: 'Akses Super Admin diperlukan.' }, { status: 403 });
  }

  let form: FormData;
  try {
    form = await readFormDataWithinLimit(request, 100_000);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) return NextResponse.json({ error: 'Payload terlalu besar.' }, { status: 413 });
    return redirectWith(request, 'error=form');
  }
  const intent = String(form.get('intent') || '');

  try {
    const actorUserId = await resolveActorId(session);
    if (intent === 'create') {
      const report = await createFinancialReport({ ...reportInput(form), actorUserId });
      return redirectWith(request, `saved=${report.id}`);
    }
    const id = String(form.get('id') || '').trim();
    if (!id) return redirectWith(request, 'error=not-found');
    if (intent === 'update') {
      const report = await updateFinancialReport({ ...reportInput(form), id, actorUserId });
      return redirectWith(request, `saved=${report.id}`);
    }
    if (intent === 'publish') {
      await publishFinancialReport(id, actorUserId);
      return redirectWith(request, `published=${id}`);
    }
    if (intent === 'archive') {
      await archiveFinancialReport(id, actorUserId);
      return redirectWith(request, `archived=${id}`);
    }
    return redirectWith(request, 'error=operation');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'FINANCE_SAVE_FAILED';
    const known = new Set(['FINANCE_PERIOD_INVALID', 'FINANCE_DATE_INVALID', 'FINANCE_TITLE_INVALID', 'FINANCE_DESCRIPTION_INVALID', 'FINANCE_AMOUNT_INVALID', 'FINANCE_REPORT_NOT_FOUND']);
    return redirectWith(request, `error=${known.has(message) ? message.toLowerCase() : 'save'}`);
  }
}
