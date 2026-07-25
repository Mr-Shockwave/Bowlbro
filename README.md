# BowlBro (EmberEats demo)

A food-ordering demo built with Next.js 16 + Tailwind CSS, with AI features
powered by the OpenAI API.

## Features

**Customer side**
- Menu with cuisine sections (Asian / American / Mexican / Italian) and course
  filters (Appetizers / Mains / Desserts / Drinks)
- Cart with localStorage persistence, guest checkout (delivery or pickup),
  order confirmation
- Per-dish photo search (Wikimedia Commons, no key needed)
- 🔥 **Cal Calculator** (`/calculator`) — upload a dish photo, AI estimates
  calories with a per-ingredient breakdown
- 🥘 **Build Your Own** (`/build-your-own`) — pick ingredients from a
  checklist, AI suggests the 3 most popular ways to cook them, with optional
  AI-generated preview images; chosen dishes go into the cart

**Vendor side** (bottom of `/menu` — "Restaurant owner? → Upload your menu")
- Photograph a paper menu → AI extracts every dish into an editable e-menu
- Required per-dish parameters: one-sentence intro and allergen declarations
  (used on customer-facing cards and intended for future recommendations)
- Published dishes are stored in `data/vendor-menu.json` (runtime data,
  git-ignored) and merged into the customer menu

## Setup

```bash
git clone git@github.com:Mr-Shockwave/Bowlbro.git
cd Bowlbro
npm install
```

Create `.env.local` in the project root with **your own** OpenAI API key
(get one at https://platform.openai.com/api-keys):

```
OPENAI_API_KEY=sk-...
```

Then:

```bash
npm run dev
```

Open http://localhost:3000. Without the key the site still runs; only the AI
features (Cal Calculator, Build Your Own, menu scanning) show a
"not configured" message.

## AI models & cost

- Text/vision: `gpt-5.4-mini` (calorie analysis, dish suggestions, menu scanning)
- Images: `gpt-image-1-mini`, low quality, WebP (dish previews)

Each AI action costs roughly 1–2 cents. Model names live at the top of the
route files under `src/app/api/` if you want to swap them.

## Testing on other devices (LAN)

The dev server listens on your LAN, but Next.js blocks dev assets for
non-localhost origins unless allowed. Put **your machine's IP** in
`next.config.ts`:

```ts
allowedDevOrigins: ["<your-lan-ip>"],
```

then restart `npm run dev` and open `http://<your-lan-ip>:3000` from the
other device.

## Image credits

Dish photos under `public/dishes/` are sourced from
[Wikimedia Commons](https://commons.wikimedia.org/) under their respective
free licenses (demo use).

## Project layout

```
src/app/            pages (menu, calculator, build-your-own, vendor, checkout…)
src/app/api/        API routes (calories, dish-image, build-your-own,
                    food-image, vendor/scan-menu, vendor/menu)
src/components/     Header, MenuItemCard, CartDrawer, CheckoutForm, …
src/context/        CartContext (cart state + localStorage persistence)
src/data/           static menu, ingredient checklist, vendor types
data/               runtime vendor menu store (created on first publish)
```

Notes:
- Cart items with ids starting `custom-` (build-your-own dishes, vendor
  dishes) are persisted inline in localStorage; static menu items are
  re-resolved by id.
- Checkout is a mock: no payments, orders live in sessionStorage only.
