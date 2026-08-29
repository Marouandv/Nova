## Sprache
- Alle sichtbaren UI-Texte (Buttons, Labels, Überschriften, Platzhalter) werden auf FRANZÖSISCH geschrieben, niemals auf Deutsch oder Englisch.
- Texte werden nicht hart codiert, sondern über next-intl-Übersetzungsschlüssel eingebunden (`t("schluessel")`), auch wenn aktuell nur eine `fr.json` existiert.
- Für spätere Mehrsprachigkeit (Arabisch, RTL) durchgehend Tailwinds logische Richtungsklassen verwenden: `ms-`/`me-`/`text-start`/`text-end` statt `ml-`/`mr-`/`text-left`/`text-right`.
- Code-Kommentare und Variablennamen bleiben Englisch, wie üblich.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
