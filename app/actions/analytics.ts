"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { dailyMetrics, transactions, trafficSources } from "@/lib/db/schema"
import { and, asc, desc, eq, gte, sql } from "drizzle-orm"
import { headers } from "next/headers"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

// Deterministic pseudo-random generator so seeded data is stable per user/day.
function seeded(seedStr: string) {
  let h = 2166136261
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const CUSTOMERS = [
  ["Acme Corp", "billing@acme.com"],
  ["Globex", "ap@globex.io"],
  ["Soylent", "finance@soylent.co"],
  ["Initech", "accounts@initech.com"],
  ["Umbrella", "ops@umbrella.org"],
  ["Hooli", "pay@hooli.xyz"],
  ["Stark Industries", "invoices@stark.com"],
  ["Wayne Enterprises", "ar@wayne.com"],
  ["Wonka Inc", "billing@wonka.co"],
  ["Cyberdyne", "accounts@cyberdyne.ai"],
  ["Massive Dynamic", "finance@massive.dev"],
  ["Vehement Capital", "pay@vehement.io"],
]
const PLANS = ["Starter", "Pro", "Business", "Enterprise"]
const PLAN_PRICE: Record<string, number> = {
  Starter: 29,
  Pro: 99,
  Business: 299,
  Enterprise: 999,
}
const STATUSES = ["succeeded", "succeeded", "succeeded", "pending", "refunded", "failed"]
const CHANNELS = ["Organic Search", "Direct", "Referral", "Social", "Email", "Paid Ads"]

/**
 * Seed ~90 days of analytics data for a user the first time they land on the
 * dashboard. Idempotent: if the user already has metrics, this is a no-op.
 */
export async function ensureSeedData() {
  const userId = await getUserId()

  await db.transaction(async (tx) => {
    // Serialize concurrent seed attempts for the same user with a
    // transaction-scoped advisory lock so we can never double-insert.
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${userId}))`)

    const existing = await tx
      .select({ id: dailyMetrics.id })
      .from(dailyMetrics)
      .where(eq(dailyMetrics.userId, userId))
      .limit(1)

    if (existing.length > 0) return

    await seedForUser(tx, userId)
  })
}

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]

async function seedForUser(tx: Tx, userId: string) {
  const rand = seeded(userId)
  const days = 90
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const metricRows: (typeof dailyMetrics.$inferInsert)[] = []
  // baseline values that trend upward over time with weekly seasonality
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const progress = (days - i) / days // 0..1 growth factor
    const dow = d.getDay()
    const weekend = dow === 0 || dow === 6 ? 0.7 : 1
    const noise = 0.8 + rand() * 0.4

    const baseSessions = 1800 + progress * 2600
    const sessions = Math.round(baseSessions * weekend * noise)
    const newUsers = Math.round(sessions * (0.05 + rand() * 0.03))
    const orders = Math.round(sessions * (0.018 + rand() * 0.012))
    const revenue = +(orders * (80 + rand() * 90)).toFixed(2)

    metricRows.push({
      userId,
      day: d.toISOString().slice(0, 10),
      revenue: String(revenue),
      newUsers,
      sessions,
      orders,
    })
  }
  await tx.insert(dailyMetrics).values(metricRows)

  // Recent transactions
  const txRows: (typeof transactions.$inferInsert)[] = []
  for (let i = 0; i < 24; i++) {
    const [customer, email] = CUSTOMERS[Math.floor(rand() * CUSTOMERS.length)]
    const plan = PLANS[Math.floor(rand() * PLANS.length)]
    const status = STATUSES[Math.floor(rand() * STATUSES.length)]
    const created = new Date(today)
    created.setDate(created.getDate() - Math.floor(rand() * 14))
    created.setHours(Math.floor(rand() * 24), Math.floor(rand() * 60))
    txRows.push({
      userId,
      customer,
      email,
      amount: String(PLAN_PRICE[plan]),
      status,
      plan,
      createdAt: created,
    })
  }
  await tx.insert(transactions).values(txRows)

  // Traffic source breakdown
  const trafficRows: (typeof trafficSources.$inferInsert)[] = CHANNELS.map((channel) => ({
    userId,
    channel,
    visitors: Math.round(2000 + rand() * 14000),
  }))
  await tx.insert(trafficSources).values(trafficRows)
}

export async function getDailyMetrics(days = 30) {
  const userId = await getUserId()
  const since = new Date()
  since.setHours(0, 0, 0, 0)
  since.setDate(since.getDate() - (days - 1))
  return db
    .select()
    .from(dailyMetrics)
    .where(and(eq(dailyMetrics.userId, userId), gte(dailyMetrics.day, since.toISOString().slice(0, 10))))
    .orderBy(asc(dailyMetrics.day))
}

export async function getTransactions(limit = 8) {
  const userId = await getUserId()
  return db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.createdAt))
    .limit(limit)
}

export async function getTrafficSources() {
  const userId = await getUserId()
  return db
    .select()
    .from(trafficSources)
    .where(eq(trafficSources.userId, userId))
    .orderBy(desc(trafficSources.visitors))
}
