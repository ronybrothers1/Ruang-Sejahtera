export default function AdminLoading() {
  return (
    <section className="trust-loading-state" aria-busy="true" aria-live="polite">
      <span className="sr-only">Memuat halaman</span>
      <div className="shell">
        <div className="trust-loading-kicker" />
        <div className="trust-loading-title" />
        <div className="trust-loading-copy" />
        <div className="trust-loading-grid">{[1, 2, 3].map((item) => <div key={item} />)}</div>
      </div>
    </section>
  );
}
