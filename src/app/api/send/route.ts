import { z } from "zod";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { EmailTemplate } from "@/components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

const QuoteSchema = z.object({
  name: z.string().min(1, "Nom requis").max(120),
  company: z.string().max(120).optional().default(""),
  contact: z.string().min(3, "Contact requis").max(200),
  location: z.string().max(120).optional().default(""),
  services: z.array(z.string().max(80)).max(20).default([]),
  message: z.string().min(1, "Message requis").max(5000),
});

// Once the production sender domain is verified in Resend, replace these:
//   from:    'MA-ERI Website <contact@maeri.mg>'
//   to:      ['contact-maeri@telma.net']
//   cc:      ['maeri.consulting.2024@gmail.com']
const FROM = "MA-ERI Website <onboarding@resend.dev>";
const TO = ["maeri.consulting.2024@gmail.com"];

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = QuoteSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { name, company, services, contact, location, message } = parsed.data;

  const { data, error } = await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `Nouvelle demande de devis : ${name}`,
    react: EmailTemplate({ name, company, services, contact, location, message }),
  });

  if (error) {
    console.error("Resend API error", error);
    return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
  }

  return NextResponse.json(data);
}
