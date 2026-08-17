"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { DownloadIcon, EyeIcon, FilePlusIcon, Trash2Icon } from "lucide-react";

import type { Article, Client } from "@/app/generated/prisma/client";
import {
  deleteProforma,
  type ProformaWithItems,
} from "@/app/actions/proformaActions";
import { formatAmount, formatDate } from "@/lib/facturation/format";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useRowDeletion } from "../analyse/use-row-deletion";
import { ProformaForm } from "./proforma-form";

/** Fenêtre d'annulation de la suppression d'un proforma (3 s). */
const UNDO_DELAY_MS = 3000;

export function ProformaManager({
  proformas,
  clients,
  articles,
}: {
  proformas: ProformaWithItems[];
  clients: Client[];
  articles: Article[];
}) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [viewed, setViewed] = useState<ProformaWithItems | null>(null);
  // La ligne masquée disparaît immédiatement ; le toast « Annuler » (3 s)
  // stoppe la suppression tant que la fenêtre n'est pas écoulée. Après
  // suppression définitive, on recharge la liste depuis le serveur.
  const handleDeleted = useCallback(() => router.refresh(), [router]);
  const { pendingIds, remove } = useRowDeletion(deleteProforma, {
    undoDelayMs: UNDO_DELAY_MS,
    onDeleted: handleDeleted,
  });
  const visibleProformas = proformas.filter(
    (proforma) => !pendingIds.has(proforma.id),
  );

  function handleSaved() {
    setIsCreating(false);
    router.refresh();
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <Button onClick={() => setIsCreating(true)}>
          <FilePlusIcon />
          Générer un proforma
        </Button>
      </div>

      {visibleProformas.length === 0 ? (
        <div className="flex flex-col items-start gap-2 rounded-lg border border-dashed p-8 text-sm text-muted-foreground">
          <p>Aucun proforma généré pour l'instant.</p>
          <p>
            Importez d'abord vos clients et articles dans la section Analyses,
            puis générez votre premier proforma.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PF N°</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Montant total TTC</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleProformas.map((proforma) => (
                <TableRow key={proforma.id}>
                  <TableCell className="font-medium">
                    {proforma.pf_num}
                  </TableCell>
                  <TableCell>{proforma.client_name}</TableCell>
                  <TableCell>{formatDate(proforma.date)}</TableCell>
                  <TableCell className="text-right">
                    {formatAmount(proforma.montant_total)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewed(proforma)}
                      >
                        <EyeIcon />
                        Voir
                      </Button>
                      <a
                        href={`/api/proforma/${proforma.id}/download`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        <DownloadIcon />
                        Télécharger PDF
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          remove(proforma.id, `Proforma ${proforma.pf_num}`)
                        }
                        aria-label={`Supprimer le proforma ${proforma.pf_num}`}
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <ProformaForm
            clients={clients}
            articles={articles}
            onCancel={() => setIsCreating(false)}
            onSaved={handleSaved}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={viewed !== null}
        onOpenChange={(open) => {
          if (!open) setViewed(null);
        }}
      >
        <DialogContent className="max-w-4xl">
          {viewed && (
            <>
              <DialogHeader>
                <DialogTitle>Proforma {viewed.pf_num}</DialogTitle>
                <DialogDescription>
                  {viewed.client_name} — {formatDate(viewed.date)}
                </DialogDescription>
              </DialogHeader>
              <iframe
                src={viewed.pdf_url}
                title={`Proforma ${viewed.pf_num}`}
                className="h-[70vh] w-full rounded-md border"
              />
              <DialogFooter>
                <a
                  href={`/api/proforma/${viewed.id}/download`}
                  className={buttonVariants({ variant: "outline" })}
                >
                  <DownloadIcon />
                  Télécharger PDF
                </a>
                <DialogClose asChild>
                  <Button>Fermer</Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
