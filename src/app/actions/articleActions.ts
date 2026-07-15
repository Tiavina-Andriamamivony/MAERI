'use server'

import prisma from "@/lib/prisma";
import { Article } from "../generated/prisma/client";

export default async function getArticles(): Promise<Article[]> {
  return prisma.article.findMany({ orderBy: { reference: "asc" } });
}
