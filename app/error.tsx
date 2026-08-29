"use client";

import { AlertTriangle } from 'lucide-react';
import { PageState } from '@/components/PageState';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <PageState eyebrow="Terjadi gangguan" title="Halaman belum dapat dimuat." description="Tidak ada data yang diubah. Silakan coba lagi." icon={<AlertTriangle size={26} />} actions={<button type="button" className="trust-button trust-button-primary" onClick={() => reset()}>Coba Lagi</button>} />;
}
