import Image from 'next/image';
import Link from 'next/link';

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Yayasan Ruang Sejahtera, kembali ke beranda">
      <Image
        src="/brand/logo-ruang-sejahtera.webp"
        alt="Yayasan Ruang Sejahtera"
        width={1000}
        height={453}
        priority
        className={compact ? 'h-auto w-[148px] object-contain sm:w-[164px]' : 'h-auto w-[260px] object-contain md:w-[320px]'}
      />
    </Link>
  );
}
