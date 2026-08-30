"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import type { Product, ProductChanges } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useStoreSettings } from "@/app/components/useStoreSettings";

type ProductManagerProps = {
  products: Product[];
  onUpdate: (id: string, changes: ProductChanges) => void;
  onDelete: (id: string) => void;
};

const inputClassName =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-start text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

export default function ProductManager({
  products,
  onUpdate,
  onDelete,
}: ProductManagerProps) {
  const t = useTranslations("ProductManager");
  const { currency } = useStoreSettings();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  function startEditing(product: Product) {
    setPendingDeleteId(null);
    setEditingId(product.id);
    setName(product.name);
    setPrice(String(product.price));
  }

  function cancelEditing() {
    setEditingId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();

    const parsedPrice = Number(price);
    const isValid =
      name.trim().length > 0 && Number.isFinite(parsedPrice) && parsedPrice > 0;

    if (!isValid) return;

    onUpdate(id, { name: name.trim(), price: parsedPrice });
    setEditingId(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {t("title")}
      </h2>

      {products.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("empty")}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
          {products.map((product) => (
            <li key={product.id} className="py-3">
              {editingId === product.id ? (
                <form
                  onSubmit={(event) => handleSubmit(event, product.id)}
                  className="flex flex-col gap-2"
                >
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    aria-label={t("nameLabel")}
                    required
                    className={inputClassName}
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    aria-label={t("priceLabel")}
                    required
                    className={inputClassName}
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                      {t("save")}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-zinc-900 dark:text-zinc-100">
                    {product.name} — {formatPrice(product.price, currency)}
                  </span>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => startEditing(product)}
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      {t("edit", { name: product.name })}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDeleteId(product.id)}
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                    >
                      {t("delete", { name: product.name })}
                    </button>
                  </div>
                </div>
              )}

              {pendingDeleteId === product.id && (
                <div
                  role="alertdialog"
                  aria-label={t("confirmDelete", { name: product.name })}
                  className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 dark:border-red-800 dark:bg-red-950"
                >
                  <span className="text-sm text-red-800 dark:text-red-200">
                    {t("confirmDelete", { name: product.name })}
                  </span>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(product.id);
                        setPendingDeleteId(null);
                      }}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                    >
                      {t("confirm")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDeleteId(null)}
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-800 hover:bg-red-100 dark:border-red-800 dark:text-red-200 dark:hover:bg-red-900"
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
