import { Eye } from 'lucide-react';

export function PreviewNotice({
  label = 'Konten contoh',
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="preview-notice" aria-label="Keterangan konten contoh">
      <Eye size={17} aria-hidden="true" />
      <strong>{label}</strong>
      <p>{children}</p>
    </aside>
  );
}
