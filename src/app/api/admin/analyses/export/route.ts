import { requireUser } from "@/lib/auth-guard";
import getArticles from "@/app/actions/articleActions";
import getClients from "@/app/actions/clientActions";
import { buildWorkbookBuffer } from "@/lib/excel/exportWorkbook";
import {
  ARTICLE_COLUMNS,
  CLIENT_COLUMNS,
} from "@/components/admin/analyse/columns";

// Noms d'onglets alignés sur ceux reconnus à l'import (`routeSheet`) : le
// fichier exporté est ainsi directement réimportable.
const CLIENT_SHEET = "base de données client";
const ARTICLE_SHEET = "base de données article";
const FILE_NAME = "maeri-analyses.xlsx";

/**
 * Exporte les tableaux Clients et Articles dans un unique classeur Excel
 * (un onglet chacun), servi en téléchargement. Réservé aux utilisateurs
 * authentifiés — le contenu est le même que celui affiché à l'écran.
 */
export async function GET() {
  const user = await requireUser();
  if (!user.success) {
    return new Response(user.error, { status: 401 });
  }

  const [clients, articles] = await Promise.all([getClients(), getArticles()]);

  const buffer = buildWorkbookBuffer([
    { sheetName: CLIENT_SHEET, columns: CLIENT_COLUMNS, rows: clients },
    { sheetName: ARTICLE_SHEET, columns: ARTICLE_COLUMNS, rows: articles },
  ]);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${FILE_NAME}"`,
    },
  });
}
