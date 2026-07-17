"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth-guard";
import { ok, fail, type ActionResult } from "@/lib/action-result";
import { firstError } from "@/lib/validations/first-error";
import {
  createArticleSchema,
  updateArticleSchema,
} from "@/lib/validations/analyse";
import { Article } from "../generated/prisma/client";

export default async function getArticles(): Promise<Article[]> {
  return prisma.article.findMany({ orderBy: { reference: "asc" } });
}

export async function createArticle(
  formData: FormData,
): Promise<ActionResult<Article>> {
  const user = await requireUser();
  if (!user.success) return user;

  const input = createArticleSchema.safeParse(Object.fromEntries(formData));
  if (!input.success) return fail(firstError(input.error));

  // La référence est unique : refuser plutôt que de créer un doublon.
  const existing = await prisma.article.findUnique({
    where: { reference: input.data.reference },
  });
  if (existing) {
    return fail(`La référence « ${input.data.reference} » existe déjà.`);
  }

  const article = await prisma.article.create({ data: input.data });

  revalidatePath("/admin/analyses");
  return ok(article);
}

export async function updateArticle(
  formData: FormData,
): Promise<ActionResult<Article>> {
  const user = await requireUser();
  if (!user.success) return user;

  const input = updateArticleSchema.safeParse(Object.fromEntries(formData));
  if (!input.success) return fail(firstError(input.error));

  const { id, ...data } = input.data;
  const article = await prisma.article.update({ where: { id }, data });

  revalidatePath("/admin/analyses");
  return ok(article);
}

export async function deleteArticle(
  id: number,
): Promise<ActionResult<Article>> {
  const user = await requireUser();
  if (!user.success) return user;

  try {
    const article = await prisma.article.delete({ where: { id } });
    revalidatePath("/admin/analyses");
    return ok(article);
  } catch {
    // Prisma lève P2025 si la ligne n'existe plus (déjà supprimée ailleurs).
    return fail("Article introuvable ou déjà supprimé.");
  }
}
