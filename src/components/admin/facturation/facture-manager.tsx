"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DownloadIcon, EyeIcon, FilePlusIcon, Trash2Icon } from "lucide-react";

import type { Article, Client } from "@/app/generated/prisma/client";
import {
  deleteFacture,
  type FactureWithItems,
} from "@/app/actions/factureActions";
import type { ProformaWithItems } from "@/app/actions/proformaActions";
import { formatAmount, formatDate } from "@/lib/facturation/format";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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

/** Fenêtre d'annulation de la suppression d'une facture (3 s). */
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
      <TableCell>{facture.client?.client ?? "—"}</TableCell>
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


function ProformaSelectTable({
  proformas,
  onSelect,
}: {
  proformas: ProformaWithItems[];
  onSelect: (proforma: ProformaWithItems) => void;
}) {
  return (
    <Table className="rounded-lg border">
      <TableHeader>
        <TableRow>
          <TableHead>PF N°</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Montant TTC</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {proformas.map((proforma) => (
          <TableRow
            key={proforma.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onSelect(proforma)}
          >
            <TableCell className="font-medium">
              {proforma.pf_num}
            </TableCell>
            <TableCell>{proforma.client?.client ?? "—"}</TableCell>
            <TableCell>{formatDate(proforma.date)}</TableCell>
            <TableCell className="text-right">
              {formatAmount(proforma.montant_total)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/**
 * Transforme un proforma en données initiales pour le formulaire de facture.
 * Résout les identifiants client et article à partir des listes disponibles.
 */
function buildInitialDataFromProforma(
  proforma: ProformaWithItems,
  clients: Client[],
  articles: Article[],
): Partial<FactureFormValues> {
  const items = proforma.items.map((item) => {
    const matched = articles.find(
      (a) =>
        a.designation?.trim().toLowerCase() ===
        item.designation.trim().toLowerCase(),
    );
    return {
      article_id: matched?.id ?? 0,
      designation: item.designation,
      uom: item.uom ?? "",
      quantite: item.quantite,
      prix_unitaire: item.prix_unitaire,
      remise_pct: item.remise_pct,
    };
  });

  return {
    proforma_id: proforma.id,
    client_id: proforma.client_id ?? undefined,
    votre_reference: proforma.votre_reference ?? "",
    monnaie: proforma.monnaie,
    tva_active: proforma.tva_active,
    tva_rate: proforma.tva_rate,
    items,
  };
}

/**
 * Transforme les query params (string) en données initiales pour le formulaire.
 * Filtre les valeurs undefined pour n'inclure que les champs réellement fournis.
 */
function buildInitialDataFromParams(
  params: Record<string, string>,
): Partial<FactureFormValues> {
  return Object.fromEntries(
    Object.entries({
      facture_num: params.facture_num,
      date: params.date,
      client_id: params.client_id ? Number(params.client_id) : undefined,
      votre_reference: params.votre_reference,
      monnaie: params.monnaie,
      livraison: params.livraison,
      paiement: params.paiement,
      proforma_id: params.proforma_id
        ? Number(params.proforma_id)
        : undefined,
      tva_active: params.tva_active === "true",
      tva_rate: params.tva_rate ? Number(params.tva_rate) : undefined,
      items: params.items
        ? (JSON.parse(params.items) as FactureFormValues["items"])
        : undefined,
    }).filter(([, value]) => value !== undefined),
  ) as Partial<FactureFormValues>;
}

/* ─── Sous-composants extraits pour limiter l'imbrication JSX ─── */


function ProformaSelectionDialog({
  open,
  onOpenChange,
  proformas,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proformas: ProformaWithItems[];
  onSelect: (proforma: ProformaWithItems) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
        <DialogTitle>Sélectionner un proforma</DialogTitle>
        <DialogDescription>
          Choisissez le proforma à convertir en facture. Les données
          client et articles seront pré-remplies dans le formulaire.
        </DialogDescription>
        {proformas.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Aucun proforma disponible. Créez d&apos;abord un proforma.
          </p>
        ) : (
          <ProformaSelectTable proformas={proformas} onSelect={onSelect} />
        )}
        <DialogClose asChild>
          <Button variant="outline">Annuler</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}


function FactureCreationDialog({
  open,
  onOpenChange,
  clients,
  articles,
  onCancel,
  onSaved,
  initialData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Client[];
  articles: Article[];
  onCancel: () => void;
  onSaved: () => void;
  initialData?: Partial<FactureFormValues>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <FactureForm
          clients={clients}
          articles={articles}
          onCancel={onCancel}
          onSaved={onSaved}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
}


function FacturePdfDialogFooter({ factureId }: { factureId: number }) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
      <a
        href={`/api/facture/${factureId}/download`}
        className={buttonVariants({ variant: "outline" })}
      >
        <DownloadIcon />
        Télécharger PDF
      </a>
      <DialogClose asChild>
        <Button>Fermer</Button>
      </DialogClose>
    </div>
  );
}


function FacturePdfViewerDialog({
  viewed,
  pdfUrl,
  onOpenChange,
}: {
  viewed: FactureWithItems;
  pdfUrl: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogTitle>Facture {viewed.facture_num}</DialogTitle>
        <DialogDescription>
          {viewed.client?.client ?? "—"} — {formatDate(viewed.date)}
        </DialogDescription>
        {pdfUrl ? (
          <object
            data={pdfUrl}
            type="application/pdf"
            title={`Facture ${viewed.facture_num}`}
            className="h-[70vh] w-full rounded-md border"
          />
        ) : (
          <div className="flex h-[70vh] items-center justify-center rounded-md border text-muted-foreground">
            Chargement…
          </div>
        )}
        <FacturePdfDialogFooter factureId={viewed.id} />
      </DialogContent>
    </Dialog>
  );
}

export function FactureManager({
  factures,
  clients,
  articles,
  proformas,
  initialData,
}: {
  factures: FactureWithItems[];
  clients: Client[];
  articles: Article[];
  proformas: ProformaWithItems[];
  /** Données pré-remplies (provenant d'un proforma via query param). */
  initialData?: Record<string, string>;
}) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isSelectingProforma, setIsSelectingProforma] = useState(false);
  const [proformaInitialData, setProformaInitialData] = useState<
    Partial<FactureFormValues> | undefined
  >();
  const [viewed, setViewed] = useState<FactureWithItems | null>(null);
  const [viewPdfUrl, setViewPdfUrl] = useState<string | null>(null);



  const handleDeleted = useCallback(() => router.refresh(), [router]);
  const { pendingIds, remove } = useRowDeletion(deleteFacture, {
    undoDelayMs: UNDO_DELAY_MS,
    onDeleted: handleDeleted,
  });
  const visibleFactures = factures.filter(
    (facture) => !pendingIds.has(facture.id),
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

  // Si des données initiales sont fournies (depuis un proforma via query param),
  // ouvrir automatiquement le formulaire de création pré-rempli.
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setIsCreating(true);
    }
  }, [initialData]);

  

  const handleSelectProforma = (proforma: ProformaWithItems) => {
    setIsSelectingProforma(false);
    setProformaInitialData(
      buildInitialDataFromProforma(proforma, clients, articles),
    );
    setIsCreating(true);
  };

  
  const formInitialData: Partial<FactureFormValues> | undefined =
    proformaInitialData ?? (initialData ? buildInitialDataFromParams(initialData) : undefined);

  const handleSaved = () => {
    setIsCreating(false);
    setProformaInitialData(() => undefined);
    router.replace(window.location.pathname);
    router.refresh();
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setProformaInitialData(() => undefined);
  };

  const handleViewPdfClose = (open: boolean) => {
    if (!open) {
      if (viewPdfUrl) URL.revokeObjectURL(viewPdfUrl);
      setViewPdfUrl(null);
      setViewed(null);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <Button onClick={() => setIsSelectingProforma(true)}>
          <FilePlusIcon />
          Générer une facture
        </Button>
      </div>

      {visibleFactures.length === 0 ? (
        <div className="flex flex-col items-start gap-2 rounded-lg border border-dashed p-8 text-sm text-muted-foreground">
          <p>Aucune facture générée pour l&apos;instant.</p>
          <p>
            Créez une facture à partir d&apos;un proforma existant.
          </p>
        </div>
      ) : (
        <FactureTable
          factures={visibleFactures}
          onView={setViewed}
          onDelete={remove}
        />
      )}

      <ProformaSelectionDialog
        open={isSelectingProforma}
        onOpenChange={setIsSelectingProforma}
        proformas={proformas}
        onSelect={handleSelectProforma}
      />

      <FactureCreationDialog
        open={isCreating}
        onOpenChange={setIsCreating}
        clients={clients}
        articles={articles}
        onCancel={handleCancelCreate}
        onSaved={handleSaved}
        initialData={formInitialData}
      />

      {viewed && (
        <FacturePdfViewerDialog
          viewed={viewed}
          pdfUrl={viewPdfUrl}
          onOpenChange={handleViewPdfClose}
        />
      )}
    </div>
  );
}
