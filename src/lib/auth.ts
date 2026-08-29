// MVP mock authentication — there is no real backend or database yet
// (Supabase is only planned, see AGENTS.md). This module deliberately fakes
// a login flow with a single hardcoded account and a boolean session flag
// in localStorage, mirroring the localStorage pattern used in `sales.ts`.
//
// This has NO real security: credentials are checked client-side and the
// session flag can be flipped from devtools. It exists only so the UI can
// gate the POS behind a login screen. Replace this whole module with a real
// auth provider (e.g. Supabase Auth) once the backend exists — the rest of
// the app should keep talking to `login`/`logout`/`isAuthenticated` so the
// swap stays contained here.

const SESSION_STORAGE_KEY = "nova:auth-session";

// Fired whenever the session flag changes, so React can resync via
// `useSyncExternalStore` (see AuthProvider) instead of polling localStorage.
// The built-in "storage" event only fires in *other* tabs, so a same-tab
// custom event is needed too for login/logout to update the current tab.
const AUTH_CHANGE_EVENT = "nova:auth-changed";

// Single mock account for the MVP. Not a real user store.
const MOCK_CREDENTIALS = {
  email: "caissier@nova.ma",
  password: "nova2026",
};

function notifyChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function login(email: string, password: string): boolean {
  const isValid =
    email.trim().toLowerCase() === MOCK_CREDENTIALS.email &&
    password === MOCK_CREDENTIALS.password;

  if (isValid) {
    window.localStorage.setItem(SESSION_STORAGE_KEY, "true");
    notifyChange();
  }

  return isValid;
}

export function logout() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
  notifyChange();
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SESSION_STORAGE_KEY) === "true";
}

// Subscribes to session changes, for `useSyncExternalStore`.
export function subscribe(onChange: () => void) {
  window.addEventListener(AUTH_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
