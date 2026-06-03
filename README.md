# MA-ERI Consulting — Site vitrine

Site officiel de **MA-ERI Consulting**, startup malgache basée à Toamasina.
Vitrine publique des quatre pôles : approvisionnement industriel, matières
premières, formation professionnelle et conseil informatique.

Production : <https://maeri.vercel.app>

## Stack

- **Next.js 15** App Router · React 19 · TypeScript strict
- **Tailwind CSS v4** (sans `tailwind.config.*` — tokens dans `src/app/globals.css`)
- **shadcn/ui** (style `new-york`, base `stone`, RSC activé)
- **next-themes** (mode clair / sombre)
- **next-international** (en/fr, en cours)
- **react-hook-form** + **zod** pour les formulaires
- **Resend** + **@react-email/components** pour l'email transactionnel
- **framer-motion / motion** pour les animations
- **pnpm** comme gestionnaire de paquets

## Démarrage

Prérequis : Node ≥ 18, **pnpm** installé.

```bash
pnpm install
pnpm dev          # http://localhost:3000 (Turbopack)
pnpm build        # build de production
pnpm start        # exécuter le build
pnpm lint         # ESLint flat config (next/core-web-vitals + next/typescript)
```

Il n'y a pas de runner de tests configuré pour l'instant.

### Variables d'environnement

```bash
# .env (non versionné)
RESEND_API_KEY=...        # requis pour /api/send
```

## Structure rapide

```
src/
  app/                  # App Router — pages marketing + /api/send
  components/
    anotherNav.tsx      # navigation principale (montée dans layout)
    brand/              # vocabulaire éditorial (PageHero, Kicker, FeatureGrid…)
    ui/                 # primitives shadcn
    magicui/            # composants animés (grid, marquee, scroll-progress…)
    email-template.tsx  # template React Email
locales/                # dictionnaires next-international (en/fr)
public/                 # logos + assets statiques
```

## Pour les nouveaux développeurs

Lire **[onboarding.md](./onboarding.md)** avant la première contribution :
conventions de code, vocabulaire de composants `brand/*`, tokens de couleur,
workflow de commits, FAQ.

Le fichier **[CLAUDE.md](./CLAUDE.md)** documente la même chose à destination
des assistants IA — il reste utile comme référence rapide.

## Licence

MIT — voir `LICENSE.txt`.
