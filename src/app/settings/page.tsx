"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useStoreSettings } from "@/app/components/useStoreSettings";
import { updateSettings } from "@/lib/store-settings";

const inputClassName =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-start text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

// Currencies a Moroccan shop is realistically going to bill in.
const CURRENCIES = ["MAD", "EUR", "USD"];

export default function SettingsPage() {
  const t = useTranslations("Settings");
  const settings = useStoreSettings();
  const [name, setName] = useState(settings.name);
  const [address, setAddress] = useState(settings.address);
  const [currency, setCurrency] = useState(settings.currency);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (!showConfirmation) return;
    const timeout = setTimeout(() => setShowConfirmation(false), 3000);
    return () => clearTimeout(timeout);
  }, [showConfirmation]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.trim().length === 0) return;

    updateSettings({
      name: name.trim(),
      address: address.trim(),
      currency,
    });
    setShowConfirmation(true);
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="store-name"
                className="text-sm text-zinc-500 dark:text-zinc-400"
              >
                {t("nameLabel")}
              </label>
              <input
                id="store-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className={inputClassName}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="store-address"
                className="text-sm text-zinc-500 dark:text-zinc-400"
              >
                {t("addressLabel")}
              </label>
              <input
                id="store-address"
                type="text"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                className={inputClassName}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="store-currency"
                className="text-sm text-zinc-500 dark:text-zinc-400"
              >
                {t("currencyLabel")}
              </label>
              <select
                id="store-currency"
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
                className={inputClassName}
              >
                {CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="mt-1 w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {t("save")}
            </button>

            {showConfirmation && (
              <p
                role="status"
                className="text-sm font-medium text-green-700 dark:text-green-400"
              >
                {t("saved")}
              </p>
            )}
          </form>
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
