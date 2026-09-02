"use client";

import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm, type Path } from "react-hook-form";
import { FileTextIcon, Loader2, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { createFacture } from "@/app/actions/factureActions";
import type { Article, Client } from "@/app/generated/prisma/client";
import { formatClientCode } from "@/lib/analyse/codes";
import { toDateInputValue } from "@/lib/facturation/format";
import {
  DEFAULT_CURRENCY,
  DEFAULT_TVA_RATE,
} from "@/lib/facturation/pdf-assets";
import { DEFAULT_FACTURE_NUM } from "@/lib/facturation/unique-keys";
import {
  FACTURE_MAX_ITEMS,
  factureSchema,
  type FactureInput,
} from "@/lib/validations/facture";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ItemValues = {
  article_id?: number;
  designation: string;
  uom: string;
  quantite: number;
  prix_unitaire: number;
  remise_pct: number;
};

export type FactureFormValues = {
  facture_num: string;
  date: string;
  client_id?: number;
  client_code: string;
  client_name: string;
  client_address: string;
  client_province: string;
  client_nif: string;
  client_stat: string;
  client_rcs: string;
  client_contact: string;
  client_phone: string;
  client_mail: string;
  votre_reference: string;
  monnaie: string;
  date_paiement: string;
  livraison: string;
  paiement: string;
  proforma_id?: number | null;
  tva_active: boolean;
  tva_rate: number;
  items: ItemValues[];
};

function emptyItem(): ItemValues {
  return {
    designation: "",
    uom: "",
    quantite: 1,
    prix_unitaire: 0,
    remise_pct: 0,
  };
}

function clientLabel(client: Client): string {
  const location = client.province ? ` — ${client.province}` : "";
  return `${formatClientCode(client.code_client)} · ${client.client}${location}`;
}

function articleLabel(article: Article): string {
  return article.designation
    ? `${article.reference} · ${article.designation}`
    : article.reference;
}

type ClientTextFieldName =
  | "client_code"
  | "client_name"
  | "client_province"
  | "client_address"
  | "client_nif"
  | "client_stat"
  | "client_rcs"
  | "client_contact"
  | "client_phone"
  | "client_mail";

function ClientField({
  form,
  name,
  label,
  className,
}: {
  form: ReturnType<typeof useForm<FactureFormValues>>;
  name: ClientTextFieldName;
  label: string;
  className?: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} disabled readOnly />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function ItemFields({
  index,
  form,
  articles,
  canRemove,
  onRemove,
  onArticleChange,
}: {
  index: number;
  form: ReturnType<typeof useForm<FactureFormValues>>;
  articles: Article[];
  canRemove: boolean;
  onRemove: () => void;
  onArticleChange: (index: number, articleId: number) => void;
}) {
  const { control } = form;

  return (
    <div className="rounded-lg border border-border p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm font-medium">Article {index + 1}</p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={!canRemove}
          aria-label={`Supprimer l'article ${index + 1}`}
        >
          <Trash2Icon />
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <FormField
          control={control}
          name={`items.${index}.article_id`}
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Article</FormLabel>
              <Select
                value={field.value ? String(field.value) : undefined}
                onValueChange={(value) =>
                  onArticleChange(index, Number(value))
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un article" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {articles.map((article) => (
                    <SelectItem
                      key={article.id}
                      value={String(article.id)}
                    >
                      {articleLabel(article)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`items.${index}.designation`}
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Désignation</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`items.${index}.quantite`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantité</FormLabel>
              <FormControl>
                <Input type="number" min={0} step="any" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`items.${index}.uom`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unité</FormLabel>
              <FormControl>
                <Input {...field} disabled readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`items.${index}.prix_unitaire`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix unitaire TTC</FormLabel>
              <FormControl>
                <Input type="number" min={0} step="any" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`items.${index}.remise_pct`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remise %</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step="any"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}



function ClientSection({
  form,
  clients,
  onClientChange,
}: {
  form: ReturnType<typeof useForm<FactureFormValues>>;
  clients: Client[];
  onClientChange: (clientId: number) => void;
}) {
  return (
    <div className="grid gap-3">
      <FormField
        control={form.control}
        name="client_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client</FormLabel>
            <Select
              value={field.value ? String(field.value) : undefined}
              onValueChange={(value) => onClientChange(Number(value))}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem
                    key={client.id}
                    value={String(client.id)}
                  >
                    {clientLabel(client)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-3">
        <ClientField form={form} name="client_code" label="Code client" />
        <ClientField form={form} name="client_name" label="Client" />
        <ClientField form={form} name="client_province" label="Province" />
        <ClientField form={form} name="client_address" label="Adresse" />
        <ClientField form={form} name="client_nif" label="NIF" />
        <ClientField form={form} name="client_stat" label="STAT" />
        <ClientField form={form} name="client_rcs" label="RCS" />
        <ClientField form={form} name="client_contact" label="Contact" />
        <ClientField form={form} name="client_phone" label="Téléphone" />
        <ClientField
          form={form}
          name="client_mail"
          label="E-Mail"
          className="sm:col-span-3"
        />
      </div>
    </div>
  );
}

/** Champs référence, monnaie. */
function CommercialFields({
  form,
}: {
  form: ReturnType<typeof useForm<FactureFormValues>>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="votre_reference"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Votre référence</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="monnaie"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Monnaie</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}


function ArticlesSection({
  form,
  articles,
  fields,
  append,
  remove,
  onArticleChange,
  tvaActive,
}: {
  form: ReturnType<typeof useForm<FactureFormValues>>;
  articles: Article[];
  fields: ReturnType<typeof useFieldArray<FactureFormValues, "items">>["fields"];
  append: ReturnType<typeof useFieldArray<FactureFormValues, "items">>["append"];
  remove: ReturnType<typeof useFieldArray<FactureFormValues, "items">>["remove"];
  onArticleChange: (index: number, articleId: number) => void;
  tvaActive: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">Articles</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append(emptyItem())}
          disabled={fields.length >= FACTURE_MAX_ITEMS}
        >
          <PlusIcon />
          Ajouter un article
        </Button>
      </div>

      {fields.map((field, index) => (
        <ItemFields
          key={field.id}
          index={index}
          form={form}
          articles={articles}
          canRemove={fields.length > 1}
          onRemove={() => remove(index)}
          onArticleChange={onArticleChange}
        />
      ))}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-border p-3">
        <FormField
          control={form.control}
          name="tva_active"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal">
                Appliquer la TVA au montant net (globale)
              </FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tva_rate"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormLabel className="text-sm font-normal">
                Taux TVA %
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  className="w-24"
                  disabled={!tvaActive}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}


function FactureFormBody({
  form,
  clients,
  articles,
  fields,
  append,
  remove,
  handleClientChange,
  handleArticleChange,
}: {
  form: ReturnType<typeof useForm<FactureFormValues>>;
  clients: Client[];
  articles: Article[];
  fields: ReturnType<typeof useFieldArray<FactureFormValues, "items">>["fields"];
  append: ReturnType<typeof useFieldArray<FactureFormValues, "items">>["append"];
  remove: ReturnType<typeof useFieldArray<FactureFormValues, "items">>["remove"];
  handleClientChange: (clientId: number) => void;
  handleArticleChange: (index: number, articleId: number) => void;
}) {
  const tvaActive = form.watch("tva_active");

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="facture_num"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facture N°</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de facture</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_paiement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de paiement</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <ClientSection
        form={form}
        clients={clients}
        onClientChange={handleClientChange}
      />

      <CommercialFields form={form} />

      <ArticlesSection
        form={form}
        articles={articles}
        fields={fields}
        append={append}
        remove={remove}
        onArticleChange={handleArticleChange}
        tvaActive={tvaActive}
      />

      <FormField
        control={form.control}
        name="livraison"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Livraison</FormLabel>
            <FormControl>
              <Textarea rows={3} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="paiement"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Paiement</FormLabel>
            <FormControl>
              <Textarea rows={3} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export function FactureForm({
  clients,
  articles,
  onCancel,
  onSaved,
  initialData,
}: {
  clients: Client[];
  articles: Article[];
  onCancel: () => void;
  onSaved: () => void;
  /** Données pré-remplies (provenant d'un proforma). */
  initialData?: Partial<FactureFormValues>;
}) {
  const form = useForm<FactureFormValues>({
    defaultValues: {
      facture_num: DEFAULT_FACTURE_NUM,
      date: toDateInputValue(new Date()),
      client_code: "",
      client_name: "",
      client_address: "",
      client_province: "",
      client_nif: "",
      client_stat: "",
      client_rcs: "",
      client_contact: "",
      client_phone: "",
      client_mail: "",
      votre_reference: "",
      monnaie: DEFAULT_CURRENCY,
      date_paiement: "",
      livraison: "",
      paiement: "",
      proforma_id: null,
      tva_active: false,
      tva_rate: DEFAULT_TVA_RATE,
      items: [emptyItem()],
      ...initialData,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const pendingPayload = useRef<FactureInput | null>(null);

  function handleClientChange(clientId: number) {
    const client = clients.find((candidate) => candidate.id === clientId);
    if (!client) return;
    form.setValue("client_id", client.id);
    form.setValue("client_code", formatClientCode(client.code_client));
    form.setValue("client_name", client.client);
    form.setValue("client_address", client.adress ?? "");
    form.setValue("client_province", client.province);
    form.setValue(
      "client_nif",
      client.nif === null ? "" : String(client.nif),
    );
    form.setValue(
      "client_stat",
      client.stat === null ? "" : String(client.stat),
    );
    form.setValue("client_rcs", client.rcs ?? "");
    form.setValue("client_contact", client.contact ?? "");
    form.setValue("client_phone", client.phone ?? "");
    form.setValue("client_mail", client.mail ?? "");
  }

  function handleArticleChange(index: number, articleId: number) {
    const article = articles.find(
      (candidate) => candidate.id === articleId,
    );
    if (!article) return;
    form.setValue(`items.${index}.article_id`, article.id);
    form.setValue(
      `items.${index}.designation`,
      article.designation ?? "",
    );
    form.setValue(`items.${index}.uom`, article.uom ?? "");
    form.setValue(`items.${index}.prix_unitaire`, article.prix_vente_ttc ?? 0);
  }

  const watchedClientId = form.watch("client_id");
  useEffect(() => {
    if (watchedClientId) handleClientChange(watchedClientId);
    // handleClientChange est stable (pas de dépendances externes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedClientId]);

 



  function validateForm(): boolean {
    const parsed = factureSchema.safeParse(form.getValues());
    if (parsed.success) return true;

    form.clearErrors();
    for (const issue of parsed.error.issues) {
      form.setError(
        issue.path.join(".") as Path<FactureFormValues>,
        {
          type: "validate",
          message: issue.message,
        },
      );
    }
    return false;
  }

  
  function buildPayload(): FactureInput | null {
    if (!validateForm()) {
      toast.error(
        "Corrigez les erreurs du formulaire avant l'aperçu.",
      );
      return null;
    }
    const parsed = factureSchema.safeParse(form.getValues());
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Formulaire invalide.");
      return null;
    }
    return parsed.data;
  }


  
  async function handlePreview() {
    const payload = buildPayload();
    if (!payload) return;

    setIsPreviewing(true);
    try {
      const response = await fetch("/api/facture/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        toast.error(body?.error ?? "Aperçu indisponible.");
        return;
      }
      const blob = await response.blob();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      pendingPayload.current = payload;
      setPreviewUrl(URL.createObjectURL(blob));
    } catch {
      toast.error("Aperçu indisponible.");
    } finally {
      setIsPreviewing(false);
    }
  }



  async function handleSave() {
    const payload = pendingPayload.current;
    if (!payload) return;

    setIsSaving(true);
    const result = await createFacture(payload);
    setIsSaving(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Facture sauvegardée.");
    onSaved();
  }

  function handleBackToForm() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    pendingPayload.current = null;
    setPreviewUrl(null);
  }

  if (previewUrl) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Aperçu de la facture</DialogTitle>
          <DialogDescription>
            {form.getValues("facture_num")} — vérifiez le rendu avant de
            sauvegarder. Le document sera figé après enregistrement.
          </DialogDescription>
        </DialogHeader>
        <object
          data={previewUrl}
          type="application/pdf"
          title="Aperçu de la facture"
          className="h-[65vh] w-full rounded-md border"
        />
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleBackToForm}
            disabled={isSaving}
          >
            Modifier
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving && <Loader2 className="animate-spin" />}
            Sauvegarder la facture
          </Button>
        </DialogFooter>
      </>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={(event) => event.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Générer une facture</DialogTitle>
          <DialogDescription>
            Les données client et article sont copiées dans le document
            : celui-ci reste figé même si la fiche source change.
          </DialogDescription>
        </DialogHeader>

        <FactureFormBody
          form={form}
          clients={clients}
          articles={articles}
          fields={fields}
          append={append}
          remove={remove}
          handleClientChange={handleClientChange}
          handleArticleChange={handleArticleChange}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPreviewing}
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handlePreview}
            disabled={isPreviewing}
          >
            {isPreviewing ? (
              <Loader2 className="animate-spin" />
            ) : (
              <FileTextIcon />
            )}
            Aperçu PDF
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
