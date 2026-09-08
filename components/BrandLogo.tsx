import Image from 'next/image';
import Link from 'next/link';

export function BrandLogo({ compact = false, priority = false, className = '' }: { compact?: boolean; priority?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      className={`brand-logo-link ${compact ? 'brand-logo-link-compact' : 'brand-logo-link-full'} ${className}`.trim()}
      aria-label="Yayasan Ruang Sejahtera, kembali ke beranda"
    >
      <Image
        src="/brand/logo-ruang-sejahtera-transparent.svg"
        alt="Logo resmi Yayasan Ruang Sejahtera"
        width={564}
        height={251}
        priority={priority}
        unoptimized
        sizes={compact ? '(max-width: 430px) 150px, (max-width: 1023px) 172px, 198px' : '(max-width: 768px) 250px, 350px'}
        className="brand-logo-image"
      />
    </Link>
  );
}
