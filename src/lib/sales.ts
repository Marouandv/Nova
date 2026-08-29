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
export function saveSale(sale: Sale) {
  const sales = getSales();
  sales.push(sale);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
}

export function getSales(): Sale[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Sale[];
  } catch {
    return [];
  }
}
