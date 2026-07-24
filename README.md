# MobilityCharts

Static site scaffold built to **MC-SOP-001 v0.1**. No build step, no package manager,
no external requests. Plain HTML, one stylesheet, one chart renderer.

> **Every figure in this repository is a placeholder.** Values were invented to test
> layout. No dataset has passed the SOP-01 licence gate. Nothing here may go live
> until real, licensed data replaces it.

## Run it locally

```bash
python -m http.server 5178
```

Then open `http://localhost:5178/`.

## Folder map

```
mobilitycharts/
├── index.html                        landing page, chart index, subscribe block
├── assets/
│   ├── site.css                      theme, typography, layout, SVG chart styling
│   ├── chart.js                      SVG bar and line renderer, zero dependencies
│   └── site.js                       theme switch, embed copy, table sorting
├── charts/
│   ├── ev-chargers-by-country/       bar chart page
│   └── charging-cost-per-100km/      bar plus line chart page
├── data/
│   └── <dataset-id>/
│       ├── clean.csv                 the record of truth
│       ├── data.js                   render-ready copy, generated from clean.csv
│       └── meta.json                 source, licence, credit, refresh state, gates
├── embed/                            standalone embeddable chart pages
├── registers/
│   ├── dataset-register.csv          SOP-01 intake log
│   └── page-production-log.csv       SOP-04 publishing log
└── .claude/launch.json               local server config
```

## Adding a chart page

1. Run SOP-01 intake. Log the row in `registers/dataset-register.csv`. Status must reach green.
2. Save the untouched download as `data/<id>/raw_YYYY-MM.csv`. Never edit it.
3. Produce `clean.csv` under the SOP-02 rules: lowercase headers, ISO dates, plain digits,
   one unit per column, empty cells for missing values, no rounding in storage.
4. Fill `meta.json`, including the credit wording word for word.
5. Write `data.js` from `clean.csv`.
6. Copy an existing page folder under `charts/`, swap the dataset id in the inline script,
   rewrite the heading, summary line and four takeaways.
7. Add a standalone page under `embed/`.
8. Link the new page from `index.html` and from two sibling chart pages.
9. Pass gates G2 and G3, then log the row in `registers/page-production-log.csv`.

## What the chart renderer guarantees

- Bar charts always start at zero.
- Bars sort by value, never alphabetically.
- Values sit as direct labels, so no legend is needed.
- The source credit and the site mark get drawn inside the SVG, so they survive screenshots.
- Styling runs through CSS classes, so light and dark themes need no re-render.

## Still to build

- `/compare/` cluster, where affiliate links live
- `/tools/running-cost/` calculator
- Beehiiv embed replacing the placeholder subscribe form
- `sitemap.xml` and `robots.txt`
- Dataset schema markup per chart page
- `/sources/`, `/privacy/`, `/disclosure/`, correction policy pages
- A script that turns `clean.csv` into `data.js` without hand editing
