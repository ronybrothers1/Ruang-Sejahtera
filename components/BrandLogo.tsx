import Image from 'next/image';
import Link from 'next/link';

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Yayasan Ruang Sejahtera, kembali ke beranda">
      <Image
        src="/brand/logo-ruang-sejahtera.webp"
        alt="Yayasan Ruang Sejahtera"
        width={640}
        height={425}
        priority
        className={compact ? 'h-10 w-auto object-contain' : 'h-12 md:h-14 w-auto object-contain'}
      />
    </Link>
  );
}
