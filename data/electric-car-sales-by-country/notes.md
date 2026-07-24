# Notes: electric-car-sales-by-country

## Licence check, 2026-07-25

Same origin as [ev-sales-share-by-country](../ev-sales-share-by-country/notes.md):
IEA Global EV Outlook 2026, processed by Our World in Data, released under
CC BY 4.0. Gate G1 passes on the same reading, and the same report-year
discrepancy in the Our World in Data metadata applies. See that file for detail.

## Judgement calls

- `clean.csv` holds the source count of cars, unrounded. `data.js` divides by
  1,000 purely so the chart axis reads in thousands rather than eight digits.
- Aggregates removed before ranking, so the chart ranks countries only.
- The top 15 gets plotted. China dwarfs the rest, which is the actual story,
  so the bar scale stays linear rather than logarithmic. A log scale would make
  the gap look smaller than it is.
- Vietnam carries an exact source value of 180,077 against Belgium's rounded
  180,000. Both land at 180 thousand on the chart, and the table shows the
  same rounding. The source publishes them at different precision.

## Refresh

Run `tools/build-data.ps1`.
