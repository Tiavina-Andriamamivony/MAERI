import { readFileSync } from "node:fs";
import path from "node:path";

import React from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

import { formatAmount, formatDate, formatPercent, formatQuantity } from "./format";
import { lineTotals, computeTotals } from "./totals";
import { BANK, COMPANY, DEFAULT_CIF } from "./pdf-assets";

export const LOGO_IMAGE = readFileSync(
  path.join(process.cwd(), "public", "MA-ERI.png"),
);
export const SIGNATURE_IMAGE = readFileSync(
  path.join(process.cwd(), "public", "maeri_signature.png"),
);

export const PAGE_MARGIN = 32;

/** Largeurs des colonnes du tableau (somme = largeur utile de la page). */
export const COLUMNS = {
  designation: 233,
  quantite: 38,
  uom: 42,
  prix: 70,
  remise: 40,
  tva: 34,
  montant: 72,
} as const;

type LineItem = {
  designation: string;
  uom: string | null;
  quantite: number;
  prix_unitaire: number;
  remise_pct: number;
};

/** Données client minimales pour le rendu PDF (provenant du modèle Prisma Client). */
export type DocumentClient = {
  code_client: number;
  client: string;
  adress?: string | null;
  province: string;
  nif?: number | null;
  stat?: number | null;
  rcs?: string | null;
  contact?: string | null;
  phone?: string | null;
  mail?: string | null;
};

export const styles = StyleSheet.create({
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
    // Étire les deux encadrés (MA-ERI et client) à la même hauteur.
    marginBottom: 12,
  },
  companyBlock: {
    width: 250,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#999999",
    padding: 6,
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
    textAlign: "left",
    fontSize: 8.5,
    lineHeight: 1.35,
    borderWidth: 1,
    borderColor: "#999999",
    padding: 6,
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
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 18,
  },
  arreteBlock: {
    width: 290,
    fontSize: 8,
    lineHeight: 1.5,
    // Aligne la première ligne du texte avec la première ligne des totaux,
    // qui commence sous la signature (hauteur 59 + marge 4).
    marginTop: 63,
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
    textAlign: "center",
  },
  legal: {
    marginTop: 6,
  },
});

export function ItemRow({
  item,
  tvaActive,
  tvaRate,
}: {
  item: LineItem;
  tvaActive: boolean;
  tvaRate: number;
}) {
  const totals = lineTotals(item);
  const tvaCell = tvaActive
    ? formatAmount(totals.net * (tvaRate / 100))
    : "–";

  return (
    <View style={styles.itemRow}>
      <View style={[styles.itemCell, { width: COLUMNS.designation }]}>
        <Text>{item.designation}</Text>
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
      <Text
        style={[
          styles.itemCell,
          { width: COLUMNS.montant, borderRightWidth: 0 },
        ]}
      >
        {formatAmount(totals.net)}
      </Text>
    </View>
  );
}

/** Items table header row. */
export function ItemsTableHeader() {
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
        style={[
          styles.tableHeaderCell,
          { width: COLUMNS.montant, borderRightWidth: 0 },
        ]}
      >
        Montant net
      </Text>
    </View>
  );
}

export function ItemsTable({
  items,
  tvaActive,
  tvaRate,
}: {
  items: LineItem[];
  tvaActive: boolean;
  tvaRate: number;
}) {
  return (
    <View style={styles.table}>
      <ItemsTableHeader />
      {items.map((item) => (
        <ItemRow
          key={`item-${item.designation}`}
          item={item}
          tvaActive={tvaActive}
          tvaRate={tvaRate}
        />
      ))}
    </View>
  );
}

/** Single totals line (label + formatted amount). */
export function TotalsLine({
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

/** Totals block with signature and all summary lines. */
export function TotalsBlock({
  totals,
}: {
  totals: ReturnType<typeof computeTotals>;
}) {
  return (
    <View style={styles.totalsBlock}>
      {/* eslint-disable-next-line jsx-a11y/alt-text -- Image @react-pdf (PDF), no alt attr */}
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

/** Bloc d'informations client, partagé entre proforma et facture. */
export function ClientInfoBlock({ client }: { client: DocumentClient }) {
  return (
    <View style={styles.clientBlock}>
      <Text style={{ fontWeight: "bold" }}>{client.client}</Text>
      {client.adress ? <Text>{client.adress}</Text> : null}
      <Text>{client.province}</Text>
      <Text>{client.nif ? `NIF : ${client.nif}` : ""}</Text>
      <Text>{client.stat ? `STAT : ${client.stat}` : ""}</Text>
      <Text>{client.rcs ? `RCS : ${client.rcs}` : ""}</Text>
      {client.contact || client.phone ? (
        <Text>{`ATTN: ${client.contact ?? ""} / ${client.phone ?? ""}`}</Text>
      ) : null}
      {client.mail ? <Text>{`E-Mail: ${client.mail}`}</Text> : null}
    </View>
  );
}

/** Bloc MA-ERI (logo + coordonnées), encadré à gauche de l'entête. */
export function CompanyInfoBlock({ cif }: { cif: string }) {
  return (
    <View style={styles.companyBlock}>
      {/* eslint-disable-next-line jsx-a11y/alt-text -- Image @react-pdf (PDF), no alt attr */}
      <Image src={LOGO_IMAGE} style={styles.logo} />
      <View style={styles.companyAddress}>
        {COMPANY.addressLines.map((line) => (
          <Text key={line}>{line}</Text>
        ))}
        <Text>{`CIF:${cif || DEFAULT_CIF}`}</Text>
      </View>
    </View>
  );
}

/** En-tête du document : nom MA-ERI à gauche, numéro et date à droite. */
export function DocumentHeader({
  label,
  docNum,
  date,
}: {
  label: string;
  docNum: string;
  date: Date;
}) {
  return (
    <View style={styles.headerRow}>
      <Text style={styles.companyName}>{COMPANY.name}</Text>
      <View>
        <Text style={styles.metaLine}>
          <Text style={styles.metaLabel}>{label} : </Text>
          {docNum}
        </Text>
        <Text style={styles.metaLine}>
          <Text style={styles.metaLabel}>Date : </Text>
          {formatDate(date)}
        </Text>
      </View>
    </View>
  );
}

/** Footer : coordonnées bancaires centrées, contenu additionnel optionnel. */
export function DocumentFooter({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.footer}>
      <Text>{BANK.title}</Text>
      <Text>{BANK.address}</Text>
      <Text>{BANK.rib}</Text>
      {children}
    </View>
  );
}
