import Image from 'next/image';
import Link from 'next/link';

export function BrandLogo({ compact = false, priority = false }: { compact?: boolean; priority?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Yayasan Ruang Sejahtera, kembali ke beranda">
      <Image
        src="/brand/logo-ruang-sejahtera-transparent.svg"
        alt="Yayasan Ruang Sejahtera"
        width={1000}
        height={453}
        priority={priority}
        unoptimized
        sizes={compact ? '(max-width: 640px) 150px, 174px' : '(max-width: 768px) 250px, 330px'}
        className={compact ? 'h-auto w-[150px] object-contain sm:w-[174px]' : 'h-auto w-[250px] object-contain md:w-[330px]'}
      />
    </Link>
  );
}
