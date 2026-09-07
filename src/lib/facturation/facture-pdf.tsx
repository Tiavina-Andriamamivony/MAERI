import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";

import { formatClientCode } from "@/lib/analyse/codes";
import type { FactureInput } from "@/lib/validations/facture";
import { arreteProformaLine } from "./amount-in-words";
import { formatDate } from "./format";
import {
  ClientInfoBlock,
  CompanyInfoBlock,
  DocumentFooter,
  DocumentHeader,
  ItemsTable,
  TotalsBlock,
  styles,
  type DocumentClient,
} from "./pdf-base";
import { computeTotals } from "./totals";

function PartyBlock({ facture, client }: { facture: FactureInput; client: DocumentClient }) {
  return (
    <View style={styles.partyRow}>
      <CompanyInfoBlock cif={facture.cif} />
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
        <Text style={styles.infoValueCell}>{formatClientCode(clientCode)}</Text>
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
          {`Paiement : ${facture.paiement || "–"}`}
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
        <DocumentHeader label="Facture N°" docNum={facture.facture_num} date={facture.date} />

        <PartyBlock facture={facture} client={client} />
        <InfoTable facture={facture} clientCode={client.code_client} />
        <ItemsTable
          items={facture.items}
          tvaActive={facture.tva_active}
          tvaRate={facture.tva_rate}
        />

        <BottomSection facture={facture} totals={totals} />

        <DocumentFooter />
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
