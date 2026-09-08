export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  const context = `${eyebrow} ${title}`.toLocaleLowerCase('id-ID');
  const variant = /program|rakyat|rumah|air bersih|pendidikan/.test(context)
    ? 'program'
    : /kegiatan|berita|galeri|cerita/.test(context)
      ? 'editorial'
      : /dampak|transparansi|legalitas|donasi/.test(context)
        ? 'accountability'
        : /tentang|visi|misi|nilai|sejarah|organisasi/.test(context)
          ? 'institution'
          : /kontak|kolaborasi|dukungan/.test(context)
            ? 'support'
            : 'utility';

  return (
    <section className="page-hero" data-variant={variant}>
      <div className="page-hero-grid" aria-hidden="true" />
      <div className="shell page-hero-inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
