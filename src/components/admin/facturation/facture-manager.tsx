"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DownloadIcon, EyeIcon, FilePlusIcon, Trash2Icon } from "lucide-react";

import type { Article, Client } from "@/app/generated/prisma/client";
import {
  deleteFacture,
  type FactureWithItems,
} from "@/app/actions/factureActions";
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
import { FactureForm, type FactureFormValues } from "./facture-form";

/** Fenêtre d&apos;annulation de la suppression d&apos;une facture (3 s). */
const UNDO_DELAY_MS = 3000;

/** Ligne du tableau avec actions (voir, télécharger, supprimer). */
function FactureRow({
  facture,
  onView,
  onDelete,
}: {
  facture: FactureWithItems;
  onView: (f: FactureWithItems) => void;
  onDelete: (id: number, label: string) => void;
}) {
  return (
    <TableRow>
      <TableCell className="font-medium">{facture.facture_num}</TableCell>
      <TableCell>{facture.client_name}</TableCell>
      <TableCell>{formatDate(facture.date)}</TableCell>
      <TableCell className="text-right">
        {formatAmount(facture.montant_total)}
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(facture)}
          >
            <EyeIcon />
            Voir
          </Button>
          <a
            href={`/api/facture/${facture.id}/download`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <DownloadIcon />
            Télécharger PDF
          </a>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(facture.id, `Facture ${facture.facture_num}`)}
            aria-label={`Supprimer la facture ${facture.facture_num}`}
          >
            <Trash2Icon />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

/** En-tête du tableau des factures. */
function FactureTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Facture N°</TableHead>
        <TableHead>Client</TableHead>
        <TableHead>Date</TableHead>
        <TableHead className="text-right">Montant total TTC</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

/** Tableau des factures. */
function FactureTable({
  factures,
  onView,
  onDelete,
}: {
  factures: FactureWithItems[];
  onView: (f: FactureWithItems) => void;
  onDelete: (id: number, label: string) => void;
}) {
  return (
    <Table className="rounded-lg border">
      <FactureTableHeader />
      <TableBody>
        {factures.map((facture) => (
          <FactureRow
            key={facture.id}
            facture={facture}
            onView={onView}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  );
}

export function FactureManager({
  factures,
  clients,
  articles,
  initialData,
}: {
  factures: FactureWithItems[];
  clients: Client[];
  articles: Article[];
  /** Données pré-remplies (provenant d&apos;un proforma via query param). */
  initialData?: Record<string, string>;
}) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [viewed, setViewed] = useState<FactureWithItems | null>(null);
  const [viewPdfUrl, setViewPdfUrl] = useState<string | null>(null);

  // La ligne masquée disparaît immédiatement ; le toast « Annuler » (3 s)
  // stoppe la suppression tant que la fenêtre n&apos;est pas écoulée. Après
  // suppression définitive, on recharge la liste depuis le serveur.
  const handleDeleted = useCallback(() => router.refresh(), [router]);
  const { pendingIds, remove } = useRowDeletion(deleteFacture, {
    undoDelayMs: UNDO_DELAY_MS,
    onDeleted: handleDeleted,
  });
  const visibleFactures = factures.filter(
    (facture) => !pendingIds.has(facture.id),
  );

  // Récupère le PDF depuis l&apos;URL Vercel Blob et crée un blob URL local
  // pour l&apos;afficher dans l&apos;objet (évite les restrictions cross-origin).
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

  // Si des données initiales sont fournies (depuis un proforma), ouvrir
  // automatiquement le formulaire de création.
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setIsCreating(true);
    }
  }, [initialData]);

  function handleSaved() {
    setIsCreating(false);
    // Supprimer les query params injectés par le proforma pour que
    // le useEffect ne réouvre pas le formulaire après le rafraîchissement.
    router.replace(window.location.pathname);
    router.refresh();
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <Button onClick={() => setIsCreating(true)}>
          <FilePlusIcon />
          Générer une facture
        </Button>
      </div>

      {visibleFactures.length === 0 ? (
        <div className="flex flex-col items-start gap-2 rounded-lg border border-dashed p-8 text-sm text-muted-foreground">
          <p>Aucune facture générée pour l&apos;instant.</p>
          <p>
            Créez une facture manuellement ou à partir d&apos;un proforma
            existant.
          </p>
        </div>
      ) : (
        <FactureTable
          factures={visibleFactures}
          onView={setViewed}
          onDelete={remove}
        />
      )}

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          <FactureForm
            clients={clients}
            articles={articles}
            onCancel={() => setIsCreating(false)}
            onSaved={handleSaved}
            initialData={
              initialData
                ? Object.fromEntries(
                    Object.entries({
                      facture_num: initialData.facture_num,
                      date: initialData.date,
                      client_id: initialData.client_id
                        ? Number(initialData.client_id)
                        : undefined,
                      client_code: initialData.client_code,
                      client_name: initialData.client_name,
                      client_address: initialData.client_address,
                      client_province: initialData.client_province,
                      client_nif: initialData.client_nif,
                      client_stat: initialData.client_stat,
                      client_rcs: initialData.client_rcs,
                      client_contact: initialData.client_contact,
                      client_phone: initialData.client_phone,
                      client_mail: initialData.client_mail,
                      votre_reference: initialData.votre_reference,
                      monnaie: initialData.monnaie,
                      livraison: initialData.livraison,
                      paiement: initialData.paiement,
                      proforma_id: initialData.proforma_id
                        ? Number(initialData.proforma_id)
                        : undefined,
                      tva_active: initialData.tva_active === "true",
                      tva_rate: initialData.tva_rate
                        ? Number(initialData.tva_rate)
                        : undefined,
                      items: initialData.items
                        ? (JSON.parse(initialData.items) as FactureFormValues["items"])
                        : undefined,
                    }).filter(
                      ([, value]) => value !== undefined,
                    ),
                  ) as Partial<FactureFormValues>
                : undefined
            }
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
                <DialogTitle>Facture {viewed.facture_num}</DialogTitle>
                <DialogDescription>
                  {viewed.client_name} — {formatDate(viewed.date)}
                </DialogDescription>
              </DialogHeader>
              {viewPdfUrl ? (
                <object
                  data={viewPdfUrl}
                  type="application/pdf"
                  title={`Facture ${viewed.facture_num}`}
                  className="h-[70vh] w-full rounded-md border"
                />
              ) : (
                <div className="flex h-[70vh] items-center justify-center rounded-md border text-muted-foreground">
                  Chargement…
                </div>
              )}
              <DialogFooter>
                <a
                  href={`/api/facture/${viewed.id}/download`}
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
