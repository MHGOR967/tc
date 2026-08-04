import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json, decimal, bigint } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  telegramUserId: bigint("telegramUserId", { mode: "number" }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  points: int("points").default(0),
  isBanned: boolean("isBanned").default(false),
  referrerId: int("referrerId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Telegram Bot Channels (القنوات الإجبارية)
export const telegramChannels = mysqlTable("telegramChannels", {
  id: int("id").autoincrement().primaryKey(),
  channelId: varchar("channelId", { length: 64 }).notNull().unique(),
  channelName: varchar("channelName", { length: 255 }),
  channelLink: text("channelLink"),
  isRequired: boolean("isRequired").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TelegramChannel = typeof telegramChannels.$inferSelect;
export type InsertTelegramChannel = typeof telegramChannels.$inferInsert;

// Bot Buttons (الأزرار)
export const botButtons = mysqlTable("botButtons", {
  id: int("id").autoincrement().primaryKey(),
  buttonText: varchar("buttonText", { length: 255 }).notNull(),
  buttonCallback: varchar("buttonCallback", { length: 255 }).notNull(),
  buttonType: mysqlEnum("buttonType", ["admin", "vip", "user", "fun", "payment"]).default("user"),
  requiredPoints: int("requiredPoints").default(0),
  isActive: boolean("isActive").default(true),
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BotButton = typeof botButtons.$inferSelect;
export type InsertBotButton = typeof botButtons.$inferInsert;

// Hosted Pages (الصفحات المستضافة)
export const hostedPages = mysqlTable("hostedPages", {
  id: int("id").autoincrement().primaryKey(),
  pageTitle: varchar("pageTitle", { length: 255 }).notNull(),
  pageSlug: varchar("pageSlug", { length: 255 }).notNull().unique(),
  htmlContent: text("htmlContent"),
  s3Key: varchar("s3Key", { length: 255 }),
  createdBy: int("createdBy"),
  isActive: boolean("isActive").default(true),
  viewCount: int("viewCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HostedPage = typeof hostedPages.$inferSelect;
export type InsertHostedPage = typeof hostedPages.$inferInsert;

// User Links (الروابط الديناميكية لكل مستخدم)
export const userLinks = mysqlTable("userLinks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  pageId: int("pageId").notNull(),
  linkToken: varchar("linkToken", { length: 255 }).notNull().unique(),
  visitCount: int("visitCount").default(0),
  lastVisit: timestamp("lastVisit"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserLink = typeof userLinks.$inferSelect;
export type InsertUserLink = typeof userLinks.$inferInsert;

// Visitor Data (بيانات الزوار)
export const visitorData = mysqlTable("visitorData", {
  id: int("id").autoincrement().primaryKey(),
  linkId: int("linkId").notNull(),
  visitorIp: varchar("visitorIp", { length: 45 }),
  userAgent: text("userAgent"),
  deviceType: varchar("deviceType", { length: 50 }),
  location: varchar("location", { length: 255 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type VisitorData = typeof visitorData.$inferSelect;
export type InsertVisitorData = typeof visitorData.$inferInsert;

// Payments (الدفعات)
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  points: int("points"),
  paymentMethod: mysqlEnum("paymentMethod", ["telegram_stars", "manual"]),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending"),
  transactionId: varchar("transactionId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

// Referrals (الإحالات)
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  referrerId: int("referrerId").notNull(),
  referredUserId: int("referredUserId").notNull(),
  pointsEarned: int("pointsEarned").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

// Activity Logs (سجل الأنشطة)
export const activityLogs = mysqlTable("activityLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  action: varchar("action", { length: 255 }).notNull(),
  details: text("details"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;