import Link from 'next/link';

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      {/* 
        This is a stylistic representation of the Yayasan Ruang Sejahtera logo 
        using text, since the actual image asset needs to be uploaded by the user.
      */}
      <div className="flex flex-col leading-none">
        <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-red-600 uppercase">
          Ruang
        </span>
        <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 uppercase flex items-center">
          Sejah<span className="text-red-600">tera</span>
        </span>
      </div>
    </Link>
  );
}
