import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  integer,
  numeric,
  date,
} from "drizzle-orm/pg-core"

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})

// --- App tables ------------------------------------------------------------
// Per-user analytics data. Every table carries a plain `userId` column so all
// queries can be scoped to the signed-in user (there is no RLS on Neon).

// One row per day per user: the core time-series powering revenue / traffic charts.
export const dailyMetrics = pgTable("daily_metrics", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  day: date("day").notNull(),
  revenue: numeric("revenue", { precision: 12, scale: 2 }).notNull().default("0"),
  newUsers: integer("newUsers").notNull().default(0),
  sessions: integer("sessions").notNull().default(0),
  orders: integer("orders").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// Recent transactions / activity feed.
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  customer: text("customer").notNull(),
  email: text("email").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("succeeded"), // succeeded | pending | failed | refunded
  plan: text("plan").notNull().default("Pro"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// Traffic source breakdown (for the channel breakdown chart).
export const trafficSources = pgTable("traffic_sources", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  channel: text("channel").notNull(), // Organic, Direct, Referral, Social, Email, Paid
  visitors: integer("visitors").notNull().default(0),
})
