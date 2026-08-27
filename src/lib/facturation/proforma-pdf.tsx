import { readFileSync } from "node:fs";
import path from "node:path";

import React from "react";
import {
  Document,
  Image,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

import type {
  ProformaInput,
  ProformaItemInput,
} from "@/lib/validations/proforma";
import { arreteProformaLine } from "./amount-in-words";
import {
  formatAmount,
  formatDate,
  formatPercent,
  formatQuantity,
} from "./format";
import { BANK, COMPANY, LEGAL_NOTICE, TABLE_ROW_COUNT } from "./pdf-assets";
import { DEFAULT_CIF } from "./pdf-assets";
import { lineTotals, proformaTotals } from "./totals";

/**
 * Logo et signature, lus depuis `public/` (comme le template Excel).
 * `proforma-pdf.tsx` n'est importé que côté serveur (route API et server
 * action), le chargement via `fs` y est donc sûr.
 */
const LOGO_IMAGE = readFileSync(
  path.join(process.cwd(), "public", "MA-ERI.png"),
);
const SIGNATURE_IMAGE = readFileSync(
  path.join(process.cwd(), "public", "maeri signature.png"),
);

/**
 * Rendu PDF de la facture proforma, fidèle au template Excel
 * (`public/2026 template.xlsx`, feuille « proforma ») : mêmes blocs, mêmes
 * libellés, mêmes positions. Le tableau réserve exactement `TABLE_ROW_COUNT`
 * lignes pour que le bloc des totaux reste à position fixe.
 */

const PAGE_MARGIN = 32;

const COLUMNS = {
  designation: 238,
  quantite: 38,
  uom: 42,
  prix: 66,
  remise: 40,
  tva: 36,
  montant: 72,
} as const;

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: PAGE_MARGIN,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#1a1a1a",
  },
  title: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  companyName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  metaLine: {
    textAlign: "right",
    fontSize: 9.5,
    marginBottom: 2,
  },
  metaLabel: {
    fontWeight: "bold",
  },
  partyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  companyBlock: {
    width: 250,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  logo: {
    width: 96,
    height: 96,
    marginRight: 8,
  },
  companyAddress: {
    flex: 1,
    fontSize: 8.5,
    lineHeight: 1.35,
  },
  clientBlock: {
    width: 250,
    textAlign: "right",
    fontSize: 8.5,
    lineHeight: 1.35,
  },
  infoTable: {
    borderWidth: 1,
    borderColor: "#999999",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
  },
  infoHeaderCell: {
    flex: 1,
    padding: 4,
    fontWeight: "bold",
    fontSize: 8,
    backgroundColor: "#e8e8e8",
    borderRightWidth: 1,
    borderRightColor: "#999999",
    borderBottomWidth: 1,
    borderBottomColor: "#999999",
  },
  infoValueCell: {
    flex: 1,
    padding: 4,
    fontSize: 8.5,
    borderRightWidth: 1,
    borderRightColor: "#999999",
  },
  table: {
    borderWidth: 1,
    borderColor: "#999999",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#e8e8e8",
  },
  tableHeaderCell: {
    padding: 4,
    fontWeight: "bold",
    fontSize: 8,
    borderRightWidth: 1,
    borderRightColor: "#999999",
    borderBottomWidth: 1,
    borderBottomColor: "#999999",
  },
  itemRow: {
    flexDirection: "row",
  },
  itemCell: {
    padding: 4,
    fontSize: 8,
    borderRightWidth: 1,
    borderRightColor: "#999999",
    borderBottomWidth: 1,
    borderBottomColor: "#999999",
  },
  emptyRow: {
    height: 15,
    flexDirection: "row",
  },
  emptyCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#999999",
    borderBottomWidth: 1,
    borderBottomColor: "#999999",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 10,
  },
  arreteBlock: {
    width: 290,
    fontSize: 8,
    lineHeight: 1.5,
  },
  totalsBlock: {
    width: 230,
  },
  signature: {
    width: 141,
    height: 59,
    alignSelf: "flex-end",
    marginBottom: 4,
  },
  totalsLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    fontSize: 8.5,
  },
  totalsLineTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    fontWeight: "bold",
    fontSize: 9.5,
    backgroundColor: "#e8e8e8",
    borderWidth: 1,
    borderColor: "#999999",
    marginTop: 2,
  },
  footer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#999999",
    paddingTop: 8,
    fontSize: 8,
    lineHeight: 1.5,
  },
  legal: {
    marginTop: 6,
  },
});

/** Lignes de désignation d'un article : la désignation inclut déjà les specs. */
function designationLines(item: ProformaItemInput): string[] {
  return [item.designation];
}

function InfoCell({
  label,
  last,
}: {
  label: string;
  last?: boolean;
}) {
  const cellStyle = last
    ? [styles.infoHeaderCell, { borderRightWidth: 0 }]
    : styles.infoHeaderCell;
  return <Text style={cellStyle}>{label}</Text>;
}

function InfoValueCell({
  value,
  last,
}: {
  value: string;
  last?: boolean;
}) {
  const cellStyle = last
    ? [styles.infoValueCell, { borderRightWidth: 0 }]
    : styles.infoValueCell;
  return <Text style={cellStyle}>{value}</Text>;
}

function ItemRow({
  item,
  tvaActive,
  tvaRate,
}: {
  item: ProformaItemInput;
  tvaActive: boolean;
  tvaRate: number;
}) {
  const totals = lineTotals(item);
  // TVA globale sur le montant net : la colonne détaille la part de chaque
  // ligne, dont la somme est exactement le « Montant TVA » des totaux.
  const tvaCell = tvaActive
    ? formatAmount(totals.net * (tvaRate / 100))
    : "–";

  return (
    <View style={styles.itemRow}>
      <View style={[styles.itemCell, { width: COLUMNS.designation }]}>
        {designationLines(item).map((line) => (
          <Text key={line}>{line}</Text>
        ))}
      </View>
      <Text style={[styles.itemCell, { width: COLUMNS.quantite }]}>
        {formatQuantity(item.quantite)}
      </Text>
      <Text style={[styles.itemCell, { width: COLUMNS.uom }]}>
        {item.uom ?? ""}
      </Text>
      <Text style={[styles.itemCell, { width: COLUMNS.prix }]}>
        {formatAmount(item.prix_unitaire)}
      </Text>
      <Text style={[styles.itemCell, { width: COLUMNS.remise }]}>
        {item.remise_pct > 0 ? formatPercent(item.remise_pct) : ""}
      </Text>
      <Text style={[styles.itemCell, { width: COLUMNS.tva }]}>{tvaCell}</Text>
      <Text style={[styles.itemCell, { width: COLUMNS.montant }]}>
        {formatAmount(totals.net)}
      </Text>
    </View>
  );
}

/** Bloc entreprise + client (logo, adresse, infos). */
function PartyBlock({ proforma }: { proforma: ProformaInput }) {
  return (
    <View style={styles.partyRow}>
      <View style={styles.companyBlock}>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- Image @react-pdf (PDF), pas d'attribut alt */}
        <Image src={LOGO_IMAGE} style={styles.logo} />
        <View style={styles.companyAddress}>
          {COMPANY.addressLines.map((line) => (
            <Text key={line}>{line}</Text>
          ))}
          <Text>{`CIF:${proforma.cif || DEFAULT_CIF}`}</Text>
        </View>
      </View>
      <View style={styles.clientBlock}>
        <Text style={{ fontWeight: "bold" }}>{proforma.client_name}</Text>
        {proforma.client_address ? (
          <Text>{proforma.client_address}</Text>
        ) : null}
        <Text>{proforma.client_province}</Text>
        <Text>
          {proforma.client_nif ? `NIF : ${proforma.client_nif}` : ""}
        </Text>
        <Text>
          {proforma.client_stat ? `STAT : ${proforma.client_stat}` : ""}
        </Text>
        <Text>
          {proforma.client_rcs ? `RCS : ${proforma.client_rcs}` : ""}
        </Text>
        {proforma.client_contact || proforma.client_phone ? (
          <Text>
            {`ATTN: ${proforma.client_contact ?? ""} / ${proforma.client_phone ?? ""}`}
          </Text>
        ) : null}
        {proforma.client_mail ? (
          <Text>{`E-Mail: ${proforma.client_mail}`}</Text>
        ) : null}
      </View>
    </View>
  );
}

/** Tableau des informations complémentaires (code client, référence, etc.). */
function InfoTable({ proforma }: { proforma: ProformaInput }) {
  return (
    <View style={styles.infoTable}>
      <View style={styles.infoRow}>
        <InfoCell label="Code client" />
        <InfoCell label="Votre référence" />
        <InfoCell label={"Date de validité de l\u2019offre"} />
        <InfoCell label="Terme de paiement" />
        <InfoCell label="Monnaie" last />
      </View>
      <View style={styles.infoRow}>
        <InfoValueCell value={proforma.client_code} />
        <InfoValueCell value={proforma.votre_reference ?? ""} />
        <InfoValueCell
          value={formatDate(proforma.validite_offre ?? null)}
        />
        <InfoValueCell
          value={`${proforma.terme_paiement} jour(s)`}
        />
        <InfoValueCell value={proforma.monnaie} last />
      </View>
    </View>
  );
}

/** En-tête du tableau des articles. */
function ItemsTableHeader() {
  return (
    <View style={styles.tableHeaderRow}>
      <Text
        style={[styles.tableHeaderCell, { width: COLUMNS.designation }]}
      >
        Désignation
      </Text>
      <Text
        style={[styles.tableHeaderCell, { width: COLUMNS.quantite }]}
      >
        Qté
      </Text>
      <Text style={[styles.tableHeaderCell, { width: COLUMNS.uom }]}>
        Unité
      </Text>
      <Text style={[styles.tableHeaderCell, { width: COLUMNS.prix }]}>
        Prix unitaire
      </Text>
      <Text
        style={[styles.tableHeaderCell, { width: COLUMNS.remise }]}
      >
        Remise %
      </Text>
      <Text style={[styles.tableHeaderCell, { width: COLUMNS.tva }]}>
        TVA
      </Text>
      <Text
        style={[styles.tableHeaderCell, { width: COLUMNS.montant }]}
      >
        Montant net
      </Text>
    </View>
  );
}

/** Ligne vide de remplissage (conserve la hauteur du tableau). */
function EmptyItemRow({ index }: { index: number }) {
  return (
    <View key={`empty-${index}`} style={styles.emptyRow}>
      <View style={styles.emptyCell} />
      <View style={styles.emptyCell} />
      <View style={styles.emptyCell} />
      <View style={styles.emptyCell} />
      <View style={styles.emptyCell} />
      <View style={styles.emptyCell} />
      <View style={[styles.emptyCell, { borderRightWidth: 0 }]} />
    </View>
  );
}

/** Tableau des lignes d'articles. */
function ItemsTable({
  items,
  tvaActive,
  tvaRate,
}: {
  items: ProformaItemInput[];
  tvaActive: boolean;
  tvaRate: number;
}) {
  const rows: (ProformaItemInput | null)[] = [
    ...items,
    ...Array.from(
      {
        length: Math.max(0, TABLE_ROW_COUNT - items.length),
      },
      () => null,
    ),
  ];

  return (
    <View style={styles.table}>
      <ItemsTableHeader />
      {rows.map((item, index) =>
        item ? (
          <ItemRow
            key={`item-${item.article_id ?? item.designation}`}
            item={item}
            tvaActive={tvaActive}
            tvaRate={tvaRate}
          />
        ) : (
          <EmptyItemRow key={`empty-${index}`} index={index} />
        ),
      )}
    </View>
  );
}

/** Bloc des totaux (sous-total, remise, TVA, total). */
function TotalsBlock({
  totals,
}: {
  totals: ReturnType<typeof proformaTotals>;
}) {
  return (
    <View style={styles.totalsBlock}>
      {/* eslint-disable-next-line jsx-a11y/alt-text -- Image @react-pdf (PDF), pas d'attribut alt */}
      <Image src={SIGNATURE_IMAGE} style={styles.signature} />
      <TotalsLine label="Sous-total TTC" value={totals.sous_total} />
      <TotalsLine
        label={`Remise @ ${formatPercent(totals.remise_pct)}`}
        value={totals.remise}
      />
      <TotalsLine label="Montant net TTC" value={totals.montant_net} />
      <TotalsLine label="Montant TVA" value={totals.montant_tva} />
      <View style={styles.totalsLineTotal}>
        <Text>Montant Total TTC</Text>
        <Text>{formatAmount(totals.montant_total)}</Text>
      </View>
    </View>
  );
}

function TotalsLine({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <View style={styles.totalsLine}>
      <Text>{label}</Text>
      <Text>{formatAmount(value)}</Text>
    </View>
  );
}

export function ProformaDocument({
  proforma,
}: {
  proforma: ProformaInput;
}) {
  const totals = proformaTotals(
    proforma.items,
    proforma.tva_active,
    proforma.tva_rate,
  );

  const solde = proforma.terme_paiement;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>PROFORMA</Text>

        <View style={styles.headerRow}>
          <Text style={styles.companyName}>{COMPANY.name}</Text>
          <View>
            <Text style={styles.metaLine}>
              <Text style={styles.metaLabel}>PF N° : </Text>
              {proforma.pf_num}
            </Text>
            <Text style={styles.metaLine}>
              <Text style={styles.metaLabel}>Date : </Text>
              {formatDate(proforma.date)}
            </Text>
          </View>
        </View>

        <PartyBlock proforma={proforma} />
        <InfoTable proforma={proforma} />
        <ItemsTable
          items={proforma.items}
          tvaActive={proforma.tva_active}
          tvaRate={proforma.tva_rate}
        />

        <View style={styles.bottomRow}>
          <View style={styles.arreteBlock}>
            <Text>
              {arreteProformaLine(totals.montant_total)}
            </Text>
            <Text>
              {`Prix : Livraison à ${proforma.client_province}`}
            </Text>
            <Text>
              {`Délai de livraison : ${proforma.delai_livraison || "8-9 semaines après confirmation de commande et paiement"}`}
            </Text>
            <Text>
              {`Condition et mode de paiement : ${proforma.conditions_paiement || "virement bancaire (à l'ordre de MA-ERI CONSULTING)"}`}
            </Text>
            <Text>
              {`***75% avec la commande (MGA ${formatAmount(totals.montant_total * 0.75)})`}
            </Text>
            <Text>
              {`***Solde ${solde} jours date de commande`}
            </Text>
          </View>
          <TotalsBlock totals={totals} />
        </View>

        <View style={styles.footer}>
          <Text>{BANK.title}</Text>
          <Text>{BANK.address}</Text>
          <Text>{BANK.rib}</Text>
          <Text style={styles.legal}>{LEGAL_NOTICE}</Text>
        </View>
      </Page>
    </Document>
  );
}

/** Rend le proforma en tampon PDF prêt à être stocké ou servi. */
export function renderProformaPdf(
  proforma: ProformaInput,
): Promise<Buffer> {
  return renderToBuffer(<ProformaDocument proforma={proforma} />);
}
