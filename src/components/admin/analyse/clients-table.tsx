import type { Client } from "@/app/generated/prisma/client";
import {
  createClient,
  deleteClient,
  updateClient,
} from "@/app/actions/clientActions";

import DataTable from "./data-table";
import { CLIENT_COLUMNS } from "./columns";

export default function ClientsTable({ clients }: { clients: Client[] }) {
  return (
    <DataTable
      columns={CLIENT_COLUMNS}
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
