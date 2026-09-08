'use client';

import { Download } from 'lucide-react';

export function PrintCardButton() {
  return (
    <button type="button" className="button-primary member-card-actions inline-flex items-center gap-2" onClick={() => window.print()}>
      <Download size={17} aria-hidden="true" />
      Unduh kartu sebagai PDF
    </button>
  );
}
