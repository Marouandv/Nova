"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";

// Routes that stay reachable without a session.
const PUBLIC_PATHS = ["/login"];

// Client-side route guard. There is no server session (no backend yet), so
// this cannot run in `proxy.ts` — it reads the localStorage-backed mock
// session from AuthProvider instead. Unauthenticated visitors never see
// protected content (e.g. the POS on "/"): `isAuthenticated` is false on
// the server and on first paint (see AuthProvider's server snapshot), so
// protected routes render `null` until the real session is confirmed, and
// redirect to "/login" if there is none.
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (!isAuthenticated && !isPublicPath) {
      router.replace("/login");
    }
    if (isAuthenticated && isPublicPath) {
      router.replace("/");
    }
  }, [isAuthenticated, isPublicPath, router]);

  // Public routes (the login page) render immediately, session or not —
  // an already logged-in visitor just gets redirected away right after.
  if (isPublicPath) {
    return <>{children}</>;
  }

  // Protected routes only render for a confirmed, authenticated session.
  // Otherwise a redirect to "/login" is in flight.
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
