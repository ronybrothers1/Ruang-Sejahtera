export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-hero">
      <div className="shell relative z-10 py-16 md:py-24">
        <p className="eyebrow text-red-200">{eyebrow}</p>
        <h1 className="max-w-4xl text-4xl font-extrabold tracking-[-0.04em] text-white md:text-6xl">{title}</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-300 md:text-lg">{description}</p>
      </div>
    </section>
  );
}
