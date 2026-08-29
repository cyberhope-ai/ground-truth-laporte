import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  InsertSubmission, submissions,
  InsertMeeting, meetings,
  InsertMeetingCommitment, meetingCommitments,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/** Create an email/password citizen. Returns the new user's openId, or null if the
 *  email is already registered (any login method). */
export async function createPasswordUser(input: {
  email: string;
  name: string;
  passwordHash: string;
}): Promise<string | null> {
  const db = await getDb();
  if (!db) throw new Error("database not available");
  const email = input.email.trim().toLowerCase();
  const existing = await getUserByEmail(email);
  if (existing) return null; // email taken
  const openId = "pw:" + email.slice(0, 60);
  await db.insert(users).values({
    openId,
    name: input.name || email.split("@")[0],
    email,
    loginMethod: "password",
    passwordHash: input.passwordHash,
    lastSignedIn: new Date(),
  });
  return openId;
}

/* ── Admin: citizen management (never selects passwordHash) ── */
export async function listAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: users.id, name: users.name, email: users.email,
      loginMethod: users.loginMethod, role: users.role,
      createdAt: users.createdAt, lastSignedIn: users.lastSignedIn,
    })
    .from(users)
    .orderBy(desc(users.createdAt));
}

export async function setUserRole(id: number, role: "user" | "admin") {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ role }).where(eq(users.id, id));
}

export async function userStats() {
  const all = await listAllUsers();
  const byMethod: Record<string, number> = {};
  let admins = 0;
  for (const u of all) {
    byMethod[u.loginMethod || "unknown"] = (byMethod[u.loginMethod || "unknown"] || 0) + 1;
    if (u.role === "admin") admins++;
  }
  return { total: all.length, admins, byMethod };
}

/* ── Evidence submissions (quarantine-by-default intake) ── */

export async function createSubmission(row: InsertSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(submissions).values(row);
  return result[0].insertId;
}

export async function listSubmissionsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(submissions)
    .where(eq(submissions.userId, userId))
    .orderBy(desc(submissions.createdAt));
}

export async function listAllSubmissions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(submissions).orderBy(desc(submissions.createdAt));
}

export async function listVerifiedSubmissions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(submissions)
    .where(eq(submissions.status, "verified"))
    .orderBy(desc(submissions.releasedAt));
}

export async function updateSubmissionStatus(
  id: number,
  status: "quarantined" | "under_review" | "verified" | "rejected",
  notes?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const set: Record<string, unknown> = { status };
  if (notes !== undefined) set.authenticityNotes = notes;
  if (status === "verified") set.releasedAt = new Date();
  if (status === "rejected") set.rejectedAt = new Date();
  await db.update(submissions).set(set).where(eq(submissions.id, id));
}

/* ── Meetings & extracted commitments ── */

export async function listMeetings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(meetings).orderBy(desc(meetings.heldOn));
}

export async function getMeetingBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(meetings).where(eq(meetings.slug, slug)).limit(1);
  return rows[0];
}

export async function listMeetingCommitments(meetingId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(meetingCommitments)
    .where(eq(meetingCommitments.meetingId, meetingId));
}

export async function seedMeeting(meeting: InsertMeeting, commitments: Omit<InsertMeetingCommitment, "meetingId">[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(meetings).where(eq(meetings.slug, meeting.slug)).limit(1);
  if (existing.length > 0) return existing[0].id;
  const result = await db.insert(meetings).values(meeting);
  const meetingId = result[0].insertId;
  if (commitments.length > 0) {
    await db.insert(meetingCommitments).values(
      commitments.map((c) => ({ ...c, meetingId }))
    );
  }
  return meetingId;
}
