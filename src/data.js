/**
 * Dataset definitions — 9 points per series.
 * Smooth curves with a clear dip (downfall) and a strong recovery (high rate).
 * ProvChart auto-formats large numbers (20K, 1.3K, 2M, …).
 */

export const DATASETS = {
  '1d': {
    // Intraday: morning dip → afternoon recovery
    portfolio:  [81200, 79800, 78500, 77200, 76800, 79100, 81500, 82800, 83200],
    benchmark:  [80500, 79600, 78800, 78000, 77800, 79200, 80800, 81800, 82200],
    labels:     ['6a', '8a', '10a', '12p', '2p', '4p', '6p', '8p', 'Now'],
    range:      'Today, Aug 18, 2025',
    btc:        [63800, 62900, 61800, 60500, 59800, 61200, 62800, 63500, 62480],
    eth:        [2780, 2720, 2650, 2580, 2540, 2620, 2700, 2740, 2690],
    kpi:        { total: '$83,200', pnl: '+$980', pnlDelta: '▲ +1.19%', winrate: '67.8%' },
  },

  '1w': {
    // Week: mid-week dip, strong Friday–weekend recovery
    portfolio:  [74200, 76800, 75500, 72800, 71500, 76200, 79800, 82500, 84201],
    benchmark:  [72800, 74500, 73800, 71800, 71000, 74200, 76800, 79200, 81000],
    labels:     ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Now'],
    range:      'Aug 12 – Aug 18, 2025',
    btc:        [58900, 61200, 59800, 57200, 55500, 60200, 64500, 66800, 62480],
    eth:        [2420, 2550, 2480, 2320, 2250, 2480, 2680, 2820, 2690],
    kpi:        { total: '$84,201', pnl: '+$1,842', pnlDelta: '▲ +2.24%', winrate: '68.2%' },
  },

  '1m': {
    // Month: early dip, steady climb into a high rate near the end
    portfolio:  [70200, 68500, 66800, 69200, 72500, 75800, 79200, 82500, 84201],
    benchmark:  [69500, 68200, 67000, 68800, 71200, 73800, 76500, 79000, 80500],
    labels:     ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'Now'],
    range:      'Jul 18 – Aug 18, 2025',
    btc:        [54200, 52800, 50500, 53200, 56800, 60500, 64200, 67800, 62480],
    eth:        [2280, 2180, 2050, 2200, 2420, 2620, 2820, 2980, 2690],
    kpi:        { total: '$84,201', pnl: '+$14,201', pnlDelta: '▲ +20.3%', winrate: '68.2%' },
  },

  '3m': {
    // Quarter: May softness → June trough → July–Aug strong recovery
    portfolio:  [65200, 63800, 61500, 59800, 62800, 68500, 74200, 79800, 84201],
    benchmark:  [64800, 63500, 61800, 60500, 62500, 66800, 71200, 75800, 79000],
    labels:     ['May', 'May W3', 'Jun', 'Jun W3', 'Jul', 'Jul W3', 'Aug', 'Aug W3', 'Now'],
    range:      'May 18 – Aug 18, 2025',
    btc:        [48500, 46200, 43800, 42000, 45800, 52500, 59500, 65500, 62480],
    eth:        [1980, 1850, 1720, 1650, 1880, 2250, 2650, 2980, 2690],
    kpi:        { total: '$84,201', pnl: '+$19,201', pnlDelta: '▲ +29.6%', winrate: '68.2%' },
  },

  '1y': {
    // Year: autumn dip, winter trough, then a high-rate climb through summer
    portfolio:  [55200, 52500, 49800, 48500, 52000, 58500, 66500, 75500, 84201],
    benchmark:  [54800, 52800, 50500, 49500, 52000, 56500, 62500, 70000, 76000],
    labels:     ['Sep', 'Nov', 'Jan', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Now'],
    range:      'Aug 2024 – Aug 2025',
    btc:        [42000, 38500, 35200, 33800, 38500, 46500, 55500, 64500, 62480],
    eth:        [1680, 1480, 1320, 1250, 1520, 1950, 2450, 2950, 2690],
    kpi:        { total: '$84,201', pnl: '+$29,201', pnlDelta: '▲ +53.1%', winrate: '68.2%' },
  },
};

export const ALLOCATION = [
  { id: 'equities', name: 'Equities', pct: 48, color: '#6c47ff', icon: 'building-columns' },
  { id: 'crypto', name: 'Crypto', pct: 28, color: '#00c9b8', icon: 'bitcoin' },
  { id: 'forex', name: 'Forex', pct: 16, color: '#f5a623', icon: 'dollar-sign' },
  { id: 'commodities', name: 'Commodities', pct: 8, color: '#ff4d6a', icon: 'cubes' },
];

export const ACTIVITY = [
  { type: 'buy', name: 'Buy — NVDA', time: '2 min ago · 12 shares', amount: '+$1,284', up: true },
  { type: 'sell', name: 'Sell — BTC/USD', time: '18 min ago · 0.04 BTC', amount: '−$2,410', up: false },
  { type: 'buy', name: 'Buy — ETH/USD', time: '1 hr ago · 2.5 ETH', amount: '+$6,750', up: true },
  { type: 'swap', name: 'Swap — USDC → EUR', time: '3 hr ago', amount: '$5,000', up: null },
];

