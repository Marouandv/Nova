"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/app/components/AuthProvider";

export default function LoginPage() {
  const t = useTranslations("Login");
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const success = login(email, password);
    setHasError(!success);
    // On success, AuthGate redirects to "/" once the auth state updates.
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-10 font-sans dark:bg-black">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="mb-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {t("title")}
        </h1>
        <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
          {t("subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              {t("emailLabel")}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-zinc-100"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              {t("passwordLabel")}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-zinc-100"
            />
          </div>

          {hasError && (
            <p
              role="alert"
              className="text-sm font-medium text-red-600 dark:text-red-400"
            >
              {t("error")}
            </p>
          )}

          <button
            type="submit"
            className="mt-1 w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
