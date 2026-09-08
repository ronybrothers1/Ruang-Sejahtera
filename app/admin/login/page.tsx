import { redirect } from 'next/navigation';

export default function AdminLoginPage() {
  redirect('/masuk?redirect_url=%2Fadmin');
}
