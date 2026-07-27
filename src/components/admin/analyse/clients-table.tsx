import type { Client } from "@/app/generated/prisma/client";
import {
  createClient,
  deleteClient,
  updateClient,
} from "@/app/actions/clientActions";

import DataTable from "./data-table";
import ClientsProvinceChart from "./clients-province-chart";
import { CLIENT_COLUMNS } from "./columns";

export default function ClientsTable({ clients }: { clients: Client[] }) {
  return (
    <div className="flex flex-col gap-6">
      <ClientsProvinceChart clients={clients} />
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
    </div>
  );
}
