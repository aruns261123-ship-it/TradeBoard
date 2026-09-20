# TradeBoard Outreach Kit

Everything you need to fill the board with real employers. Your offer, your scripts, your daily rhythm.

## The offer (what you're selling right now)

**Founding Employer offer — free while we launch:**

- First job post **100% free** with code `LAUNCH100` (100 redemptions available)
- Backup code `FIRST50` (1 free post, 50 redemptions)
- No credit card needed to sign up or redeem
- Their posting includes: 30 days live, applications emailed directly to them, featured placement available
- Send them here: **https://tradeboard-mu.vercel.app/founding-employer** (you can also fill the form *for* them from their info — it lands in your `/admin/leads` pipeline)

**Your pitch in one line:** "We're the new job board just for the trades — no white-collar noise, your ad seen only by HVAC techs / plumbers / electricians. First post is free while we launch."

---

## 1) Cold email — local contractors (send 10–20/day)

**Subject lines (rotate):**

- Hiring HVAC techs in {City}?
- Free job post for {Company Name} (founding offer)
- {FirstName}, where do you post your tech jobs?

**Body:**

> Hi {FirstName},
>
> I'm building TradeBoard — a job board exclusively for the skilled trades (HVAC, plumbing, electrical, welding). No desk jobs, no noise — just tradespeople looking for their next job.
>
> We're onboarding a small group of founding employers in {State} right now, and your first job post is **100% free** (normally $149) — no card required.
>
> If you're hiring — or will be this season — it takes about 3 minutes:
> **https://tradeboard-mu.vercel.app/founding-employer**
>
> If you'd rather, reply with the job details and I'll set it up for you.
>
> {Your name}
> TradeBoard — https://tradeboard-mu.vercel.app

**Follow-up 1 (day 3):** "Hi {FirstName} — quick nudge on my note below. The founding offer (free first post) is open through {month}. Even if you're not hiring now, want me to hold a free credit for peak season? Takes one word: yes."

**Follow-up 2 (day 7):** "Last one from me, {FirstName}. If hiring techs isn't a priority right now, no worries — I'll close your free-post credit and check back in {season}. Good luck out there."

> **Rule:** 3 touches max, then move on. Log every contractor in `/admin/leads` (new → contacted → posted → won/lost).

---

## 2) Phone script — walking in / calling local shops (highest conversion)

> "Hi, is the owner or service manager around? I'm {Name}, I run TradeBoard — a job board just for the trades. We're signing up founding employers in {State} and the first post is free, no card. Are you hiring techs right now?"
>
> **If yes:** "Great — takes 3 minutes at tradeboard-mu.vercel.app/founding-employer, code LAUNCH100 makes it free. Or give me the basics — title, pay, city — and I'll post it for you right now."
>
> **If no:** "No problem. Can I set you up with a free credit for when you are? What's the best email?"
>
> **If "we use Indeed":** "Perfect — keep Indeed. We're where techs go to get *away* from the noise. Think of us as an extra line in the water that costs you nothing right now."

---

## 3) Staffing agencies (your $499/mo customers — pitch early, close later)

**Subject:** Trade-only job board — unlimited posts for {Agency Name}?

> Hi {FirstName},
>
> You place tradespeople — HVAC, plumbing, electrical. TradeBoard is a trades-only board where your roles won't drown in white-collar listings.
>
> While we launch, I'll set your agency up with **free unlimited posting for 30 days**. If your placements speed up, the ongoing plan is $499/mo for unlimited posts — a fraction of one placement fee.
>
> Worth a 15-minute call this week? {phone}
>
> {Your name} — TradeBoard

> **Note:** don't hand agencies a promo code — free unlimited posting during launch is a manual favor you control. Log them in `/admin/leads`, mark `contacted`, and publish their roles yourself with `LAUNCH100` or by posting from your account.

---

## 4) Trade schools & apprenticeship programs

**Subject:** Free job board for {School} grads

> Hi {Name},
>
> I run TradeBoard, a job board for the skilled trades. We'd love to list openings from employers who hire your graduates — free, permanently for schools.
>
> Two asks:
>
> 1. Can we add {School} as a partner? (logo + link on our site)
> 2. Could you share our board with your placement office / graduating class?
>
> Employers are posting HVAC, plumbing, and electrical roles across {State} right now: https://tradeboard-mu.vercel.app
>
> {Your name} — TradeBoard

---

## 5) Community posts (Reddit / Facebook groups — value first, never spam)

**Reddit (r/HVAC, r/Plumbing, r/electricians, r/welding, r/TradeJobs — read each sub's self-promo rules first):**

> **Title:** I built a job board just for the trades — looking for brutally honest feedback
>
> Hey all. I got tired of seeing "HVAC installer" buried under 500 desk jobs on the big boards, so I built TradeBoard — trades-only listings: https://tradeboard-mu.vercel.app
>
> It's early. Right now: 40+ jobs across 30 states, filter by trade/state, apply in one click, weekly job-alert emails.
>
> Techs: tell me what's missing — salary ranges? License filters? Roast it.
> Employers: first post is free while we launch (code LAUNCH100).

**Facebook trade groups:** shorter, screenshot of the job list as the image:

> "Fellow tradesfolk — built a job board with ONLY trade jobs (HVAC/plumbing/electric/welding). Free to apply, new jobs weekly: {link}. Employers hiring: first post free with code LAUNCH100. Mods — remove if not allowed, and my apologies."

---

## Daily rhythm (30–45 min/day)

1. **Morning (20 min):** 10 cold emails + 5 calls/walk-ins. Log all in `/admin/leads`.
2. **Midday (10 min):** 1 community post or comment (rotate subs/groups). Reply to every comment.
3. **Evening (5 min):** Check `/admin/leads` — move statuses, note follow-up dates. Follow up on day-3 leads.

## Targets

| Metric | Week 1 | Week 4 |
|---|---|---|
| Outreach touches | 100 | 400 |
| Leads in pipeline | 20 | 80 |
| Real job posts | 5 | 25 |
| Job-alert subscribers | 50 | 300 |

**The one metric that matters: real job posts.** 25 real listings beats any feature. Post > build.

---

## When you get your custom domain

Find-and-replace `tradeboard-mu.vercel.app` in this file with your real domain, then update `NEXT_PUBLIC_APP_URL` on Vercel and redeploy.
