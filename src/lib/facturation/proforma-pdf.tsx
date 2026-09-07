import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";

import { formatClientCode } from "@/lib/analyse/codes";
import type { ProformaInput } from "@/lib/validations/proforma";
import { arreteProformaLine } from "./amount-in-words";
import { formatDate } from "./format";
import { LEGAL_NOTICE } from "./pdf-assets";
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

function PartyBlock({ proforma, client }: { proforma: ProformaInput; client: DocumentClient }) {
  return (
    <View style={styles.partyRow}>
      <CompanyInfoBlock cif={proforma.cif} />
      <ClientInfoBlock client={client} />
    </View>
  );
}

function InfoTable({ proforma, clientCode }: { proforma: ProformaInput; clientCode: number }) {
  return (
    <View style={styles.infoTable}>
      <View style={styles.infoRow}>
        <Text style={styles.infoHeaderCell}>Code client</Text>
        <Text style={styles.infoHeaderCell}>Votre référence</Text>
        <Text style={styles.infoHeaderCell}>Date de validité de l{"\u2019"}offre</Text>
        <Text style={styles.infoHeaderCell}>Terme de paiement</Text>
        <Text
          style={[styles.infoHeaderCell, { borderRightWidth: 0 }]}
        >
          Monnaie
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoValueCell}>{formatClientCode(clientCode)}</Text>
        <Text style={styles.infoValueCell}>{proforma.votre_reference ?? ""}</Text>
        <Text style={styles.infoValueCell}>
          {formatDate(proforma.validite_offre ?? null)}
        </Text>
        <Text style={styles.infoValueCell}>
          {`${proforma.terme_paiement} jour(s)`}
        </Text>
        <Text
          style={[styles.infoValueCell, { borderRightWidth: 0 }]}
        >
          {proforma.monnaie}
        </Text>
      </View>
    </View>
  );
}

function BottomSection({
  proforma,
  totals,
}: {
  proforma: ProformaInput;
  totals: ReturnType<typeof computeTotals>;
}) {
  return (
    <View style={styles.bottomRow}>
      <View style={styles.arreteBlock}>
        <Text>
          {arreteProformaLine(totals.montant_total)}
        </Text>
        <Text>
          {`Prix : Livraison à ${proforma.livraison_a || "–"}`}
        </Text>
        <Text>
          {`Délai de livraison : ${proforma.delai_livraison || "–"}`}
        </Text>
        <Text>
          {`Condition et mode de paiement : ${proforma.conditions_paiement || "–"}`}
        </Text>
      </View>
      <TotalsBlock totals={totals} />
    </View>
  );
}

export function ProformaDocument({
  proforma,
  client,
}: {
  proforma: ProformaInput;
  client: DocumentClient;
}) {
  const totals = computeTotals(
    proforma.items,
    proforma.tva_active,
    proforma.tva_rate,
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>PROFORMA</Text>
        <DocumentHeader label="PF N°" docNum={proforma.pf_num} date={proforma.date} />

        <PartyBlock proforma={proforma} client={client} />
        <InfoTable proforma={proforma} clientCode={client.code_client} />
        <ItemsTable
          items={proforma.items}
          tvaActive={proforma.tva_active}
          tvaRate={proforma.tva_rate}
        />

        <BottomSection proforma={proforma} totals={totals} />

        <DocumentFooter>
          {proforma.clause_propriete_active && (
            <Text style={styles.legal}>{LEGAL_NOTICE}</Text>
          )}
        </DocumentFooter>
      </Page>
    </Document>
  );
}

/** Renders the proforma into a PDF buffer ready to be stored or served. */
export function renderProformaPdf(
  proforma: ProformaInput,
  client: DocumentClient,
): Promise<Buffer> {
  return renderToBuffer(<ProformaDocument proforma={proforma} client={client} />);
}
