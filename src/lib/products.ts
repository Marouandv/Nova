export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

export type NewProduct = {
  name: string;
  price: number;
  stock: number;
};

// Only name and price are editable; stock is driven by sales and restocking.
export type ProductChanges = {
  name: string;
  price: number;
};

// Local mock data for the MVP — seeds the local store on first run.
export const initialProducts: Product[] = [
  { id: "1", name: "Café", price: 8, stock: 50 },
  { id: "2", name: "Thé à la menthe", price: 6, stock: 50 },
  { id: "3", name: "Croissant", price: 5, stock: 30 },
  { id: "4", name: "Eau minérale 0.5L", price: 4, stock: 40 },
  { id: "5", name: "Jus d'orange frais", price: 12, stock: 20 },
];

const STORAGE_KEY = "nova:products";

// Local persistence for the MVP — works offline until a real database
// (Supabase) is wired up.
function saveProducts(products: Product[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Subscriber pattern so components can sync with this external store via
// `useSyncExternalStore` instead of setState-in-effect.
type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeToProducts(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

let cachedRaw: string | null = null;
let cachedSnapshot: Product[] = initialProducts;

export function getProductsSnapshot(): Product[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (raw === cachedRaw) {
    return cachedSnapshot;
  }

  cachedRaw = raw;

  if (!raw) {
    saveProducts(initialProducts);
    cachedSnapshot = initialProducts;
    return cachedSnapshot;
  }

  try {
    cachedSnapshot = JSON.parse(raw) as Product[];
  } catch {
    saveProducts(initialProducts);
    cachedSnapshot = initialProducts;
  }

  return cachedSnapshot;
}

export function getServerProductsSnapshot(): Product[] {
  return initialProducts;
}

export function addProduct(input: NewProduct): Product {
  const products = getProductsSnapshot();
  const product: Product = { id: crypto.randomUUID(), ...input };
  saveProducts([...products, product]);
  notify();
  return product;
}

export function updateProduct(id: string, changes: ProductChanges) {
  const products = getProductsSnapshot();
  const updated = products.map((product) =>
    product.id === id ? { ...product, ...changes } : product,
  );

  saveProducts(updated);
  notify();
}

export function deleteProduct(id: string) {
  const products = getProductsSnapshot();
  saveProducts(products.filter((product) => product.id !== id));
  notify();
}

// Deducts the sold quantities from stock. Called once a sale is completed,
// so the stock shown in the POS stays in sync without manual counting.
export function reduceStock(soldQuantities: Record<string, number>) {
  const products = getProductsSnapshot();
  const updated = products.map((product) => {
    const sold = soldQuantities[product.id] ?? 0;
    if (sold === 0) return product;
    return { ...product, stock: product.stock - sold };
  });

  saveProducts(updated);
  notify();
}
