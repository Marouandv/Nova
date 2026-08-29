import { useTranslations } from "next-intl";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";

type CartProps = {
  products: Product[];
  cart: Record<string, number>;
  onRemove: (productId: string) => void;
  onComplete: () => void;
};

export default function Cart({ products, cart, onRemove, onComplete }: CartProps) {
  const t = useTranslations("Cart");

  const items = products
    .map((product) => ({ product, quantity: cart[product.id] ?? 0 }))
    .filter((item) => item.quantity > 0);

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {t("title")}
      </h2>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("empty")}</p>
      ) : (
        <>
          <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-center justify-between gap-3 py-2">
                <span className="text-sm text-zinc-900 dark:text-zinc-100">
                  {quantity}× {product.name} — {formatPrice(product.price * quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(product.id)}
                  aria-label={t("remove", { name: product.name })}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-zinc-300 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  –
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-zinc-200 pt-3 dark:border-zinc-800">
            <span className="text-base font-medium text-zinc-900 dark:text-zinc-100">
              {t("sum")}
            </span>
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {formatPrice(total)}
            </span>
          </div>
          <button
            type="button"
            onClick={onComplete}
            className="mt-1 w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {t("complete")}
          </button>
        </>
      )}
    </div>
  );
}
