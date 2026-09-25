export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  category: "Career Guides" | "Certifications & Licensing" | "Salary & Pay" | "Tool Guides";
  tradeSlug: "hvac" | "plumbing" | "electrical" | "welding" | "carpentry" | "automotive" | "machining" | "construction" | "other";
  tradeName: string;
  readingTime: string;
  author: {
    name: string;
    role: string;
  };
  keyTakeaways: string[];
  tableOfContents: { id: string; title: string }[];
  faqs: { question: string; answer: string }[];
  content: string;
};

export const BLOG_CATEGORIES = [
  "All",
  "Career Guides",
  "Certifications & Licensing",
  "Salary & Pay",
  "Tool Guides",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-get-epa-608-certification",
    title: "How to Get EPA 608 Certification: Complete 2026 Step-by-Step Guide",
    excerpt: "Everything you need to know to pass the EPA Section 608 technician certification: exam types, passing scores, study strategies, and career impact for HVAC techs.",
    publishedAt: "2026-02-15",
    updatedAt: "2026-03-01",
    category: "Certifications & Licensing",
    tradeSlug: "hvac",
    tradeName: "HVAC",
    readingTime: "7 min read",
    author: {
      name: "Marcus Vance",
      role: "HVAC Master Mechanical Contractor & TradeBoard Contributor",
    },
    keyTakeaways: [
      "Federal law requires EPA 608 certification for anyone maintaining, servicing, repairing, or disposing of appliances containing regulated refrigerants.",
      "The Universal Certification qualifies you for all equipment and is required by almost all top-paying HVAC employers.",
      "The exam consists of 4 sections (Core + Types I, II, III) of 25 questions each, requiring a 70% passing grade on each section.",
      "Most trade schools and employers cover the test fee ($50–$150) as part of hiring or onboarding.",
    ],
    tableOfContents: [
      { id: "what-is-epa-608", title: "What Is the EPA 608 Certification?" },
      { id: "certification-types", title: "The 4 EPA 608 Certification Types" },
      { id: "exam-structure", title: "Exam Format & Passing Requirements" },
      { id: "step-by-step", title: "5 Steps to Pass on Your First Try" },
      { id: "cost-and-timeline", title: "Cost, Timeline & Retakes" },
      { id: "career-impact", title: "Salary & Career Impact" },
    ],
    faqs: [
      {
        question: "Does the EPA 608 certification expire?",
        answer: "No. Once you earn your EPA Section 608 certification, it is valid for life. There are no renewal fees or continuing education requirements, though you must keep your wallet card as proof of compliance.",
      },
      {
        question: "Can I take the EPA 608 exam online?",
        answer: "Type I (small appliances) can be taken as an open-book online exam. However, Types II, III, and the Universal certification require a proctored exam, either in person at an approved testing facility or via an accredited remote live-proctored platform like Esco Institute or Mainstream Engineering.",
      },
      {
        question: "How long does it take to prepare for the EPA 608 test?",
        answer: "Most technicians with basic trade knowledge prepare in 1 to 2 weeks of dedicated study (10–15 hours total), focusing heavily on the Core section and recovery techniques.",
      },
    ],
    content: `
### What Is the EPA 608 Certification?
Section 608 of the United States Clean Air Act mandates that anyone who buys, handles, or recovers refrigerants during the maintenance, service, or disposal of stationary refrigeration and air conditioning equipment must be certified by an EPA-approved organization.

Without this certification, you cannot legally purchase virgin refrigerant in containers larger than 2 lbs, nor can you hook gauges up to residential split systems or commercial chillers.

### The 4 EPA 608 Certification Types

1. **Type I — Small Appliances**: Covers equipment manufactured, charged, and hermetically sealed at the factory with 5 pounds or less of refrigerant (e.g., domestic refrigerators, window AC units, ice machines).
2. **Type II — High-Pressure Appliances**: Covers high-pressure systems including residential central air conditioners, heat pumps, commercial rooftop units (RTUs), and grocery store walk-in coolers.
3. **Type III — Low-Pressure Appliances**: Covers low-pressure chillers and industrial cooling equipment (typically using R-123 or newer low-GWP replacements).
4. **Universal Certification**: Earned when a technician passes the Core section plus all three types (I, II, and III). **This is the gold standard for all HVAC field technicians.**

### Exam Format & Passing Requirements

The Universal exam contains **100 multiple-choice questions** divided into four 25-question modules:
- **Core Module**: Stratospheric ozone depletion, Clean Air Act regulations, Montreal Protocol, substitute refrigerants, recovery techniques, and safety standards (ASHRAE Standard 15 & 34).
- **Type I Module**: Small appliance recovery methods, process tubes, system-dependent vs. self-contained recovery.
- **Type II Module**: Leak detection thresholds, evacuation requirements, deep vacuum levels (microns), and oil foaming.
- **Type III Module**: Low-pressure rupture disks, purge unit operation, hydrostatic tube testing, and heater blankets.

You must score **at least 70% (18/25 correct)** on the Core module AND at least 70% on whichever specialized module you wish to qualify for.

### 5 Steps to Pass on Your First Try

1. **Master the Core Module First**: You cannot qualify for ANY certification type without passing Core. Focus 50% of your initial study on Clean Air Act penalties (up to $50,000+/day per violation), the date phases for R-22 and HFC phase-downs, and ASHRAE refrigerant safety groups (A1, A2L, B2, etc.).
2. **Memorize the Evacuation Level Tables**: Questions on required vacuum levels (inches of Hg or microns) before and after opening equipment appear on every exam.
3. **Understand R-410A & A2L Safety Guidelines**: With modern transitions to mildly flammable A2L refrigerants (R-32, R-454B), updated exams frequently test cylinder pressure ratings, leak mitigation, and spark-free recovery machines.
4. **Take Free Practice Exams**: Use accredited practice tests from ESCO Institute, Ferris State University, or RSES until you consistently score 85%+ on timed quizzes.
5. **Register Through an Accredited Provider**: Choose a testing provider such as ESCO, Mainstream Engineering, or a local HVAC wholesale supply house (Ferguson, Johnstone Supply).

### Cost, Timeline & Retakes
- **Cost**: Between **$50 and $150**, depending on whether you take it through a supply house, vocational school, or online proctor.
- **Timeline**: 1–2 weeks of study; the exam itself takes 90–120 minutes.
- **Retakes**: If you fail one module but pass the others, you only need to retest the failed section within the allowable retest window.

### Salary & Career Impact
Holding an EPA 608 Universal certificate immediately moves you from entry-level helper ($18–$22/hr) to service technician ($28–$45/hr). In modern heating and cooling companies, an EPA Universal license is the baseline requirement for getting assigned a take-home company van and earning bonus commissions.
    `,
  },
  {
    slug: "skilled-trades-salary-guide-2026",
    title: "Skilled Trades Salary Guide 2026: Highest-Paying Blue-Collar Careers",
    excerpt: "Comprehensive compensation report for HVAC technicians, plumbers, electricians, welders, and machinists. Hourly wages, overtime, and top-paying US states.",
    publishedAt: "2026-02-20",
    updatedAt: "2026-03-10",
    category: "Salary & Pay",
    tradeSlug: "other",
    tradeName: "All Trades",
    readingTime: "9 min read",
    author: {
      name: "Dave Kowalski",
      role: "Industrial Workforce Analyst & Master Electrician",
    },
    keyTakeaways: [
      "Skilled trade wages grew 5.8% year-over-year in 2025–2026 due to an ongoing shortage of 500,000+ licensed technicians in the US.",
      "Journeyman electricians and commercial plumbers average between $36 and $54 per hour ($75,000 to $112,000/yr), excluding overtime.",
      "Specialty welders (rig, pipeline, nuclear) and commercial HVAC/R technicians consistently exceed $120,000+ with overtime and per diem.",
      "Benefits like take-home trucks, paid health insurance, tool allowances, and employer 401(k) matches add an additional $18,000–$25,000 in annual value.",
    ],
    tableOfContents: [
      { id: "overview", title: "Trade Compensation Landscape in 2026" },
      { id: "trade-comparison", title: "Trade-by-Trade Wage Comparison Table" },
      { id: "experience-levels", title: "Pay Progression: Apprentice to Master" },
      { id: "top-paying-states", title: "Top 10 Highest-Paying US States" },
      { id: "hidden-value", title: "Overtime, Perks & Total Compensation" },
    ],
    faqs: [
      {
        question: "Which skilled trade pays the most in 2026?",
        answer: "On average, Commercial/Industrial Electricians, Commercial Refrigeration (HVAC/R) Techs, and Traveling Rig Welders earn the highest hourly rates. With overtime and travel per diem, technicians in these specialties frequently make over $130,000 annually without college debt.",
      },
      {
        question: "Do trade apprentices get paid while learning?",
        answer: "Yes. Unlike college where students pay tuition, skilled trades apprentices are paid full-time wages on day one, typically starting at 50% of the journeyman rate ($20–$25/hr) with structured 5%–10% raises every 6–12 months.",
      },
    ],
    content: `
### Trade Compensation Landscape in 2026
With more than 530,000 unfilled skilled trade positions across the United States and hundreds of thousands of senior baby-boomer technicians retiring each year, skilled labor has unprecedented bargaining power.

Unlike standard corporate jobs, skilled trade compensation is heavily performance- and qualification-driven. Technicians with state licenses, clean driving records, and clean drug screenings command immediate wage premiums.

### Trade-by-Trade Wage Comparison Table (2026 Data)

| Trade | Entry / Apprentice | Journeyman Hourly | Average Annual | Top 10% / Master |
|---|---|---|---|---|
| **Electrical** | $22 – $27/hr | $38 – $55/hr | $82,000 – $114,000 | $125,000+ |
| **HVAC / R** | $20 – $26/hr | $36 – $52/hr | $78,000 – $108,000 | $120,000+ |
| **Plumbing** | $21 – $26/hr | $37 – $54/hr | $80,000 – $112,000 | $130,000+ |
| **Welding (Pipe/Rig)** | $22 – $28/hr | $35 – $58/hr | $76,000 – $122,000 | $145,000+ |
| **CNC Machining** | $20 – $25/hr | $32 – $46/hr | $68,000 – $96,000 | $110,000+ |
| **Carpentry (Framing/Finish)**| $19 – $24/hr | $30 – $44/hr | $64,000 – $92,000 | $105,000+ |
| **Heavy Diesel / Auto Tech** | $21 – $26/hr | $34 – $50/hr | $72,000 – $104,000 | $118,000+ |

### Pay Progression: Apprentice to Master

1. **Apprentice (Years 1–4)**: Starts at 50% of journeyman rate ($20–$25/hr) with automatic, contractually mandated step raises every 1,000 to 2,000 hours worked.
2. **Journeyman (Years 5+)**: Fully licensed to work unsupervised. Wages jump to **$38–$55/hr**. Eligible for take-home company van, dispatch bonuses, and overtime at 1.5x to 2.0x base pay.
3. **Master / Field Supervisor (Years 8+)**: Oversees crews, signs commercial permits, and troubleshoots complex systems. Base salaries average **$95,000–$130,000+**, plus performance profit-sharing.

### Top 10 Highest-Paying US States for Trades
Adjusting for local cost of living and union density, the top-paying states for skilled trades in 2026 are:
1. **Washington State** ($46.20/hr median)
2. **Illinois** ($45.80/hr median)
3. **New York** ($45.10/hr median)
4. **California** ($44.90/hr median)
5. **Alaska** ($44.50/hr median)
6. **New Jersey** ($43.80/hr median)
7. **Massachusetts** ($43.40/hr median)
8. **Colorado** ($42.10/hr median)
9. **Minnesota** ($41.90/hr median)
10. **Texas** ($39.80/hr median with zero state income tax)

### Overtime, Perks & Total Compensation
Hourly rates only tell half the story. The average commercial technician works 5 to 10 hours of overtime weekly during peak seasons (summer heat waves for HVAC, winter freezes for plumbing). Ten hours of overtime at $50/hr base rate equates to **$75/hr**, adding **$39,000/year** in overtime earnings alone.
    `,
  },
  {
    slug: "trade-school-vs-apprenticeship-guide",
    title: "Trade School vs. Apprenticeship: Which Path Is Best in 2026?",
    excerpt: "Direct comparison of vocational trade schools versus registered union/non-union apprenticeships. Costs, timelines, debt, hands-on hours, and job placement.",
    publishedAt: "2026-02-25",
    updatedAt: "2026-03-05",
    category: "Career Guides",
    tradeSlug: "other",
    tradeName: "All Trades",
    readingTime: "8 min read",
    author: {
      name: "Sarah Jenkins",
      role: "Apprenticeship Program Director & Career Advisor",
    },
    keyTakeaways: [
      "Apprenticeships offer an earn-while-you-learn model where you pay $0 tuition and start earning $20–$25/hour on day one.",
      "Trade schools cost $12,000 to $35,000 but can be completed in 6 to 18 months, helping you earn foundational certifications faster.",
      "Registered apprenticeships provide direct college credit, state licensing documentation, and guaranteed journeyman wage progression.",
      "For electricians and plumbers, an apprenticeship is almost always superior because state boards require 8,000 verified field hours regardless of school.",
    ],
    tableOfContents: [
      { id: "quick-summary", title: "Quick Comparison: Trade School vs Apprenticeship" },
      { id: "trade-school-pros-cons", title: "Trade School: Pros, Cons & Costs" },
      { id: "apprenticeship-pros-cons", title: "Apprenticeship: Pros, Cons & Pay" },
      { id: "licensing-requirements", title: "State Licensing Hours Reality Check" },
      { id: "decision-guide", title: "Which Path Should You Choose?" },
    ],
    faqs: [
      {
        question: "Can I do both trade school and an apprenticeship?",
        answer: "Yes. Many technicians attend a 9-month technical trade school to earn their EPA 608 or OSHA 10, then immediately join an apprenticeship. Some apprenticeship sponsors will even credit 500 to 1,000 hours toward your field requirements for completed accredited coursework.",
      },
      {
        question: "Do employers prefer trade school graduates or apprentice hires?",
        answer: "Employers value verified field experience above all else. A candidate with 2 years of field apprenticeship experience is almost always hired over someone with 2 years of classroom experience and zero field hours.",
      },
    ],
    content: `
### Quick Comparison: Trade School vs. Apprenticeship

| Factor | Vocational Trade School | Registered Apprenticeship |
|---|---|---|
| **Cost / Tuition** | $12,000 – $35,000 | **$0** (Paid by employer / sponsor) |
| **Income While Training** | $0 (Student pays tuition) | **Earn $20 – $30/hr** from day one |
| **Duration** | 6 to 24 months | 3 to 5 years (Full-time career) |
| **Schedule** | Daytime or evening classes | 40 hrs/wk field work + evening/weekend class |
| **Outcome** | Diploma / Certificate of Completion | **State Journeyman License + Red Seal** |
| **Debt Burden** | Often requires student loans | **Zero debt** |

### Trade School: Pros, Cons & Costs
Trade schools offer accelerated classroom simulations. You spend mornings in theory classes and afternoons in lab bays wiring simulated residential breaker boxes, charging training HVAC condensers, or bending copper pipe.

**Advantages:**
- Fast completion (many diplomas awarded in under 12 months).
- Structured environment for candidates with zero tool familiarity.
- School career centers often have direct relationships with local contractors.

**Drawbacks:**
- High out-of-pocket tuition costs ($15,000+ average).
- State licensing boards in most states only credit **up to 1,000 hours** of classroom time toward the 8,000 field hours required for a journeyman license.

### Apprenticeship: Pros, Cons & Pay
In a registered apprenticeship (either union like IBEW/UA or non-union like IEC/PHCC), you are an employee of a licensed contractor from day one. You work alongside experienced journeymen and attend paid or employer-sponsored classes 1 or 2 nights per week.

**Advantages:**
- Zero debt; you are paid a full-time paycheck from day one.
- 100% of your worked hours count directly toward state licensing board requirements.
- Full health insurance, 401(k), and pension benefits frequently included from the first 90 days.

### Which Path Should You Choose?
- **Choose an Apprenticeship if**: You want to enter Electrical, Plumbing, or Pipefitting where state licensure strictly requires 8,000 field hours. Earning while you learn is mathematically the superior financial move.
- **Choose Trade School if**: You are entering Welding, CNC Machining, or Automotive where hands-on booth time and portfolio development can rapidly qualify you for high-paying production positions.
    `,
  },
  {
    slug: "journeyman-electrician-license-requirements",
    title: "Journeyman Electrician License Guide: Hours & Exam Requirements",
    excerpt: "Everything required to earn your Journeyman Electrician card: 8,000 hours documentation, NEC code prep, state board exams, and interstate reciprocity.",
    publishedAt: "2026-03-01",
    updatedAt: "2026-03-12",
    category: "Certifications & Licensing",
    tradeSlug: "electrical",
    tradeName: "Electrical",
    readingTime: "8 min read",
    author: {
      name: "Dave Kowalski",
      role: "Industrial Workforce Analyst & Master Electrician",
    },
    keyTakeaways: [
      "Most US state electrical boards require 8,000 verified hours (approx. 4 years) of on-the-job training under a licensed Master Electrician.",
      "Candidates must also complete a minimum of 576 to 600 hours of related technical classroom instruction.",
      "The journeyman exam tests calculations, box fill, ampacity tables, conduit bending, grounding, and bonding from the National Electrical Code (NEC).",
      "Earning your card increases average hourly pay by 40% to 60% ($38–$55/hr) and allows you to supervise apprentices.",
    ],
    tableOfContents: [
      { id: "what-is-journeyman", title: "What Does a Journeyman Electrician License Allow?" },
      { id: "hour-requirements", title: "Hour Requirements & Apprenticeship Breakdown" },
      { id: "nec-exam", title: "The NEC Licensing Exam Decoded" },
      { id: "state-reciprocity", title: "State Reciprocity Agreements" },
      { id: "step-by-step", title: "Checklist: From Apprentice to Carded Journeyman" },
    ],
    faqs: [
      {
        question: "How difficult is the Journeyman Electrician exam?",
        answer: "The exam is notoriously rigorous, with first-time pass rates historically hovering between 55% and 65%. It is an open-book exam testing your speed and ability to navigate the 800+ page National Electrical Code (NFPA 70), calculate load demands, and size conductors within strict time limits.",
      },
      {
        question: "Can I transfer my electrical license to another state?",
        answer: "Yes, if the two states have a reciprocity agreement. For instance, Texas, Colorado, Idaho, Wyoming, and Utah share electrical reciprocity. If you hold a license in good standing in one, you can often obtain a reciprocal license without retaking the exam.",
      },
    ],
    content: `
### What Does a Journeyman Electrician License Allow?
A Journeyman Electrician license certifies that a tradesperson has acquired the technical knowledge and thousands of hours of supervised field work necessary to install, alter, repair, and maintain electrical systems safely and without direct supervision.

With a journeyman license, you can run commercial jobs, wire complex industrial switchgear, install three-phase transformers, and pull branch circuits in residential developments.

### Hour Requirements & Apprenticeship Breakdown
Most state licensing departments (e.g., TDLR in Texas, CSLB in California, L&I in Washington) require:
- **8,000 hours of verified on-the-job training** (roughly 4 years of 2,000-hour full-time work years).
- **At least 4,000 hours** must be in commercial or industrial wiring (residential-only hours often limit you to a Residential Wireman license).
- **576 to 600 hours** of accredited classroom instruction covering electrical theory, math, Blueprint reading, and NEC code articles.

### The NEC Licensing Exam Decoded
The examination is almost universally based on the current cycle of the **National Electrical Code (NFPA 70)**:
- **Time**: 4 to 5 hours.
- **Questions**: 80 to 100 multiple-choice questions.
- **Passing Score**: 70% to 75% depending on jurisdiction.

**Top Topics Tested:**
1. **Article 250 (Grounding and Bonding)**: The most heavily tested and critical safety article on the exam.
2. **Article 310 (Conductors for General Wiring)**: Sizing wires, temperature derating factors, and ampacity tables (Table 310.16).
3. **Chapter 9 Tables**: Conduit fill, conductor dimensions, and box fill calculations (Article 314).
4. **Article 430 (Motors)**: Sizing overload protection, short-circuit protection, and branch circuit conductors for inductive loads.

### State Reciprocity Agreements
If you plan to travel or relocate, state reciprocity is vital. The **National Electrical Reciprocal Alliance (NERA)** enables licensed journeymen from participating states (like Alaska, Arkansas, Colorado, Idaho, Iowa, Montana, Nebraska, New Mexico, Oklahoma, South Dakota, Texas, Utah, and Wyoming) to transfer credentials seamlessly.
    `,
  },
  {
    slug: "plumbing-apprenticeship-how-to-start",
    title: "Plumbing Apprenticeship Guide: How to Get Paid on Day One",
    excerpt: "The complete roadmap to starting a plumbing career. Sponsoring contractors, union vs open-shop programs, tool requirements, and license progression.",
    publishedAt: "2026-03-05",
    updatedAt: "2026-03-15",
    category: "Career Guides",
    tradeSlug: "plumbing",
    tradeName: "Plumbing",
    readingTime: "7 min read",
    author: {
      name: "Marcus Vance",
      role: "HVAC & Mechanical Contractor",
    },
    keyTakeaways: [
      "Plumbing apprenticeships combine 4 to 5 years of full-time paid work with evening classroom training.",
      "Starting apprentice wages range from $21 to $26 per hour, progressing toward $40 to $55/hr at the journeyman level.",
      "Plumbing encompasses residential service, commercial new construction, medical gas systems, hydronics, and backflow prevention.",
      "No prior experience is necessary to land an entry helper or apprentice role—contractors prioritize reliability, clean driving records, and strong work ethic.",
    ],
    tableOfContents: [
      { id: "what-apprentices-do", title: "What Does a First-Year Apprentice Actually Do?" },
      { id: "union-vs-nonunion", title: "UA Union vs PHCC Non-Union Programs" },
      { id: "how-to-apply", title: "How to Land Your First Sponsoring Contractor" },
      { id: "career-milestones", title: "The 5-Year Career & Salary Timeline" },
    ],
    faqs: [
      {
        question: "Do I have to deal with sewage as a plumbing apprentice?",
        answer: "It depends on whether you work in new commercial construction (where pipes are clean, new, and dry) or residential service and repair. While service plumbers do clear clogs and replace sewer laterals, they earn higher hourly dispatch rates and commissions.",
      },
      {
        question: "What qualifications do I need to become an apprentice?",
        answer: "A high school diploma or GED, a valid US driver's license with a clean driving record, the ability to pass a standard drug screening, and the physical stamina to lift 50+ lbs and work in crawlspaces or trenches.",
      },
    ],
    content: `
### What Does a First-Year Apprentice Actually Do?
A common misconception is that plumbing apprentices spend all day fixing residential toilets. In reality, modern plumbing is a complex mechanical discipline covering high-rise water distribution, gas lines, hydronic radiant heating, and municipal sewer mains.

As a first-year apprentice, your core responsibilities include:
- Staging materials: PEX, copper tubing, PVC/cast-iron DWV pipe, and fittings.
- Cutting, reaming, deburring, and soldering (sweating) copper lines.
- Operating pipe threaders, press tools (ProPress), and fusion welders.
- Trenching, grading, and roughing in underground drainage pipes with laser levels.
- Shadowing licensed journeymen to read isometric plumbing blueprints.

### UA Union vs. PHCC Non-Union Programs
- **United Association (UA)**: The major plumbing, pipefitting, and sprinkler-fitting union. Offers 5-year registered apprenticeships with full employer-funded medical coverage, local pension plans, and guaranteed hourly wage scales.
- **PHCC (Plumbing-Heating-Cooling Contractors)**: The premier non-union open-shop trade association. Offers accredited 4-year apprenticeships through private contractor members, often featuring faster advancement tracks and performance commissions.

### How to Land Your First Sponsoring Contractor
1. **Get an Apprentice Registration Card**: In states like Texas (TSBPE) or California (DIR), you must register online as an Apprentice Plumber before touching a wrench on a commercial job site.
2. **Apply Directly to Local Contractors**: Many top plumbing companies hire "Plumbing Helpers" or "Shop Drivers" with zero experience, promoting them to formal apprentices after 60 days of good attendance.
3. **Emphasize Soft Skills**: Show up with steel-toe boots, a 25ft tape measure, a torpedo level, and a clean motor vehicle record. Contractors hire for attitude and train for skill.
    `,
  },
  {
    slug: "highest-paying-welding-certifications",
    title: "Top AWS Welding Certifications That Pay $40+/Hour",
    excerpt: "Breakdown of the most lucrative welding certifications in America: AWS D1.1 structural steel, ASME Section IX pipe, 6G pipe tests, and aerospace TIG.",
    publishedAt: "2026-03-08",
    updatedAt: "2026-03-18",
    category: "Certifications & Licensing",
    tradeSlug: "welding",
    tradeName: "Welding",
    readingTime: "8 min read",
    author: {
      name: "Sarah Jenkins",
      role: "Apprenticeship Program Director & Career Advisor",
    },
    keyTakeaways: [
      "Welding compensation depends almost entirely on the difficulty of the certification test rather than years on the job.",
      "The 6G Pipe Welding certification (ASME Section IX) is the gateway to $45–$65/hr jobs on oil refineries, power plants, and pipeline projects.",
      "AWS D1.1 Structural Steel certification qualifies welders for multi-story ironworking, bridges, and infrastructure builds.",
      "Aerospace TIG welding (AWS D17.1) offers high hourly pay in climate-controlled cleanroom environments with zero outdoor field exposure.",
    ],
    tableOfContents: [
      { id: "cert-tiers", title: "Welding Certification Pay Tiers" },
      { id: "aws-d11", title: "AWS D1.1 Structural Steel (MIG & Stick)" },
      { id: "asme-6g", title: "ASME Section IX: The Legendary 6G Pipe Test" },
      { id: "aerospace-tig", title: "Aerospace TIG (AWS D17.1)" },
      { id: "testing-tips", title: "How to Pass Your Test Coupon Inspection" },
    ],
    faqs: [
      {
        question: "What is a 6G pipe welding test?",
        answer: "A 6G pipe test requires welding two pieces of pipe set at a fixed 45-degree angle without rotating the pipe. Because the angle requires welding in flat, vertical, and overhead positions continuously around the circumference, it proves mastery of all welding positions.",
      },
      {
        question: "How long is a welding certification valid?",
        answer: "Under AWS and ASME codes, most certifications remain valid indefinitely as long as you maintain continuous employment using that specific welding process at least once every six months and have your welding log signed by an inspector.",
      },
    ],
    content: `
### Welding Certification Pay Tiers
Welding is unique because you don't need a four-year degree or a state board license to make six figures. If you can pass an X-ray bend test on a coupon, you get hired on the spot.

### The Most Lucrative Certifications in 2026

#### 1. ASME Section IX — 6G Pipe Welding ($45 – $65/hr)
- **Processes**: GTAW (TIG) root pass + SMAW (Stick 7018) fill and cap.
- **Applications**: Cross-country gas pipelines, nuclear power facilities, chemical plants, offshore oil platforms.
- **Why It Pays High**: Pipe welds are subject to radiographic (X-ray) and ultrasonic non-destructive testing (NDT). Zero slag inclusions or porosity are tolerated.

#### 2. AWS D1.1 — Structural Steel ($34 – $48/hr)
- **Processes**: FCAW (Flux-Cored Arc Welding / Dual Shield) and SMAW (Stick 7018).
- **Applications**: High-rise building frameworks, highway bridges, stadium builds.
- **Positions**: 3G (Vertical Up) and 4G (Overhead) plate tests with backing bars.

#### 3. AWS D17.1 — Aerospace TIG ($38 – $52/hr)
- **Processes**: Precision GTAW (TIG) on Inconel, Titanium, and 4130 Chromoly.
- **Applications**: Rocket fuselages (SpaceX, Blue Origin), commercial aircraft turbines, defense hardware.
- **Work Environment**: Cleanroom, climate-controlled, high ergonomics.

### How to Pass Your Test Coupon Inspection
- **Root Opening & Land**: Keep a uniform 3/32" or 1/8" gap. Use a clean filler wire as your spacer.
- **Interpass Temperature**: Overheating structural coupons causes excessive grain growth and failure during guided side-bend tests.
- **Cleanliness**: Grind every bead down to bright metal before laying the next pass. Slag trapped underneath is an immediate failure on radiographic inspection.
    `,
  },
  {
    slug: "apprentice-electrician-tool-list",
    title: "The Essential Apprentice Electrician Tool List (Day-One Checklist)",
    excerpt: "Everything you need in your tool pouch on your first day as an apprentice wireman. Essential hand tools, safety gear, multimeters, and brand recommendations.",
    publishedAt: "2026-03-12",
    updatedAt: "2026-03-20",
    category: "Tool Guides",
    tradeSlug: "electrical",
    tradeName: "Electrical",
    readingTime: "6 min read",
    author: {
      name: "Dave Kowalski",
      role: "Industrial Workforce Analyst & Master Electrician",
    },
    keyTakeaways: [
      "Do not buy expensive power tools before day one—contractors are legally required to provide corded/battery tools, benders, and ladders.",
      "Invest in professional-grade hand tools from reputable brands like Klein Tools, Wiha, or Knipex that will last your entire career.",
      "A non-contact voltage tester (NCVT) and safety glasses are your non-negotiable life-saving tools.",
      "Most union locals (IBEW) and quality merit-shop contractors provide a strict written tool list so apprentices never overspend.",
    ],
    tableOfContents: [
      { id: "golden-rule", title: "The Golden Rule of Apprentice Tools" },
      { id: "must-have-hand-tools", title: "Top 10 Must-Have Hand Tools" },
      { id: "meters-and-testers", title: "Meters, Testers & Electrical Safety" },
      { id: "pouches-and-belts", title: "Tool Pouches, Bags & Ergonomics" },
    ],
    faqs: [
      {
        question: "How much should an apprentice spend on tools initially?",
        answer: "A solid starter kit of professional hand tools runs between $250 and $400. Many contractors offer tool purchase deduction programs or annual tool allowances ($500/year) after your 90-day probationary period.",
      },
    ],
    content: `
### The Golden Rule of Apprentice Tools
**Never bring power tools (drills, impact drivers, Sawzalls, band saws) to a commercial job site.** Your employer is required to furnish all power tools, benders, safety harnesses, and consumables (drill bits, electrical tape, wire nuts). Your responsibility is hand tools.

### Top 10 Must-Have Hand Tools for Day One

1. **9" High-Leverage Linesman Pliers (Klein D213-9NE)**: The workhorse of the trade. Used for twisting wire, cutting Romex, and pulling fish tape.
2. **Wire Strippers (10–18 AWG Solid / 12–20 Stranded)**: Klein Kurve or Milwaukee wire strippers with built-in loopers.
3. **Diagonal Cutting Pliers (Dikes)**: For cutting tie wire, cable ties, and trimming conductors flush inside junction boxes.
4. **11-in-1 Multi-Bit Screwdriver / Nut Driver**: Saves pouch weight; includes #1 and #2 Phillips, slotted bits, and 1/4", 5/16", and 3/8" nut drivers.
5. **Magnetic Torpedo Level**: Essential for bending conduit and mounting electrical panels plumb and level.
6. **25-Foot Magnetic Tip Tape Measure**: Look for a durable tape with clear fractional markings and conduit bending multipliers printed on the back.
7. **Pump Pliers / Channel Locks (2 pairs, 10-inch)**: Required for tightening EMT fittings, compression connectors, and rigid conduit locknuts.
8. **Romex Cable Ripper & Utility Knife**: For stripping non-metallic sheathed cable without nicking the inner copper conductors.
9. **Non-Contact Voltage Tester (Tic Tracer)**: A life-safety tool (Klein NCVT-1P or Fluke 1AC-II) to check for AC voltage before touching any conductor.
10. **Heavy-Duty Sharpie Markers & Pencils**: For labeling circuit numbers, panel schedules, and conduit bend marks.
    `,
  },
  {
    slug: "skilled-trades-resume-guide-templates",
    title: "How to Write a Skilled Trades Resume That Gets You Hired Fast",
    excerpt: "Resume blueprint for blue-collar technicians. How to showcase state licenses, equipment experience, clean MVR driving records, and land high-paying interviews.",
    publishedAt: "2026-03-15",
    updatedAt: "2026-03-22",
    category: "Career Guides",
    tradeSlug: "other",
    tradeName: "All Trades",
    readingTime: "7 min read",
    author: {
      name: "Marcus Vance",
      role: "HVAC & Mechanical Contractor",
    },
    keyTakeaways: [
      "Hiring managers in the trades spend less than 15 seconds scanning a resume—put your licenses, certifications, and driving status at the very top.",
      "List equipment brands, tonnage, and voltage specs (e.g. 'Carrier RTUs up to 25 tons', '480V 3-phase switchgear') to prove real field familiarity.",
      "Always specify 'Clean Driving Record (Clean MVR)'—insurance eligibility is the #1 reason trade hires fall through.",
      "Keep your resume to one single page with zero fluff or generic buzzwords.",
    ],
    tableOfContents: [
      { id: "what-contractors-look-for", title: "What Trade Hiring Managers Actually Look For" },
      { id: "winning-structure", title: "The 1-Page Trade Resume Structure" },
      { id: "skills-and-equipment", title: "Listing Equipment & Technical Skills" },
      { id: "example-template", title: "Real-World Sample Trade Resume" },
    ],
    faqs: [
      {
        question: "Should I include a cover letter when applying for a trade job?",
        answer: "A formal cover letter is rarely needed. Instead, include a short 2–3 sentence note stating your years of field experience, licenses held, equipment specialties, and that you have a clean driver's license ready for dispatch.",
      },
    ],
    content: `
### What Trade Hiring Managers Actually Look For
Contractors don't care about fancy graphics or generic objectives like "seeking a challenging position." When an owner or dispatcher reviews your application, they check three criteria:
1. **Can we legally dispatch you?** (Do you have the required state license / EPA card?)
2. **Can our insurance company approve you to drive our truck?** (Clean driver's license, no DUIs, clean drug test.)
3. **What equipment have you actually touched?** (Residential splits, boilers, commercial refrigeration, conduit, pipe welding.)

### The 1-Page Trade Resume Structure

#### Header
Include your full name, phone number (with area code), email, city/state, and key license in bold:
> **John Miller** | Dallas, TX | (214) 555-0192 | john.miller@email.com
> **Licensed Journeyman Electrician (TDLR #123456) · Clean Driving Record (MVR)**

#### Credentials & Licenses (Put this right below your name!)
- State Journeyman Electrician License (#123456)
- OSHA 30 Construction Safety Certified
- Scissor Lift / Aerial Boom Certified
- Valid Texas Driver's License (Clean MVR)

#### Professional Experience
Format each job with specific, quantified accomplishments:
> **Lead Service Electrician** | Voltway Electric, Dallas, TX (2023 – Present)
> - Wired and commissioned 480V three-phase electrical distribution panels for 8 commercial distribution centers.
> - Bent and installed over 4,000 feet of 3/4" to 2" EMT conduit to exact blueprint tolerances.
> - Dispatched independently on a take-home van handling 3–5 emergency commercial service calls daily.
> - Mentored 2 first-year apprentices in conduit bending and multimeter troubleshooting.
    `,
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedBlogPosts(currentSlug: string, count = 3): BlogPost[] {
  const current = getBlogPostBySlug(currentSlug);
  return BLOG_POSTS.filter((p) => p.slug !== currentSlug)
    .sort((a, b) => {
      if (current && a.tradeSlug === current.tradeSlug) return -1;
      if (current && b.tradeSlug === current.tradeSlug) return 1;
      return 0;
    })
    .slice(0, count);
}
