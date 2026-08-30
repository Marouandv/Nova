export type SaleItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

export type Sale = {
  id: string;
  items: SaleItem[];
  total: number;
  createdAt: string;
};

const STORAGE_KEY = "nova:sales";

// Local persistence for the MVP — works offline until a real database
// (Supabase) is wired up.
function save(sales: Sale[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
}

// Subscriber pattern so components can sync with this external store via
// `useSyncExternalStore` instead of setState-in-effect. This is what makes
// the dashboard update as soon as a sale is completed.
type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeToSales(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

let cachedRaw: string | null = null;
let cachedSnapshot: Sale[] = [];

export function getSales(): Sale[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (raw === cachedRaw) {
    return cachedSnapshot;
  }

  cachedRaw = raw;

  if (!raw) {
    cachedSnapshot = [];
    return cachedSnapshot;
  }

  try {
    cachedSnapshot = JSON.parse(raw) as Sale[];
  } catch {
    cachedSnapshot = [];
  }

  return cachedSnapshot;
}

export function getServerSalesSnapshot(): Sale[] {
  return [];
}

export function saveSale(sale: Sale) {
  save([...getSales(), sale]);
  notify();
}

// Sales made since midnight, local time.
export function getTodaysSales(sales: Sale[]): Sale[] {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  return sales.filter((sale) => new Date(sale.createdAt) >= startOfToday);
}

export function getTotalRevenue(sales: Sale[]): number {
  return sales.reduce((sum, sale) => sum + sale.total, 0);
}
