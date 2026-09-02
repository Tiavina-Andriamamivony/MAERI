/** Prisma error code for unique constraint violations (P2002). */
const UNIQUE_VIOLATION_CODE = "P2002";

/** Checks whether a caught error is a Prisma unique constraint violation. */
export function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === UNIQUE_VIOLATION_CODE
  );
}
