import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import prisma  from '@/lib/prisma'; // Votre instance Prisma Client [8, 9]

const LOG = '[clerk-webhook]';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error(`${LOG} CLERK_WEBHOOK_SECRET manquant dans les variables d'environnement`);
    return new Response('Configuration serveur invalide', { status: 500 });
  }

  // Récupérer les headers de signature Svix [10]
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error(`${LOG} headers svix manquants`, { svix_id, svix_timestamp, svix_signature });
    return new Response('Erreur : Headers Svix manquants', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Vérification de la signature avec Svix [10]
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error(`${LOG} signature invalide`, err instanceof Error ? err.message : err);
    return new Response('Erreur : Signature invalide', err instanceof Error ? { status: 400, statusText: err.message } : { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`${LOG} reçu`, { eventType, clerkId: id });

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;
    const name = `${first_name} ${last_name}`;

    try {
      // Utilisation de upsert pour créer ou mettre à jour l'utilisateur [11, 12]
      const user = await prisma.user.upsert({
        where: { clerkId: id },
        update: { email, name },
        create: {
          clerkId: id as string,
          email,
          name,
        },
      });
      console.log(`${LOG} utilisateur synchronisé`, { eventType, dbId: user.id, clerkId: id, email });
    } catch (err) {
      console.error(`${LOG} échec sync prisma`, { clerkId: id, error: err instanceof Error ? err.message : err });
      return new Response('Erreur : synchronisation base de données', { status: 500 });
    }
  } else {
    console.log(`${LOG} event ignoré`, { eventType });
  }

  return new Response('Webhook reçu', { status: 200 });
}
