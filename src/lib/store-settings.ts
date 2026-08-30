export type StoreSettings = {
  name: string;
  address: string;
  currency: string;
};

export const defaultSettings: StoreSettings = {
  name: "Nova",
  address: "",
  currency: "MAD",
};

const STORAGE_KEY = "nova:store-settings";

// Local persistence for the MVP — works offline until a real database
// (Supabase) is wired up.
function save(settings: StoreSettings) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

// Subscriber pattern so components can sync with this external store via
// `useSyncExternalStore` instead of setState-in-effect.
type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeToSettings(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

let cachedRaw: string | null = null;
let cachedSnapshot: StoreSettings = defaultSettings;

export function getSettingsSnapshot(): StoreSettings {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (raw === cachedRaw) {
    return cachedSnapshot;
  }

  cachedRaw = raw;

  if (!raw) {
    cachedSnapshot = defaultSettings;
    return cachedSnapshot;
  }

  try {
    // Merge over the defaults so a partial or older stored shape still
    // yields a complete settings object.
    cachedSnapshot = { ...defaultSettings, ...(JSON.parse(raw) as StoreSettings) };
  } catch {
    cachedSnapshot = defaultSettings;
  }

  return cachedSnapshot;
}

export function getServerSettingsSnapshot(): StoreSettings {
  return defaultSettings;
}

export function updateSettings(settings: StoreSettings) {
  save(settings);
  notify();
}
