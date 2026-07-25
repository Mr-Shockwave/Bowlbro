# BowlBro — Onboarding

Welcome! This gets you (and your Claude) productive on the BowlBro food-ordering
demo in about 10 minutes.

## 1. Get the code and run it

```bash
git clone git@github.com:Mr-Shockwave/Bowlbro.git
cd Bowlbro
npm install
```

Create `.env.local` in the project root with **your own** OpenAI API key
(https://platform.openai.com/api-keys — the app never uses anyone else's key,
and this file is git-ignored):

```
OPENAI_API_KEY=sk-...
```

```bash
npm run dev
```

Open http://localhost:3000 — you should see the EmberEats home page.
The full README covers features and project layout.

## 2. Two-minute tour

- `/menu` — customer menu; cuisine sections + course filters; each card has a
  🔍 Photo button (Wikimedia image search)
- `/calculator` — upload a food photo → AI calorie estimate
- `/build-your-own` — tick ingredients → AI suggests 3 dishes → optional
  AI-generated preview image → add to cart
- Vendor tools — at the bottom of `/menu` ("Restaurant owner? → Upload your
  menu"): photograph a paper menu → AI extracts dishes → fill required fields
  (one-sentence intro, allergens) → publish → dishes appear in the menu above
- Checkout is a mock (no payments); orders live in sessionStorage.

## 3. Gotchas that cost us time (so they don't cost you)

- **Testing from a phone/another device:** Next.js dev blocks assets for
  non-localhost origins. Set `allowedDevOrigins: ["<your-lan-ip>"]` in
  `next.config.ts` and restart, or every button silently does nothing on the
  other device.
- **OpenAI key format:** keys start with `sk-` from platform.openai.com. An
  Anthropic key (`sk-ant-`) will not work — the AI routes call OpenAI.
- **Cart persistence:** items whose id starts with `custom-` (build-your-own
  and vendor dishes) are stored inline in localStorage; static menu items are
  re-resolved from `src/data/menu.ts` by id. Keep that invariant if you touch
  `src/context/CartContext.tsx`.
- **Vendor data:** published vendor menus live in `data/vendor-menu.json`
  (created at first publish, git-ignored). Publishing replaces the whole file.
- **Models:** text/vision = `gpt-5.4-mini`, images = `gpt-image-1-mini`
  (defined at the top of each route in `src/app/api/`). Each AI action costs
  ~1–2 cents.

## 4. Conventions

- Push to GitHub after each completed, verified change (build passing).
- `npm run build` before pushing — it catches type and lint errors.
- No database by design: localStorage (cart), sessionStorage (orders),
  a JSON file (vendor menu). Adding a real DB is the natural next step.

## 5. Ideas queued up (not started)

- Allergen-aware recommendations: vendor dishes already carry allergens +
  a one-sentence intro, collected specifically to power customer
  recommendations later.
- Real order storage / an admin view for incoming orders.
- Configurable pricing for build-your-own dishes (currently AI-suggested $9–19).
