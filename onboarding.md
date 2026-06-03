# Guide d'onboarding — MA-ERI Consulting

> Bienvenue. Ce document est ton point d'entrée pour devenir productif sur le site
> de **MA-ERI Consulting**. Il complète le `README.md` (installation rapide) et
> le `CLAUDE.md` (référence pour assistants IA). Lis-le une fois en entier.

---

## 1. Le projet en une page

MA-ERI Consulting est une startup malgache basée à Toamasina. Le site est sa
**vitrine publique** : pas d'application produit, pas de back-office utilisateur,
pas de paiement. C'est un site éditorial multi-pages avec un seul endpoint
serveur — `POST /api/send` — qui transforme un formulaire de devis en email.

Quatre pôles d'activité, tous mis en avant sur le site :

1. **Approvisionnement industriel** — roulements, courroies, joints, moteurs, pompes.
2. **Matières premières & sourcing** — import-export, négociation, logistique.
3. **Formation professionnelle** — vente, management, recouvrement, stock.
4. **Conseil informatique & digital** — data, UI/UX, applications web, microservices.

Audience : dirigeants de PME et responsables achats / formation à Madagascar
et dans l'océan Indien.

Ton du contenu : **sobre, professionnel, crédible**. Pas de growth hacking,
pas de superlatifs marketing. Le français est la langue principale.

---

## 2. Stack — ce qui tourne sous le capot

| Domaine | Outil | Note |
| --- | --- | --- |
| Framework | **Next.js 15.2 App Router** | Server components par défaut. Turbopack en dev. |
| UI | **React 19** + **TypeScript strict** | Pas de `any`. Pas de `as` injustifié. |
| CSS | **Tailwind CSS v4** | Pas de `tailwind.config.*`. Tokens dans `src/app/globals.css`. |
| Composants | **shadcn/ui** (`new-york`, base `stone`) | CLI : `pnpm dlx shadcn@latest add <component>`. |
| Thème | **next-themes** | `attribute="class"`, défaut `light`. |
| i18n | **next-international** | Squelette en/fr, dictionnaires presque vides. |
| Formulaires | **react-hook-form** + **zod** + `@hookform/resolvers` | Validation des entrées externes obligatoire. |
| Email | **Resend** + **@react-email/components** | Endpoint `/api/send`. |
| Animations | **framer-motion / motion** | Composants signature dans `brand/` et `magicui/`. |
| Paquets | **pnpm** | Ne pas utiliser npm/yarn. Un seul lockfile. |

**Path alias :** `@/*` → `src/*`.

---

## 3. Arborescence — où vit quoi

```
src/
├── app/                          # App Router
│   ├── layout.tsx                # Layout racine — fonts, ThemeProvider, Nav, Footer
│   ├── page.tsx                  # Accueil
│   ├── globals.css               # Tokens design + utilitaires éditoriaux
│   ├── sitemap.ts                # Sitemap statique
│   ├── robots.ts                 # robots.txt
│   ├── api/send/route.ts         # Seul endpoint serveur
│   ├── contact/page.tsx          # Formulaire de devis
│   ├── services/                 # 5 sous-routes
│   ├── products/                 # 3 sous-routes
│   ├── pricing/                  # 3 sous-routes (small/medium/large business)
│   ├── training/                 # 3 sous-routes (basic/advanced/specialized)
│   └── about/                    # history / mission / team
│
├── components/
│   ├── anotherNav.tsx            # ⚠️ Navigation principale (la seule montée)
│   ├── theme-button.tsx          # ModeToggle clair/sombre (next-themes)
│   ├── theme-provider.tsx        # Wrapper next-themes
│   ├── email-template.tsx        # Template React Email pour /api/send
│   ├── brand/                    # 🎨 Vocabulaire éditorial du site (cf. §5)
│   ├── ui/                       # Primitives shadcn (button, card, input, …)
│   └── magicui/                  # Composants animés (grid, marquee, scroll…)
│
├── hooks/use-mobile.ts           # Détecte le breakpoint mobile (<768px)
└── lib/utils.ts                  # `cn()` — concat de classes (clsx + tailwind-merge)

locales/                          # Dictionnaires next-international (en/fr)
public/                           # logo.png, logo_bg.png, etc.
```

---

## 4. Identité visuelle — la charte

### 4.1 Typographies

Trois familles, toutes chargées via `next/font/google` dans `layout.tsx` et
exposées en variables CSS :

| Variable CSS | Famille | Usage |
| --- | --- | --- |
| `--font-sans` | **Geist Sans** | Corps de texte, navigation, boutons. C'est la police par défaut du `<body>`. |
| `--font-serif` | **Fraunces** (opsz + SOFT) | Titres éditoriaux — classe `.font-display`, balises `<h1 class="display">`, etc. |
| `--font-mono` | **JetBrains Mono** | « Kickers » (étiquettes monospaces tracées), valeurs `tabular-nums`, code. |

Pour appliquer la serif à un titre : `<h1 className="display font-display">`.
Le `display` ajoute les bons axes optiques de Fraunces ; `font-display` suffit
ailleurs.

### 4.2 Tokens de couleur

Tout vit en OKLCH dans `globals.css`. Deux ancres conceptuelles :

- `--paper` = fond (presque blanc en clair, presque noir en sombre)
- `--ink` = encre (texte principal — inversion de `--paper`)
- `--brand` = ember / copper, un orange-cuivre OKLCH. C'est l'accent
  industriel + artisanal de la marque.

Toutes les variables shadcn classiques (`--background`, `--foreground`,
`--primary`, `--muted`, `--border`, etc.) sont **dérivées** de ces ancres.
**Ne jamais coder une couleur en dur**. Toujours utiliser :

- les classes Tailwind sémantiques : `bg-background`, `text-foreground`,
  `text-muted-foreground`, `bg-primary`, `border-border`, `bg-secondary/50`,
  `text-brand`…
- ou les variables via `style={{ backgroundColor: "var(--ink)" }}` quand on a
  besoin de la paire ink/paper inversée (ex. boutons noir-en-clair / blanc-en-sombre).

Le mode sombre est piloté par `next-themes` (`attribute="class"`). Chaque page
doit être testée en clair **et** en sombre.

### 4.3 Utilitaires éditoriaux maison

Ajoutés dans `@layer utilities` de `globals.css` :

| Classe | Effet |
| --- | --- |
| `.kicker` | Petite étiquette monospace, uppercase, tracée. Le tag de section. |
| `.kicker-brand` | Variante en couleur `--brand`. |
| `.font-display`, `.display` | Active Fraunces avec axes optiques. |
| `.text-display-xl` | Hero — `clamp(3rem, 10vw, 9rem)`. |
| `.text-display-lg` | Page hero — `clamp(2.5rem, 7vw, 6rem)`. |
| `.text-display-md` | Section heading — `clamp(2rem, 5vw, 4rem)`. |
| `.bg-grain` | Texture papier (radial-gradients fins). |
| `.rule` | Hairline éditoriale (1px, currentColor 15%). |
| `.brand-underline` | Soulignement 2px en couleur de marque. |
| `.text-balance` / `.text-pretty` | `text-wrap` controllers. |

### 4.4 Rayons et animations

- `--radius: 0.5rem` → utiliser `rounded-md` / `rounded-lg` / `rounded-xl`,
  jamais des valeurs en pixels.
- Animations nommées : `animate-rise`, `animate-fade-in`, `animate-kicker`,
  `animate-marquee` (définies en keyframes dans `@theme inline`). On les
  combine avec `style={{ animationDelay: "200ms" }}` pour le staggering.

### 4.5 Logo + nom de marque

- Fichiers : `public/logo.png` et `public/logo_bg.png` (variante avec fond).
- Toujours via `next/image` avec `alt="MA-ERI Consulting"`.
- **Nomenclature** : on écrit **MA-ERI Consulting** (tiret, majuscules, un seul espace).

---

## 5. Le système de composants `brand/`

C'est le **vocabulaire éditorial** du site. Tout le contenu marketing se
construit avec ces briques — pas de divs maison à chaque page. Re-export
groupé depuis `@/components/brand`.

| Composant | Rôle | Quand l'utiliser |
| --- | --- | --- |
| `Kicker` | Étiquette de section monospace, optionnellement préfixée par un index (`"01"`) | Au-dessus de chaque titre de section. |
| `PageHero` | Hero standard pour pages internes (titre + lede + meta) | Première section de toute page autre que `/`. |
| `HomeHero` | Hero éditorial spécial de l'accueil | Uniquement `app/page.tsx`. |
| `BrandSeal` | Le logo en frontispice avec anneaux concentriques | Sections de marque (accueil). |
| `SectionHeading` | En-tête de section avec kicker + titre + lede | Tout titre interne d'une page. |
| `FeatureGrid` | Grille de cartes (2/3/4 colonnes) avec icône + index + texte | Présenter une liste de bénéfices, sous-services, piliers. |
| `Steps` | Numérotation 01 → 04 en grille | Décrire une méthode, un process. |
| `Checklist` | Liste à pucks `Check` colorés `--brand` | Lister des inclusions, garanties. |
| `StatBand` | Bande de gros chiffres clés | Mettre en avant des métriques. |
| `PricingCard` | Carte de tarif (avec variante `highlight`) | Pages `/pricing/*`. |
| `CTABlock` | Bloc d'appel à l'action plein ink (sombre) | Bas de chaque page. |
| `Footer` | Pied de page global | Monté dans `layout.tsx`, pas à appeler manuellement. |

### Exemple — une page de service typique

```tsx
import { CTABlock, FeatureGrid, PageHero, SectionHeading } from "@/components/brand";

export const metadata = {
  title: "Approvisionnement industriel",
  description: "...",
};

export default function Page() {
  return (
    <>
      <PageHero
        index="01"
        kicker="Service · Approvisionnement"
        title={<>La pièce juste, <span className="italic text-muted-foreground">au bon moment.</span></>}
        lede="..."
        meta={[
          { label: "Familles", value: "07" },
          { label: "Délai", value: "48h" },
        ]}
      />

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <SectionHeading kicker="Ce que nous couvrons" title={<>...</>} />
        <div className="mt-16">
          <FeatureGrid columns={3} features={items} />
        </div>
      </section>

      <CTABlock
        kicker="Un besoin précis ?"
        title={<>Parlons-en.</>}
        primary={{ href: "/contact", label: "Demander un devis" }}
      />
    </>
  );
}
```

---

## 6. Routing

App Router — chaque dossier de `src/app` mappe une URL. Les pages sont
**statiques** par défaut (server components). Tout est en français côté slug
sauf les sous-pages historiques en anglais (`/services/raw-material-supply`,
`/products/industrial-pipes`, `/pricing/small-business`, etc.) — la
navigation et le sitemap doivent rester alignés.

Trois fichiers à toucher **ensemble** quand on ajoute ou renomme une route
top-level :

1. `src/app/<slug>/page.tsx` — la page elle-même.
2. `src/components/anotherNav.tsx` — la nav doit pointer vers le bon slug.
3. `src/app/sitemap.ts` — ajouter / renommer l'entrée.
4. `src/components/brand/footer.tsx` — colonnes de liens.

`layout.tsx` monte globalement `<AnotherNav />`, `<main>` et `<Footer />`. Ne
pas ré-importer ces blocs dans les pages.

---

## 7. Formulaire de devis (`/contact` + `/api/send`)

Côté client (`src/app/contact/page.tsx`) : `react-hook-form`, validation via
les props `register("name", { required: true })`. Sur succès, `toast.success`
(sonner) — sur erreur, `toast.error`.

Côté serveur (`src/app/api/send/route.ts`) :

- Validation **zod** stricte (`QuoteSchema`). 400 si JSON invalide, 422 si
  validation échoue.
- Envoi via Resend. 502 si Resend renvoie une erreur.
- `from` / `to` actuels = bac à sable Resend (`onboarding@resend.dev` →
  l'adresse Gmail du compte). Les vraies adresses cibles
  (`contact-maeri@telma.net`, `commercial-maeri@telma.net`) sont
  commentées en tête du fichier — on bascule **une fois** que le domaine
  d'envoi est vérifié dans Resend.

Variable d'environnement requise : `RESEND_API_KEY`. Sans elle, l'API renvoie
une erreur Resend silencieuse — gérer en `.env.local`.

---

## 8. i18n

Squelette `next-international` dans `locales/` (`en.ts`, `fr.ts`,
`client.ts`, `server.ts`). Les dictionnaires sont **presque vides** : la
plupart du copy vit en dur dans les pages en français. C'est volontaire pour
l'instant.

Quand on ajoute une string traduisible :

1. Ajouter la clé dans `locales/fr.ts` **et** `locales/en.ts`.
2. Utiliser `getI18n()` (server) ou `useI18n()` (client).

Le routing **n'est pas encore préfixé** par locale (`/fr/...`). À planifier
si on active l'anglais.

---

## 9. Style de code

### 9.1 Principes

- **Lisibilité avant cleverness.** Un peu plus long, beaucoup plus clair.
- **Noms honnêtes.** `pricingTiers`, pas `data`. `quoteSubmitHandler`, pas `fn`.
- **Une responsabilité par composant.** Si le composant dépasse ~150 lignes,
  extraire des sous-blocs.
- **Server-first.** N'ajouter `"use client"` que si on a besoin de state,
  effects ou APIs navigateur.
- **Données aux frontières.** zod pour valider tout ce qui entre (API,
  formulaires). À l'intérieur, faire confiance aux types TS.
- **Styles.** `cn(...)` depuis `@/lib/utils`. Tokens sémantiques shadcn.
  Si un même motif de classes se répète ≥ 3 fois → extraire une variante `cva`.
- **Images.** `next/image` avec `alt` descriptif. Nouveau domaine distant →
  l'ajouter dans `images.remotePatterns` de `next.config.ts`.
- **Accessibilité.** `<nav>`, `<main>`, `<section>`, un seul `<h1>` par page,
  `aria-label` sur les boutons icône-only, contraste vérifié en clair et sombre.
- **Pas de code mort.** On supprime quand on passe à côté.

### 9.2 Ce qu'on évite

- Couleurs hex / rgb codées en dur.
- `any`, `as unknown as ...`, `// eslint-disable` sans justification.
- Fichiers `*.module.css`, `styled-components` — uniquement Tailwind.
- Commentaires qui décrivent le quoi (le code le dit déjà). Garder les
  commentaires qui expliquent le **pourquoi**.

### 9.3 Avant de livrer

```bash
pnpm lint        # doit passer
pnpm build       # doit passer pour tout changement non trivial
```

Tester manuellement : **clair + sombre**, **desktop + mobile** (menu burger
dédié dans `anotherNav.tsx`).

---

## 10. Commits — Conventional Commits

Format : `type(scope)?: description courte à l'impératif, en minuscules`.

Types autorisés :

- `feat` — fonctionnalité visible utilisateur
- `fix` — correction de bug
- `refactor` — réorganisation sans changement de comportement
- `style` — formatage, CSS, variables de design (pas de logique)
- `chore` — outillage, config, dépendances, metadata
- `docs` — documentation
- `perf` — performance
- `test` — tests (quand il y en aura)

Règles :

- **Un commit = un changement cohérent.**
- **Sujet ≤ 72 caractères**, à l'impératif, sans point final.
- **Scope** quand ça clarifie : `feat(contact): ...`, `fix(api/send): ...`.
- **Breaking change** ⇒ `!` après le type ou footer `BREAKING CHANGE:`.
- **Bannis** : `chore: wip`, `update`, `fix stuff`. Trop vague = commit trop gros.

Exemples du dépôt :

```
feat(brand): enlarge logo and full brand name across nav, hero and footer
fix: add brand seal component
style: set a special section for the logo
chore: add another contact
docs: update CLAUDE.md typography
```

---

## 11. Workflow git

1. Brancher depuis `main` : `git checkout -b <type>/<sujet-kebab>`.
2. Petits commits atomiques, en français.
3. Pousser : `git push -u origin <branche>`.
4. PR vers `main`. Description : résumé court + capture clair/sombre si UI.
5. Une review minimum avant merge. Merger en `squash` pour garder l'historique
   lisible.

Pas de push direct sur `main` sans revue (sauf hotfix annoncé).

---

## 12. Déploiement

Cible : **Vercel** (`maeri.vercel.app`). Le déploiement est automatique sur
push vers `main`. Les variables d'environnement (`RESEND_API_KEY`) sont
configurées côté Vercel.

À garder cohérent quand on touche aux routes top-level :

- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/components/anotherNav.tsx`
- `src/components/brand/footer.tsx`
- `metadataBase` dans `src/app/layout.tsx`

Si le domaine de production change, mettre à jour ces cinq fichiers en même
temps.

---

## 13. Tâches courantes — recettes

### Ajouter une nouvelle page de service

1. Créer `src/app/services/<slug>/page.tsx`. Partir de `services/page.tsx`
   comme gabarit.
2. Importer `PageHero`, `SectionHeading`, `FeatureGrid` (et `CTABlock`)
   depuis `@/components/brand`.
3. Exporter `metadata = { title, description }`.
4. Ajouter le lien dans `anotherNav.tsx` (`NAV[Services].children`).
5. Ajouter l'URL dans `sitemap.ts`.
6. Tester en clair + sombre.

### Ajouter une nouvelle formule de tarif

1. Créer `src/app/pricing/<slug>/page.tsx`.
2. Définir un `PricingTier` et le rendre via `<PricingCard tier={...} />`.
3. Mettre à jour la nav + le sitemap.

### Ajouter une primitive shadcn

```bash
pnpm dlx shadcn@latest add <component>
```

Respecte `components.json` — atterrit dans `src/components/ui/`.

### Ajouter un nouveau domaine d'image distante

Modifier `next.config.ts` :

```ts
images: {
  remotePatterns: [
    ...,
    { protocol: "https", hostname: "nouveau.domaine.com" },
  ],
}
```

### Changer une couleur de marque

Modifier `--brand` (et au besoin `--brand-foreground`) dans `:root` **et**
`.dark` de `src/app/globals.css`. C'est le seul endroit qui compte.

---

## 14. Pièges connus

- **Lockfile.** Le projet utilise **pnpm**. Ne pas créer de `package-lock.json`
  ou `yarn.lock` accidentellement.
- **`/api/send` en dev.** Sans `RESEND_API_KEY` dans `.env.local`, l'envoi
  échoue. Sans domaine vérifié dans Resend, le `to:` est restreint à l'adresse
  du compte (voir commentaire en tête de `route.ts`).
- **Hydration.** Le toggle de thème (`ModeToggle`) garde un placeholder
  invisible avant `mounted` pour éviter le flash de la mauvaise icône.
- **Lockfile + Vercel.** Vercel détecte pnpm via le lockfile présent. Si on
  changeait de paquet manager, il faudrait mettre à jour les Build Settings.
- **`next/font` cache.** Si une font Google ne se charge pas en dev, redémarrer
  `pnpm dev` — Turbopack garde un cache parfois capricieux.

---

## 15. Pour aller plus loin

- `CLAUDE.md` — la même information, condensée, à destination des assistants IA.
- `src/app/globals.css` — source de vérité absolue pour les tokens design.
- `src/components/brand/index.ts` — l'inventaire du vocabulaire éditorial.
- [Docs Next.js 15 — App Router](https://nextjs.org/docs/app)
- [Docs Tailwind CSS v4](https://tailwindcss.com/docs)
- [Docs shadcn/ui](https://ui.shadcn.com)
- [Docs Resend + React Email](https://resend.com/docs/send-with-nextjs)

Bonne contribution.
