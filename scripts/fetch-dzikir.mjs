// One-time snapshot of the Hisnul Muslim API into src/data/dzikir/.
// The app reads only the snapshot, so it never depends on the API being up.
//
//   node scripts/fetch-dzikir.mjs [--allow-missing=86,...]
//
// Nothing is written unless every category validates (or is explicitly allowed to be missing).

import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE = 'https://www.hisnmuslim.com';
const API = `${SOURCE}/api/en`;
const OUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'dzikir');
const BATCH_SIZE = 8;

const allowMissing = new Set(
  (process.argv.find((a) => a.startsWith('--allow-missing='))?.split('=')[1] ?? '')
    .split(',')
    .filter(Boolean)
    .map(Number)
);

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  // Responses start with a BOM, which JSON.parse rejects
  return (await res.text()).replace(/^\uFEFF/, '');
}

// Both endpoints wrap their array in a single key (the language, or the category title).
// Category 126 never closes that key's quote, so take the array itself and ignore the key.
function unwrap(text) {
  const start = text.search(/\[\s*\{/);
  const end = text.lastIndexOf(']');
  if (start === -1 || end < start) throw new Error('unexpected shape');
  return JSON.parse(text.slice(start, end + 1));
}

function toItem(raw) {
  const item = {
    id: Number(raw.ID),
    // Category 132 names this field `Text`
    arabic: String(raw.ARABIC_TEXT ?? raw.Text ?? '').trim(),
    transliteration: String(raw.LANGUAGE_ARABIC_TRANSLATED_TEXT ?? '').trim(),
    translation: String(raw.TRANSLATED_TEXT ?? '').trim(),
    repeat: Number(raw.REPEAT),
  };
  if (!Number.isInteger(item.id)) throw new Error(`item has no numeric ID`);
  if (!item.arabic) throw new Error(`item ${item.id} has no Arabic text`);
  if (!Number.isInteger(item.repeat) || item.repeat < 1) {
    throw new Error(`item ${item.id} has invalid REPEAT ${JSON.stringify(raw.REPEAT)}`);
  }
  return item;
}

async function fetchCategory(id) {
  // Built from the ID: the index's own TEXT url is wrong for at least one entry
  const items = unwrap(await fetchText(`${API}/${id}.json`)).map(toItem);
  if (items.length === 0) throw new Error('no items');
  return items;
}

const index = unwrap(await fetchText(`${API}/husn_en.json`))
  .map((c) => ({ id: Number(c.ID), title: String(c.TITLE).trim() }))
  .sort((a, b) => a.id - b.id);

const categories = [];
const failures = [];
const seen = new Map(); // item-id signature -> category id, to catch one category served under two ids

for (let i = 0; i < index.length; i += BATCH_SIZE) {
  const batch = index.slice(i, i + BATCH_SIZE);
  const results = await Promise.allSettled(batch.map((c) => fetchCategory(c.id)));
  results.forEach((result, j) => {
    const category = batch[j];
    if (result.status === 'rejected') {
      failures.push({ ...category, reason: result.reason.message });
      return;
    }
    const signature = result.value.map((item) => item.id).join(',');
    const duplicateOf = seen.get(signature);
    if (duplicateOf !== undefined) {
      failures.push({ ...category, reason: `same items as category ${duplicateOf}` });
      return;
    }
    seen.set(signature, category.id);
    categories.push({ ...category, items: result.value });
  });
}

const blocking = failures.filter((f) => !allowMissing.has(f.id));
for (const f of failures) {
  console.log(`${allowMissing.has(f.id) ? 'skipped' : 'FAILED'} ${f.id} "${f.title}": ${f.reason}`);
}
if (blocking.length > 0) {
  console.error(
    `\n${blocking.length} of ${index.length} categories failed. Nothing written.\n` +
      `Re-run, or accept the gap with --allow-missing=${blocking.map((f) => f.id).join(',')}`
  );
  process.exit(1);
}

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });
await writeFile(
  path.join(OUT_DIR, 'index.json'),
  JSON.stringify(
    { source: SOURCE, categories: categories.map(({ id, title, items }) => ({ id, title, count: items.length })) },
    null,
    2
  ) + '\n'
);
await Promise.all(
  categories.map(({ id, items }) =>
    writeFile(path.join(OUT_DIR, `${id}.json`), JSON.stringify(items, null, 2) + '\n')
  )
);

const itemCount = categories.reduce((sum, c) => sum + c.items.length, 0);
console.log(
  `\nWrote ${categories.length} of ${index.length} categories, ${itemCount} items to ${path.relative(process.cwd(), OUT_DIR)}`
);
