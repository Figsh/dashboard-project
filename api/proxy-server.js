/**
 * Simple local proxy for ProvChart.
 * Run with: node api/proxy-server.js
 * (or `npm run proxy`)
 *
 * Keeps the API key off the client. In production use Vercel / Netlify / Cloudflare functions.
 */
import http from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Load .env if present
if (existsSync(join(root, '.env'))) {
  const env = readFileSync(join(root, '.env'), 'utf8');
  env.split('\n').forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  });
}

const PORT = 8787;
const API_BASE = (process.env.PROVCHART_API_BASE || 'https://provchart-api.devtem.org').replace(/\/$/, '');
const API_KEY = process.env.PROVCHART_API_KEY || '';

const server = http.createServer(async (req, res) => {
  // CORS for Vite dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/chart') {
    let body = '';
    for await (const chunk of req) body += chunk;

    if (!API_KEY) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'PROVCHART_API_KEY is not set. Copy .env.example → .env and add your key from https://chart.devtem.org/dashboard',
      }));
      return;
    }

    try {
      const upstream = await fetch(`${API_BASE}/api/v1/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
          'User-Agent': 'VelaDashboard/1.0',
        },
        body,
      });

      const text = await upstream.text();
      res.writeHead(upstream.status, { 'Content-Type': 'application/json' });
      res.end(text);
    } catch (err) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found. POST /api/chart only.' }));
});

server.listen(PORT, () => {
  console.log(`ProvChart proxy listening on http://localhost:${PORT}`);
  console.log(`API key present: ${API_KEY ? 'yes' : 'NO — set PROVCHART_API_KEY'}`);
});
