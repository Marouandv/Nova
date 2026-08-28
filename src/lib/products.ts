export type Product = {
  id: string;
  name: string;
  price: number;
};

// Lokale Mock-Daten fürs MVP — funktioniert offline, keine Datenbank nötig.
export const products: Product[] = [
  { id: "1", name: "Café", price: 8 },
  { id: "2", name: "Thé à la menthe", price: 6 },
  { id: "3", name: "Croissant", price: 5 },
  { id: "4", name: "Eau minérale 0.5L", price: 4 },
  { id: "5", name: "Jus d'orange frais", price: 12 },
];
