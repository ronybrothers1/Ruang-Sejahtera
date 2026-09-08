import Link from 'next/link';
import { ArrowLeft, BadgeCheck, LockKeyhole, ShieldCheck } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-brand-black text-white">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl lg:grid-cols-[1.05fr_.95fr]">
        <section className="relative hidden overflow-hidden border-r border-white/10 px-10 py-12 lg:flex lg:flex-col lg:justify-between xl:px-16">
          <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-brand-red/20 blur-3xl" aria-hidden="true" />
          <BrandLogo priority />
          <div className="relative max-w-xl pb-8">
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-red-300">{eyebrow}</p>
            <h1 className="mt-5 font-heading text-5xl font-extrabold leading-[1.02] tracking-[-.055em] xl:text-6xl">{title}</h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-neutral-300">{description}</p>
            <div className="mt-9 grid gap-4 text-sm text-neutral-200 sm:grid-cols-3">
              <span className="flex items-center gap-2"><ShieldCheck className="text-red-400" size={19} aria-hidden="true" />Akses berbasis role</span>
              <span className="flex items-center gap-2"><LockKeyhole className="text-red-400" size={19} aria-hidden="true" />Data terlindungi</span>
              <span className="flex items-center gap-2"><BadgeCheck className="text-red-400" size={19} aria-hidden="true" />Kurasi berjenjang</span>
            </div>
          </div>
          <p className="text-xs leading-6 text-neutral-500">Yayasan Ruang Sejahtera · Sistem keanggotaan dan pengelolaan konten</p>
        </section>

        <main className="flex min-h-screen flex-col bg-[var(--color-surface-page)] text-brand-ink">
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-5 sm:px-8 lg:justify-end">
            <div className="lg:hidden"><BrandLogo compact priority /></div>
            <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-neutral-600 hover:text-brand-red">
              <ArrowLeft size={17} aria-hidden="true" />Kembali ke website
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
