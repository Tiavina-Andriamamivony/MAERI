"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DownloadIcon, EyeIcon, FilePlusIcon } from "lucide-react";

import type { Article, Client } from "@/app/generated/prisma/client";
import type { ProformaWithItems } from "@/app/actions/proformaActions";
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

import { ProformaForm } from "./proforma-form";

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

      {proformas.length === 0 ? (
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
              {proformas.map((proforma) => (
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
