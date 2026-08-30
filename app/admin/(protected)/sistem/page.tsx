import Link from 'next/link';
import { rolePermissions } from '@/lib/auth/permissions';
import { getBootstrapAuthStatus, requireSuperAdminSession } from '@/lib/auth/admin-session';
import { getIdentityStatus } from '@/lib/auth/config';
import { getControlPlaneSecurityStatus } from '@/lib/auth/control-plane-gate';
import { getCmsWriteStatus } from '@/lib/cms/store';
import { listCoreManagers } from '@/lib/db/users';

export default async function AdminSystemPage({ searchParams }: { searchParams: Promise<{ manager?: string }> }) {
  const session = await requireSuperAdminSession();
  const { manager } = await searchParams;
  const auth = getBootstrapAuthStatus();
  const identity = getIdentityStatus();
  const security = getControlPlaneSecurityStatus();
  const cms = getCmsWriteStatus();
  const coreManagers = identity.database ? await listCoreManagers() : [];

  return (
    <div>
      <p className="eyebrow">Sistem & Akses</p>
      <h1 className="font-heading text-4xl font-extrabold tracking-tight">Kelola akses dengan alur yang mudah dipahami.</h1>

      {manager === 'created' ? <div role="status" className="status-message-success mt-7 rounded-xl border p-4 text-sm font-semibold">Core Manager berhasil ditambahkan. Minta orang tersebut mendaftar di <Link className="underline" href="/daftar">/daftar</Link> menggunakan email yang sama, lalu melakukan verifikasi email.</div> : null}
      {manager === 'invalid' ? <div role="alert" className="status-message-error mt-7 rounded-xl border p-4 text-sm font-semibold">Nama atau email Core Manager belum valid.</div> : null}
      {manager === 'reserved' ? <div role="alert" className="status-message-error mt-7 rounded-xl border p-4 text-sm font-semibold">Email tersebut sudah digunakan oleh Super Admin.</div> : null}
      {manager === 'blocked' ? <div role="alert" className="status-message-error mt-7 rounded-xl border p-4 text-sm font-semibold">Akun tersebut sedang diblokir dan tidak dapat langsung diangkat menjadi Core Manager.</div> : null}
      {manager === 'database' ? <div role="alert" className="status-message-warning mt-7 rounded-xl border p-4 text-sm font-semibold">Database belum dikonfigurasi. Hubungkan DATABASE_URL terlebih dahulu.</div> : null}
      {manager === 'error' ? <div role="alert" className="status-message-error mt-7 rounded-xl border p-4 text-sm font-semibold">Core Manager belum dapat ditambahkan. Periksa koneksi database dan coba lagi.</div> : null}

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="font-heading text-xl font-extrabold">Autentikasi</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt>Identity provider</dt><dd className="font-bold">{identity.clerk ? 'configured' : 'disabled'}</dd></div>
            <div className="flex justify-between gap-4"><dt>Database</dt><dd className="font-bold">{identity.database ? 'configured' : 'disabled'}</dd></div>
            <div className="flex justify-between gap-4"><dt>Webhook identity</dt><dd className="font-bold">{identity.productionReady ? 'configured' : 'disabled'}</dd></div>
            <div className="flex justify-between gap-4"><dt>Login Super Admin</dt><dd className="font-bold">{auth.configured ? 'simple login aktif' : 'disabled'}</dd></div>
            <div className="flex justify-between gap-4"><dt>Control Plane gate</dt><dd className="font-bold">{auth.configured ? 'login sederhana sementara' : security.mode === 'approval' ? 'approval sementara' : 'MFA'}</dd></div>
          </dl>
          <p className="mt-5 text-sm leading-7 text-neutral-600">{auth.configured ? 'Login sederhana sedang dipakai untuk tahap pembangunan. Matikan flag bootstrap dan aktifkan pengamanan final sebelum website dinyatakan siap produksi.' : security.mode === 'approval' ? 'MFA belum tersedia pada provider saat ini. Approval sementara hanya menjadi lapisan kompensasi dan terikat ke sesi.' : 'MFA diwajibkan pada Super Admin sebelum Control Plane dapat dibuka.'}</p>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="font-heading text-xl font-extrabold">Tambah Core Manager</h2>
          <p className="mt-4 text-sm leading-7 text-neutral-600">Masukkan nama dan email. Role Core Manager disimpan di database, bukan dipilih dari browser. Jika email sudah memiliki akun Member, akun tersebut akan dinaikkan menjadi Core Manager.</p>
          <form action="/api/admin/core-managers" method="post" className="mt-6 space-y-4">
            <div>
              <label htmlFor="fullName" className="text-sm font-bold">Nama lengkap</label>
              <input id="fullName" name="fullName" type="text" required minLength={2} maxLength={120} autoComplete="name" className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 text-sm" disabled={!identity.database} />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-bold">Email Core Manager</label>
              <input id="email" name="email" type="email" required maxLength={254} autoComplete="email" className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 text-sm" disabled={!identity.database} />
            </div>
            <button className="button-primary w-full" type="submit" disabled={!identity.database}>Tambahkan Core Manager</button>
          </form>
          {!identity.database ? <p className="mt-4 text-sm leading-6 text-neutral-500">Form aktif setelah DATABASE_URL tersedia.</p> : null}
        </section>
      </div>

      <section className="mt-5 rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-xl font-extrabold">Core Manager terdaftar</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Akun yang ditambahkan di sini tetap memakai login biasa melalui <Link className="font-bold underline" href="/masuk">/masuk</Link>.</p>
          </div>
          <span className="count-badge" aria-label={`${coreManagers.length} Core Manager`}>{coreManagers.length}</span>
        </div>
        {coreManagers.length ? (
          <div className="mt-5 divide-y divide-neutral-100">
            {coreManagers.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold">{item.fullName}</p>
                  <p className="mt-1 text-sm text-neutral-500">{item.email}</p>
                </div>
                <div className="text-left text-xs font-bold text-neutral-500 sm:text-right">
                  <p>{item.identityProviderId ? 'Akun sudah terhubung' : 'Menunggu pendaftaran'}</p>
                  <p className="mt-1">{item.emailVerified ? 'Email terverifikasi' : 'Belum terverifikasi'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm leading-6 text-neutral-500">{identity.database ? 'Belum ada Core Manager.' : 'Daftar Core Manager akan tampil setelah database dikonfigurasi.'}</p>
        )}
      </section>

      <section className="mt-5 rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="font-heading text-xl font-extrabold">CMS persistence</h2>
        <p className="mt-4 text-sm leading-7 text-neutral-600">Mode saat ini: <strong>{cms.mode}</strong>. {cms.reason}</p>
      </section>

      <section className="mt-5 rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="font-heading text-xl font-extrabold">Permission efektif untuk {session.role}</h2>
        <div className="mt-5 flex flex-wrap gap-2">{rolePermissions[session.role].map((permission) => <span key={permission} className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-bold text-neutral-700">{permission}</span>)}</div>
        <p className="mt-5 text-sm leading-7 text-neutral-600">Menu dan aksi tetap ditentukan oleh permission server-side. Form ini hanya tersedia untuk Super Admin.</p>
      </section>
    </div>
  );
}
