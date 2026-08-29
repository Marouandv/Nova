"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ProductList from "@/app/components/ProductList";
import Cart from "@/app/components/Cart";

export default function Home() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const t = useTranslations("Sale");

  function handleAdd(productId: string) {
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

        <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {t("products")}
          </h2>
          <ProductList cart={cart} onAdd={handleAdd} />
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <Cart cart={cart} onRemove={handleRemove} />
        </section>
      </main>
    </div>
  );
}
