// A stand-in for a real backend. Every function returns a promise that resolves
// after a short delay, so the UI has genuine loading and error states to handle.
// Swapping this file for real fetch calls would not change any component.
import defaultProfile from '../data/profile.json';
import { addDays, diffInDays } from '../utils/dateRange';
import { countsAsRevenue } from '../utils/metrics';

export const SIMULATE_ERRORS_KEY = 'jl:simulate-errors';
const PROFILE_KEY = 'jl:profile';

export class ApiError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ApiError';
  }
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Settings has a switch that makes requests fail, to show the error states.
function shouldFail() {
  try {
    return JSON.parse(localStorage.getItem(SIMULATE_ERRORS_KEY)) === true;
  } catch {
    return false;
  }
}

async function request(resolver, { min = 600, max = 900, canFail = true } = {}) {
  await wait(min + Math.random() * (max - min));
  if (canFail && shouldFail()) {
    throw new ApiError('The request failed. Check your connection and try again.');
  }
  return resolver();
}

// --- In-memory database ------------------------------------------------------

let databasePromise;

function loadDatabase() {
  if (!databasePromise) {
    // Dynamic imports keep the mock data out of the main bundle.
    databasePromise = Promise.all([
      import('../data/orders.json'),
      import('../data/customers.json'),
      import('../data/products.json'),
    ])
      .then(([orders, customers, products]) =>
        buildDatabase(orders.default, customers.default, products.default),
      )
      .catch((error) => {
        databasePromise = undefined;
        throw error;
      });
  }
  return databasePromise;
}

function buildDatabase(rawOrders, rawCustomers, products) {
  const now = new Date();
  const productBySku = new Map(products.map((product) => [product.sku, product]));
  const customerById = new Map(rawCustomers.map((customer) => [customer.id, customer]));

  // Shift every date by whole days so the newest order lands on today.
  // ISO strings sort chronologically, so a string comparison finds the newest.
  const latest = rawOrders.reduce((max, order) => (order.date > max ? order.date : max), '');
  const offset = diffInDays(new Date(latest), now);
  const shiftDate = (iso) => {
    const shifted = addDays(new Date(iso), offset);
    return shifted > now ? addDays(shifted, -1) : shifted;
  };

  const orders = rawOrders
    .map((order) => {
      const items = order.items.map((item) => {
        const product = productBySku.get(item.sku);
        return { ...item, name: product.name, category: product.category, price: product.price };
      });
      return {
        id: order.id,
        placedAt: shiftDate(order.date),
        customerId: order.customerId,
        customerName: customerById.get(order.customerId).name,
        status: order.status,
        payment: order.payment,
        items,
        itemCount: items.reduce((sum, item) => sum + item.qty, 0),
        total: order.total,
      };
    })
    .sort((a, b) => b.placedAt - a.placedAt);

  const stats = new Map();
  for (const order of orders) {
    const entry = stats.get(order.customerId) ?? {
      orderCount: 0,
      totalSpent: 0,
      lastOrderAt: order.placedAt,
      joinedAt: order.placedAt,
    };
    entry.orderCount += 1;
    if (countsAsRevenue(order)) entry.totalSpent += order.total;
    if (order.placedAt > entry.lastOrderAt) entry.lastOrderAt = order.placedAt;
    if (order.placedAt < entry.joinedAt) entry.joinedAt = order.placedAt;
    stats.set(order.customerId, entry);
  }

  const customers = rawCustomers
    .filter((customer) => stats.has(customer.id))
    .map((customer) => ({ ...customer, ...stats.get(customer.id) }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { orders, customers };
}

// --- Orders and customers ----------------------------------------------------

export const getOrders = () => request(async () => (await loadDatabase()).orders);

export const getCustomers = () => request(async () => (await loadDatabase()).customers);

export const getCustomerOrders = (customerId) =>
  request(
    async () => {
      const { orders } = await loadDatabase();
      return orders.filter((order) => order.customerId === customerId);
    },
    { min: 400, max: 700 },
  );

export const search = (query) =>
  request(
    async () => {
      const term = query.trim().toLowerCase();
      if (!term) return { orders: [], customers: [] };
      const { orders, customers } = await loadDatabase();
      return {
        orders: orders
          .filter(
            (order) =>
              order.id.toLowerCase().includes(term) ||
              order.customerName.toLowerCase().includes(term),
          )
          .slice(0, 5),
        customers: customers
          .filter(
            (customer) =>
              customer.name.toLowerCase().includes(term) ||
              customer.email.toLowerCase().includes(term),
          )
          .slice(0, 5),
      };
    },
    { min: 250, max: 450 },
  );

// --- Profile and sign-in -----------------------------------------------------

function readProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROFILE_KEY));
    if (!saved) return defaultProfile;
    return {
      ...defaultProfile,
      ...saved,
      notifications: { ...defaultProfile.notifications, ...saved.notifications },
    };
  } catch {
    return defaultProfile;
  }
}

function writeProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Storage can be unavailable in private windows. The profile then lasts for this visit only.
  }
  return profile;
}

export const getProfile = () => request(readProfile);

export const saveProfile = (profile) => request(() => writeProfile(profile), { min: 700, max: 1000 });

// Mock sign-in: there is no real authentication, so any valid-looking credentials succeed.
export const signIn = ({ email }) =>
  request(() => writeProfile({ ...readProfile(), email: email.trim() }), {
    min: 500,
    max: 800,
    canFail: false,
  });
