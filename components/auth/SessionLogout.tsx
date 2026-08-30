"use client";

import { SignOutButton } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';

export function SessionLogout({ authMethod }: { authMethod: 'clerk' | 'bootstrap' }) {
  if (authMethod === 'clerk') {
    return (
      <SignOutButton redirectUrl="/masuk">
        <button className="icon-button" type="button" aria-label="Keluar dari akun">
          <LogOut size={18} aria-hidden="true" />
        </button>
      </SignOutButton>
    );
  }

  return (
    <form action="/api/admin/logout" method="post">
      <button className="icon-button" type="submit" aria-label="Keluar dari admin preview">
        <LogOut size={18} aria-hidden="true" />
      </button>
    </form>
  );
}
