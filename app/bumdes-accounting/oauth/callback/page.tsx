import { redirect } from 'next/navigation';

const CANARY_URL =
  'https://script.google.com/macros/s/AKfycbz8hvrwqvDS4H55srR' +
  'P14IpgSKHHG_WQdNtCI6qCvAmcS4w7uYye-Qoz9-TVr01WIA9/exec';
const ALLOWED_PARAMS = ['code', 'state', 'scope', 'authuser', 'prompt', 'error', 'error_description'] as const;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const dynamic = 'force-dynamic';

export default async function BumdesAccountingOAuthCallbackPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const incoming = await searchParams;
  const outgoing = new URLSearchParams();

  for (const key of ALLOWED_PARAMS) {
    const raw = incoming[key];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (value) outgoing.set(key, value);
  }

  const hasCode = outgoing.has('code');
  const hasError = outgoing.has('error');
  const hasState = outgoing.has('state');

  if (hasState && hasCode !== hasError) {
    redirect(`${CANARY_URL}?${outgoing.toString()}`);
  }

  return (
    <main style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: '48px 24px' }}>
      <section style={{ maxWidth: 680 }}>
        <p style={{ fontWeight: 700, letterSpacing: '0.04em' }}>BUM DESA ACCOUNTING</p>
        <h1>Callback login tidak lengkap</h1>
        <p>Google tidak mengirimkan kombinasi parameter OAuth yang dapat diproses dengan aman.</p>
        <p>Silakan kembali ke BUM Desa Accounting dan mulai proses login kembali.</p>
      </section>
    </main>
  );
}
