import { getRequestConfig } from "next-intl/server";

// French only, see "Sprache" in AGENTS.md. Further locales (e.g. `ar`) will be
// added later as additional files under `src/messages/`.
export default getRequestConfig(async () => {
  const locale = "fr";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
