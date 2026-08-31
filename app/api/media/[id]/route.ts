import { get } from '@vercel/blob';
import { and, eq, isNull } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getAdminSession, hasControlPlaneAccess } from '@/lib/auth/admin-session';
import { getDb } from '@/lib/db';
import { mediaAssets } from '@/lib/db/schema';
import { isBlobStorageConfigured } from '@/lib/security/image-upload';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session || !(await hasControlPlaneAccess(session))) {
    return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 });
  }
  if (!isBlobStorageConfigured()) return NextResponse.json({ error: 'Media belum dikonfigurasi.' }, { status: 503 });

  const { id } = await params;
  const rows = await getDb().select({
    objectKey: mediaAssets.objectKey,
    mimeType: mediaAssets.mimeType,
    byteSize: mediaAssets.byteSize,
    visibility: mediaAssets.visibility,
  }).from(mediaAssets).where(and(
    eq(mediaAssets.id, id),
    eq(mediaAssets.visibility, 'private'),
    isNull(mediaAssets.deletedAt),
  )).limit(1);
  const media = rows[0];
  if (!media?.objectKey) return NextResponse.json({ error: 'Media tidak ditemukan.' }, { status: 404 });

  const blob = await get(media.objectKey, { access: 'private' });
  if (!blob) return NextResponse.json({ error: 'Media tidak tersedia.' }, { status: 404 });

  return new Response(blob.stream, {
    headers: {
      'Cache-Control': 'private, no-store, max-age=0',
      'Content-Length': String(media.byteSize || blob.blob.size),
      'Content-Type': media.mimeType || blob.blob.contentType || 'application/octet-stream',
      'Content-Disposition': 'inline',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
