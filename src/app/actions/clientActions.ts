"use server";

import prisma from "@/lib/prisma";
import { Client } from "../generated/prisma/client";

export default async function getClients(): Promise<Client[]> {
  return prisma.client.findMany({ orderBy: { code_client: "asc" } });
}
