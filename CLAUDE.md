## Sprache
- Alle sichtbaren UI-Texte (Buttons, Labels, Überschriften, Platzhalter) werden auf FRANZÖSISCH geschrieben, niemals auf Deutsch oder Englisch.
- Texte werden nicht hart codiert, sondern über next-intl-Übersetzungsschlüssel eingebunden (`t("schluessel")`), auch wenn aktuell nur eine `fr.json` existiert.
- Für spätere Mehrsprachigkeit (Arabisch, RTL) durchgehend Tailwinds logische Richtungsklassen verwenden: `ms-`/`me-`/`text-start`/`text-end` statt `ml-`/`mr-`/`text-left`/`text-right`.
- Code-Kommentare und Variablennamen bleiben Englisch, wie üblich.

@AGENTS.md
