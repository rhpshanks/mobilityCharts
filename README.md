# MobilityCharts

Static site scaffold built to **MC-SOP-001 v0.1**. No build step, no package manager,
no external requests. Plain HTML, one stylesheet, one chart renderer.

## Data and licence

Both live datasets come from **IEA Global EV Outlook 2026**, processed by
**Our World in Data**, released under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

> IEA (2026), Global EV Outlook 2026, IEA, Paris. Licence: CC BY 4.0. Processed by Our World in Data.

CC BY 4.0 permits republishing with attribution, so the credit line rides inside
every chart SVG and repeats in each page method note. Refresh both datasets with:

```bash
powershell -File tools/build-data.ps1
```

That script downloads the current CSV, replaces `clean.csv` and `data.js`, and
leaves `meta.json` and `notes.md` for a human to review.

## Run it locally

```bash
python -m http.server 5178
```

Then open `http://localhost:5178/`.

## Vercel Web Analytics

Every page carries this tag before `</body>`:

```html
<script defer src="/_vercel/insights/script.js"></script>
```

Vercel serves that path itself at deploy time. On a local server it returns
404, which is expected and breaks nothing, because the tag is deferred.

**The tag alone does not switch analytics on.** Two steps remain, and both live
in the Vercel dashboard rather than in this repository:

1. Deploy the project to Vercel.
2. Open the project, go to the Analytics tab, and enable Web Analytics.

Data starts landing on the next page view after step 2. Until then the script
404s in production too.

The embed pages carry the tag as well, so views happening inside other people's
sites get counted. That is the closest direct read on embed reach. Delete the
tag from `embed/*.html` if that measurement is unwanted.

## Google AdSense

The loader sits inside `<head>` on the three reader-facing pages:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8869440014127177"
     crossorigin="anonymous"></script>
```

**Not on `embed/*.html`, on purpose.** Those pages get served inside other
people's articles. Loading ad code there would place ads on a third party site
without that owner having any say, which risks both the AdSense policy and the
goodwill the whole embed strategy depends on.

This tag readies the site for review. It shows nothing by itself until either
Auto ads gets switched on or a unit is placed by hand.

Still pending before ads can run:

- A live privacy page. The footer link points at `#` today, and AdSense expects
  a real one describing what gets collected.
- An `ads.txt` at the site root carrying the publisher ID.
- Enough published pages for review to pass. Two chart pages is thin.

Note that this tag is the first external request the site makes. Everything
else still runs offline with zero third party calls.

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
