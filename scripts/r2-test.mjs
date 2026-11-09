// Test de conexión a Cloudflare R2. Uso: node scripts/r2-test.mjs
import { readFileSync } from 'node:fs';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

function loadEnv() {
  const raw = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
loadEnv();

const A = process.env.R2_ACCOUNT_ID;
const K = process.env.R2_ACCESS_KEY_ID;
const S = process.env.R2_SECRET_ACCESS_KEY;
const B = process.env.R2_BUCKET;

// Prueba varias combinaciones de (accountId, accessKeyId)
const candidates = [
  { label: 'Account=ACCOUNT_ID, Key=ACCESS_KEY_ID', account: A, key: K },
  { label: 'Account=ACCESS_KEY_ID, Key=ACCOUNT_ID (cruzados)', account: K, key: A },
];

for (const c of candidates) {
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${c.account}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: c.key, secretAccessKey: S },
  });
  try {
    const list = await client.send(new ListObjectsV2Command({ Bucket: B, MaxKeys: 5 }));
    console.log(`✅ FUNCIONA → ${c.label}`);
    console.log(`   endpoint: https://${c.account}.r2.cloudflarestorage.com`);
    console.log(`   objetos en "${B}": ${list.KeyCount ?? 0}`);
    process.exit(0);
  } catch (err) {
    console.log(`✗ ${c.label}: ${err.name} — ${err.message.split('\n')[0]}`);
  }
}
console.error('\n❌ Ninguna combinación conectó. Revisar valores.');
process.exitCode = 1;
