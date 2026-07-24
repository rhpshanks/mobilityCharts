/* ==========================================================================
   Dataset: charging-cost-per-100km
   STATUS: PLACEHOLDER. Invented figures for layout testing only.
   ========================================================================== */

window.DATASETS = window.DATASETS || {};

window.DATASETS['charging-cost-per-100km'] = {
  id: 'charging-cost-per-100km',
  placeholder: true,
  title: 'Home charging cost per 100 km',
  unit: 'USD per 100 km',
  suffix: '',
  decimals: 2,
  labelHead: 'Market',
  valueHead: 'Cost per 100 km (USD)',
  source: 'PLACEHOLDER, no source assigned',
  sourceDate: 'sample',
  rows: [
    { label: 'Market A', value: 4.85 },
    { label: 'Market B', value: 4.12 },
    { label: 'Market C', value: 3.64 },
    { label: 'Market D', value: 3.08 },
    { label: 'Market E', value: 2.51 },
    { label: 'Market F', value: 1.97 },
    { label: 'Market G', value: 1.43 }
  ],
  series: [
    { label: '2020', value: 2.10 },
    { label: '2021', value: 2.34 },
    { label: '2022', value: 3.28 },
    { label: '2023', value: 3.55 },
    { label: '2024', value: 3.21 },
    { label: '2025', value: 3.02 },
    { label: '2026', value: 3.08 }
  ]
};
