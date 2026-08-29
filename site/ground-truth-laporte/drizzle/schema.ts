import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";

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
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  /** scrypt hash for email/password citizens (null for social-login users). */
  passwordHash: varchar("passwordHash", { length: 255 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/* ────────────────────────────────────────────────────────────────
   GROUND TRUTH LAPORTE — evidence intake & civic record tables.
   Mirrors the PCOS engine's quarantine-by-default submission model:
   nothing submitted becomes public without authenticity review.
   ──────────────────────────────────────────────────────────────── */

/** Public evidence submissions — quarantined by default. */
export const submissions = mysqlTable("submissions", {
  id: int("id").autoincrement().primaryKey(),
  /** The contributor's account. */
  userId: int("userId").notNull(),
  kind: mysqlEnum("kind", ["evidence", "question"]).notNull(),
  /** What the contributor says it is — a hypothesis, never evidence. */
  title: varchar("title", { length: 500 }).notNull(),
  statement: text("statement"),
  sourceUrl: text("sourceUrl"),
  /** Uploaded file metadata — bytes live in S3, never in the DB. */
  fileKey: varchar("fileKey", { length: 512 }),
  fileUrl: text("fileUrl"),
  fileName: varchar("fileName", { length: 500 }),
  mimeType: varchar("mimeType", { length: 120 }),
  fileSize: int("fileSize"),
  /** SHA-256 fingerprint computed at intake — the seal. */
  sha256: varchar("sha256", { length: 128 }),
  /** Quarantine pipeline state. */
  status: mysqlEnum("status", [
    "quarantined",
    "under_review",
    "verified",
    "rejected",
  ]).default("quarantined").notNull(),
  authenticityNotes: text("authenticityNotes"),
  /** Set when released from quarantine; NULL = still quarantined. */
  releasedAt: timestamp("releasedAt"),
  rejectedAt: timestamp("rejectedAt"),
  rejectionReason: text("rejectionReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = typeof submissions.$inferInsert;

/** Local public meetings — council, commissioners, plan commission, etc. */
export const meetings = mysqlTable("meetings", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  body: varchar("body", { length: 300 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  heldOn: varchar("heldOn", { length: 40 }).notNull(),
  summary: text("summary"),
  decisions: json("decisions").$type<string[]>(),
  moneyDiscussed: json("moneyDiscussed").$type<string[]>(),
  unanswered: json("unanswered").$type<string[]>(),
  videoUrl: text("videoUrl"),
  transcript: text("transcript"),
  minutesUrl: text("minutesUrl"),
  status: mysqlEnum("status", ["sealed", "processed", "published"]).default("published").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Meeting = typeof meetings.$inferSelect;
export type InsertMeeting = typeof meetings.$inferInsert;

/** Commitments extracted from a specific meeting, linked to the ledger. */
export const meetingCommitments = mysqlTable("meeting_commitments", {
  id: int("id").autoincrement().primaryKey(),
  meetingId: int("meetingId").notNull(),
  speaker: varchar("speaker", { length: 300 }),
  speakerRole: varchar("speakerRole", { length: 300 }),
  text: text("text").notNull(),
  metricLabel: varchar("metricLabel", { length: 300 }),
  targetValue: varchar("targetValue", { length: 120 }),
  /** Timestamp anchor in the recording, e.g. '0:14:13'. */
  anchor: varchar("anchor", { length: 40 }),
  /** Links to the tracker commitment id in the canonical data layer. */
  trackerRef: varchar("trackerRef", { length: 120 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type MeetingCommitment = typeof meetingCommitments.$inferSelect;
export type InsertMeetingCommitment = typeof meetingCommitments.$inferInsert;
