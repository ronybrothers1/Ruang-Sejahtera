import Image from 'next/image';
import Link from 'next/link';

export function BrandLogo({ compact = false, priority = false }: { compact?: boolean; priority?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand-logo-link ${compact ? 'brand-logo-link-compact' : 'brand-logo-link-full'}`}
      aria-label="Yayasan Ruang Sejahtera, kembali ke beranda"
    >
      <Image
        src="/brand/logo-ruang-sejahtera.webp"
        alt="Logo resmi Yayasan Ruang Sejahtera"
        width={1000}
        height={453}
        priority={priority}
        unoptimized
        sizes={compact ? '(max-width: 430px) 144px, (max-width: 1023px) 164px, 190px' : '(max-width: 768px) 240px, 330px'}
        className="brand-logo-image"
      />
    </Link>
  );
}
