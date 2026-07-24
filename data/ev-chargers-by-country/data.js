/* ==========================================================================
   Dataset: ev-chargers-by-country
   STATUS: PLACEHOLDER. Every figure below is invented for layout testing.
   Nothing here may go live. SOP-01 intake must run first, then this file
   gets regenerated from data/ev-chargers-by-country/clean.csv.
   ========================================================================== */

window.DATASETS = window.DATASETS || {};

window.DATASETS['ev-chargers-by-country'] = {
  id: 'ev-chargers-by-country',
  placeholder: true,
  title: 'Public EV charging points by country',
  unit: 'Charging points, thousands',
  suffix: 'k',
  decimals: 1,
  labelHead: 'Country',
  valueHead: 'Points (thousands)',
  source: 'PLACEHOLDER, no source assigned',
  sourceDate: 'sample',
  licence: 'not yet checked',
  refreshFrequency: 'monthly',
  lastRefresh: 'never',
  rows: [
    { label: 'Country A', value: 128.4 },
    { label: 'Country B', value: 96.2 },
    { label: 'Country C', value: 71.8 },
    { label: 'Country D', value: 58.3 },
    { label: 'Country E', value: 44.9 },
    { label: 'Country F', value: 31.5 },
    { label: 'Country G', value: 22.7 },
    { label: 'Country H', value: 15.1 },
    { label: 'Country I', value: 9.6 },
    { label: 'Country J', value: 4.2 }
  ]
};
