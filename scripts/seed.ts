/**
 * Seeds realistic sample data so the site looks alive on first run:
 * admin + employer accounts, 12 companies, ~40 jobs, and promo codes.
 *
 *   npm run db:seed
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { companies, jobs, promoCodes, users } from "../src/db/schema";
import { slugify } from "../src/lib/utils";
import type { TradeSlug } from "../src/lib/trades";

const now = Date.now();

function daysAgo(n: number) {
  return new Date(now - n * 86400000);
}

function daysFromNow(n: number) {
  return new Date(now + n * 86400000);
}

type SeedJob = {
  company: string;
  title: string;
  trade: TradeSlug;
  city: string;
  state: string;
  min?: number;
  max?: number;
  type?: "full_time" | "part_time" | "contract" | "apprenticeship";
  featured?: boolean;
  postedDaysAgo: number;
  description: string;
};

const COMPANIES: { name: string; city: string; state: string; website: string; about: string }[] = [
  { name: "Lone Star Climate Co.", city: "Dallas", state: "TX", website: "https://example.com/lonestar", about: "Family-owned HVAC contractor serving North Texas since 1998. 60+ techs and growing every season." },
  { name: "Ironclad Plumbing Group", city: "Houston", state: "TX", website: "https://example.com/ironclad", about: "Commercial and residential plumbing. We run late-model trucks and pay for EPA and journeyman licenses." },
  { name: "Voltway Electric", city: "Phoenix", state: "AZ", website: "https://example.com/voltway", about: "Solar + electrical contractor powering the Southwest. Apprenticeship program certified since 2010." },
  { name: "Great Lakes Welding Works", city: "Chicago", state: "IL", website: "https://example.com/glww", about: "Structural and pipe welding for industrial clients across the Midwest." },
  { name: "Sunshine Air Systems", city: "Tampa", state: "FL", website: "https://example.com/sunshineair", about: "Florida's fastest-growing residential HVAC installer. Year-round cooling means year-round work." },
  { name: "Keystone Mechanical", city: "Philadelphia", state: "PA", website: "https://example.com/keystone", about: "Commercial refrigeration and HVAC for grocery and cold-storage chains." },
  { name: "Cascade Pipe & Flow", city: "Portland", state: "OR", website: "https://example.com/cascade", about: "Green plumbing specialists — tankless, recirculation, and water-efficiency retrofits." },
  { name: "Mile High Riggers", city: "Denver", state: "CO", website: "https://example.com/milehigh", about: "Steel erection and certified welding crews for mountain-region construction." },
  { name: "Empire Auto & Diesel", city: "Brooklyn", state: "NY", website: "https://example.com/empireauto", about: "Five-bay shop in Brooklyn. ASE-certified team, brand-new lifts." },
  { name: "Precision CNC Partners", city: "Columbus", state: "OH", website: "https://example.com/precisioncnc", about: "Aerospace machining supplier running 3 shifts. Haas and Mazak on the floor." },
  { name: "Peach State Builders", city: "Atlanta", state: "GA", website: "https://example.com/peachstate", about: "General contractor building single-family and multifamily across Georgia." },
  { name: "Desert Service Alliance", city: "Las Vegas", state: "NV", website: "https://example.com/dsa", about: "Multi-trade service company: HVAC, plumbing, electrical under one roof." },
];

const JOBS: SeedJob[] = [
  { company: "Lone Star Climate Co.", title: "HVAC Service Technician", trade: "hvac", city: "Dallas", state: "TX", min: 62000, max: 95000, featured: true, postedDaysAgo: 1, description: "Lone Star Climate Co. is hiring experienced HVAC service techs in Dallas.\n\nWhat you'll do:\n- Diagnose and repair residential and light-commercial systems\n- Perform seasonal maintenance on 8-12 calls per day\n- Communicate options clearly with homeowners\n\nWhat we offer:\n- $62k-$95k DOE + commission on attachments\n- Company truck, tools, and uniforms\n- EPA 608 certification paid\n- 401(k) with 4% match, health/dental/vision\n\nRequirements:\n- 2+ years field experience\n- EPA 608 certification\n- Clean driving record" },
  { company: "Lone Star Climate Co.", title: "HVAC Install Helper / Apprentice", trade: "hvac", city: "Fort Worth", state: "TX", min: 38000, max: 48000, type: "apprenticeship", postedDaysAgo: 3, description: "Entry-level HVAC apprenticeship in Fort Worth. No experience required — we train.\n\nYou'll assist lead installers with equipment change-outs, learn ductwork basics, and get paid while you earn your EPA cert (we cover the cost).\n\n$38k-$48k + overtime. Full benefits after 60 days." },
  { company: "Sunshine Air Systems", title: "Residential HVAC Installer", trade: "hvac", city: "Tampa", state: "FL", min: 55000, max: 80000, postedDaysAgo: 2, description: "Sunshine Air Systems installs more residential systems in Tampa Bay than anyone.\n\n- Full-time, year-round work (Florida cooling never stops)\n- $55k-$80k + per-install bonuses\n- New equipment, 2-person crews\n- Health insurance + PTO from day one\n\nEPA 608 required. 1+ year install experience preferred." },
  { company: "Keystone Mechanical", title: "Commercial Refrigeration Technician", trade: "hvac", city: "Philadelphia", state: "PA", min: 70000, max: 105000, featured: true, postedDaysAgo: 1, description: "Keystone Mechanical services grocery chains and cold-storage facilities across the Mid-Atlantic.\n\nWork on rack systems, walk-ins, and controls. C0/D license a plus.\n\n$70k-$105k, on-call rotation paid, van + fuel card, full benefits. Union-adjacent shop with annual tool allowance." },
  { company: "Desert Service Alliance", title: "HVAC Lead Technician", trade: "hvac", city: "Las Vegas", state: "NV", min: 75000, max: 110000, postedDaysAgo: 4, description: "Lead tech role in Las Vegas — the toughest HVAC market in America, which means the best pay.\n\n- $75k-$110k with commission\n- Mentor apprentices on 2-person crews\n- Commercial rooftop + residential split systems\n- Sign-on bonus $2,500\n\n5+ years experience, NATE certification preferred, EPA 608 required." },
  { company: "Ironclad Plumbing Group", title: "Journeyman Plumber", trade: "plumbing", city: "Houston", state: "TX", min: 65000, max: 98000, featured: true, postedDaysAgo: 2, description: "Ironclad Plumbing Group needs licensed journeymen in Houston.\n\n- Service and repair-focused work (no new-contract mud)\n- $65k-$98k + spiffs on water heaters and repipes\n- Take-home company van\n- We pay for and renew your TX journeyman license\n\nRequirements: TX journeyman license, 3+ years, clean MVR." },
  { company: "Ironclad Plumbing Group", title: "Plumber Apprentice", trade: "plumbing", city: "Houston", state: "TX", min: 36000, max: 44000, type: "apprenticeship", postedDaysAgo: 5, description: "Start your plumbing career with Ironclad. We put you on trucks with master plumbers, sponsor your apprenticeship hours, and cover trade school tuition.\n\n$36k-$44k to start, raises every 6 months. Benefits after 90 days." },
  { company: "Cascade Pipe & Flow", title: "Green Plumbing Specialist", trade: "plumbing", city: "Portland", state: "OR", min: 78000, max: 96000, postedDaysAgo: 3, description: "Cascade Pipe & Flow leads the Northwest in water-efficiency retrofits.\n\nYou'll install tankless and heat-pump water heaters, recirculation systems, and greywater setups. Training provided on all green tech.\n\n$78k-$96k, 4/10 schedule (Fridays off), union-scale benefits, boot + tool allowance." },
  { company: "Desert Service Alliance", title: "Residential Plumber", trade: "plumbing", city: "Las Vegas", state: "NV", min: 60000, max: 85000, postedDaysAgo: 6, description: "Multi-trade company seeking residential plumbers in Las Vegas.\n\nService-focused: drains, water heaters, repipes. Bilingual (English/Spanish) techs encouraged to apply.\n\n$60k-$85k + commission, company van, health/dental/401(k)." },
  { company: "Voltway Electric", title: "Journeyman Electrician — Solar", trade: "electrical", city: "Phoenix", state: "AZ", min: 72000, max: 104000, featured: true, postedDaysAgo: 1, description: "Voltway Electric installs solar + storage across metro Phoenix.\n\n- $72k-$104k + per-job bonuses\n- Residential solar and battery installs\n- Journeyman license required; solar NABCEP a plus\n- Company truck and full tool package\n\nWe're booking 8 weeks out — help us keep up with demand." },
  { company: "Voltway Electric", title: "Electrical Apprentice", trade: "electrical", city: "Mesa", state: "AZ", min: 38000, max: 46000, type: "apprenticeship", postedDaysAgo: 4, description: "Registered electrical apprenticeship in Mesa, AZ. Earn while you learn: 8,000 OJT hours + classroom (we pay tuition).\n\n$38k-$46k with structured raises. Paths to residential or solar specialization." },
  { company: "Keystone Mechanical", title: "Industrial Electrician", trade: "electrical", city: "Allentown", state: "PA", min: 76000, max: 99000, postedDaysAgo: 7, description: "Industrial electricians for cold-storage and food-processing facilities.\n\n- 3-phase power, MCCs, PLC troubleshooting\n- $76k-$99k, OT available year-round\n- LOTO and NFPA 70E training provided\n\n5+ years industrial experience required." },
  { company: "Desert Service Alliance", title: "Commercial Electrician", trade: "electrical", city: "Henderson", state: "NV", min: 68000, max: 92000, postedDaysAgo: 8, description: "Tenant-improvement and service work for commercial clients in Henderson.\n\nJourneyman card required. $68k-$92k DOE, full benefits, steady 40+ hours." },
  { company: "Great Lakes Welding Works", title: "Structural Welder (MIG/Flux)", trade: "welding", city: "Chicago", state: "IL", min: 62000, max: 88000, postedDaysAgo: 2, description: "Great Lakes Welding Works fabricates structural steel for Midwest construction.\n\n- MIG and flux-core on structural assemblies\n- $28-$42/hr DOE\n- AWS D1.1 cert required (test on site)\n- 1st and 2nd shift available, OT after 40\n\nShop is climate-controlled with new bays." },
  { company: "Great Lakes Welding Works", title: "Pipe Welder (TIG)", trade: "welding", city: "Joliet", state: "IL", min: 85000, max: 120000, featured: true, postedDaysAgo: 1, description: "Certified TIG pipe welders for refinery and food-plant work.\n\n- $41-$58/hr DOE, per-diem for travel sites\n- 6G certification required; test on site\n- Travel crews get hotel + per diem\n\nSteady 50-60 hr weeks for the right welder. Pass a 6G coupon and name your rate." },
  { company: "Mile High Riggers", title: "Certified Welder / Rigger", trade: "welding", city: "Denver", state: "CO", min: 68000, max: 95000, postedDaysAgo: 5, description: "Steel erection + welding crews for mountain projects.\n\nNCCER rigger card and 3G/4G certs required. $68k-$95k, snow days paid when scheduled hours missed, health insurance day one." },
  { company: "Empire Auto & Diesel", title: "Automotive Service Technician", trade: "automotive", city: "Brooklyn", state: "NY", min: 65000, max: 95000, postedDaysAgo: 3, description: "Five-bay shop in Brooklyn hiring experienced auto techs.\n\n- Flat rate $65k-$95k effective\n- Brand-new lifts, Hunter alignment rig\n- ASE certs paid, diagnostic equipment top-tier\n- Health insurance, 401(k), 3 weeks PTO\n\nDiometrics and electrical strength preferred." },
  { company: "Empire Auto & Diesel", title: "Diesel Mechanic", trade: "automotive", city: "Newark", state: "NJ", min: 70000, max: 100000, postedDaysAgo: 6, description: "Diesel mechanics for fleet and medium-duty trucks.\n\n$70k-$100k, day shift only, tool allowance, uniform service. CDL not required but helpful for road tests." },
  { company: "Precision CNC Partners", title: "CNC Machinist (2nd Shift)", trade: "machining", city: "Columbus", state: "OH", min: 58000, max: 82000, postedDaysAgo: 2, description: "Aerospace supplier hiring CNC machinists for 2nd shift.\n\n- Haas VF-2s and Mazak 5-axis\n- $27-$38/hr + $2/hr shift differential\n- Set-up and operate from prints; GibbsCAM a plus\n- ITAR shop — US persons only\n\nSteady aerospace backlog through 2028." },
  { company: "Precision CNC Partners", title: "CNC Programmer / Machinist", trade: "machining", city: "Columbus", state: "OH", min: 75000, max: 100000, postedDaysAgo: 9, description: "Program and run production jobs on 3- and 5-axis mills.\n\nMastercam 2024+, GD&T fluency, 5+ years. $75k-$100k + quarterly profit share." },
  { company: "Peach State Builders", title: "Framing Carpenter (Lead)", trade: "carpentry", city: "Atlanta", state: "GA", min: 54000, max: 78000, postedDaysAgo: 3, description: "Lead framing carpenters for single-family and multifamily builds.\n\n- $26-$38/hr DOE + per-unit completion bonus\n- Lead a 3-person crew, read plans, hit quality marks\n- Steady pipeline: 14 communities active\n\nOwn tools required, company truck for material runs." },
  { company: "Peach State Builders", title: "Finish Carpenter", trade: "carpentry", city: "Marietta", state: "GA", min: 58000, max: 82000, postedDaysAgo: 7, description: "Finish carpentry on $1M+ custom homes: trim, doors, cabinetry fit-out, built-ins.\n\n$28-$40/hr. Pride-of-craft shop — portfolio preferred, speed required." },
  { company: "Sunshine Air Systems", title: "HVAC Controls Technician", trade: "hvac", city: "Orlando", state: "FL", min: 68000, max: 92000, postedDaysAgo: 8, description: "Controls techs for DDC/BAS systems in commercial buildings.\n\nNiagara N4 experience preferred. $68k-$92k, company vehicle, on-call rotation paid at 1.5x." },
  { company: "Ironclad Plumbing Group", title: "Service Plumber — Night Shift", trade: "plumbing", city: "Sugar Land", state: "TX", min: 70000, max: 92000, postedDaysAgo: 10, description: "Night-shift service plumber for commercial service calls.\n\n$34-$44/hr night differential. Journeyman license required. Solo van route, minimal supervision." },
  { company: "Voltway Electric", title: "Data Center Electrician", trade: "electrical", city: "Goodyear", state: "AZ", min: 85000, max: 125000, featured: true, postedDaysAgo: 2, description: "Data center build-out electricians — the hottest trade of 2026.\n\n- $85k-$125k, 6-month project minimum\n- Switchgear, busway, and generator tie-ins\n- OSHA 30 and journeyman card required\n- Per diem for out-of-state hires\n\nMassive phase-2 expansion starting next quarter." },
  { company: "Great Lakes Welding Works", title: "Welding Fabricator (Entry)", trade: "welding", city: "Chicago", state: "IL", min: 46000, max: 58000, type: "apprenticeship", postedDaysAgo: 11, description: "Entry-level fabricators: fit, tack, and finish weld structural parts.\n\nWe train to AWS D1.1 and pay for your cert test. $22-$28/hr to start, raise at 90 days." },
  { company: "Mile High Riggers", title: "Crane Operator / Rigger", trade: "construction", city: "Denver", state: "CO", min: 78000, max: 110000, postedDaysAgo: 12, description: "NCCCO-certified crane operators for structural steel erection.\n\n$78k-$110k with per-diems on mountain projects. Small crew, long tenure." },
  { company: "Peach State Builders", title: "Concrete Finisher", trade: "construction", city: "Atlanta", state: "GA", min: 48000, max: 66000, postedDaysAgo: 13, description: "Flatwork finishers for residential and light commercial pours.\n\n$23-$32/hr, OT during peak season, tools provided beyond hand tools." },
  { company: "Keystone Mechanical", title: "HVAC Commercial Estimator", trade: "hvac", city: "Philadelphia", state: "PA", min: 85000, max: 115000, postedDaysAgo: 14, description: "Commercial HVAC estimator: take-offs, subcontractor quotes, bid packages.\n\nMechanical contracting background essential. $85k-$115k + project bonus, hybrid schedule after 90 days." },
  { company: "Desert Service Alliance", title: "Plumbing Service Manager", trade: "plumbing", city: "Las Vegas", state: "NV", min: 95000, max: 130000, postedDaysAgo: 15, description: "Run the residential plumbing division: 8 trucks, dispatch, quality, P&L.\n\n$95k-$130k + profit share. Must have run service ops before — this is a leadership seat." },
  { company: "Lone Star Climate Co.", title: "Warehouse / Parts Coordinator", trade: "other", city: "Dallas", state: "TX", min: 42000, max: 52000, postedDaysAgo: 16, description: "Keep 12 HVAC trucks stocked: parts receiving, min-max levels, will-calls.\n\n$42k-$52k, M-F 7-4, benefits day one. HVAC parts knowledge a big plus." },
  { company: "Cascade Pipe & Flow", title: "Journeyman Plumber — Service", trade: "plumbing", city: "Beaverton", state: "OR", min: 82000, max: 98000, postedDaysAgo: 5, description: "Service plumbing in Portland's west side. OR journeyman license required.\n\n$82k-$98k with commission, 4/10 schedule, company van, 100% paid family health insurance." },
  { company: "Sunshine Air Systems", title: "HVAC Sales Comfort Advisor", trade: "hvac", city: "Tampa", state: "FL", min: 80000, max: 160000, type: "contract", postedDaysAgo: 6, description: "In-home sales for replacement systems. Uncapped: realistic $80k-$160k.\n\nWe generate the leads, you run consultative sales. HVAC field background required — techs make the best advisors." },
  { company: "Voltway Electric", title: "EV Charger Installer", trade: "electrical", city: "Scottsdale", state: "AZ", min: 64000, max: 88000, postedDaysAgo: 9, description: "Level 2 and DC fast-charger installs for residential and fleet clients.\n\n$64k-$88k + per-install bonus. Journeyman preferred; EVITP cert a plus (we'll sponsor)." },
  { company: "Precision CNC Partners", title: "Quality Inspector (CMM)", trade: "machining", city: "Columbus", state: "OH", min: 56000, max: 74000, postedDaysAgo: 17, description: "CMM programming and first-article inspection for aerospace parts.\n\nCalypso or PC-DMIS experience. $56k-$74k, M-F days, climate-controlled QA lab." },
  { company: "Empire Auto & Diesel", title: "Lube & Light-Line Technician", trade: "automotive", city: "Brooklyn", state: "NY", min: 45000, max: 58000, type: "part_time", postedDaysAgo: 18, description: "Entry auto tech: oil services, tires, brakes. Path to flat-rate bays as you grow.\n\n$21-$28/hr. Full-time available after 90 days for the right fit." },
  { company: "Mile High Riggers", title: "Construction Laborer — Steel Crew", trade: "construction", city: "Aurora", state: "CO", min: 46000, max: 58000, postedDaysAgo: 19, description: "Steel-crew laborers: bolting, decking, rigging assist. Hard-hat-to-hard-hat culture with real advancement.\n\n$22-$28/hr, OT abundant, boots + PPE provided." },
  { company: "Peach State Builders", title: "Construction Superintendent (Residential)", trade: "construction", city: "Alpharetta", state: "GA", min: 95000, max: 130000, postedDaysAgo: 4, description: "Run 6-8 active single-family homes: schedule, subs, quality, safety.\n\n$95k-$130k + truck allowance + completion bonuses. 5+ years production homebuilding." },
  { company: "Great Lakes Welding Works", title: "Fitter / Fabricator", trade: "welding", city: "Gary", state: "IN", min: 54000, max: 72000, postedDaysAgo: 8, description: "Fit structural assemblies to print before they hit the weld bays.\n\n$26-$35/hr. Print reading and layout tools fluency required." },
  { company: "Ironclad Plumbing Group", title: "Plumbing Dispatch Coordinator", trade: "plumbing", city: "Houston", state: "TX", min: 48000, max: 60000, postedDaysAgo: 20, description: "Coordinate 14 trucks: scheduling, customer callbacks, tech support.\n\n$48k-$60k, M-F 7:30-4:30, ServiceTitan experience preferred." },
  { company: "Desert Service Alliance", title: "HVAC Maintenance Technician", trade: "hvac", city: "Henderson", state: "NV", min: 52000, max: 68000, postedDaysAgo: 21, description: "Seasonal maintenance routes: 10-14 tune-ups/day, sales hand-offs.\n\n$52k-$68k + conversion bonus. Great entry to service tech path." },
];

const DESCRIPTION_FIXUPS: Record<string, string> = {};

async function main() {
  console.log("Seeding TradeBoard…");

  // Reset tables (dev convenience)
  await db.delete(jobs);
  await db.delete(companies);
  await db.delete(promoCodes);
  await db.delete(users);

  // --- Admin + demo employer ---
  const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? "admin1234", 10);
  const [admin] = await db
    .insert(users)
    .values({
      name: "Site Admin",
      email: (process.env.ADMIN_EMAIL ?? "admin@localhost").toLowerCase(),
      passwordHash: adminHash,
      role: "admin",
    })
    .returning();

  const employerHash = await bcrypt.hash("demo1234", 10);
  const [employer] = await db
    .insert(users)
    .values({
      name: "Dana Reyes",
      email: "demo@tradeboard.local",
      passwordHash: employerHash,
      role: "employer",
    })
    .returning();

  // --- Companies ---
  const companyBySlug = new Map<string, number>();
  for (const c of COMPANIES) {
    const [row] = await db
      .insert(companies)
      .values({ name: c.name, slug: slugify(c.name), website: c.website, description: c.about })
      .returning();
    companyBySlug.set(c.name, row.id);
  }

  // Give the demo employer a company and two jobs
  const [demoCo] = await db
    .insert(companies)
    .values({
      name: "Reyes Mechanical (Demo)",
      slug: "co-demo",
      website: "https://example.com/reyes",
      description: "Demo company for the employer account demo@tradeboard.local / demo1234.",
      userId: employer.id,
    })
    .returning();

  const demoJobs: SeedJob[] = [
    { company: "Reyes Mechanical (Demo)", title: "HVAC Technician — Sign-On Bonus", trade: "hvac", city: "Dallas", state: "TX", min: 60000, max: 90000, postedDaysAgo: 2, description: "This is the demo employer account (demo@tradeboard.local / demo1234). Sign in to see the dashboard, edit posts, and review applicants.\n\n$2,000 sign-on bonus for experienced HVAC techs in Dallas. Company truck, full benefits, EPA paid." },
    { company: "Reyes Mechanical (Demo)", title: "Apprentice Plumber", trade: "plumbing", city: "Dallas", state: "TX", min: 38000, max: 46000, type: "apprenticeship", featured: true, postedDaysAgo: 1, description: "Demo apprenticeship listing. Featured posts appear at the top of every list and in the weekly newsletter.\n\nEarn while you learn with Reyes Mechanical." },
  ];

  // --- Jobs ---
  let count = 0;
  for (const j of [...JOBS, ...demoJobs]) {
    const companyId = companyBySlug.get(j.company) ?? demoCo.id;
    await db.insert(jobs).values({
      companyId,
      title: j.title,
      slug: `${slugify(j.title)}-${slugify(j.city)}-${j.state.toLowerCase()}`,
      trade: j.trade,
      city: j.city,
      state: j.state,
      employmentType: j.type ?? "full_time",
      salaryMin: j.min ?? null,
      salaryMax: j.max ?? null,
      description: j.description,
      applyEmail: "hiring@example.com",
      status: "published",
      featured: j.featured ?? false,
      publishedAt: daysAgo(j.postedDaysAgo),
      expiresAt: daysFromNow(30 - j.postedDaysAgo),
      createdAt: daysAgo(j.postedDaysAgo),
      updatedAt: daysAgo(j.postedDaysAgo),
    });
    count++;
  }

  // --- Promo codes ---
  await db.insert(promoCodes).values([
    { code: "FIRST50", freePosts: 1, maxRedemptions: 50, percentOff: 100 },
    { code: "LAUNCH100", freePosts: 1, maxRedemptions: 100, percentOff: 100 },
  ]);

  console.log(`✓ Seeded ${count} jobs, ${COMPANIES.length + 1} companies`);
  console.log(`✓ Admin:   ${admin.email} / ${process.env.ADMIN_PASSWORD ?? "admin1234"}`);
  console.log(`✓ Employer: demo@tradeboard.local / demo1234`);
  console.log("✓ Promo codes: FIRST50, LAUNCH100 (100% off, for seeding real listings)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$client.end();
  });
