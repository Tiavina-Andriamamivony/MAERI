# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Guide d'onboarding humain : `onboarding.md` à la racine. Plus détaillé, mêmes
> conventions. Le présent fichier est la version condensée pour assistants IA.

## À propos de MA-ERI Consulting

MA-ERI Consulting est une **startup malgache** basée à Toamasina qui
accompagne les entreprises — de la start-up aux grands groupes — dans leur
développement. Le site (ce repo) est la vitrine publique de l'activité.
L'offre s'articule autour de quatre pôles :

- **Approvisionnement industriel** — roulements, courroies, joints, tuyaux, vannes, moteurs, pompes.
- **Approvisionnement en matières premières** et **réseau de fournisseurs** (sourcing local et international).
- **Formation professionnelle** — vente, négociation, management, recouvrement, gestion de stock, accueil client.
- **Conseil informatique et digital** — analyse de données, UI/UX, applications web, microservices.

Positionnement : « partenaire de confiance », « Matière, savoir, digital ».
Langue principale : **français** (copies de pages, slugs publics, emails).
Anglais : locale secondaire, dictionnaires `next-international` quasi vides.

Audience : dirigeants de PME et responsables achats / formation au Madagascar
et dans la région océan Indien. Ton **sobre, professionnel, crédible** — pas
de marketing agressif ni de jargon growth.

## Identité visuelle

La charte vit dans `src/app/globals.css` (tokens OKLCH + utilitaires
éditoriaux) et dans `components.json` (style shadcn). **Ne jamais coder une
couleur en dur** — toujours passer par les classes Tailwind sémantiques
(`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-primary`,
`text-brand`, `border-border`, etc.) ou par les variables CSS
(`var(--ink)`, `var(--paper)`, `var(--brand)`) pour que le mode sombre
continue de fonctionner.

### Couleurs

Le système est construit autour de **trois ancres** définies en OKLCH :

- `--paper` — fond (presque blanc en clair, presque noir en sombre)
- `--ink` — texte / inversion de `--paper`
- `--brand` — ember / copper (orange-cuivre, signature industrielle + artisanale)

Les variables shadcn (`--background`, `--foreground`, `--primary`,
`--secondary`, `--muted`, `--border`, etc.) sont dérivées de ces trois ancres
dans `:root` et `.dark`. Pour changer la teinte de marque : éditer `--brand`
(et au besoin `--brand-foreground`) aux deux endroits.

Base shadcn déclarée : `stone` (`components.json`), style `new-york`, RSC
activé.

### Typographies

Trois familles chargées dans `src/app/layout.tsx` via `next/font/google` et
exposées en variables CSS :

| Variable | Famille | Usage |
| --- | --- | --- |
| `--font-sans` | **Geist Sans** | Corps de texte, nav, UI. Police par défaut du `<body>`. |
| `--font-serif` | **Fraunces** (axes `opsz` + `SOFT`) | Titres éditoriaux. Activée par la classe `.font-display` ou `.display`. |
| `--font-mono` | **JetBrains Mono** | Kickers monospaces, `tabular-nums`, code. |

Pour un titre éditorial : `<h1 className="display font-display text-display-lg">`.

### Rayon

`--radius: 0.5rem`. Utiliser `rounded-md` / `rounded-lg` / `rounded-xl`. Pas
de valeurs pixel arbitraires.

### Utilitaires maison (déclarés en `@layer utilities` de `globals.css`)

- `.kicker` / `.kicker-brand` — étiquette monospace tracée, uppercase.
- `.font-display` / `.display` — Fraunces avec axes optiques.
- `.text-display-xl|lg|md` — tailles fluides `clamp()` pour héros et sections.
- `.bg-grain` — texture papier (radial-gradients fins).
- `.rule` — hairline éditoriale 1px à `currentColor` 15%.
- `.brand-underline` — soulignement 2px en `var(--brand)`.
- `.text-balance` / `.text-pretty`.

### Animations nommées

Définies dans `@theme inline` (`@keyframes` + `--animate-*`) :

- `animate-rise` — apparition + slide-up (héros, titres).
- `animate-fade-in` — fondu doux.
- `animate-kicker` — kicker qui slide depuis la gauche.
- `animate-marquee` — défilement horizontal (bandeau de mots-clés du hero).

Staggering via `style={{ animationDelay: "200ms" }}`.

### Mode sombre

Piloté par **next-themes** (`attribute="class"`, défaut `light`). Provider
monté dans `layout.tsx`. Le composant `ModeToggle`
(`src/components/theme-button.tsx`) utilise `useTheme()` de `next-themes` —
**ne pas** réintroduire de gestion `localStorage` maison. Chaque écran doit
être testé en clair **et** en sombre.

### Logo + nomenclature

- `public/logo.png` et `public/logo_bg.png` (variante avec fond).
- Toujours `next/image` avec `alt="MA-ERI Consulting"`.
- Écrire **MA-ERI Consulting** (tiret, majuscules, un seul espace).

## Commands

- `pnpm dev` — dev server (Next.js + **Turbopack**) sur http://localhost:3000
- `pnpm build` — build de production
- `pnpm start` — exécuter le build
- `pnpm lint` — `next lint` (ESLint flat config, `next/core-web-vitals` + `next/typescript`)

Pas de runner de tests configuré.

**Gestionnaire de paquets : pnpm.** Un seul lockfile : `pnpm-lock.yaml`. Ne
pas régénérer `package-lock.json`.

## Stack

- **Next.js 15.2** App Router · **React 19** · **TypeScript strict**
- **Tailwind CSS v4** (via `@tailwindcss/postcss`). Pas de `tailwind.config.*` — tokens dans `src/app/globals.css`.
- **shadcn/ui** (style `new-york`, base `stone`, RSC activé). Config : `components.json`. CLI : `pnpm dlx shadcn@latest add <component>` → atterrit dans `src/components/ui/`.
- **next-themes** pour le mode sombre.
- **next-international** pour l'i18n (en / fr) — squelette présent dans `locales/`, routing pas encore préfixé par locale, dictionnaires presque vides.
- **react-hook-form** + **zod** + `@hookform/resolvers` pour les formulaires.
- **Resend** + **@react-email/components** pour l'email transactionnel.
- **framer-motion / motion** pour les animations.

Path alias : `@/*` → `src/*`.

## Architecture

### Routing (`src/app/`)

App Router avec routes statiques imbriquées. Les feuilles sont majoritairement
des pages marketing :

- `/` — accueil (`page.tsx`) — `HomeHero`, `BrandSeal`, `StatBand`, manifeste, grille de pôles, méthode, CTA.
- `/services/*` — `approvisionnement`, `professional-training`, `conseil-informatique`, `raw-material-supply`, `supplier-networking`.
- `/products/*` — `construction-materials`, `industrial-pipes`, `specialized-equipment`.
- `/pricing/*` — `small-business`, `medium-business`, `large-business`.
- `/training/*` — `basic`, `advanced`, `specialized`.
- `/about/*` — `history`, `mission`, `team` (slugs anglais, mais la nav française pointe correctement dessus).
- `/contact` — formulaire de devis qui POST vers `/api/send`.
- `/api/send/route.ts` — **seul** endpoint serveur. Reçoit le formulaire, valide via **zod**, envoie un email via Resend en utilisant `EmailTemplate` (React Email).

`layout.tsx` est le layout racine. Il :

- charge **Geist Sans**, **JetBrains Mono** et **Fraunces** via `next/font/google`,
- expose `--font-sans`, `--font-mono`, `--font-serif`,
- monte `<AnotherNav />`, `<main>`, `<Footer />` et `<ThemeProvider>`,
- déclare `metadataBase` + OpenGraph pour `https://maeri.vercel.app`.

`sitemap.ts` et `robots.ts` sont statiques et hardcodent la même URL de prod
— les mettre à jour ensemble quand on ajoute ou renomme une route top-level.

### Composants

- `src/components/anotherNav.tsx` — **la** navigation principale, montée dans `layout.tsx`. Source de vérité unique pour les liens. Inclut menu desktop hover/focus et sheet mobile plein écran.
- `src/components/brand/` — **vocabulaire éditorial du site**. Re-export groupé via `index.ts`. À utiliser systématiquement plutôt que de réinventer des sections :
  - `Kicker` — étiquette de section (avec index optionnel)
  - `PageHero` — hero standard des pages internes
  - `HomeHero` — hero spécial accueil
  - `BrandSeal` — frontispice avec logo + anneaux concentriques
  - `SectionHeading` — en-tête de section
  - `FeatureGrid` — grille de cartes (2/3/4 colonnes)
  - `Steps` — méthode numérotée
  - `Checklist` — liste à pucks `Check` colorés `--brand`
  - `StatBand` — bande de gros chiffres
  - `PricingCard` — carte de tarif (avec variante `highlight`)
  - `CTABlock` — bloc d'appel à l'action plein ink
  - `Footer` — pied de page (monté dans `layout.tsx`, ne pas appeler manuellement)
- `src/components/ui/` — primitives shadcn. CLI : `pnpm dlx shadcn@latest add <component>` (respecte `components.json`).
- `src/components/magicui/` — composants décoratifs / animés (grid pattern, marquee, aurora text, scroll-progress, text reveal, word rotate). À réserver aux ouvertures / héros — ne pas en saupoudrer chaque bloc.
- `src/components/email-template.tsx` — template React Email consommé par `/api/send`. `baseUrl` = `https://maeri.vercel.app` (alignée avec `metadataBase`).
- `src/components/theme-button.tsx` — `ModeToggle` via `next-themes` (`useTheme()`).
- `src/components/theme-provider.tsx` — wrapper `next-themes`.

### i18n

`locales/{en,fr}.ts` portent les dictionnaires ; `locales/client.ts` et
`locales/server.ts` exposent `useI18n` / `getI18n` via `next-international`.
Les dictionnaires sont actuellement quasi vides et la majorité du copy est
hardcodée en français. Quand on ajoute une string traduisible : ajouter la
clé dans `en.ts` **et** `fr.ts`. Le routing n'est pas encore préfixé par
locale.

### Formulaires

Pattern unique sur `/contact` :

- `react-hook-form` côté client avec validation par props `register`,
- `toast` (sonner) pour succès / erreur,
- POST `application/json` vers `/api/send`,
- côté serveur, **zod schema** (`QuoteSchema`) → 400 si JSON invalide, 422 si validation échoue, 502 si Resend renvoie une erreur.

Pour tout nouveau formulaire, dupliquer ce pattern.

### Environnement

- `RESEND_API_KEY` requise pour `/api/send`.
- `next.config.ts` : whitelist d'images distantes via `images.remotePatterns` (`assets.aceternity.com`, `via.placeholder.com`, `i.pinimg.com`, `images.unsplash.com`). Ajouter une entrée avant d'utiliser `<Image>` avec un nouveau host.

### Déploiement

Cible : **Vercel** (`maeri.vercel.app`). Le sender Resend est
`onboarding@resend.dev` et le `to` est restreint à
`maeri.consulting.2024@gmail.com` tant que le domaine d'envoi n'est pas
vérifié. Quand le domaine de prod sera vérifié dans Resend, basculer les
adresses commentées en tête de `src/app/api/send/route.ts` (les vraies
adresses cibles sont `contact-maeri@telma.net`, `commercial-maeri@telma.net`,
`info-maeri@telma.net`).

## Style de travail

Objectif : **du code qui marche, qui se maintient facilement, et qui soit agréable à lire.** Dans cet ordre.

### Clean code

- **Lisibilité avant cleverness.** Préférer la variante explicite et un peu plus longue à l'astuce concise.
- **Noms honnêtes.** Variables, fonctions, composants, slugs : le nom doit décrire ce que la chose *fait* ou *est*, pas comment elle est implémentée. Éviter les abréviations opaques.
- **Une responsabilité par unité.** Composants React courts et ciblés ; logique métier (fetch, validation, mapping) extraite en utilitaires dans `src/lib/` ou `src/hooks/` quand elle est réutilisée ou testable isolément. Ne pas abstraire prématurément.
- **Data at boundaries.** Valider les entrées externes (API, formulaires) avec **zod** ; à l'intérieur, faire confiance aux types TypeScript. Pas de `any`, pas de `as` non justifiés.
- **Server-first.** App Router par défaut = server component. N'ajouter `"use client"` que si nécessaire (state, effects, APIs navigateur).
- **Formulaires.** `react-hook-form` + résolveur `zod`, messages d'erreur en français, états chargement / succès / erreur visibles.
- **Styles.** Composer avec `cn(...)` (`src/lib/utils.ts`). Utiliser les tokens sémantiques shadcn. Si un même motif de classes se répète ≥ 3 fois, extraire une variante `cva`.
- **Images.** Toujours `next/image` avec `alt` descriptif. Nouveau domaine distant ⇒ l'ajouter dans `images.remotePatterns` de `next.config.ts`.
- **Accessibilité.** HTML sémantique (`<nav>`, `<main>`, `<section>`, `<h1>` unique par page), `aria-label` sur les boutons icône-only, contraste vérifié en clair et sombre.
- **Pas de code mort.** Fichiers non importés, imports inutilisés, composants doublonnés : les supprimer quand on passe à proximité.
- **Avant de livrer :** `pnpm lint` doit passer, et `pnpm build` doit passer pour toute modification non triviale.

### Commits — Conventional Commits

Format obligatoire : `type(scope)?: description courte à l'impératif, en minuscules`.

Types principaux : `feat`, `fix`, `refactor`, `style`, `chore`, `docs`,
`perf`, `test`.

Règles :

- **Un commit = un changement cohérent.**
- **Sujet ≤ 72 caractères**, à l'impératif (« add », « fix », « remove »), pas de point final.
- **Scope optionnel** quand il clarifie : `feat(contact): ...`, `fix(api/send): ...`, `style(globals): ...`.
- **Breaking change** ⇒ `!` après le type ou footer `BREAKING CHANGE:`.
- **Pas de `chore: wip`, `update`, `fix stuff`.** Trop vague = commit trop gros.

### Workflow

1. Lire avant d'écrire ; comprendre le code existant avant de le modifier.
2. Petits changements atomiques ; commits fréquents avec des messages précis.
3. Tester manuellement en clair **et** en sombre, desktop **et** mobile (menu burger dédié dans `anotherNav.tsx`).
4. Pas de secret commité. Toute clé vit dans `.env.local` (gitignoré) et est consommée via `process.env`.
5. Quand on touche à une route top-level, mettre à jour ensemble : `sitemap.ts`, `anotherNav.tsx`, `brand/footer.tsx` et le `metadataBase` si l'URL de prod change.
