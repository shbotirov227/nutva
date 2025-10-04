#!/usr/bin/env node
/**
 * Simple CLI to call internal reindex API and log result.
 * Usage: node scripts/ping-search.js [url1 url2 ...]
 */
import https from 'https';

const base = process.env.SITE_ORIGIN || 'https://nutva.uz';
const endpoint = `${base}/api/reindex`;
const urls = process.argv.slice(2).filter(Boolean);

function request(body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const url = new URL(endpoint);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    const req = https.request(url, options, res => {
      let out = '';
      res.on('data', d => (out += d));
      res.on('end', () => resolve({ status: res.statusCode, body: out }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

(async () => {
  try {
    const result = await request({ urls });
    console.log('Reindex ping response:', result.status);
    console.log(result.body);
  } catch (e) {
    console.error('Ping failed:', e);
    process.exit(1);
  }
})();
