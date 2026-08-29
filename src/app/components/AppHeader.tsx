"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";
import LogoutButton from "@/app/components/LogoutButton";

// Small top bar carrying the logout button. Hidden on the login page and
// until there is an authenticated session, so it never shows up for a
// signed-out visitor.
export default function AppHeader() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated || pathname === "/login") {
    return null;
  }

  return (
    <header className="flex items-center justify-end border-b border-zinc-200 bg-white px-6 py-3 dark:border-zinc-800 dark:bg-zinc-950">
      <LogoutButton />
    </header>
  );
}
