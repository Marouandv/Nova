"use client";

import { useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import ProductList from "@/app/components/ProductList";
import ProductForm from "@/app/components/ProductForm";
import ProductManager from "@/app/components/ProductManager";
import Cart from "@/app/components/Cart";
import Receipt from "@/app/components/Receipt";
import {
  addProduct,
  deleteProduct,
  getProductsSnapshot,
  getServerProductsSnapshot,
  reduceStock,
  subscribeToProducts,
  updateProduct,
  type NewProduct,
  type ProductChanges,
} from "@/lib/products";
import { saveSale, type Sale } from "@/lib/sales";

export default function Home() {
  const products = useSyncExternalStore(
    subscribeToProducts,
    getProductsSnapshot,
    getServerProductsSnapshot,
  );
  const [cart, setCart] = useState<Record<string, number>>({});
  const [lastSale, setLastSale] = useState<Sale | null>(null);
  const t = useTranslations("Sale");

  function handleAddProduct(input: NewProduct) {
    addProduct(input);
  }

  function handleUpdateProduct(id: string, changes: ProductChanges) {
    updateProduct(id, changes);
  }

  function handleDeleteProduct(id: string) {
    deleteProduct(id);
    // Drop the deleted product from the cart so it cannot be sold anymore.
    setCart((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function handleAdd(productId: string) {
    // Starting a new sale dismisses the previous receipt.
    setLastSale(null);
    setCart((current) => {
      const stock = products.find((p) => p.id === productId)?.stock ?? 0;
      const quantity = current[productId] ?? 0;
      // Never sell more than what is in stock, which would drive it negative.
      if (quantity >= stock) return current;
      return { ...current, [productId]: quantity + 1 };
    });
  }

  function handleRemove(productId: string) {
    setCart((current) => {
      const quantity = current[productId] ?? 0;
      if (quantity <= 1) {
        const next = { ...current };
        delete next[productId];
        return next;
      }
      return { ...current, [productId]: quantity - 1 };
    });
  }

  function handleComplete() {
    const items = products
      .filter((product) => (cart[product.id] ?? 0) > 0)
      .map((product) => ({
        productId: product.id,
        name: product.name,
        quantity: cart[product.id],
        price: product.price,
      }));
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const sale: Sale = {
      id: crypto.randomUUID(),
      items,
      total,
      createdAt: new Date().toISOString(),
    };

    saveSale(sale);
    reduceStock(cart);

    setCart({});
    setLastSale(sale);
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10 sm:px-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {t("title")}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {t("subtitle")}
          </p>
        </div>

        {lastSale && (
          <Receipt sale={lastSale} onClose={() => setLastSale(null)} />
        )}

        <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {t("products")}
          </h2>
          <ProductList products={products} cart={cart} onAdd={handleAdd} />
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <Cart
            products={products}
            cart={cart}
            onRemove={handleRemove}
            onComplete={handleComplete}
          />
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <ProductForm onAdd={handleAddProduct} />
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <ProductManager
            products={products}
            onUpdate={handleUpdateProduct}
            onDelete={handleDeleteProduct}
          />
        </section>
      </main>
    </div>
  );
}
