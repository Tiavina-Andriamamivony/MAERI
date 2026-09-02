import React from "react";
import {
  Document,
  Image,
  Page,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";

import type { ProformaInput } from "@/lib/validations/proforma";
import { arreteProformaLine } from "./amount-in-words";
import { formatDate } from "./format";
import {
  BANK,
  COMPANY,
  DEFAULT_CIF,
  LEGAL_NOTICE,
  LOGO_IMAGE,
  ClientInfoBlock,
  ItemsTable,
  TotalsBlock,
  styles,
  type DocumentClient,
} from "./pdf-base";
import { computeTotals } from "./totals";

function CompanyInfoBlock({ cif }: { cif: string }) {
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
        <Text style={styles.infoValueCell}>{clientCode}</Text>
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

function DocumentHeader({
  pfNum,
  date,
}: {
  pfNum: string;
  date: Date;
}) {
  return (
    <View style={styles.headerRow}>
      <Text style={styles.companyName}>{COMPANY.name}</Text>
      <View>
        <Text style={styles.metaLine}>
          <Text style={styles.metaLabel}>PF N° : </Text>
          {pfNum}
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
  proforma,
  client,
  totals,
}: {
  proforma: ProformaInput;
  client: DocumentClient;
  totals: ReturnType<typeof computeTotals>;
}) {
  return (
    <View style={styles.bottomRow}>
      <View style={styles.arreteBlock}>
        <Text>
          {arreteProformaLine(totals.montant_total)}
        </Text>
        <Text>
          {`Prix : Livraison à ${client.province}`}
        </Text>
        <Text>
          {`Délai de livraison : ${proforma.delai_livraison || "8-9 semaines après confirmation de commande et paiement"}`}
        </Text>
        <Text>
          {`Condition et mode de paiement : ${proforma.conditions_paiement || "virement bancaire (à l'ordre de MA-ERI CONSULTING)"}`}
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
        <DocumentHeader pfNum={proforma.pf_num} date={proforma.date} />

        <PartyBlock proforma={proforma} client={client} />
        <InfoTable proforma={proforma} clientCode={client.code_client} />
        <ItemsTable
          items={proforma.items}
          tvaActive={proforma.tva_active}
          tvaRate={proforma.tva_rate}
        />

        <BottomSection proforma={proforma} client={client} totals={totals} />

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

/** Renders the proforma into a PDF buffer ready to be stored or served. */
export function renderProformaPdf(
  proforma: ProformaInput,
  client: DocumentClient,
): Promise<Buffer> {
  return renderToBuffer(<ProformaDocument proforma={proforma} client={client} />);
}
