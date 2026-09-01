import { syncIdentityProfile } from '@/lib/db/users';

type BackendIdentityUser = {
  id: string;
  primaryEmailAddressId: string | null;
  emailAddresses: Array<{
    id: string;
    emailAddress: string;
    verification: { status: string } | null;
  }>;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  twoFactorEnabled: boolean;
  lastSignInAt: number | null;
};

type WebhookIdentityUser = {
  id: string;
  primary_email_address_id: string | null;
  email_addresses: Array<{
    id: string;
    email_address: string;
    verification: { status: string } | null;
  }>;
  first_name: string | null;
  last_name: string | null;
  image_url: string;
  two_factor_enabled: boolean;
  last_sign_in_at: number | null;
};

type IdentityUser = BackendIdentityUser | WebhookIdentityUser;

function readIdentityUser(user: IdentityUser) {
  if ('primary_email_address_id' in user) {
    const primaryEmail = user.email_addresses.find((item) => item.id === user.primary_email_address_id) || user.email_addresses[0];
    if (!primaryEmail) throw new Error('IDENTITY_PRIMARY_EMAIL_MISSING');
    return {
      identityProviderId: user.id,
      email: primaryEmail.email_address,
      emailVerified: primaryEmail.verification?.status === 'verified',
      fullName: [user.first_name, user.last_name].filter(Boolean).join(' ').trim() || 'Calon Anggota',
      profileImageUrl: user.image_url,
      twoFactorEnabled: user.two_factor_enabled,
      lastSignInAt: user.last_sign_in_at ? new Date(user.last_sign_in_at) : null,
    };
  }

  const primaryEmail = user.emailAddresses.find((item) => item.id === user.primaryEmailAddressId) || user.emailAddresses[0];
  if (!primaryEmail) throw new Error('IDENTITY_PRIMARY_EMAIL_MISSING');

  return {
    identityProviderId: user.id,
    email: primaryEmail.emailAddress,
    emailVerified: primaryEmail.verification?.status === 'verified',
    fullName: [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || 'Calon Anggota',
    profileImageUrl: user.imageUrl,
    twoFactorEnabled: user.twoFactorEnabled,
    lastSignInAt: user.lastSignInAt ? new Date(user.lastSignInAt) : null,
  };
}

export async function syncClerkUser(user: IdentityUser) {
  return syncIdentityProfile(readIdentityUser(user));
}
