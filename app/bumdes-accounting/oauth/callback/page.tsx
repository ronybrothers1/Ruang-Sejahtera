'use client';

import { useEffect, useState } from 'react';

const CANARY_URL = 'https://script.google.com/macros/s/AKfycbzd-rm09OoqAHumfF8quLu9jsiggRxjYn6bs7kKXlULydBYINQyuHusyJIjUThYEwUi/exec';
const ALLOWED_PARAMS = ['code', 'state', 'scope', 'authuser', 'prompt', 'error', 'error_description'];

export default function BumdesAccountingOAuthCallbackPage() {
  const [message, setMessage] = useState('Menyelesaikan login Google...');

  useEffect(() => {
    try {
      const current = new URL(window.location.href);
      const target = new URL(CANARY_URL);

      for (const key of ALLOWED_PARAMS) {
        const value = current.searchParams.get(key);
        if (value) target.searchParams.set(key, value);
      }

      if (!target.searchParams.has('code') && !target.searchParams.has('error')) {
        setMessage('Callback Google tidak membawa hasil autentikasi. Silakan kembali ke aplikasi dan login ulang.');
        return;
      }

      window.location.replace(target.toString());
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
