"use client";

import { useTranslations } from "next-intl";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useStoreSettings } from "@/app/components/useStoreSettings";

type ProductListProps = {
  products: Product[];
  cart: Record<string, number>;
  onAdd: (productId: string) => void;
};

export default function ProductList({ products, cart, onAdd }: ProductListProps) {
  const t = useTranslations("ProductList");
  const { currency } = useStoreSettings();

  return (
    <ul className="w-full divide-y divide-zinc-200 dark:divide-zinc-800">
      {products.map((product) => {
        const quantity = cart[product.id] ?? 0;
        return (
          <li key={product.id}>
            <button
              type="button"
              onClick={() => onAdd(product.id)}
              className="flex w-full items-center justify-between py-3 text-start"
            >
              <span className="flex flex-col items-start gap-0.5">
                <span className="flex items-center gap-2 text-base text-zinc-900 dark:text-zinc-100">
                  {product.name}
                  {quantity > 0 && (
                    <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-xs font-medium text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
                      {quantity}
                    </span>
                  )}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {t("stock", { count: product.stock })}
                </span>
              </span>
              <span className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                {formatPrice(product.price, currency)}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
