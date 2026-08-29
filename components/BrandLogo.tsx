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
        alt="Yayasan Ruang Sejahtera"
        width={1000}
        height={453}
        priority={priority}
        sizes={compact ? '(max-width: 430px) 132px, (max-width: 1023px) 150px, 174px' : '(max-width: 768px) 220px, 330px'}
        className="brand-logo-image"
      />
    </Link>
  );
}
