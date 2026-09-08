import { seedInitialSuperAdmin } from '../lib/db/users';

const email = process.env.INITIAL_SUPER_ADMIN_EMAIL?.trim() || '';
const fullName = process.env.INITIAL_SUPER_ADMIN_NAME?.trim() || '';

if (!process.env.DATABASE_URL?.trim()) throw new Error('DATABASE_URL is required.');
if (!email || !fullName) throw new Error('INITIAL_SUPER_ADMIN_EMAIL and INITIAL_SUPER_ADMIN_NAME are required.');

const user = await seedInitialSuperAdmin({ email, fullName });
console.log(`Initial Super Admin prepared with id ${user.id}. Sign up with the verified email to attach the identity.`);
