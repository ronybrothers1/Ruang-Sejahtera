import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/admin-session';
import { can } from '@/lib/auth/permissions';
import { getCmsWriteStatus, persistCmsMutation } from '@/lib/cms/store';
import { CmsValidationError, isCmsCollection, parseCreateContent } from '@/lib/cms/validation';
import { hasAllowedFormContentType, isDeclaredBodyWithinLimit } from '@/lib/security/request-limits';
import { isSameOriginRequest } from '@/lib/security/same-origin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Permintaan ditolak.' }, { status: 403 });
  if (!hasAllowedFormContentType(request)) return NextResponse.json({ error: 'Content-Type tidak didukung.' }, { status: 415 });
  if (!isDeclaredBodyWithinLimit(request, 64_000)) return NextResponse.json({ error: 'Payload terlalu besar.' }, { status: 413 });

  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Autentikasi diperlukan.' }, { status: 401 });
  if (!can(session.role, 'content.create')) return NextResponse.json({ error: 'Tidak memiliki izin.' }, { status: 403 });

  const form = await request.formData();
  const collectionValue = String(form.get('collection') || '');
  const intent = String(form.get('intent') || '');
  if (!isCmsCollection(collectionValue) || intent !== 'create') return NextResponse.json({ error: 'Operasi tidak valid.' }, { status: 400 });

  try {
    const record = parseCreateContent(collectionValue, form, session.id);
    const status = getCmsWriteStatus();
    if (!status.configured) return NextResponse.json({ error: 'Backend tulis CMS belum dikonfigurasi.' }, { status: 503 });
    await persistCmsMutation({ collection: collectionValue, action: 'create', records: [record] });
    return NextResponse.redirect(new URL('/admin/konten?queued=1', request.url), 303);
  } catch (error) {
    if (error instanceof CmsValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ error: 'Penyimpanan konten gagal.' }, { status: 503 });
  }
}
