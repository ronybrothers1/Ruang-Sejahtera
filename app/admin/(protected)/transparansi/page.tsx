import { notFound } from 'next/navigation';
import { can } from '@/lib/auth/permissions';
import { requireAdminSession } from '@/lib/auth/admin-session';

export default async function AdminTransparencyPage() {
  const session = await requireAdminSession();
  if (!can(session.role, 'finance.read') && !can(session.role, 'reports.publish')) notFound();
  return <div><p className="eyebrow">Transparansi</p><h1 className="font-heading text-4xl font-extrabold tracking-tight">Keuangan tidak dicampur dengan CMS editorial.</h1><p className="mt-4 max-w-3xl leading-7 text-neutral-600">Modul finansial menunggu database, autentikasi produksi, rekonsiliasi, dan sumber laporan resmi. Sampai itu tersedia, panel ini sengaja tidak menampilkan angka, grafik, saldo, atau status audit simulasi.</p><div className="status-message-warning mt-8 rounded-2xl border p-6"><h2 className="font-heading text-xl font-extrabold">Production gate</h2><p className="mt-3 text-sm leading-7">Aktifkan hanya setelah finance role, database terenkripsi, audit trail, backup/restore, workflow approval, dan sumber dokumen keuangan resmi telah diverifikasi.</p></div></div>;
}
