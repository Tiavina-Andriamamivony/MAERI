import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";

const connectionString = process.env.DATABASE_URL ?? "";

// Le `datasource db` du schéma n'a pas d'`url` : le transport est choisi ici,
// selon le protocole de DATABASE_URL.
// - Prod (Vercel) : URL Accelerate (`prisma+postgres://` sur 443) → on passe
//   `accelerateUrl` + l'extension `withAccelerate()`. L'adapter PrismaPg (TCP
//   direct) ne sait PAS parler à Accelerate — c'était la cause de l'échec du
//   build au prerendering (PrismaClientKnownRequestError sur findMany).
// - Dev local : URL Postgres directe (`postgresql://…localhost`) → adapter
//   PrismaPg (TCP). En Prisma 7, `adapter` et `accelerateUrl` sont exclusifs.
const usesAccelerate =
  connectionString.startsWith("prisma://") ||
  connectionString.startsWith("prisma+postgres://");

// Type de retour annoté explicitement sur `PrismaClient` : sans ça, TypeScript
// infère l'UNION du client de base et du client étendu par `withAccelerate()`.
// Ces types Prisma étendus sont énormes (génériques sur tous les modèles) et
// leur union fait exploser la mémoire de tsc (heap out of memory au build).
// L'app n'utilise aucune API spécifique d'Accelerate → le type de base suffit.
function createPrismaClient(): PrismaClient {
  if (usesAccelerate) {
    return new PrismaClient({ accelerateUrl: connectionString }).$extends(
      withAccelerate(),
    ) as unknown as PrismaClient;
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
