"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSales } from "@/app/components/useSales";
import { useStoreSettings } from "@/app/components/useStoreSettings";
import {
  getSalesInPeriod,
  getTodaysSales,
  getTopProducts,
  getTotalRevenue,
  type Period,
} from "@/lib/sales";
import { formatPrice } from "@/lib/format";

const PERIODS: Period[] = ["today", "week", "month"];
const TOP_PRODUCTS_LIMIT = 5;

const PERIOD_LABEL_KEY: Record<Period, string> = {
  today: "periodToday",
  week: "periodWeek",
  month: "periodMonth",
};

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const { currency } = useStoreSettings();
  const sales = useSales();
  const [period, setPeriod] = useState<Period>("today");

  const todaysSales = getTodaysSales(sales);
  const revenue = getTotalRevenue(todaysSales);
  const topProducts = getTopProducts(
    getSalesInPeriod(sales, period),
    TOP_PRODUCTS_LIMIT,
  );

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

        <div className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {t("revenue")}
            </h2>
            <p className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
              {formatPrice(revenue, currency)}
            </p>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {t("salesCount")}
            </h2>
            <p className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
              {todaysSales.length}
            </p>
          </section>
        </div>

        <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {t("topProducts")}
            </h2>
            <div className="flex gap-1">
              {PERIODS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPeriod(option)}
                  aria-pressed={period === option}
                  className={
                    period === option
                      ? "rounded-lg bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                      : "rounded-lg border border-zinc-300 px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  }
                >
                  {t(PERIOD_LABEL_KEY[option])}
                </button>
              ))}
            </div>
          </div>

          {topProducts.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              {t("noSales")}
            </p>
          ) : (
            <ol className="mt-3 flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
              {topProducts.map((product, index) => (
                <li
                  key={product.productId}
                  className="flex items-center justify-between gap-3 py-2"
                >
                  <span className="text-sm text-zinc-900 dark:text-zinc-100">
                    {index + 1}. {product.name}
                  </span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {t("soldQuantity", { quantity: product.quantity })}
                  </span>
                </li>
              ))}
            </ol>
          )}
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
