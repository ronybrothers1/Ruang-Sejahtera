"use client";

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { PreviewForm } from './PreviewForm';

export function DonationPreviewForm({ amounts }: { amounts: readonly string[] }) {
  const [selectedAmount, setSelectedAmount] = useState<string | null>(amounts[2] ?? amounts[0] ?? null);

  return (
    <PreviewForm className="trust-preview-form" ariaLabel="Formulir donasi simulasi">
      <fieldset>
        <legend>Pilih program</legend>
        <div className="trust-option-grid">
          <label><input type="radio" name="program" value="air-bersih" defaultChecked /> Air Bersih</label>
          <label><input type="radio" name="program" value="sembako" /> Sembako</label>
          <label><input type="radio" name="program" value="pendidikan" /> Pendidikan</label>
          <label><input type="radio" name="program" value="kemanusiaan" /> Kemanusiaan</label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Nominal donasi</legend>
        <div className="trust-amount-grid">
          {amounts.map((amount) => {
            const selected = amount === selectedAmount;
            return (
              <button
                type="button"
                aria-pressed={selected}
                className={selected ? 'is-active' : undefined}
                key={amount}
                onClick={() => setSelectedAmount(amount)}
              >
                {amount}
              </button>
            );
          })}
        </div>
        <label>
          Nominal lainnya
          <input
            type="text"
            name="customAmount"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={15}
            placeholder="Masukkan nominal"
            onFocus={() => setSelectedAmount(null)}
            onInput={() => setSelectedAmount(null)}
          />
        </label>
      </fieldset>
      <div className="trust-form-grid">
        <label>Nama<input type="text" name="name" autoComplete="name" maxLength={120} placeholder="Nama donatur (contoh)" /></label>
        <label>Email<input type="email" name="email" autoComplete="email" maxLength={254} placeholder="nama@email.com" /></label>
      </div>
      <button type="button" disabled><Heart size={17} aria-hidden="true" /> Lanjutkan Pembayaran · SIMULASI</button>
    </PreviewForm>
  );
}
