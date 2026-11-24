// Generates the mock data in src/data. The output is deterministic: the same
// seed always produces the same files, so the JSON can be committed.
//
//   npm run generate:data
//
// Dates end on BASE_DATE. The fake API shifts them at load time so the most
// recent order always falls on "today".
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data');
const SEED = 2024;
const BASE_DATE = new Date(2026, 10, 16);
const DAYS = 730;
const NEW_CUSTOMER_RATE = 0.125;

// --- Seeded random helpers ---------------------------------------------------

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(SEED);
const pick = (list) => list[Math.floor(random() * list.length)];

function pickWeighted(entries) {
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = random() * total;
  for (const [value, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return value;
  }
  return entries[entries.length - 1][0];
}

function poisson(lambda) {
  const limit = Math.exp(-lambda);
  let count = 0;
  let product = 1;
  do {
    count += 1;
    product *= random();
  } while (product > limit);
  return count - 1;
}

// --- Catalogue ---------------------------------------------------------------

const categories = [
  { id: 'kitchen', name: 'Kitchen & dining' },
  { id: 'bedding', name: 'Bedding & bath' },
  { id: 'lighting', name: 'Lighting' },
  { id: 'decor', name: 'Home decor' },
  { id: 'gifts', name: 'Gifts & stationery' },
];

const categoryWeights = [
  ['kitchen', 28],
  ['bedding', 20],
  ['lighting', 16],
  ['decor', 22],
  ['gifts', 14],
];

const catalogue = {
  kitchen: [
    ['Stoneware dinner plates, set of four', 48],
    ['Olive wood serving board', 32],
    ['Linen apron', 28],
    ['Speckled mugs, set of two', 24],
    ['Enamel roasting tin', 36],
    ['Glass storage jars, set of three', 22],
  ],
  bedding: [
    ['Washed linen duvet cover', 120],
    ['Linen pillowcases, pair', 38],
    ['Waffle bath towel', 26],
    ['Wool throw blanket', 85],
    ['Cotton bath mat', 24],
    ['Quilted bedspread', 140],
  ],
  lighting: [
    ['Ribbed glass table lamp', 78],
    ['Brass wall light', 64],
    ['Rattan pendant shade', 56],
    ['Ceramic bedside lamp', 49],
    ['Soy wax candle, cedar and fig', 18],
    ['Taper candles, set of six', 12],
  ],
  decor: [
    ['Stoneware bud vase', 19],
    ['Framed botanical print', 42],
    ['Jute runner rug', 95],
    ['Seagrass storage basket', 34],
    ['Arched wall mirror', 110],
    ['Linen cushion cover', 27],
  ],
  gifts: [
    ['Letterpress notebook', 14],
    ['Seeded greeting cards, set of five', 9],
    ['Candle gift box', 45],
    ['Brass bookmark', 11],
    ['Loose-leaf tea sampler', 21],
    ['Weekly desk planner', 16],
  ],
};

const products = categories.flatMap((category) =>
  catalogue[category.id].map(([name, price], index) => ({
    sku: `${category.id.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(2, '0')}`,
    name,
    category: category.id,
    price,
  })),
);

const productsByCategory = Object.fromEntries(
  categories.map((category) => [
    category.id,
    products.filter((product) => product.category === category.id),
  ]),
);

// --- Customers ---------------------------------------------------------------

const firstNames = [
  'Amelia', 'Oliver', 'Priya', 'Kwame', 'Sofia', 'Liam', 'Aisha', 'Tomasz', 'Niamh', 'Rhys',
  'Mei', 'Callum', 'Fatima', 'Ewan', 'Ingrid', 'Mateo', 'Zainab', 'Hugo', 'Saoirse', 'Daniel',
  'Chloe', 'Arjun', 'Freya', 'Marcus', 'Elena', 'Idris', 'Hannah', 'Jonas', 'Leila', 'Owen',
  'Beatrice', 'Tariq', 'Maeve', 'Lucas', 'Yasmin', 'Finn', 'Greta', 'Samuel', 'Naomi', 'Pieter',
];

const lastNames = [
  'Hughes', 'Patel', 'Okafor', 'Lindqvist', 'Murphy', 'Fraser', 'Khan', 'Nowak', 'Evans', 'Campbell',
  'Chen', 'Rossi', 'Byrne', 'de Vries', 'Schneider', 'Laurent', 'Ahmed', 'Wright', 'Bennett', 'Kaur',
  'Morgan', 'Singh', 'Doyle', 'Baker', 'Novak', 'Hassan', 'Walsh', 'Jansen', 'Fischer', 'Moreau',
  'Reid', 'Clarke', 'Mensah', 'Turner', 'Petrov', 'Ellis', 'Sharma', 'Gallagher', 'Bauer', 'Dubois',
];

const locations = [
  [['London', 'United Kingdom'], 16],
  [['Manchester', 'United Kingdom'], 8],
  [['Bristol', 'United Kingdom'], 7],
  [['Edinburgh', 'United Kingdom'], 7],
  [['Glasgow', 'United Kingdom'], 5],
  [['Leeds', 'United Kingdom'], 5],
  [['Brighton', 'United Kingdom'], 5],
  [['Cardiff', 'United Kingdom'], 4],
  [['Bath', 'United Kingdom'], 3],
  [['York', 'United Kingdom'], 3],
  [['Norwich', 'United Kingdom'], 2],
  [['Belfast', 'United Kingdom'], 2],
  [['Dublin', 'Ireland'], 6],
  [['Cork', 'Ireland'], 3],
  [['Galway', 'Ireland'], 2],
  [['Amsterdam', 'Netherlands'], 4],
  [['Utrecht', 'Netherlands'], 2],
  [['Berlin', 'Germany'], 4],
  [['Hamburg', 'Germany'], 2],
  [['Paris', 'France'], 4],
  [['Lyon', 'France'], 2],
];

function createCustomerPool(size) {
  const pool = [];
  const usedNames = new Set();
  while (pool.length < size) {
    const name = `${pick(firstNames)} ${pick(lastNames)}`;
    if (usedNames.has(name)) continue;
    usedNames.add(name);
    const [city, country] = pickWeighted(locations);
    const index = pool.length + 1;
    pool.push({
      id: `C-${String(index).padStart(3, '0')}`,
      name,
      email: `${name.toLowerCase().replace(/[^a-z ]/g, '').trim().replace(/ +/g, '.')}@example.com`,
      // 01632 960xxx is a range reserved for fictional use, so these numbers reach nobody.
      phone: country === 'United Kingdom' ? `+44 1632 960 ${String(100 + index)}` : null,
      city,
      country,
      loyalty: pickWeighted([[1, 55], [2, 25], [4, 14], [8, 6]]),
    });
  }
  return pool;
}

// --- Orders ------------------------------------------------------------------

const weekdayFactor = [1.25, 0.95, 0.9, 0.9, 1.0, 1.05, 1.2];
const hourWeights = [
  [7, 2], [8, 4], [9, 6], [10, 7], [11, 8], [12, 9], [13, 9], [14, 7], [15, 6],
  [16, 6], [17, 7], [18, 8], [19, 10], [20, 11], [21, 10], [22, 6], [23, 3],
];

const pad = (value) => String(value).padStart(2, '0');
const toLocalIso = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
  `T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;

function statusForAge(ageInDays) {
  if (ageInDays <= 2) return pickWeighted([['Processing', 80], ['Shipped', 20]]);
  if (ageInDays <= 8) return pickWeighted([['Shipped', 65], ['Delivered', 25], ['Processing', 10]]);
  return pickWeighted([['Delivered', 89], ['Refunded', 6], ['Cancelled', 5]]);
}

function createItems() {
  const lineCount = pickWeighted([[1, 45], [2, 30], [3, 17], [4, 8]]);
  const lines = new Map();
  for (let i = 0; i < lineCount; i += 1) {
    const product = pick(productsByCategory[pickWeighted(categoryWeights)]);
    const qty = pickWeighted([[1, 75], [2, 20], [3, 5]]);
    lines.set(product.sku, (lines.get(product.sku) ?? 0) + qty);
  }
  return [...lines].map(([sku, qty]) => ({ sku, qty }));
}

function generate() {
  const pool = createCustomerPool(150);
  const joined = [];
  const orders = [];
  const priceBySku = new Map(products.map((product) => [product.sku, product.price]));

  for (let dayIndex = 0; dayIndex < DAYS; dayIndex += 1) {
    const day = new Date(BASE_DATE);
    day.setDate(day.getDate() - (DAYS - 1 - dayIndex));

    const growth = 0.6 + 1.7 * (dayIndex / (DAYS - 1));
    // A gentle wave so that sales rise and dip instead of climbing in a straight line.
    const wave = 1 + 0.12 * Math.sin((dayIndex - 44) / 9);
    const ordersToday = poisson(growth * wave * weekdayFactor[day.getDay()]);

    const times = Array.from({ length: ordersToday }, () => ({
      hour: pickWeighted(hourWeights),
      minute: Math.floor(random() * 60),
    })).sort((a, b) => a.hour - b.hour || a.minute - b.minute);

    for (const { hour, minute } of times) {
      const isNewCustomer =
        joined.length === 0 || (joined.length < pool.length && random() < NEW_CUSTOMER_RATE);
      let customer;
      if (isNewCustomer) {
        customer = pool[joined.length];
        joined.push(customer);
      } else {
        customer = pickWeighted(joined.map((entry) => [entry, entry.loyalty]));
      }

      const items = createItems();
      const placedAt = new Date(day);
      placedAt.setHours(hour, minute, 0, 0);

      orders.push({
        id: `JL-${10001 + orders.length}`,
        date: toLocalIso(placedAt),
        customerId: customer.id,
        status: statusForAge(DAYS - 1 - dayIndex),
        payment: pickWeighted([['Card', 58], ['PayPal', 20], ['Apple Pay', 14], ['Klarna', 8]]),
        items,
        total: items.reduce((sum, item) => sum + item.qty * priceBySku.get(item.sku), 0),
      });
    }
  }

  const customers = joined.map(({ loyalty, ...customer }) => customer);
  return { orders, customers };
}

// --- Output ------------------------------------------------------------------

// One record per line keeps the files readable and the diffs small.
const toJsonLines = (records) =>
  `[\n${records.map((record) => `  ${JSON.stringify(record)}`).join(',\n')}\n]\n`;

const { orders, customers } = generate();

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(resolve(OUT_DIR, 'categories.json'), toJsonLines(categories));
writeFileSync(resolve(OUT_DIR, 'products.json'), toJsonLines(products));
writeFileSync(resolve(OUT_DIR, 'customers.json'), toJsonLines(customers));
writeFileSync(resolve(OUT_DIR, 'orders.json'), toJsonLines(orders));

console.log(
  `Wrote ${orders.length} orders, ${customers.length} customers and ${products.length} products to src/data.`,
);
