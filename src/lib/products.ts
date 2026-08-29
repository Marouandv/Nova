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

// Lokale Mock-Daten fürs MVP — dient als Startbestand für den lokalen Store.
export const initialProducts: Product[] = [
  { id: "1", name: "Café", price: 8, stock: 50 },
  { id: "2", name: "Thé à la menthe", price: 6, stock: 50 },
  { id: "3", name: "Croissant", price: 5, stock: 30 },
  { id: "4", name: "Eau minérale 0.5L", price: 4, stock: 40 },
  { id: "5", name: "Jus d'orange frais", price: 12, stock: 20 },
];

const STORAGE_KEY = "nova:products";

// Lokale Persistenz fürs MVP — funktioniert offline, bis eine echte
// Datenbank (Supabase) angebunden ist.
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
