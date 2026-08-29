import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createCtx(role: "user" | "admin" = "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAnonCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("submissions router", () => {
  it("rejects unauthenticated submission creation", async () => {
    const caller = appRouter.createCaller(createAnonCtx());
    await expect(
      caller.submissions.create({ kind: "evidence", title: "Test evidence" })
    ).rejects.toThrow();
  });

  it("rejects non-admin access to listAll", async () => {
    const caller = appRouter.createCaller(createCtx("user"));
    await expect(caller.submissions.listAll()).rejects.toThrow();
  });

  it("rejects non-admin status changes", async () => {
    const caller = appRouter.createCaller(createCtx("user"));
    await expect(
      caller.submissions.setStatus({ id: 1, status: "verified" })
    ).rejects.toThrow();
  });
});

describe("meetings router", () => {
  it("allows public read of the meetings list", async () => {
    const caller = appRouter.createCaller(createAnonCtx());
    // Should not throw — returns array (possibly empty if DB unavailable in test)
    const result = await caller.meetings.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("returns null for an unknown meeting slug", async () => {
    const caller = appRouter.createCaller(createAnonCtx());
    const result = await caller.meetings.bySlug({ slug: "does-not-exist" });
    expect(result).toBeNull();
  });

  it("rejects non-admin seed attempts", async () => {
    const caller = appRouter.createCaller(createCtx("user"));
    await expect(
      caller.meetings.seed({
        slug: "test",
        body: "Test",
        title: "Test",
        heldOn: "2026-01-01",
        commitments: [],
      })
    ).rejects.toThrow();
  });
});
