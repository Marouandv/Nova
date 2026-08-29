"use client";

import { products } from "@/lib/products";
import { formatPrice } from "@/lib/format";

type ProductListProps = {
  cart: Record<string, number>;
  onAdd: (productId: string) => void;
};

export default function ProductList({ cart, onAdd }: ProductListProps) {
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
              <span className="flex items-center gap-2 text-base text-zinc-900 dark:text-zinc-100">
                {product.name}
                {quantity > 0 && (
                  <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-xs font-medium text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
                    {quantity}
                  </span>
                )}
              </span>
              <span className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                {formatPrice(product.price)}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
