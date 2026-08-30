import { UserProfile } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { requireUserSession } from '@/lib/auth/admin-session';

export default async function AccountProfilePage() {
  const session = await requireUserSession();
  if (session.authMethod !== 'clerk') redirect('/akun');

  return (
    <div className="min-h-screen bg-neutral-100 px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <UserProfile routing="path" path="/akun/profil" appearance={{ variables: { colorPrimary: '#d71920', borderRadius: '0.9rem' } }} />
      </div>
    </div>
  );
}
