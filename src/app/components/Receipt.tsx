"use client";

import { useTranslations } from "next-intl";
import type { Sale } from "@/lib/sales";
import { formatDateTime, formatPrice } from "@/lib/format";
import { useStoreSettings } from "@/app/components/useStoreSettings";

type ReceiptProps = {
  sale: Sale;
  onClose: () => void;
};

export default function Receipt({ sale, onClose }: ReceiptProps) {
  const t = useTranslations("Receipt");
  const settings = useStoreSettings();

  function handlePrint() {
    window.print();
  }

  return (
    <section
      // `receipt` is the hook the print stylesheet uses to hide the rest of
      // the page, so the browser's print dialog only outputs this receipt.
      className="receipt rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
      aria-labelledby="receipt-title"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2
          id="receipt-title"
          className="text-sm font-medium text-zinc-500 dark:text-zinc-400"
        >
          {t("title")}
        </h2>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {t("date")} : {formatDateTime(sale.createdAt)}
        </span>
      </div>

      <div className="mt-2">
        <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {settings.name}
        </p>
        {settings.address && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {settings.address}
          </p>
        )}
      </div>

      <p
        role="status"
        className="mt-1 text-sm font-medium text-green-700 dark:text-green-400"
      >
        {t("saved")}
      </p>

      <ul className="mt-3 flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
        {sale.items.map((item) => (
          <li
            key={item.productId}
            className="flex items-center justify-between gap-3 py-2"
          >
            <span className="text-sm text-zinc-900 dark:text-zinc-100">
              {t("item", { quantity: item.quantity, name: item.name })}
            </span>
            <span className="text-sm text-zinc-900 dark:text-zinc-100">
              {formatPrice(item.price * item.quantity, settings.currency)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-1 flex items-center justify-between border-t border-zinc-200 pt-3 dark:border-zinc-800">
        <span className="text-base font-medium text-zinc-900 dark:text-zinc-100">
          {t("sum")}
        </span>
        <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {formatPrice(sale.total, settings.currency)}
        </span>
      </div>

      <div className="receipt-actions mt-4 flex gap-2">
        <button
          type="button"
          onClick={handlePrint}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {t("print")}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {t("close")}
        </button>
      </div>
    </section>
  );
}
