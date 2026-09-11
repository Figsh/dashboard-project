/**
 * Vela Dashboard — ProvChart powered
 * Charts are generated via the ProvChart API (proxy) so we are no longer
 * limited to the old 8-point st-core constraint.
 */

import { DATASETS, ALLOCATION, ACTIVITY } from './data.js';

/* ─── state ──────────────────────────────────────────── */
let currentPeriod = '1w';

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
 * Each host gets its own <style> so charts never clobber each other.
 */
function mountChart(hostEl, { html, css }) {
  if (!hostEl) return;

  // Remove previous style for this host
  if (hostEl._pcStyle) {
    hostEl._pcStyle.remove();
    hostEl._pcStyle = null;
  }

  // Scoped style tag per chart instance
  const style = document.createElement('style');
  style.setAttribute('data-provchart-host', hostEl.id || 'anon');
  style.textContent = css;
  document.head.appendChild(style);
  hostEl._pcStyle = style;

  hostEl.innerHTML = html;

  // Force injected root + first-level wrappers to fill the host box.
  // ProvChart often emits fixed pixel sizes from the payload width/height;
  // we override so the chart scales to the card.
  const root =
    hostEl.querySelector('[data-provchart]') || hostEl.firstElementChild;
  if (root) {
    root.style.setProperty('width', '100%', 'important');
    root.style.setProperty('max-width', '100%', 'important');
    root.style.setProperty('min-height', '100%', 'important');
    root.style.setProperty('box-sizing', 'border-box', 'important');
  }

  // Also stretch any direct SVG if present
  hostEl.querySelectorAll('svg').forEach((svg) => {
    svg.setAttribute('width', '100%');
    svg.style.maxWidth = '100%';
    svg.style.height = 'auto';
  });

  if (window.ProvChartRuntime?.refresh) {
    window.ProvChartRuntime.refresh();
  }
}

/**
 * Build a multi-series area payload — pass labels/points as-is (9 points).
 */
function buildMainPayload(period) {
  const d = DATASETS[period];
  return {
    type: 'area',
    theme: 'midnight',
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
    height: 100,
    axisX: labels,
    series: [
      {
        name: 'Price',
        color,
        points,
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

  // Loading states + clear previous scoped styles
  [mainHost, btcHost, ethHost].forEach((h) => {
    if (!h) return;
    if (h._pcStyle) {
      h._pcStyle.remove();
      h._pcStyle = null;
    }
    h.innerHTML = '<div class="pc-loading">Generating chart…</div>';
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
