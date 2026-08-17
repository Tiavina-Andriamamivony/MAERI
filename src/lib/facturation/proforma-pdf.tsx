import React from "react";
import {
  Document,
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
import { formatAmount, formatDate, formatPercent, formatQuantity } from "./format";
import { BANK, COMPANY, LEGAL_NOTICE, TABLE_ROW_COUNT } from "./pdf-assets";
import { lineTotals, proformaTotals } from "./totals";

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
    height: 18,
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
    marginTop: 24,
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

/** Lignes « ***… » d'un champ multi-lignes (max loading, pressure). */
function bulletLines(text: string | null): string[] {
  return (text ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `***${line}`);
}

/** Lignes de désignation d'un article, au format du template. */
function designationLines(item: ProformaItemInput): string[] {
  const lines = [item.designation];
  if (item.max_loading) {
    lines.push("Max loading : ", ...bulletLines(item.max_loading));
  }
  if (item.pressure) {
    lines.push("Pressure : ", ...bulletLines(item.pressure));
  }
  if (item.dimension) {
    lines.push(`Dimension : ${item.dimension}`);
  }
  return lines;
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
  const tvaCell = tvaActive ? formatAmount(totals.net * (tvaRate / 100)) : "–";

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

export function ProformaDocument({ proforma }: { proforma: ProformaInput }) {
  const totals = proformaTotals(
    proforma.items,
    proforma.tva_active,
    proforma.tva_rate,
  );

  // Le template réserve exactement TABLE_ROW_COUNT lignes : les lignes vides
  // gardent la hauteur du tableau (et donc la position du bloc des totaux).
  const rows: (ProformaItemInput | null)[] = [
    ...proforma.items,
    ...Array.from({ length: Math.max(0, TABLE_ROW_COUNT - proforma.items.length) }, () => null),
  ];

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

        <View style={styles.partyRow}>
          <View style={styles.companyBlock}>
            {COMPANY.addressLines.map((line) => (
              <Text key={line}>{line}</Text>
            ))}
          </View>
          <View style={styles.clientBlock}>
            <Text style={{ fontWeight: "bold" }}>{proforma.client_name}</Text>
            {proforma.client_address ? (
              <Text>{proforma.client_address}</Text>
            ) : null}
            <Text>{proforma.client_province}</Text>
            <Text>{proforma.client_nif ? `NIF : ${proforma.client_nif}` : ""}</Text>
            <Text>{proforma.client_stat ? `STAT : ${proforma.client_stat}` : ""}</Text>
            <Text>{proforma.client_rcs ? `RCS : ${proforma.client_rcs}` : ""}</Text>
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

        <View style={styles.infoTable}>
          <View style={styles.infoRow}>
            <InfoCell label="Code client" />
            <InfoCell label="Votre référence" />
            <InfoCell label="Date de validité de l'offre" />
            <InfoCell label="Terme de paiement" />
            <InfoCell label="Monnaie" last />
          </View>
          <View style={styles.infoRow}>
            <InfoValueCell value={proforma.client_code} />
            <InfoValueCell value={proforma.votre_reference ?? ""} />
            <InfoValueCell value={formatDate(proforma.validite_offre)} />
            <InfoValueCell value={`${proforma.terme_paiement} jour(s)`} />
            <InfoValueCell value={proforma.monnaie} last />
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, { width: COLUMNS.designation }]}>
              Désignation
            </Text>
            <Text style={[styles.tableHeaderCell, { width: COLUMNS.quantite }]}>Qté</Text>
            <Text style={[styles.tableHeaderCell, { width: COLUMNS.uom }]}>Unité</Text>
            <Text style={[styles.tableHeaderCell, { width: COLUMNS.prix }]}>
              Prix unitaire
            </Text>
            <Text style={[styles.tableHeaderCell, { width: COLUMNS.remise }]}>
              Remise %
            </Text>
            <Text style={[styles.tableHeaderCell, { width: COLUMNS.tva }]}>TVA</Text>
            <Text style={[styles.tableHeaderCell, { width: COLUMNS.montant }]}>
              Montant net
            </Text>
          </View>
          {rows.map((item, index) =>
            item ? (
              <ItemRow
                key={index}
                item={item}
                tvaActive={proforma.tva_active}
                tvaRate={proforma.tva_rate}
              />
            ) : (
              <View key={`empty-${index}`} style={styles.emptyRow}>
                <View style={styles.emptyCell} />
                <View style={styles.emptyCell} />
                <View style={styles.emptyCell} />
                <View style={styles.emptyCell} />
                <View style={styles.emptyCell} />
                <View style={styles.emptyCell} />
                <View style={[styles.emptyCell, { borderRightWidth: 0 }]} />
              </View>
            ),
          )}
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.arreteBlock}>
            <Text>{arreteProformaLine(totals.montant_total)}</Text>
            <Text>{`Prix : Livraison à ${proforma.client_province}`}</Text>
            <Text>
              Délai de livraison : 8-9 semaines après confirmation de commande et
              paiement (le délai pourrait changer suivant des évènements
              indépendèmment de notre volonté entre autre conditions
              climatiques, congestion port, guerre, congés fournisseurs, ...)
            </Text>
            <Text>
              Condition et mode de paiement : virement bancaire (à l'ordre de
              MA-ERI CONSULTING)
            </Text>
            <Text>
              {`***75% avec la commande (MGA ${formatAmount(totals.montant_total * 0.75)})`}
            </Text>
            <Text>{`***Solde ${solde} jours date de commande`}</Text>
          </View>

          <View style={styles.totalsBlock}>
            <View style={styles.totalsLine}>
              <Text>Sous-total TTC</Text>
              <Text>{formatAmount(totals.sous_total)}</Text>
            </View>
            <View style={styles.totalsLine}>
              <Text>Remise @ {formatPercent(totals.remise_pct)}</Text>
              <Text>{formatAmount(totals.remise)}</Text>
            </View>
            <View style={styles.totalsLine}>
              <Text>Montant net TTC</Text>
              <Text>{formatAmount(totals.montant_net)}</Text>
            </View>
            <View style={styles.totalsLine}>
              <Text>Montant TVA</Text>
              <Text>{formatAmount(totals.montant_tva)}</Text>
            </View>
            <View style={styles.totalsLineTotal}>
              <Text>Montant Total TTC</Text>
              <Text>{formatAmount(totals.montant_total)}</Text>
            </View>
          </View>
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
export async function renderProformaPdf(
  proforma: ProformaInput,
): Promise<Buffer> {
  return renderToBuffer(<ProformaDocument proforma={proforma} />);
}
