# NovaTec (Nova)

> Ein digitales Kassensystem für kleine Händler in Marokko.

## Das Problem

In Marokko gibt es rund 20 Millionen Zahlungskarten, aber nur etwa 50.000 Geschäfte mit einem Kartenterminal – bei einem geschätzten Potenzial von rund 200.000 möglichen Akzeptanzstellen. Die meisten kleinen Händler (Cafés, Kioske, Marktstände) kassieren weiterhin ausschließlich bar und führen Lager sowie Umsatz auf Papier oder gar nicht.

## Die Idee

Nova ist ein einfaches, modernes Kassensystem für genau diese Zielgruppe – inspiriert von SumUp und dem marokkanischen Vorbild Inyad. Statt selbst eine eigene Zahlungslizenz aufzubauen, soll sich Nova künftig mit einem bereits lizenzierten Zahlungsdienstleister (z. B. NAPS) verbinden, die seit der Marktöffnung im Mai 2025 Kartenterminals direkt an Händler vergeben dürfen.

## Kernfunktionen (geplant)

- **🧾 Kasse & Verkauf** — Produkte auswählen, Warenkorb, Rabatte, Verkauf abschließen (bar/Karte), Beleg erstellen
- **📦 Produkte & Lager** — Produktkatalog, automatische Bestandsführung, Wareneingänge, Lieferanten, Warnung bei niedrigem Bestand
- **📊 Dashboard & Reports** — Tagesumsatz, Top-Produkte, Umsatz nach Zahlungsart, Datenexport für die Buchhaltung
- **👤 Nutzer & Rollen** — Login, unterschiedliche Rechte für Besitzer und Verkäufer, Mehrfilialen-Unterstützung
- **💳 Zahlung & TPE** — Kartenzahlung über einen lizenzierten Payment-Partner, Terminal-Anbindung, Zahlungsstatus in Echtzeit

## Architektur-Prinzipien

- **Multi-Tenant von Anfang an:** eine gemeinsame Datenbank, jeder Datensatz über eine `store_id` einem Händler zugeordnet — keine separate Instanz pro Kunde
- **Payment als austauschbarer Baustein:** die Zahlungsintegration ist bewusst von der Kern-Logik getrennt, damit sich später auch andere Anbieter anbinden lassen

## Tech-Stack

| Bereich | Technologie |
|---|---|
| Frontend & Backend | [Next.js](https://nextjs.org/) (App Router), TypeScript |
| Styling | Tailwind CSS |
| Datenbank *(geplant)* | [Supabase](https://supabase.com/) (Postgres) |
| Zahlungspartner *(geplant)* | NAPS – TPE-Terminal-Integration |

## Marktkontext

Der marokkanische Zahlungsmarkt wurde im Mai 2025 für neue Anbieter geöffnet, nachdem CMI über 20 Jahre lang eine Quasi-Monopolstellung hatte. Kontaktloses Bezahlen macht bereits über 40 % aller Point-of-Sale-Transaktionen aus — Bargeld bleibt aber weiterhin dominant. Genau diese Lücke will Nova schließen.

## Projektstatus

🚧 Frühe Entwicklungsphase. Aktueller Fokus: Kassen-Grundfunktionen ohne Datenbank- und Zahlungsanbindung. Vollständiger Produkt-Backlog mit allen User Stories liegt in Notion.

## Getting Started

```bash
npm install
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.
