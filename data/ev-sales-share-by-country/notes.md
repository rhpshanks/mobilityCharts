# Notes: ev-sales-share-by-country

## Licence check, 2026-07-25

The indicator metadata at
`https://api.ourworldindata.org/v1/indicators/820022.metadata.json`
carries this citation verbatim:

> IEA (2026), Global EV Outlook 2026, IEA, Paris https://www.iea.org/reports/global-ev-outlook-2026, Licence: CC BY 4.0

CC BY 4.0 permits republishing with attribution, so gate G1 passes. The credit
wording in `meta.json` reproduces that citation and adds the Our World in Data
processing note, which their own citation guidance asks for.

## One discrepancy worth recording

The same metadata file disagrees with itself about the report year:

| Field | Value |
|---|---|
| `origins[0].producer` | International Energy Agency. Global EV Outlook 2025. |
| `origins[0].citationFull` | IEA (2026), Global EV Outlook **2026** ... |
| `origins[0].urlMain` | https://www.iea.org/reports/global-ev-outlook-**2026** |
| `columns.ev_sales_share.citationShort` | ... Global EV Outlook **2025**. |
| `chart.citation` | International Energy Agency. Global EV Outlook **2026**. |

The `producer` and `citationShort` fields look stale against the rest. The site
credits **Global EV Outlook 2026**, following `citationFull`, `urlMain` and the
chart citation, which agree with each other and match the 2026 publication the
URL resolves to.

Worth re-checking at the next refresh. If Our World in Data corrects the stale
fields, this note can go.

## Judgement calls

- Aggregates removed before ranking: World, European Union (27), and the
  continent and income groupings. The chart ranks countries only.
- 59 countries carry a 2025 value. The page plots the top 15, which is where
  the bar labels stay legible on a phone.
- Values land in `clean.csv` exactly as published, with no rounding. Rounding
  happens at render time only.
- Definition from the source: electric cars include fully battery-electric and
  plug-in hybrids. Stated on the page, because a reader comparing against a
  battery-only figure elsewhere would otherwise get confused.

## Refresh

Run `tools/build-data.ps1`. It downloads the current CSV, replaces `clean.csv`
and `data.js`, and leaves this file and `meta.json` for a human to review.
