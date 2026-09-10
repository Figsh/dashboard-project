# Vela — Portfolio OS

Modern dark portfolio dashboard powered by **[ProvChart](https://chart.devtem.org)** pure-CSS charts and the original **st-core** design tokens.

> Charts are no longer limited to 8 data points. ProvChart supports up to **200+ points per series**.

![Vela Dashboard](https://img.shields.io/badge/ProvChart-pure%20CSS-6c47ff?style=flat-square)
![Theme](https://img.shields.io/badge/theme-midnight-080710?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## Features

- **ProvChart API** for line / area charts (multi-series, 24+ points)
- Original st-core design tokens (`--st-bg`, `--st-accent`, etc.) preserved
- Complete dashboard: KPIs, overview stats strip, allocation bars, activity feed
- **Profile dropdown** in the sidebar footer
- Period tabs (1D / 1W / 1M / 3M / 1Y) that re-generate charts
- Live clock, responsive layout
- API key stays server-side via a simple Node proxy

---

## Quick start

```bash
# 1. Clone & install
git clone https://github.com/YOUR_USER/vela-dashboard.git
cd vela-dashboard
npm install

# 2. Add your ProvChart API key
cp .env.example .env
# Edit .env → PROVCHART_API_KEY=pc_live_xxxxxxxx
# Get a free key at https://chart.devtem.org/dashboard (5 gens/month on free tier)

# 3. Start the proxy (keeps the key off the browser)
npm run proxy
# → http://localhost:8787

# 4. In another terminal start the Vite dev server
npm run dev
# → http://localhost:5173
```

The Vite config already proxies `/api/chart` → the local proxy, so the browser never sees the real key.

---

## Project structure

```
vela-dashboard/
├── index.html              # Main shell
├── src/
│   ├── main.js             # App logic + ProvChart client
│   ├── data.js             # Datasets (24 points each)
│   └── styles/
│       ├── tokens.css      # st-core design tokens
│       └── dashboard.css   # Full UI styles
├── api/
│   └── proxy-server.js     # Local ProvChart proxy
├── .env.example
├── package.json
├── vite.config.js
└── README.md
```

---

## How ProvChart is used

```js
// src/main.js
const res = await fetch('/api/chart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'line',
    theme: 'midnight',
    axisX: [...],
    series: [
      { name: 'Portfolio', color: '#6c47ff', points: [...] },
      { name: 'Benchmark', color: '#00c9b8', points: [...] },
    ],
  }),
});

const { html, css } = await res.json();
// inject into the host element
```

The proxy (`api/proxy-server.js`) forwards the request to:

```
POST https://provchart-api.devtem.org/api/v1/generate
X-API-Key: <your key>
```

and returns pure HTML + CSS. No charting JavaScript is shipped to the browser.

---

## Production notes

- **Never** expose `PROVCHART_API_KEY` in client bundles.
- Deploy the proxy as a serverless function (Vercel / Netlify / Cloudflare Workers) or keep a small Node service.
- Free tier = 5 generations / month. Pro = 500. Business = 5 000.
- For static deploys you can also pre-generate SVGs with the GitHub Action [`provchart-readme-action`](https://github.com/fscss-ttr/provchart-readme-action).

---

## Design tokens (kept intact)

```css
:root {
  --st-bg:       #080710;
  --st-surface:  #0f0e1c;
  --st-card:     #13122a;
  --st-accent:   #6c47ff;
  --st-accent-2: #a78bff;
  --st-green:    #00e5a0;
  --st-red:      #ff4d6a;
  --st-text:     #edeaff;
  --st-muted:    #5e5a82;
  /* … */
}
```

---

## License

MIT
