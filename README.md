# 🔧 TradeBoard — Skilled-Trades Job Board

A production-ready job board for **HVAC, plumbing, electrical, welding, carpentry,
automotive, machining and construction jobs** — built to make money from day one.

## The business

| | |
|---|---|
| **Niche** | Skilled trades (530K+ unfilled US positions, postings up 18–30%/yr) |
| **Revenue** | $149 standard post · $249 featured · $495 5-pack · $499/mo agency plan |
| **Seekers** | Always free — they're the inventory that attracts paying employers |
| **Stack** | Next.js 15 · TypeScript · Tailwind · Postgres (Drizzle) · Auth.js v5 · Stripe · Resend |
| **Cost** | ~$0/mo to run: Vercel free tier + Neon free tier |

## Quick start (local, no external accounts needed)

```bash
npm install

# 1. Database — either option:
docker compose up -d                # if you have Docker
node scripts/dev-db.mjs start       # embedded Postgres, no Docker/admin needed

# 2. Environment
cp .env.example .env                # defaults work out of the box

# 3. Schema + sample data
npm run db:push
npm run db:seed

# 4. Run
npm run dev                         # http://localhost:3000
```

**No Stripe key? No problem.** Without Stripe keys the checkout runs in dev mode:
orders complete instantly so you can test the entire post-a-job → publish →
apply → dashboard flow locally.

### Seeded logins

| Role | Email | Password |
|---|---|---|
| Admin | `admin@localhost` | `admin1234` (from `.env`) |
| Employer | `demo@tradeboard.local` | `demo1234` |
| Promo codes | `FIRST50`, `LAUNCH100` | 100% off — use to seed real listings free |

## Going live with real payments (Stripe)

1. **Create products** in the Stripe dashboard (one-off: Standard $149, Featured $249,
   5-Pack $495; recurring monthly: Agency $499).
2. Copy each **Price ID** (`price_…`) into `.env` → `STRIPE_PRICE_*`.
3. Set `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
4. **Webhook**: add endpoint `https://yourdomain.com/api/stripe/webhook` with events
   `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`.
5. Test with `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
   (A success-page fallback also fulfills orders, so payments work even if a webhook is missed.)

## Deploying (Vercel + Neon)

1. Create a free Postgres at [neon.tech](https://neon.tech) → copy the connection string.
2. Push to GitHub → import the repo in Vercel → set all `.env` variables
   (`DATABASE_URL`, `AUTH_SECRET` → `openssl rand -base64 32`,
   `NEXT_PUBLIC_APP_URL=https://yourdomain.com`, Stripe keys, `CRON_SECRET`).
3. Run `npm run db:push && npm run db:seed` locally against the Neon URL
   (or clear the sample listings via `/admin` afterwards).
4. Add your domain in Vercel. Cron jobs in `vercel.json` expire stale listings daily
   and send the weekly job-alert email (Vercel Cron calls them with your `CRON_SECRET`).

## How the money flows

```
Employer → /post-a-job (details) → /post-a-job/pay (preview + plan + promo)
         → /api/checkout
              ├─ Agency plan active?            publish free (unlimited)
              ├─ Has 5-pack credits?            publish free (standard posts)
              ├─ Valid 100% promo code?         publish free (seeding strategy)
              └─ Otherwise → Stripe Checkout → webhook → auto-publish (30 days)
Seeker → /jobs, /hvac-jobs, /hvac-jobs/texas … → apply by form (emails employer) or link
Admin  → /admin: revenue, orders, live-job count, subscribers, reject listings
```

## SEO / growth built in

- **Google Jobs**: every listing emits `JobPosting` JSON-LD
- **Programmatic pages**: 9 trade hubs × 30 states (270 landing pages) + sitemap
- **Email capture**: job-alert subscribe form on every page → weekly digest cron
- **Launch promo**: `FIRST50` fills the board with real listings free, then start charging

### 30-day launch playbook

1. **Week 1**: deploy, seed real listings via free-post promo (email 20 local contractors/day), submit sitemap in Search Console
2. **Week 2**: outreach to staffing agencies for the $499 plan (they post unlimited); post in r/HVAC, r/Plumbing, contractor Facebook groups
3. **Week 3**: contact trade-school job offices; start weekly newsletter once 100+ subscribers
4. **Week 4**: first paid posts; raise free-promo limits down; iterate pricing

## Project structure

```
src/
  app/                 # App Router pages + API routes
    jobs/              # browse, detail (+JSON-LD), apply
    [trade]/           # /hvac-jobs, /[trade]/[state] programmatic SEO
    post-a-job/        # wizard: details → preview → pay
    dashboard/         # employer: listings, applicants
    admin/             # revenue + moderation
    api/               # checkout, stripe webhook, cron, auth
  components/          # header, footer, job card, UI primitives
  db/                  # Drizzle schema + client
  lib/                 # pricing, entitlements, fulfillment, data, email, seo
scripts/
  seed.ts              # 43 realistic listings + companies + promo codes
  dev-db.mjs           # embedded Postgres for dev (no Docker)
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `start` | Production build / serve |
| `npm run typecheck` | Strict TS check |
| `npm run db:push` | Sync schema to database |
| `npm run db:seed` | Reset + load sample data |
| `node scripts/dev-db.mjs start\|stop` | Embedded Postgres (no Docker) |
