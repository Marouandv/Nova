"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import type { NewProduct } from "@/lib/products";

type ProductFormProps = {
  onAdd: (product: NewProduct) => void;
};

export default function ProductForm({ onAdd }: ProductFormProps) {
  const t = useTranslations("ProductForm");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (!showConfirmation) return;
    const timeout = setTimeout(() => setShowConfirmation(false), 3000);
    return () => clearTimeout(timeout);
  }, [showConfirmation]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);
    const isValid =
      name.trim().length > 0 &&
      Number.isFinite(parsedPrice) &&
      parsedPrice > 0 &&
      Number.isFinite(parsedStock) &&
      parsedStock >= 0;

    if (!isValid) return;

    onAdd({ name: name.trim(), price: parsedPrice, stock: parsedStock });

    setName("");
    setPrice("");
    setStock("");
    setShowConfirmation(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {t("title")}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="product-name"
            className="text-sm text-zinc-500 dark:text-zinc-400"
          >
            {t("nameLabel")}
          </label>
          <input
            id="product-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("namePlaceholder")}
            required
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-start text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-1">
            <label
              htmlFor="product-price"
              className="text-sm text-zinc-500 dark:text-zinc-400"
            >
              {t("priceLabel")}
            </label>
            <input
              id="product-price"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              required
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-start text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <label
              htmlFor="product-stock"
              className="text-sm text-zinc-500 dark:text-zinc-400"
            >
              {t("stockLabel")}
            </label>
            <input
              id="product-stock"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={stock}
              onChange={(event) => setStock(event.target.value)}
              required
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-start text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-1 w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {t("submit")}
        </button>

        {showConfirmation && (
          <p
            role="status"
            className="text-sm font-medium text-green-700 dark:text-green-400"
          >
            {t("confirmation")}
          </p>
        )}
      </form>
    </div>
  );
}
