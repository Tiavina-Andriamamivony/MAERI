import type { Client } from "@/app/generated/prisma/client";
import {
  createClient,
  deleteClient,
  updateClient,
} from "@/app/actions/clientActions";

import DataTable, { type Column } from "./data-table";

const COLUMNS: Column<Client>[] = [
  { key: "code_client", label: "Code client", readOnly: true },
  { key: "client", label: "Client" },
  { key: "adress", label: "Adresse" },
  { key: "province", label: "Province" },
  { key: "nif", label: "NIF", type: "number" },
  { key: "stat", label: "STAT", type: "number" },
  { key: "rcs", label: "RCS" },
  { key: "cf", label: "CF" },
  { key: "contact", label: "Contact" },
  { key: "phone", label: "Téléphone" },
  { key: "mail", label: "Mail" },
];

export default function ClientsTable({ clients }: { clients: Client[] }) {
  return (
    <DataTable
      columns={COLUMNS}
      rows={clients}
      emptyMessage="Aucun client importé pour le moment."
      actions={{
        update: updateClient,
        create: createClient,
        delete: deleteClient,
        labelKey: "client",
      }}
    />
  );
}
