import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUserSession } from '@/lib/auth/admin-session';
import { canAccessControlPlane } from '@/lib/auth/permissions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mengalihkan akun',
  robots: { index: false, follow: false, nocache: true },
};

export default async function AuthRedirectPage() {
  const session = await getCurrentUserSession();
  if (!session) redirect('/masuk');
  redirect(canAccessControlPlane(session.role) ? '/admin' : '/akun');
}
