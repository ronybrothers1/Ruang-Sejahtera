const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() || '';
const clerkSecretKey = process.env.CLERK_SECRET_KEY?.trim() || '';

export function isClerkConfigured() {
  return clerkPublishableKey.startsWith('pk_') && clerkSecretKey.startsWith('sk_');
}
export function isDatabaseConfigured() {
  const databaseUrl = process.env.DATABASE_URL?.trim() || '';
  return databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://');
}

export function getIdentityStatus() {
  const clerk = isClerkConfigured();
  const database = isDatabaseConfigured();

  return {
    clerk,
    database,
    productionReady: clerk && database && Boolean(process.env.CLERK_WEBHOOK_SIGNING_SECRET?.trim()),
  };
}
