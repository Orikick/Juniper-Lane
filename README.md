# Juniper Lane Admin

Developed by **Orest Labiak**.

**Live demo:** https://juniper-lane.netlify.app/

<!-- Screenshots: save them to the docs/ folder with these names, then delete this comment's first and last lines.
![Desktop view](docs/screenshot-desktop.png)
![Mobile view](docs/screenshot-mobile.png)
-->

An analytics dashboard for **Juniper Lane**, a fictional online shop that sells homeware and small gifts from a studio in Bristol. It shows revenue, orders and customers for any date range, with a mock sign-in, a dark theme and a fake API that behaves like a real one: slow responses, loading states and failures you can switch on.

The project is a front-end portfolio piece. There is no backend: all data is generated JSON served through an async function with a delay.

## Stack

| Area | Choice |
| --- | --- |
| Build | Vite 5 |
| UI | React 18 (JavaScript, function components and hooks) |
| Routing | React Router 6, with lazy-loaded pages |
| Charts | Recharts 2 |
| Tables | TanStack Table 8 |
| Styling | SCSS modules, with design tokens as CSS custom properties |
| Icons | lucide-react |
| Fonts | Bricolage Grotesque (headings) and Public Sans (body), self-hosted via Fontsource |

Forms, validation, the date-range picker, the drawer and the dropdown menu are written by hand. There is no UI kit or form library.

## Getting started

You need Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the address Vite prints (usually http://localhost:5173). Sign in with **any email address and a password of 8 or more characters**: authentication is mocked.

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the production bundle into `dist/` |
| `npm run preview` | Serves the production build locally, for example to run Lighthouse |
| `npm run generate:data` | Regenerates the mock JSON in `src/data` |

## Features

### Layout

- Collapsible sidebar. It collapses to an icon rail, starts collapsed on narrower desktops and remembers your choice. Below 768px it becomes a slide-in menu.
- Top bar with global search, the date-range filter, a theme switch and the user menu.
- Footer with the developer credit on every page, including sign-in.
- Responsive at 360px, 768px and 1280px and above.

### Pages

- **Login:** mock sign-in with inline validation and a show/hide password button. It returns you to the page you originally asked for.
- **Overview:**
  - Four KPI cards (revenue, orders, average order value, new customers), each with its change against the previous period.
  - Revenue line chart, with the previous period dashed behind it.
  - Orders bar chart.
  - Sales-by-category donut.
- **Orders:** TanStack Table with:
  - sortable columns
  - status, payment and minimum-total filters
  - search by order number or customer
  - pagination with a page-size choice
  - status badges
- **Customers:** table with search, a country filter and sorting. Selecting a customer opens a details drawer with their contact details, lifetime figures and recent orders.
- **Settings:**
  - Profile form with validation and save, discard and error handling.
  - Notification switches.
  - Theme choice (system, light or dark).
  - A switch that makes API requests fail, to show the error screens.

### Date range

- Presets for 7 days, 30 days, 90 days and 12 months, plus a custom from/to range with validation.
- Changing the range updates every KPI, every chart and the Orders table at once. All of them are calculated from the same list of orders, so the figures always agree.
- Each KPI's change is measured against the previous period of the same length.
- Charts group by day, week or month depending on the length of the range.

### Search and deep links

- Global search suggests matching orders and customers as you type, and supports the arrow keys.
- Choosing a result opens the right page. If an order is older than the current range, the range widens so the order is visible.
- The Orders search, the Customers search and the open customer are kept in the URL, so they can be bookmarked or shared.

### Loading, empty and error states

- **Loading:** skeleton placeholders for KPIs, charts, table rows and the profile form.
- **Empty:** a message whenever there is no data, for example "No orders in this period", or no rows that match the filters (with a button to clear them).
- **Errors:** an error message with a **Try again** button for every request. Turn on **Settings → Demo tools → Simulate failed requests** to see them.

### Dark mode

- On the first visit the theme follows the system setting. After that it remembers your choice.
- The theme is applied before the first paint, so the page never flashes the wrong colours.
- Charts read the same colour tokens, so they switch with the rest of the interface.

### Accessibility

- Semantic landmarks, a skip link, a single `h1` per page, and focus moved to the content on each page change.
- Every form field has a label, and hints and errors are linked to it with `aria-describedby`. On submit, focus goes to the first invalid field.
- Visible keyboard focus throughout. Menus, the search suggestions and the drawer follow the matching ARIA patterns (menu button, combobox and modal dialog).
- Sortable table headers announce their sort order with `aria-sort`.
- Status badges, KPI changes and chart legends always pair colour with text or an arrow.
- Chart colours were checked for colour-blind separation in both themes. Every chart has a text summary for screen readers and a **Show table** view with the exact figures.
- Animation is turned off when the system asks for reduced motion.

### Performance

- Each page is its own lazy-loaded chunk, and Recharts loads only with the Overview page.
- The mock data is loaded with a dynamic import, outside the main bundle.
- Fonts are self-hosted variable fonts, so no requests go to a third-party font service.

## Project structure

```
src/
├─ api/            fakeApi.js: async functions with a delay and optional failures
├─ components/
│  ├─ auth/        LoginForm
│  ├─ charts/      ChartCard, RevenueLineChart, OrdersBarChart, CategoryDonutChart,
│  │               ChartTooltip, ChartDataTable
│  ├─ customers/   CustomerDrawer
│  ├─ dashboard/   KpiCard, KpiGrid
│  ├─ layout/      AppShell, Sidebar, TopBar, Footer, GlobalSearch, DateRangePicker,
│  │               UserMenu, ThemeToggle, SkipLink, ProtectedRoute
│  ├─ settings/    ProfileForm, PreferencesPanel
│  ├─ table/       DataTable, TableToolbar, ColumnFilter, Pagination
│  └─ ui/          Button, IconButton, Card, StatusBadge, Avatar, Spinner, Skeleton,
│                  StateMessage, FormField, Select, Switch, Drawer, DropdownMenu,
│                  PageHeader, BrandMark
├─ context/        AuthContext, ThemeContext, DateRangeContext
├─ data/           Mock JSON (orders, customers, products, categories, profile) and
│                  static lists (navigation, date presets, order statuses)
├─ hooks/          useAsync, useOrdersInRange, useForm, useLocalStorage, useMediaQuery,
│                  useDebouncedValue, useDocumentTitle, useOnClickOutside, useReducedMotion
├─ pages/          Login, Overview, Orders, Customers, Settings, NotFound
├─ styles/         _tokens.scss (light and dark themes), _mixins.scss, global.scss
└─ utils/          metrics.js (KPIs and chart data), dateRange.js, formatters.js,
                   validators.js, cx.js
scripts/
└─ generate-data.mjs   Seeded generator for the mock data
```

Every component lives in its own folder, with its `.jsx` file next to its `.module.scss` file.

## About the mock data

- `scripts/generate-data.mjs` creates about 1,100 orders from about 130 customers across two years, with steady growth, busier weekends and evening peaks.
- It uses a fixed seed, so running it again produces the same files.
- When the data loads, every date is shifted so that the newest order falls on today. The dashboard never looks out of date.
- Revenue counts orders that are processing, shipped or delivered. Refunded and cancelled orders are excluded.
- Customer phone numbers use the UK range reserved for drama and fiction (01632 960xxx), and every email address uses `example.com`.

## Notes

- Sign-in is mocked. Nothing leaves the browser, and the session, profile, theme and sidebar state are kept in `localStorage`.
- To deploy under a sub-path, set `base` in `vite.config.js`. If the host does not fall back to `index.html` for unknown paths, configure it to, so that deep links such as `/orders` work.

## Code quality

```bash
npm run lint          # check the code with ESLint
npm run lint:fix      # fix what ESLint can fix automatically
npm run format        # format every file with Prettier
npm run format:check  # check formatting without changing files
```

ESLint uses the recommended JavaScript rules plus the React Hooks rules (`eslint.config.js`).
Prettier settings are in `.prettierrc.json`.
