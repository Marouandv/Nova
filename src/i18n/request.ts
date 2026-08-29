import { getRequestConfig } from "next-intl/server";

// Nur Französisch, siehe "Sprache" in AGENTS.md. Weitere Locales (z. B. `ar`)
// kommen später als zusätzliche Datei unter `src/messages/` dazu.
export default getRequestConfig(async () => {
  const locale = "fr";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
