# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## À propos de MA-ERI Consulting

MA-ERI Consulting est une **startup malgache** qui accompagne les entreprises — de la start-up aux grands groupes — dans leur développement. Le site (ce repo) est la vitrine publique de l'activité. L'offre s'articule autour de quatre pôles :

- **Approvisionnement industriel** — rouleaux métalliques, roulements, courroies, joints, tuyaux, vannes, moteurs électriques, pompes hydrauliques.
- **Approvisionnement en matières premières** et **réseau de fournisseurs** (sourcing local et international, import-export).
- **Formation professionnelle** — accueil client, vente et négociation, management, recouvrement, gestion de stock, mise à disposition d'hôtesses commerciales.
- **Conseil informatique et digital** — analyse de données, UI/UX, applications web, microservices, transformation digitale.

Positionnement : « partenaire de confiance » / « Empowering Businesses with Premium Materials & Expertise ». La langue principale du produit est le **français** (copies de pages, slugs de routes, emails transactionnels). L'anglais existe comme locale secondaire mais n'est pas encore traduit.

Audience des pages : dirigeants de PME et responsables achats / formation au Madagascar et dans la région. Tout le contenu doit rester **sobre, professionnel, crédible** — éviter le ton « growth hacker » ou marketing agressif.

## Identité visuelle

La charte vit dans `src/app/globals.css` via les variables CSS shadcn (`--background`, `--primary`, etc.) et dans `components.json`. **Ne pas coder de couleurs en dur** dans les composants — toujours passer par les classes Tailwind sémantiques (`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground`, `border-border`, etc.) pour que le mode sombre continue de fonctionner.

- **Base color shadcn :** `stone` (neutres chauds, en OKLCH). Mode clair : fond blanc pur, texte stone très sombre, primary stone foncé. Mode sombre : fond stone très sombre, primary stone clair. L'inversion est volontaire — garder ce contraste.
- **Rayon :** `--radius: 0.625rem` (≈ `rounded-lg`). Utiliser `rounded-md` / `rounded-lg` / `rounded-xl` dérivés, pas de valeurs pixel arbitraires.
- **Typographie :** police principale **Quicksand** (variable font chargée via `@font-face` depuis `src/app/Quicksand-VariableFont_wght.ttf`), appliquée globalement au `body`. Les variables `--font-geist-sans` / `--font-geist-mono` sont chargées via `next/font` et disponibles en secours. Hiérarchie typique : titres en `font-bold` tracking serré (`tracking-tighter` pour les hero), corps en `text-muted-foreground` pour le texte secondaire.
- **Logo :** `public/logo.png` et `public/logo_bg.png` (variante avec fond). Toujours utiliser `next/image` avec `alt="MA-ERI Logo"`.
- **Effets signature :** composants Aceternity / Magic UI dans `src/components/magicui/` — `AuroraText` pour la marque en hero, `InteractiveGridPattern` pour les fonds, `TextAnimate` / `WordRotate` pour les accroches animées. Réserver ces effets au hero et aux sections d'ouverture ; ne pas en saupoudrer chaque bloc.
- **Mode sombre :** piloté par `next-themes` (`attribute="class"`, défaut `light`). Chaque écran doit être testé en clair **et** en sombre.
- **Nomenclature marque :** écrire **MA-ERI Consulting** (tiret, majuscules, un seul espace avant « Consulting »).

Il existe deux ensembles de variables dans `globals.css` : le bloc OKLCH sous `@theme inline` (source de vérité pour shadcn / Tailwind v4) et un bloc legacy HSL sous `@layer base` hérité d'un ancien shadcn. Avant d'ajuster une couleur, modifier le bloc OKLCH — le bloc HSL n'est plus référencé par les composants actuels.

## Commands

- `npm run dev` — start the dev server (Next.js with **Turbopack**) on http://localhost:3000
- `npm run build` — production build
- `npm start` — run the production build
- `npm run lint` — run `next lint` (ESLint flat config, extending `next/core-web-vitals` + `next/typescript`)

There is no test runner configured in this project.

The repo ships with both `package-lock.json` and `pnpm-lock.yaml`. Check which one is in active use before choosing a package manager — don't regenerate the other.

## Stack

- **Next.js 15.2** App Router with **React 19** and TypeScript (`strict: true`)
- **Tailwind CSS v4** (via `@tailwindcss/postcss`). Global styles and CSS variables live in `src/app/globals.css` — there is no `tailwind.config.*` file.
- **shadcn/ui** (style: `new-york`, base color: `stone`, RSC enabled). Config: `components.json`. CLI-generated primitives land in `src/components/ui/`.
- **next-themes** for dark mode (`attribute="class"`, default `light`)
- **next-international** for i18n (en / fr) — wired in `locales/` but routing is not yet locale-prefixed
- **react-hook-form** + **zod** + `@hookform/resolvers` for forms
- **Resend** + `@react-email/components` for transactional email
- **framer-motion / motion** for animations; many Aceternity/Magic UI–style components under `src/components/magicui/` and `src/components/ui/`

Path alias: `@/*` → `src/*`.

## Architecture

### Routing (`src/app/`)

App Router with nested static routes — most leaf segments are marketing pages:

- `/` — landing (`page.tsx`) composes `InteractiveGridPatternDemo` (hero) + `Services` section
- `/services/*` — `approvisionnement`, `professional-training`, `conseil-informatique`, `raw-material-supply`, `supplier-networking`
- `/products/*` — `construction-materials`, `industrial-pipes`, `specialized-equipment`
- `/pricing/*` — `small-business`, `medium-business`, `large-business`
- `/training/*` — `basic`, `advanced`, `specialized`
- `/about/*` — `history`, `mission`, `team` (note: nav links use French slugs `histoire`/`equipe`/`partenaire-confiance` — routes and nav are partially out of sync)
- `/contact` — quote-request form that POSTs to `/api/send`
- `/api/send/route.ts` — the single server route; uses Resend with `EmailTemplate` (React Email) to deliver quote requests

`layout.tsx` is the root layout. It mounts `<AnotherNav/>` and `<ThemeProvider>` globally, and sets `metadataBase` + OpenGraph for `https://maeri.vercel.app`. `sitemap.ts` and `robots.ts` are static and hardcode that same production URL — update them together when top-level routes change.

### Components

- `src/components/anotherNav.tsx` is the live top nav used by the root layout. `src/components/navbar.tsx` exists but is not mounted — treat `anotherNav` as the source of truth.
- `src/components/ui/` — shadcn primitives. Run `npx shadcn@latest add <component>` to add more; it will respect `components.json` aliases.
- `src/components/magicui/` — decorative/animated components (grid pattern, marquee, aurora/line-shadow text, scroll progress, text reveal, word rotate). Several are duplicated at the top level (`marquee.tsx`, `word-rotate.tsx`, `background-box.tsx`) — check both locations before adding a new one.
- `src/components/email-template.tsx` — React Email template consumed by `/api/send`.

### i18n

`locales/{en,fr}.ts` hold the dictionaries; `locales/client.ts` and `locales/server.ts` expose `useI18n` / `getI18n` via `next-international`. The dictionaries are currently near-empty and most page copy is hardcoded in French — when adding translatable strings, add keys to both `en.ts` and `fr.ts`.

### Environment

- `RESEND_API_KEY` is required for `/api/send` to work.
- `next.config.ts` whitelists remote image hosts: `assets.aceternity.com`, `via.placeholder.com`, `i.pinimg.com`, `images.unsplash.com`. Add new hosts here before using `<Image>` with them.

### Deployment

Target is Vercel (`maeri.vercel.app`, referenced in `layout.tsx`, `sitemap.ts`, `robots.ts`). The Resend `from` address is `onboarding@resend.dev` and `to` is limited to `maeri.consulting.2024@gmail.com` because the sender domain is not yet verified — once the production domain is verified in Resend, update `src/app/api/send/route.ts` to use the real `from`/`to`/`cc` addresses (the intended values are commented in the file).

## Style de travail

Objectif : **du code qui marche, qui se maintient facilement, et qui soit agréable à lire.** Dans cet ordre.

### Clean code

- **Lisibilité avant cleverness.** Préférer la variante explicite et un peu plus longue à l'astuce concise. Le prochain lecteur est prioritaire sur le compilateur.
- **Noms honnêtes.** Variables, fonctions, composants, slugs de route : le nom doit décrire ce que la chose *fait* ou *est*, pas comment elle est implémentée. Éviter les abréviations opaques.
- **Une responsabilité par unité.** Composants React courts et ciblés ; logique métier (fetch, validation, mapping) extraite en utilitaires dans `src/lib/` ou `src/hooks/` quand elle est réutilisée ou testable isolément. Ne pas abstraire prématurément pour un seul usage.
- **Data at boundaries.** Valider les entrées externes (API, formulaires) avec **zod** ; à l'intérieur du code, faire confiance aux types TypeScript. Pas de `any`, pas de `as` non justifiés ; les types partagés vivent près de leur utilisation.
- **Côté client vs serveur.** App Router par défaut = server component. N'ajouter `"use client"` que si le composant a besoin de state, d'effets, ou d'APIs navigateur. Garder les server components autant que possible pour la performance.
- **Formulaires.** `react-hook-form` + résolveur `zod`, messages d'erreur en français, états de chargement/succès/erreur visibles pour l'utilisateur.
- **Styles.** Composer avec `cn(...)` (`src/lib/utils.ts`), utiliser les tokens sémantiques shadcn, ne pas dupliquer des classes longues — extraire une variante `cva` si le pattern se répète ≥ 3 fois.
- **Images.** Toujours `next/image` avec `alt` descriptif. Nouveau domaine distant ⇒ l'ajouter dans `next.config.ts`.
- **Accessibilité.** HTML sémantique (`<nav>`, `<main>`, `<section>`, `<h1>` unique par page), `aria-label` sur les boutons icône-only, contraste vérifié en clair et en sombre.
- **Pas de code mort.** Fichiers non importés, imports inutilisés, composants doublonnés : les supprimer quand on passe à proximité (ex. `src/components/navbar.tsx` non monté, duplicats `marquee.tsx` / `word-rotate.tsx` entre racine et `magicui/`).
- **Avant de livrer :** `npm run lint` doit passer, et `npm run build` doit passer pour toute modification non triviale.

### Commits — Conventional Commits

Format obligatoire : `type(scope)?: description courte à l'impératif, en minuscules`.

Types principaux utilisés ici :
- `feat` — nouvelle fonctionnalité visible utilisateur
- `fix` — correction de bug
- `refactor` — réorganisation sans changement de comportement
- `style` — formatage, CSS, variables de design (pas de logique)
- `chore` — outillage, config, dépendances, metadata
- `docs` — documentation (incluant ce fichier)
- `perf` — performance
- `test` — ajout/modif de tests (quand il y en aura)

Règles :
- **Un commit = un changement cohérent.** Ne pas empiler refactor + feat + fix dans le même commit.
- **Sujet ≤ 72 caractères**, à l'impératif (« add », « fix », « remove »), pas de point final.
- **Scope optionnel** quand il clarifie : `feat(contact): ...`, `fix(api/send): ...`, `style(globals): ...`.
- **Breaking change** ⇒ `!` après le type ou footer `BREAKING CHANGE:` dans le corps.
- **Pas de `chore: wip`, `update`, `fix stuff`.** Si le message est vague, le commit est probablement trop gros.
- Cohérent avec l'historique existant (`fix: remove unused import`, `chore: set basic product link`, `feat: contact and devise form`).

### Workflow

1. Lire avant d'écrire ; comprendre le code existant avant de le modifier.
2. Petits changements atomiques ; commits fréquents avec des messages précis.
3. Tester manuellement en clair **et** en sombre, desktop **et** mobile (le site a un menu mobile dédié).
4. Pas de secret commité. Toute clé vit dans `.env` (gitignoré) et est consommée via `process.env`.
5. Quand on touche à une route top-level, penser à `sitemap.ts` ; quand on renomme un slug, penser à `anotherNav.tsx`.
