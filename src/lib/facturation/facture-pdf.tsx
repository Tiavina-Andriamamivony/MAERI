import React from "react";
import {
  Document,
  Image,
  Page,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";

import type { FactureInput } from "@/lib/validations/facture";
import { arreteProformaLine } from "./amount-in-words";
import { formatDate } from "./format";
import {
  BANK,
  COMPANY,
  LEGAL_NOTICE,
  LOGO_IMAGE,
  ClientInfoBlock,
  ItemsTable,
  TotalsBlock,
  styles,
  type DocumentClient,
} from "./pdf-base";
import { computeTotals } from "./totals";

function CompanyInfoBlock() {
  return (
    <View style={styles.companyBlock}>
      {/* eslint-disable-next-line jsx-a11y/alt-text -- Image @react-pdf (PDF), no alt attr */}
      <Image src={LOGO_IMAGE} style={styles.logo} />
      <View style={styles.companyAddress}>
        {COMPANY.addressLines.map((line) => (
          <Text key={line}>{line}</Text>
        ))}
      </View>
    </View>
  );
}

function PartyBlock({ client }: { client: DocumentClient }) {
  return (
    <View style={styles.partyRow}>
      <CompanyInfoBlock />
      <ClientInfoBlock client={client} />
    </View>
  );
}

function InfoTable({ facture, clientCode }: { facture: FactureInput; clientCode: number }) {
  return (
    <View style={styles.infoTable}>
      <View style={styles.infoRow}>
        <Text style={styles.infoHeaderCell}>Code client</Text>
        <Text style={styles.infoHeaderCell}>Votre référence</Text>
        <Text style={styles.infoHeaderCell}>Date de facture</Text>
        <Text style={styles.infoHeaderCell}>Date de paiement</Text>
        <Text
          style={[styles.infoHeaderCell, { borderRightWidth: 0 }]}
        >
          Monnaie
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoValueCell}>{clientCode}</Text>
        <Text style={styles.infoValueCell}>{facture.votre_reference ?? ""}</Text>
        <Text style={styles.infoValueCell}>{formatDate(facture.date)}</Text>
        <Text style={styles.infoValueCell}>
          {formatDate(facture.date_paiement ?? null)}
        </Text>
        <Text
          style={[styles.infoValueCell, { borderRightWidth: 0 }]}
        >
          {facture.monnaie}
        </Text>
      </View>
    </View>
  );
}

function DocumentHeader({
  factureNum,
  date,
}: {
  factureNum: string;
  date: Date;
}) {
  return (
    <View style={styles.headerRow}>
      <Text style={styles.companyName}>{COMPANY.name}</Text>
      <View>
        <Text style={styles.metaLine}>
          <Text style={styles.metaLabel}>Facture N° : </Text>
          {factureNum}
        </Text>
        <Text style={styles.metaLine}>
          <Text style={styles.metaLabel}>Date : </Text>
          {formatDate(date)}
        </Text>
      </View>
    </View>
  );
}

function BottomSection({
  facture,
  totals,
}: {
  facture: FactureInput;
  totals: ReturnType<typeof computeTotals>;
}) {
  return (
    <View style={styles.bottomRow}>
      <View style={styles.arreteBlock}>
        <Text>
          {arreteProformaLine(totals.montant_total)}
        </Text>
        <Text>
          {`Livraison : ${facture.livraison || "–"}`}
        </Text>
        <Text>
          {`Paiement : ${facture.paiement || "virement bancaire (à l'ordre de MA-ERI CONSULTING)"}`}
        </Text>
      </View>
      <TotalsBlock totals={totals} />
    </View>
  );
}

export function FactureDocument({
  facture,
  client,
}: {
  facture: FactureInput;
  client: DocumentClient;
}) {
  const totals = computeTotals(
    facture.items,
    facture.tva_active,
    facture.tva_rate,
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>FACTURE</Text>
        <DocumentHeader factureNum={facture.facture_num} date={facture.date} />

        <PartyBlock client={client} />
        <InfoTable facture={facture} clientCode={client.code_client} />
        <ItemsTable
          items={facture.items}
          tvaActive={facture.tva_active}
          tvaRate={facture.tva_rate}
        />

        <BottomSection facture={facture} totals={totals} />

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

/** Renders the facture into a PDF buffer ready to be stored or served. */
export function renderFacturePdf(
  facture: FactureInput,
  client: DocumentClient,
): Promise<Buffer> {
  return renderToBuffer(<FactureDocument facture={facture} client={client} />);
}
