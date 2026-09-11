/**
 * Dataset definitions — now free of the  8-point limit.
 * ProvChart supports above 200 points per series.
 */

export const DATASETS = {
  '1d': {
    portfolio: [42, 44, 41, 46, 48, 47, 52, 50, 55, 53, 58, 56, 60, 59, 62, 61, 64, 63, 65, 64, 66, 65, 67, 68],
    benchmark: [38, 39, 38, 40, 41, 40, 43, 42, 45, 44, 47, 46, 48, 47, 49, 48, 50, 49, 51, 50, 52, 51, 53, 54],
    labels: [
      '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p',
      '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p',
      '10p', '11p', '12a', '1a', '2a', '3a', '4a', 'Now'
    ],
    values: Array.from({ length: 24 }, (_, i) => `$${(79 + i * 0.18).toFixed(1)}k`),
    range: 'Today, Aug 18, 2025',
    btc: [55, 56, 54, 57, 58, 57, 59, 58, 60, 59, 61, 60, 62, 61, 63, 62, 64, 63, 65, 64, 66, 65, 66, 67],
    eth: [48, 49, 47, 50, 51, 50, 52, 51, 53, 52, 54, 53, 55, 54, 56, 55, 57, 56, 58, 57, 59, 58, 59, 60],
    kpi: { total: '$83,200', pnl: '+$980', pnlDelta: '▲ +1.19%', winrate: '67.8%' },
  },
  '1w': {
    portfolio: [28, 32, 30, 38, 35, 42, 40, 48, 45, 55, 52, 60, 58, 68, 65, 72, 70, 75, 73, 78, 76, 80, 79, 82],
    benchmark: [22, 25, 24, 28, 27, 32, 30, 36, 34, 40, 38, 44, 42, 48, 46, 52, 50, 55, 53, 58, 56, 60, 59, 62],
    labels: [
      'Mon 00', 'Mon 06', 'Mon 12', 'Mon 18',
      'Tue 00', 'Tue 06', 'Tue 12', 'Tue 18',
      'Wed 00', 'Wed 06', 'Wed 12', 'Wed 18',
      'Thu 00', 'Thu 06', 'Thu 12', 'Thu 18',
      'Fri 00', 'Fri 06', 'Fri 12', 'Fri 18',
      'Sat', 'Sun', 'Mon', 'Now'
    ],
    values: Array.from({ length: 24 }, (_, i) => `$${(74 + i * 0.4).toFixed(1)}k`),
    range: 'Aug 12 – Aug 18, 2025',
    btc: [40, 42, 41, 46, 44, 50, 48, 54, 52, 58, 56, 62, 60, 66, 64, 70, 68, 72, 70, 74, 72, 76, 75, 78],
    eth: [35, 37, 36, 40, 39, 44, 42, 48, 46, 52, 50, 55, 53, 58, 56, 62, 60, 64, 62, 66, 64, 68, 67, 70],
    kpi: { total: '$84,201', pnl: '+$1,842', pnlDelta: '▲ +2.24%', winrate: '68.2%' },
  },
  '1m': {
    portfolio: [20, 24, 22, 30, 28, 36, 32, 42, 38, 48, 44, 54, 50, 60, 56, 66, 62, 70, 68, 74, 72, 78, 76, 80],
    benchmark: [18, 20, 19, 24, 22, 28, 26, 32, 30, 36, 34, 40, 38, 44, 42, 48, 46, 52, 50, 55, 53, 58, 56, 60],
    labels: Array.from({ length: 24 }, (_, i) => `D${i + 1}`),
    values: Array.from({ length: 24 }, (_, i) => `$${(70 + i * 0.6).toFixed(0)}k`),
    range: 'Jul 18 – Aug 18, 2025',
    btc: [30, 33, 31, 38, 36, 42, 40, 48, 45, 52, 50, 58, 55, 62, 60, 66, 64, 70, 68, 74, 72, 76, 75, 78],
    eth: [28, 30, 29, 34, 32, 38, 36, 42, 40, 46, 44, 50, 48, 54, 52, 58, 56, 62, 60, 66, 64, 68, 67, 70],
    kpi: { total: '$84,201', pnl: '+$14,201', pnlDelta: '▲ +20.3%', winrate: '68.2%' },
  },
  '3m': {
    portfolio: [15, 18, 16, 24, 22, 30, 28, 36, 32, 42, 38, 48, 44, 54, 50, 58, 55, 64, 60, 68, 65, 72, 70, 76],
    benchmark: [14, 16, 15, 20, 18, 24, 22, 28, 26, 32, 30, 36, 34, 40, 38, 44, 42, 48, 46, 52, 50, 56, 54, 58],
    labels: [
      'May W1', 'May W2', 'May W3', 'May W4',
      'Jun W1', 'Jun W2', 'Jun W3', 'Jun W4',
      'Jul W1', 'Jul W2', 'Jul W3', 'Jul W4',
      'Aug W1', 'Aug W2', 'Aug W3', 'Aug W4',
      'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'Now'
    ],
    values: Array.from({ length: 24 }, (_, i) => `$${(65 + i * 0.8).toFixed(0)}k`),
    range: 'May 18 – Aug 18, 2025',
    btc: [25, 28, 26, 32, 30, 36, 34, 40, 38, 44, 42, 48, 46, 52, 50, 56, 54, 60, 58, 64, 62, 68, 66, 70],
    eth: [22, 25, 23, 28, 26, 32, 30, 36, 34, 40, 38, 44, 42, 48, 46, 52, 50, 56, 54, 60, 58, 64, 62, 66],
    kpi: { total: '$84,201', pnl: '+$19,201', pnlDelta: '▲ +29.6%', winrate: '68.2%' },
  },
  '1y': {
    portfolio: [10, 14, 12, 18, 16, 24, 20, 30, 26, 36, 32, 42, 38, 48, 44, 54, 50, 60, 56, 66, 62, 72, 68, 78],
    benchmark: [10, 12, 11, 15, 14, 18, 16, 22, 20, 26, 24, 30, 28, 34, 32, 38, 36, 42, 40, 46, 44, 50, 48, 54],
    labels: [
      'Sep', 'Oct', 'Nov', 'Dec',
      'Jan', 'Feb', 'Mar', 'Apr',
      'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec',
      'Jan', 'Feb', 'Mar', 'Apr',
      'May', 'Jun', 'Jul', 'Now'
    ],
    values: Array.from({ length: 24 }, (_, i) => `$${(55 + i * 1.2).toFixed(0)}k`),
    range: 'Aug 2024 – Aug 2025',
    btc: [20, 24, 22, 28, 26, 32, 30, 36, 34, 40, 38, 46, 44, 52, 50, 58, 56, 64, 62, 70, 68, 74, 72, 78],
    eth: [18, 22, 20, 26, 24, 30, 28, 34, 32, 38, 36, 42, 40, 48, 46, 54, 52, 58, 56, 64, 62, 68, 66, 72],
    kpi: { total: '$84,201', pnl: '+$29,201', pnlDelta: '▲ +53.1%', winrate: '68.2%' },
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
