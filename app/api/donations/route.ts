import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  return NextResponse.json(
    {
      code: 'PAYMENT_NOT_CONFIGURED',
      message: 'Donasi online belum diaktifkan. Gunakan hanya kanal resmi yang telah dipublikasikan Yayasan Ruang Sejahtera.',
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
