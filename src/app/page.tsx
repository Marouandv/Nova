"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import ProductList from "@/app/components/ProductList";
import ProductForm from "@/app/components/ProductForm";
import Cart from "@/app/components/Cart";
import {
  addProduct,
  getProductsSnapshot,
  getServerProductsSnapshot,
  subscribeToProducts,
  type NewProduct,
} from "@/lib/products";
import { saveSale } from "@/lib/sales";

export default function Home() {
  const products = useSyncExternalStore(
    subscribeToProducts,
    getProductsSnapshot,
    getServerProductsSnapshot,
  );
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const t = useTranslations("Sale");

  function handleAddProduct(input: NewProduct) {
    addProduct(input);
  }

  function handleAdd(productId: string) {
    setShowConfirmation(false);
    setCart((current) => ({
      ...current,
      [productId]: (current[productId] ?? 0) + 1,
    }));
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

    saveSale({
      id: crypto.randomUUID(),
      items,
      total,
      createdAt: new Date().toISOString(),
    });

    setCart({});
    setShowConfirmation(true);
  }

  useEffect(() => {
    if (!showConfirmation) return;
    const timeout = setTimeout(() => setShowConfirmation(false), 3000);
    return () => clearTimeout(timeout);
  }, [showConfirmation]);

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

        {showConfirmation && (
          <div
            role="status"
            className="rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm font-medium text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200"
          >
            {t("confirmation")}
          </div>
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
      </main>
    </div>
  );
}
