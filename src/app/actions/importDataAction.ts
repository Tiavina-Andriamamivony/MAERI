import { ActionResult } from "@/lib/action-result";
import { Article, Client } from "../generated/prisma/client";

export async function importClientFromXlsx(file: File): Promise<ActionResult<Client[]>> {
    throw new Error("Function not implemented.");
}

export async function importArticlesFromXlsx(file: File): Promise<ActionResult<Article[]>> {
    throw new Error("Function not implemented.");
}

export async function exportClientsToXlsx(): Promise<String> { 
    throw new Error("Function not implemented.");
}

export async function exportArticlesToXlsx(): Promise<String> { 
    throw new Error("Function not implemented.");
}