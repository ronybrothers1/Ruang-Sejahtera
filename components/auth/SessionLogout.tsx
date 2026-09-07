"use client";

import { SignOutButton } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';

export function SessionLogout({ authMethod: _authMethod }: { authMethod?: string } = {}) {
  return (
    <SignOutButton redirectUrl="/masuk">
      <button className="icon-button" type="button" aria-label="Keluar dari akun">
        <LogOut size={18} aria-hidden="true" />
      </button>
    </SignOutButton>
  );
}
