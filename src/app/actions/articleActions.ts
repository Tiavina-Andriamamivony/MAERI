"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { ok, fail, notFound, type ActionResult } from "@/lib/action-result";
import {
  createWithAllocatedKey,
  nextArticleReference,
} from "@/lib/analyse/next-code";
import { firstError } from "@/lib/validations/first-error";
import {
  createArticleSchema,
  updateArticleSchema,
} from "@/lib/validations/analyse";
import { Article } from "../generated/prisma/client";

export default async function getArticles(): Promise<Article[]> {
  const auth = await requireAdmin();
  if (!auth.success) return [];

  return await prisma.article.findMany({ orderBy: { reference: "asc" } });
}

export async function createArticle(
  formData: FormData,
): Promise<ActionResult<Article>> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;

  const input = createArticleSchema.safeParse(Object.fromEntries(formData));
  if (!input.success) return fail(firstError(input.error), 422, "VALIDATION_ERROR");

  const article = await createWithAllocatedKey(async () =>
    prisma.article.create({
      data: { ...input.data, reference: await nextArticleReference() },
    }),
  );

  console.log("[article] Article créé #%d (réf: %s)", article.id, article.reference);
  revalidatePath("/admin/analyses");
  return ok(article);
}

export async function updateArticle(
  formData: FormData,
): Promise<ActionResult<Article>> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;

  const input = updateArticleSchema.safeParse(Object.fromEntries(formData));
  if (!input.success) return fail(firstError(input.error), 422, "VALIDATION_ERROR");

  const { id, ...data } = input.data;
  const article = await prisma.article.update({ where: { id }, data });

  console.log("[article] Article mis à jour #%d", id);
  revalidatePath("/admin/analyses");
  return ok(article);
}

export async function deleteArticle(
  id: number,
): Promise<ActionResult<Article>> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;

  try {
    const article = await prisma.article.delete({ where: { id } });
    console.log("[article] Article supprimé #%d", id);
    revalidatePath("/admin/analyses");
    return ok(article);
  } catch {
    return notFound("Article introuvable ou déjà supprimé.", "ARTICLE_NOT_FOUND");
  }
}
