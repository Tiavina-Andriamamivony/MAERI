"use client";

import { useCallback, useEffect, useState } from "react";
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

/** Ligne du tableau avec actions (voir, télécharger, supprimer). */
function ProformaRow({
  proforma,
  onView,
  onDelete,
}: {
  proforma: ProformaWithItems;
  onView: (p: ProformaWithItems) => void;
  onDelete: (id: number, label: string) => void;
}) {
  return (
    <TableRow>
      <TableCell className="font-medium">{proforma.pf_num}</TableCell>
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
            onClick={() => onView(proforma)}
          >
            <EyeIcon />
            Voir
          </Button>
          <a
            href={`/api/proforma/${proforma.id}/download`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <DownloadIcon />
            Télécharger PDF
          </a>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(proforma.id, `Proforma ${proforma.pf_num}`)}
            aria-label={`Supprimer le proforma ${proforma.pf_num}`}
          >
            <Trash2Icon />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

/** Tableau des proformas. */
function ProformaTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>PF N°</TableHead>
        <TableHead>Client</TableHead>
        <TableHead>Date</TableHead>
        <TableHead className="text-right">Montant total TTC</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

/** Tableau des proformas. */
function ProformaTable({
  proformas,
  onView,
  onDelete,
}: {
  proformas: ProformaWithItems[];
  onView: (p: ProformaWithItems) => void;
  onDelete: (id: number, label: string) => void;
}) {
  return (
    <Table className="rounded-lg border">
      <ProformaTableHeader />
      <TableBody>
        {proformas.map((proforma) => (
          <ProformaRow
            key={proforma.id}
            proforma={proforma}
            onView={onView}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  );
}

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
  const [viewPdfUrl, setViewPdfUrl] = useState<string | null>(null);

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

  // Récupère le PDF depuis l'URL Vercel Blob et crée un blob URL local
  // pour l'afficher dans l'objet (évite les restrictions cross-origin).
  useEffect(() => {
    if (!viewed) {
      setViewPdfUrl(null);
      return undefined;
    }
    let revoked = false;
    fetch(viewed.pdf_url)
      .then((res) => {
        if (!res.ok) throw new Error("PDF introuvable");
        return res.blob();
      })
      .then((blob) => {
        if (!revoked) setViewPdfUrl(URL.createObjectURL(blob));
      })
      .catch(() => {
        if (!revoked) setViewPdfUrl(null);
      });
    return () => {
      revoked = true;
    };
  }, [viewed]);

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
          <p>Aucun proforma généré pour l&apos;instant.</p>
          <p>
            Importez d&apos;abord vos clients et articles dans la section
            Analyses, puis générez votre premier proforma.
          </p>
        </div>
      ) : (
        <ProformaTable
          proformas={visibleProformas}
          onView={setViewed}
          onDelete={remove}
        />
      )}

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
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
          if (!open) {
            if (viewPdfUrl) URL.revokeObjectURL(viewPdfUrl);
            setViewPdfUrl(null);
            setViewed(null);
          }
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
              {viewPdfUrl ? (
                <object
                  data={viewPdfUrl}
                  type="application/pdf"
                  title={`Proforma ${viewed.pf_num}`}
                  className="h-[70vh] w-full rounded-md border"
                />
              ) : (
                <div className="flex h-[70vh] items-center justify-center rounded-md border text-muted-foreground">
                  Chargement…
                </div>
              )}
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
