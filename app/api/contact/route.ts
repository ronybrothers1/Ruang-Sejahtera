import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  return NextResponse.json(
    {
      code: 'CONTACT_BACKEND_NOT_CONFIGURED',
      message: 'Formulir kontak belum diaktifkan. Gunakan hanya kanal kontak resmi yang dipublikasikan yayasan.',
    },
    {
      status: 503,
      headers: {
        'Cache-Control': 'no-store',
        'Retry-After': '86400',
      },
    },
  );
}
