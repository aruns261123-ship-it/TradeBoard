import {
  pgTable,
  serial,
  text,
  boolean,
  integer,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

export const tradeEnum = pgEnum("trade", [
  "hvac",
  "plumbing",
  "electrical",
  "welding",
  "carpentry",
  "automotive",
  "machining",
  "construction",
  "other",
]);

export const jobStatusEnum = pgEnum("job_status", [
  "draft",
  "pending_payment",
  "paid",
  "published",
  "expired",
  "filled",
  "rejected",
]);

export const productEnum = pgEnum("product", [
  "standard",
  "featured",
  "pack5",
  "agency",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
]);

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  website: text("website"),
  description: text("description"),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified"),
  image: text("image"),
  passwordHash: text("password_hash"),
  role: text("role").notNull().default("employer"), // employer | admin
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const jobs = pgTable(
  "jobs",
  {
    id: serial("id").primaryKey(),
    companyId: integer("company_id")
      .references(() => companies.id, { onDelete: "cascade" })
      .notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    trade: tradeEnum("trade").notNull(),
    city: text("city").notNull(),
    state: text("state").notNull(), // 2-letter code
    remote: boolean("remote").notNull().default(false),
    employmentType: text("employment_type").notNull().default("full_time"),
    salaryMin: integer("salary_min"),
    salaryMax: integer("salary_max"),
    description: text("description").notNull(),
    applyEmail: text("apply_email"),
    applyUrl: text("apply_url"),
    status: jobStatusEnum("status").notNull().default("draft"),
    featured: boolean("featured").notNull().default(false),
    isFree: boolean("is_free").notNull().default(false),
    entitlementSource: text("entitlement_source"), // agency | credit | promo | null
    views: integer("views").notNull().default(0),
    publishedAt: timestamp("published_at"),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("jobs_status_idx").on(t.status),
    index("jobs_trade_idx").on(t.trade),
    index("jobs_state_idx").on(t.state),
    index("jobs_published_idx").on(t.publishedAt),
  ]
);

export const applications = pgTable(
  "applications",
  {
    id: serial("id").primaryKey(),
    jobId: integer("job_id")
      .references(() => jobs.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    message: text("message"),
    resumeUrl: text("resume_url"),
    status: text("status").notNull().default("new"), // new | reviewed | contacted | hired | rejected
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("applications_job_idx").on(t.jobId)]
);

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    jobId: integer("job_id").references(() => jobs.id, { onDelete: "set null" }),
    product: productEnum("product").notNull(),
    amountCents: integer("amount_cents").notNull(),
    status: orderStatusEnum("status").notNull().default("pending"),
    stripeSessionId: text("stripe_session_id"),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("orders_session_idx").on(t.stripeSessionId)]
);

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  status: text("status").notNull(), // active | canceled | past_due ...
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const promoCodes = pgTable("promo_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  percentOff: integer("percent_off"),
  freePosts: integer("free_posts"),
  maxRedemptions: integer("max_redemptions"),
  timesRedeemed: integer("times_redeemed").notNull().default(0),
  active: boolean("active").notNull().default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  trades: text("trades"), // comma-separated interests
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const employerLeads = pgTable("employer_leads", {
  id: serial("id").primaryKey(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull().unique(),
  company: text("company").notNull(),
  phone: text("phone"),
  website: text("website"),
  trades: text("trades"), // comma-separated trade slugs
  openRoles: integer("open_roles"),
  notes: text("notes"),
  status: text("status").notNull().default("new"), // new | contacted | posted | won | lost
  source: text("source").notNull().default("founding_page"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
