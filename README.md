# Ruang Sejahtera

Website dan aplikasi operasional Yayasan Ruang Sejahtera.

## Development

```bash
npm install
npm run dev
```

## Quality gates

```bash
npm run integrity
npm run auth:audit
npm run lint
npm run typecheck
npm run build
```

## Database

Schema PostgreSQL dikelola dengan Drizzle. Migration dijalankan secara eksplisit terhadap database yang dituju:

```bash
npm run db:migrate
```

Migration tidak dijalankan otomatis pada build Vercel agar preview deployment tidak dapat mengubah database production secara tidak sengaja.

## Phase 1 identity and RBAC

Phase 1 menggunakan Clerk untuk identity/session dan PostgreSQL untuk role serta data aplikasi. Semua role masuk melalui `/masuk`; tidak ada kunci akses Super Admin terpisah atau application-level MFA gate.

Dokumentasi aktivasi lengkap ada di `docs/AUTH-RBAC-PHASE-1.md`.

## Security

Nilai secret, password, token, database URL, signing secret webhook, dan kredensial provider tidak boleh disimpan di repository. Gunakan environment variables pada platform deployment.
