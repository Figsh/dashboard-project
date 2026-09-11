/**
 * Vela Dashboard — ProvChart powered
 * Charts are generated via the ProvChart API (proxy) so we are no longer
 * limited to the 8-point st-core constraint.
 */

import { DATASETS, ALLOCATION, ACTIVITY } from './data.js';

/* ─── state ──────────────────────────────────────────── */
let currentPeriod = '1w';
let chartStyleEl = null; // holds the latest ProvChart CSS

/* ─── helpers ────────────────────────────────────────── */
function $(sel, root = document) {
  return root.querySelector(sel);
}
function $$(sel, root = document) {
  return [...root.querySelectorAll(sel)];
}

function animateValue(id, newVal) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(6px)';
  setTimeout(() => {
    el.textContent = newVal;
    el.style.transition = 'opacity .3s, transform .3s';
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }, 180);
}

function updateDate() {
  const now = new Date();
  const opts = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  const el = document.getElementById('live-date');
  if (el) el.textContent = now.toLocaleDateString('en-US', opts);
}

/* ─── ProvChart client ───────────────────────────────── */
/**
 * Call the local proxy → ProvChart /api/v1/generate
 * Returns { html, css } or throws.
 */
async function generateChart(payload) {
  const res = await fetch('/api/chart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || data.success === false) {
    const msg = data.error || data.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data; // { html, css }
}

/**
 * Inject ProvChart result into a host element.
 * Reuses a single <style id="provchart-styles"> for the page.
 */
function mountChart(hostEl, { html, css }) {
  if (!hostEl) return;

  // Ensure global style tag exists
  if (!chartStyleEl) {
    chartStyleEl = document.createElement('style');
    chartStyleEl.id = 'provchart-styles';
    document.head.appendChild(chartStyleEl);
  }
  // Append / replace CSS (ProvChart scopes classes, so safe to overwrite)
  chartStyleEl.textContent = css;

  hostEl.innerHTML = html;

  // Optional runtime refresh if you later load provchart-runtime
  if (window.ProvChartRuntime?.refresh) {
    window.ProvChartRuntime.refresh();
  }
}

/**
 * Build a multi-series line payload matching the current design tokens.
 */
function buildMainPayload(period) {
  const d = DATASETS[period];
  return {
    type: 'line',
    theme: 'midnight',
    width: 720,
    height: 260,
    axisX: d.labels,
    series: [
      {
        name: 'Portfolio',
        color: '#6c47ff',
        points: d.portfolio,
      },
      {
        name: 'Benchmark',
        color: '#00c9b8',
        points: d.benchmark,
      },
    ],
    legend: true,
    grid: true,
  };
}

function buildSparkPayload(points, color, labels) {
  return {
    type: 'area',
    theme: 'midnight',
    width: 360,
    height: 90,
    axisX: labels.slice(-8), // sparklines stay compact
    series: [
      {
        name: 'Price',
        color,
        points: points.slice(-8),
      },
    ],
    legend: false,
    grid: false,
  };
}

/* ─── render charts for a period ─────────────────────── */
async function renderPeriodCharts(period) {
  const d = DATASETS[period];
  const mainHost = document.getElementById('main-chart-host');
  const btcHost = document.getElementById('spark-btc-host');
  const ethHost = document.getElementById('spark-eth-host');

  // Loading states
  [mainHost, btcHost, ethHost].forEach((h) => {
    if (h) h.innerHTML = '<div class="pc-loading">Generating chart…</div>';
  });

  try {
    // Main chart (portfolio + benchmark)
    const main = await generateChart(buildMainPayload(period));
    mountChart(mainHost, main);

    // Sparklines in parallel
    const [btc, eth] = await Promise.all([
      generateChart(buildSparkPayload(d.btc, '#f5a623', d.labels)),
      generateChart(buildSparkPayload(d.eth, '#6c47ff', d.labels)),
    ]);
    mountChart(btcHost, btc);
    mountChart(ethHost, eth);
  } catch (err) {
    console.error('ProvChart error:', err);
    const msg = `
      <div class="pc-error">
        <strong>Chart generation failed</strong><br>
        ${err.message}<br><br>
        <small>
          Make sure the proxy is running (<code>npm run proxy</code>)<br>
          and <code>PROVCHART_API_KEY</code> is set in <code>.env</code>.
        </small>
      </div>`;
    if (mainHost) mainHost.innerHTML = msg;
    if (btcHost) btcHost.innerHTML = '<div class="pc-error">—</div>';
    if (ethHost) ethHost.innerHTML = '<div class="pc-error">—</div>';
  }
}

/* ─── apply period (KPIs + charts) ───────────────────── */
function applyPeriod(period) {
  currentPeriod = period;
  const d = DATASETS[period];

  // Range label
  const rangeEl = document.getElementById('chart-range-label');
  if (rangeEl) rangeEl.textContent = d.range;

  // KPIs
  const k = d.kpi;
  animateValue('kpi-total', k.total);
  animateValue('kpi-pnl', k.pnl);
  const deltaEl = document.getElementById('kpi-pnl-delta');
  if (deltaEl) {
    deltaEl.innerHTML = `${k.pnlDelta} <span class="kpi-sub">this period</span>`;
  }
  animateValue('kpi-winrate', k.winrate);

  // Charts via ProvChart
  renderPeriodCharts(period);
}

/* ─── allocation bars ────────────────────────────────── */
function renderAllocation() {
  const container = document.getElementById('alloc-list');
  if (!container) return;

  container.innerHTML = ALLOCATION.map((a) => {
    const iconClass = a.icon === 'bitcoin' ? 'fab fa-bitcoin' : `fas fa-${a.icon}`;
    return `
    <div class="alloc-row">
      <div class="alloc-meta">
        <span class="alloc-name">
          <i class="${iconClass}" style="color:${a.color};opacity:.9"></i>
          ${a.name}
        </span>
        <span class="alloc-pct">${a.pct}%</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="width:0%;--bar-color:${a.color}" data-pct="${a.pct}"></div>
      </div>
    </div>`;
  }).join('');

  // Animate widths
  requestAnimationFrame(() => {
    $$('.bar-fill', container).forEach((bar) => {
      bar.style.width = `${bar.dataset.pct}%`;
    });
  });
}

/* ─── activity feed ──────────────────────────────────── */
function renderActivity() {
  const container = document.getElementById('activity-list');
  if (!container) return;

  container.innerHTML = ACTIVITY.map((item) => {
    const icon =
      item.type === 'buy'
        ? 'fa-arrow-down'
        : item.type === 'sell'
          ? 'fa-arrow-up'
          : 'fa-exchange-alt';
    const amountClass =
      item.up === true ? 'up' : item.up === false ? 'down' : '';
    return `
      <div class="activity-item">
        <div class="activity-icon ${item.type}"><i class="fas ${icon}"></i></div>
        <div class="activity-body">
          <div class="activity-name">${item.name}</div>
          <div class="activity-time">${item.time}</div>
        </div>
        <div class="activity-amount ${amountClass}">${item.amount}</div>
      </div>`;
  }).join('');
}

/* ─── profile dropdown ───────────────────────────────── */
function initProfileDropdown() {
  const row = document.getElementById('user-row');
  const menu = document.getElementById('profile-dropdown');
  if (!row || !menu) return;

  row.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = menu.classList.toggle('open');
    row.classList.toggle('open', open);
  });

  document.addEventListener('click', () => {
    menu.classList.remove('open');
    row.classList.remove('open');
  });

  menu.addEventListener('click', (e) => e.stopPropagation());
}

/* ─── period tabs ────────────────────────────────────── */
function initPeriodTabs() {
  const tabs = document.getElementById('period-tabs');
  if (!tabs) return;

  tabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.period-tab');
    if (!tab) return;

    $$('.period-tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    applyPeriod(tab.dataset.period);
  });
}

/* ─── nav items ──────────────────────────────────────── */
function initNav() {
  $$('.nav-item').forEach((item) => {
    item.addEventListener('click', () => {
      $$('.nav-item').forEach((n) => n.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

/* ─── boot ───────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  updateDate();
  setInterval(updateDate, 60_000);

  renderAllocation();
  renderActivity();
  initProfileDropdown();
  initPeriodTabs();
  initNav();

  // Initial charts
  applyPeriod(currentPeriod);
});
