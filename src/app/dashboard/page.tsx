"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSales } from "@/app/components/useSales";
import { useStoreSettings } from "@/app/components/useStoreSettings";
import { getTodaysSales, getTotalRevenue } from "@/lib/sales";
import { formatPrice } from "@/lib/format";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const { currency } = useStoreSettings();
  const sales = useSales();

  const todaysSales = getTodaysSales(sales);
  const revenue = getTotalRevenue(todaysSales);

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
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {t("revenue")}
          </h2>
          <p className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            {formatPrice(revenue, currency)}
          </p>
        </section>

        <Link
          href="/"
          className="text-sm text-zinc-600 underline dark:text-zinc-400"
        >
          {t("back")}
        </Link>
      </main>
    </div>
  );
}
