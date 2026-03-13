"use client";

import { signOut } from "next-auth/react";

export function AccountSignOutButton() {
  return (
    <button className="btn-secondary" type="button" onClick={() => signOut({ callbackUrl: "/" })}>
      Sign Out
    </button>
  );
}
