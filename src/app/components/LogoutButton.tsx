"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/app/components/AuthProvider";

export default function LogoutButton() {
  const t = useTranslations("Auth");
  const { logout } = useAuth();

  return (
    <button
      type="button"
      onClick={logout}
      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      {t("logout")}
    </button>
  );
}
