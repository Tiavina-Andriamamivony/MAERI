import prisma from "@/lib/prisma";
import type { SheetImporter } from "../importSheet";
import { toInteger, toOptionalText, toText } from "../converters";

type ClientField =
  | "code_client" | "client" | "adress" | "province" | "nif"
  | "stat" | "rcs" | "cf" | "contact" | "phone" | "mail";

const HEADER_TO_FIELD: Record<string, ClientField> = {
  "CODE CLIENT": "code_client",
  CLIENT: "client",
  ADRESSE: "adress",
  PROVINCE: "province",
  NIF: "nif",
  STAT: "stat",
  RCS: "rcs",
  CF: "cf",
  CONTACT: "contact",
  PHONE: "phone",
  TELEPHONE: "phone",
  MAIL: "mail",
  EMAIL: "mail",
};

type ClientData = {
  code_client: number;
  client: string;
  province: string;
  nif: number | null;
  stat: number | null;
  adress: string | null;
  rcs: string | null;
  cf: string | null;
  contact: string | null;
  phone: string | null;
  mail: string | null;
};

export const clientImporter: SheetImporter<ClientField, ClientData> = {
  headerToField: HEADER_TO_FIELD,

  parseRow(fields) {
    const code_client = toInteger(fields.code_client);
    if (code_client === null) {
      return { valid: false, error: "code_client manquant ou invalide" };
    }
    return {
      valid: true,
      key: code_client,
      keyLabel: `code_client ${code_client}`,
      data: {
        code_client,
        client: toText(fields.client),
        province: toText(fields.province),
        nif: toInteger(fields.nif),
        stat: toInteger(fields.stat),
        adress: toOptionalText(fields.adress),
        rcs: toOptionalText(fields.rcs),
        cf: toOptionalText(fields.cf),
        contact: toOptionalText(fields.contact),
        phone: toOptionalText(fields.phone),
        mail: toOptionalText(fields.mail),
      },
    };
  },

  async loadExistingKeys() {
    const clients = await prisma.client.findMany({ select: { code_client: true } });
    return new Set(clients.map((client) => client.code_client));
  },

  async save(_key, data) {
    await prisma.client.upsert({
      where: { code_client: data.code_client },
      update: data,
      create: data,
    });
  },
};
