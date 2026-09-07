'use client';

import { useEffect } from 'react';

const CALLBACK_TYPE = 'BUMDES_GOOGLE_OIDC_CALLBACK';
const ALLOWED_PARAMS = ['code', 'state', 'scope', 'authuser', 'prompt', 'error', 'error_description'] as const;

export default function BumdesAccountingOAuthCallbackPage() {
  useEffect(() => {
    try {
      const current = new URL(window.location.href);
      const payload: Record<string, string> = { type: CALLBACK_TYPE };

      for (const key of ALLOWED_PARAMS) {
        const value = current.searchParams.get(key);
        if (value) payload[key] = value;
      }

      if ((!payload.code && !payload.error) || !window.opener || window.opener.closed) {
        return;
      }

      // The opener is the sandboxed Apps Script HTML iframe. Its googleusercontent
      // origin is generated dynamically, so the opener validates this page's fixed
      // ruangsejahtera.web.id origin before accepting the one-time OAuth result.
      window.opener.postMessage(payload, '*');
      window.setTimeout(() => window.close(), 250);
    } catch {
      // Fail closed. No token or credential is stored on this page.
    }
  }, []);

  return (
    <main style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: '48px 24px' }}>
      <section style={{ maxWidth: 680 }}>
        <p style={{ fontWeight: 700, letterSpacing: '0.04em' }}>BUM DESA ACCOUNTING</p>
        <h1>Menyelesaikan login</h1>
        <p>Memproses hasil login Google dan mengembalikannya ke aplikasi.</p>
        <p>Halaman ini tidak menyimpan token Google atau kredensial pengguna.</p>
      </section>
    </main>
  );
}
