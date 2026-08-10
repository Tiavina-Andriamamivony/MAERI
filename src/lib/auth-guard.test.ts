import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  default: { user: { upsert: vi.fn() } },
}));

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "./auth-guard";

const mockAuth = vi.mocked(auth);
const mockUpsert = vi.mocked(prisma.user.upsert);

function session(claims?: unknown, userId: string | null = "clerk_1") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockAuth.mockResolvedValue({ userId, sessionClaims: claims } as any);
}

describe("requireAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockUpsert.mockResolvedValue({ id: "db_1" } as any);
  });

  it("autorise un utilisateur portant le rôle admin", async () => {
    session({ metadata: { role: "admin" } });
    expect(await requireAdmin()).toEqual({
      success: true,
      data: { id: "db_1" },
    });
  });

  it("crée la ligne Prisma manquante plutôt que de verrouiller l'admin dehors", async () => {
    session({ metadata: { role: "admin" } });
    await requireAdmin();
    expect(mockUpsert).toHaveBeenCalledWith({
      where: { clerkId: "clerk_1" },
      update: {},
      create: { clerkId: "clerk_1" },
    });
  });

  it("refuse un utilisateur connecté sans rôle", async () => {
    session({});
    expect(await requireAdmin().then((r) => r.success)).toBe(false);
  });

  it("refuse un rôle autre qu'admin", async () => {
    session({ metadata: { role: "viewer" } });
    expect(await requireAdmin().then((r) => r.success)).toBe(false);
  });

  it("refuse quand le claim metadata est absent du token", async () => {
    session();
    expect(await requireAdmin().then((r) => r.success)).toBe(false);
  });

  it("refuse un visiteur non connecté", async () => {
    session({ metadata: { role: "admin" } }, null);
    expect(await requireAdmin().then((r) => r.success)).toBe(false);
  });

  it("ne touche pas la base quand l'autorisation échoue", async () => {
    session({ metadata: { role: "viewer" } });
    await requireAdmin();
    expect(mockUpsert).not.toHaveBeenCalled();
  });
});
