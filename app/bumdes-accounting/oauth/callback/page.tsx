'use client';

import { useEffect, useState } from 'react';

const CALLBACK_TYPE = 'BUMDES_GOOGLE_OIDC_CALLBACK';
const ALLOWED_PARAMS = ['code', 'state', 'scope', 'authuser', 'prompt', 'error', 'error_description'] as const;

export default function BumdesAccountingOAuthCallbackPage() {
  const [message, setMessage] = useState('Menyelesaikan login Google...');

  useEffect(() => {
    try {
      const current = new URL(window.location.href);
      const payload: Record<string, string> = { type: CALLBACK_TYPE };

      for (const key of ALLOWED_PARAMS) {
        const value = current.searchParams.get(key);
        if (value) payload[key] = value;
      }

      if (!payload.code && !payload.error) {
        setMessage('Callback Google tidak membawa hasil autentikasi. Silakan kembali ke aplikasi dan login ulang.');
        return;
      }

      if (!window.opener || window.opener.closed) {
        setMessage('Jendela aplikasi asal tidak tersedia. Tutup halaman ini lalu ulangi login dari aplikasi.');
        return;
      }

      // The opener is the sandboxed Apps Script HTML iframe, whose googleusercontent
      // origin is generated dynamically. The opener validates this page's fixed
      // ruangsejahtera.web.id origin before accepting the one-time OAuth result.
      window.opener.postMessage(payload, '*');
      setMessage('Login Google diterima. Jendela ini akan ditutup otomatis.');

      window.setTimeout(() => {
        window.close();
      }, 250);
    } catch {
      setMessage('Callback Google tidak dapat diproses. Silakan kembali ke aplikasi dan login ulang.');
    }
  }, []);

  return (
    <main style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: '48px 24px' }}>
      <section style={{ maxWidth: 680 }}>
        <p style={{ fontWeight: 700, letterSpacing: '0.04em' }}>BUM DESA ACCOUNTING</p>
        <h1>Menyelesaikan login</h1>
        <p>{message}</p>
        <p>Halaman ini tidak menyimpan token Google atau kredensial pengguna.</p>
      </section>
    </main>
  );
}
