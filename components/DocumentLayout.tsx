type DocumentSection = {
  id: string;
  title: string;
  content: string;
};

export function DocumentLayout({ sections }: { sections: DocumentSection[] }) {
  return (
    <section className="trust-document-section">
      <div className="shell trust-document-layout">
        <aside className="trust-document-index">
          <p>Di halaman ini</p>
          <nav aria-label="Daftar isi halaman">
            {sections.map((section, index) => (
              <a href={`#${section.id}`} key={section.id}>
                <small>{String(index + 1).padStart(2, '0')}</small>
                <span>{section.title}</span>
              </a>
            ))}
          </nav>
        </aside>

        <article className="trust-document-body">
          {sections.map((section, index) => (
            <section id={section.id} key={section.id}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2>{section.title}</h2>
                <p>{section.content}</p>
              </div>
            </section>
          ))}
        </article>
      </div>
    </section>
  );
}
