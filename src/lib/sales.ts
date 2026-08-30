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

export type Period = "today" | "week" | "month";

// Rolling windows counted back from the start of today, so "week" means the
// last seven days including today rather than an ISO calendar week.
const PERIOD_DAYS: Record<Period, number> = {
  today: 1,
  week: 7,
  month: 30,
};

export function getSalesInPeriod(sales: Sale[], period: Period): Sale[] {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (PERIOD_DAYS[period] - 1));

  return sales.filter((sale) => new Date(sale.createdAt) >= start);
}

export type ProductSalesTotal = {
  productId: string;
  name: string;
  quantity: number;
};

// Best-selling products by quantity sold. Item names come from the sale
// itself, so a renamed or deleted product still reports under the name it
// carried when it was sold.
export function getTopProducts(
  sales: Sale[],
  limit: number,
): ProductSalesTotal[] {
  const totals = new Map<string, ProductSalesTotal>();

  for (const sale of sales) {
    for (const item of sale.items) {
      const existing = totals.get(item.productId);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        totals.set(item.productId, {
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
        });
      }
    }
  }

  return [...totals.values()]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}
