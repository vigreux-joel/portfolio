# Page /projets et allègement de la home — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Créer la vraie page de listing `/projets` (études de cas vs réalisations), supprimer la section « Ce portfolio » de la page d'accueil, et corriger les doubles fonds de couleur dans les cartes projet.

**Architecture:** Le site est un portfolio Astro statique. Les projets vivent dans la collection de contenu `projects` (MDX + schéma Zod dans `src/content.config.ts`) et sont rendus par trois composants partagés (`ProjectDetailedCard`, `ProjectCard`, `ProjectVisual` dans `src/components/projects/`). Le champ `order`, nullable, définit uniquement leur position éditoriale souhaitée ; les doublons se décalent vers la première place libre et les projets sans ordre remplissent les trous. Chaque page choisit ensuite le nombre d’entrées et leur présentation. Le champ discriminant `kind` distingue l’étude de cas avec page dédiée de la réalisation pointant vers un site en ligne.

**Tech Stack:** Astro 6 (rendu statique), TypeScript, Tailwind, collection de contenu Astro (loader glob + Zod), design system maison `@udixio/ui-react` (composants `Button`, `Icon`), icônes `@udixio/icons-outlined-400`.

## Global Constraints

- **Pas de framework de test dans ce repo.** La vérification de chaque tâche est : `npm run build` (doit se terminer par `[build] Complete!`) + inspections `grep`/`ls` sur `dist/client/`. Ne pas installer de test runner.
- **Tout le contenu visible est en français**, avec apostrophes typographiques (`’`) et espace insécable (`&nbsp;`) avant `?`, `!`, `:` dans les fichiers `.astro`.
- **Ne jamais fabriquer de fausse capture d'écran.** Les projets sans `cover` utilisent le panneau de repli de `ProjectVisual.astro`.
- **Icônes** : n'importer que des modules existants dans `node_modules/@udixio/icons-outlined-400/src/` (vérifiable par `ls`). Les icônes utilisées dans ce plan (`arrow_outward`, `fact_check`, `arrow_forward`, `check_circle`, `web`) existent — c'est vérifié.
- **Alias d'import** : `@components/*` → `src/components/*`. Les pages utilisent des chemins relatifs pour `Layout` (suivre l'existant).
- **Commits en français**, format conventional commits (`feat(...)`, `fix(...)`), terminés par la ligne `Co-Authored-By:` de l'agent.
- La chaîne visuelle des sections de la home utilise des classes `theme-blue|green|cyan` + un `LinearGradient nextTheme="..."` en bas de chaque section qui doit correspondre au thème de la section suivante. Sections finales injectées par le Layout (`CtaSection`, `FaqSection`) : `theme-blue`.

## État des lieux (contexte pour l'exécutant)

- `src/pages/projets/index.astro` **n'existe pas** — seule la page de détail `src/pages/projets/[...id].astro` existe. Le menu (`src/components/Menu.tsx:6`) pointe vers l'ancre `/#projets`.
- La collection contient des entrées ordonnées par le seul champ `order`; aucune entrée ne choisit son emplacement ou son format d’affichage.
- La home affiche actuellement : Hero → Situations → Projets → Méthode → **HomePortfolioStory** (section à supprimer) → ContextPaths.
- **Bug visuel à corriger** : `ProjectVisual.astro` (panneau de repli sans capture) pose un fond `bg-surface-container` (sombre) à l'intérieur des cartes `bg-surface-container-low` (claires) de `ProjectDetailedCard`/`ProjectCard`, qui posent en plus leur propre `bg-surface-container` sur la zone visuelle. Résultat : double fond disgracieux sur les cartes sans capture.
- Aucune entrée `realisation` n'existe encore : la section « Autres réalisations » de `/projets` doit être **conditionnelle** (rendue seulement si la liste est non vide).

---

### Task 1: Champ `kind` dans le schéma et contenus

**Files:**
- Modify: `src/content.config.ts`
- Modify: `src/content/projects/vigreux-joel-fr.mdx` (frontmatter uniquement)

**Interfaces:**
- Produces: `data.kind: "etude-de-cas" | "realisation"` (défaut `"etude-de-cas"`) et `data.order: number | null`. `headline`, `need`, `solution`, `technicalNote` deviennent optionnels mais restent **obligatoires pour les études de cas** via `superRefine`.

- [ ] **Step 1: Mettre à jour le schéma**

Dans `src/content.config.ts`, remplacer le bloc `schema: z.object({ ... })` (actuellement lignes 10–44) par :

```ts
  schema: z
    .object({
      title: z.string(),
      eyebrow: z.string(),
      headline: z.string().optional(),
      description: z.string(),
      need: z.string().optional(),
      solution: z.string().optional(),
      technicalNote: z.string().optional(),
      publishedAt: z.coerce.date(),
      order: z.number().int().positive().nullable().default(null),
      draft: z.boolean().default(false),
      /**
       * "etude-de-cas" : page dédiée et présentation riche.
       * "realisation" : simple carte pointant vers le site en ligne, sans page dédiée.
       */
      kind: z.enum(["etude-de-cas", "realisation"]).default("etude-de-cas"),
      /** Introduction unique affichée dans la présentation détaillée. */
      intro: z.string().optional(),
      /** Complément court affiché avec une emphase plus discrète. */
      supportingText: z.string().optional(),
      /** Points de preuve listés sur la présentation détaillée. */
      highlights: z.array(z.string()).default([]),
      cover: z
        .object({
          src: z.string(),
          alt: z.string(),
          width: z.number().int().positive(),
          height: z.number().int().positive(),
          caption: z.string().optional(),
        })
        .optional(),
      externalUrl: z.string().url().optional(),
      repositoryUrl: z.string().url().optional(),
      technologies: z.array(z.string()).default([]),
    })
    .superRefine((data, ctx) => {
      if (data.kind === "etude-de-cas") {
        for (const field of ["headline", "need", "solution", "technicalNote"] as const) {
          if (!data[field]) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [field],
              message: `Le champ « ${field} » est requis pour une étude de cas.`,
            });
          }
        }
      }
    }),
```

- [ ] **Step 2: Vérifier que le contenu ne pilote aucun emplacement d’affichage**

Les fichiers MDX ne contiennent que leur priorité `order`. Leur présence et leur format sur une page sont décidés par le composant consommateur.

- [ ] **Step 3: Vérifier le build**

Run: `npm run build 2>&1 | tail -3`
Expected: `[build] Complete!` — le build échouerait avec une erreur Zod si une étude de cas perdait un champ narratif, ce qui valide le `superRefine`.

- [ ] **Step 4: Vérifier que le superRefine rejette un contenu invalide**

Test manuel de la validation : retirer temporairement la ligne `headline:` de `src/content/projects/mojoe.mdx`, relancer `npm run build`, constater l'échec avec le message `Le champ « headline » est requis pour une étude de cas.`, puis **remettre la ligne** et vérifier que le build repasse.

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content/projects/vigreux-joel-fr.mdx
git commit -m "feat(content): distinguer études de cas et réalisations

Champ kind avec validation superRefine : les champs narratifs restent
obligatoires pour les études de cas, une réalisation ne peut pas occuper
la page d'accueil. L'emplacement home \"story\" disparaît.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 2: Correction des doubles fonds et carte « réalisation »

**Files:**
- Modify: `src/components/projects/ProjectVisual.astro`
- Modify: `src/components/projects/ProjectDetailedCard.astro`
- Modify: `src/components/projects/ProjectCard.astro`

**Interfaces:**
- Consumes: `data.kind` défini en Task 1.
- Produces: `ProjectCard` rend un lien externe (`externalUrl`, nouvelle icône `arrow_outward`, `target="_blank"`) quand `kind === "realisation"`, un lien interne `/projets/{id}` sinon. Aucun changement d'API pour `ProjectDetailedCard` ni `ProjectVisual`.

- [ ] **Step 1: Supprimer le fond du panneau de repli dans `ProjectVisual.astro`**

Remplacer le bloc du `<div>` de repli (branche sans `cover`) par :

```astro
    <div
      class:list={[
        "relative flex h-full w-full flex-col justify-end gap-5 overflow-hidden p-7 md:p-9",
        className,
      ]}
      aria-hidden="true"
    >
      <span class="absolute -right-16 -top-20 size-64 rounded-full bg-primary-container opacity-40 blur-2xl" />
      <span class="absolute -bottom-24 -left-12 size-56 rounded-full bg-tertiary-container opacity-30 blur-2xl" />

      <p class="relative text-headline-medium text-gradient">{title}</p>

      {technologies.length > 0 && (
        <ul class="relative flex flex-wrap gap-2">
          {technologies.map((technology) => (
            <li class="rounded-full border border-outline-variant px-3 py-1 text-label-medium text-on-surface-variant">
              {technology}
            </li>
          ))}
        </ul>
      )}
    </div>
```

Deux changements : plus de `bg-surface-container` sur le panneau (il hérite du fond de la carte), et les pastilles technologies perdent leur `bg-surface-container-low` (bordure seule, sinon elles seraient invisibles sur le même fond).

- [ ] **Step 2: Fond de la zone visuelle conditionné à la présence d'une capture**

Dans `src/components/projects/ProjectDetailedCard.astro`, remplacer :

```astro
    <div class:list={["min-h-72 bg-surface-container", reverse && "lg:order-2"]}>
```

par :

```astro
    <div class:list={["min-h-72", project.data.cover && "bg-surface-container", reverse && "lg:order-2"]}>
```

Dans `src/components/projects/ProjectCard.astro`, remplacer :

```astro
  <div class="aspect-[16/10] overflow-hidden bg-surface-container">
```

par :

```astro
  <div class:list={["aspect-[16/10] overflow-hidden", data.cover && "bg-surface-container"]}>
```

- [ ] **Step 3: `headline` optionnel dans `ProjectDetailedCard.astro`**

`headline` peut désormais être absent (Task 1). Remplacer :

```astro
      <p class="mt-4 text-headline-small text-on-surface">{data.headline}</p>
```

par :

```astro
      {data.headline && <p class="mt-4 text-headline-small text-on-surface">{data.headline}</p>}
```

- [ ] **Step 4: Variante « réalisation » de `ProjectCard.astro`**

Remplacer intégralement le frontmatter et le lien de `src/components/projects/ProjectCard.astro` par :

```astro
---
import type { CollectionEntry } from "astro:content";
import { Icon } from "@udixio/ui-react";
import { iArrowForward } from "@udixio/icons-outlined-400/arrow_forward";
import { iArrowOutward } from "@udixio/icons-outlined-400/arrow_outward";

import ProjectVisual from "./ProjectVisual.astro";

interface Props {
  project: CollectionEntry<"projects">;
  linkLabel?: string;
}

const { project, linkLabel } = Astro.props;
const { data } = project;

const isRealisation = data.kind === "realisation";
const href = isRealisation ? data.externalUrl : `/projets/${project.id}`;
const label = linkLabel ?? (isRealisation ? "Voir le site" : "Voir le projet");
const linkIcon = isRealisation ? iArrowOutward : iArrowForward;
---
```

et remplacer le bloc `<a href={`/projets/${project.id}`} ...>` par :

```astro
    {
      href && (
        <a
          href={href}
          target={isRealisation ? "_blank" : undefined}
          rel={isRealisation ? "noopener noreferrer" : undefined}
          class="mt-6 inline-flex items-center gap-2 self-start text-body-medium text-on-surface transition-colors hover:text-primary focus-visible:text-primary"
        >
          <span>{label}</span>
          <span class="sr-only"> — {data.title}{isRealisation && " (nouvel onglet)"}</span>
          <Icon
            icon={linkIcon}
            className="size-4 text-on-surface-variant transition-transform group-hover:translate-x-1"
          />
        </a>
      )
    }
```

(Une réalisation sans `externalUrl` n'affiche simplement pas de lien.)

- [ ] **Step 5: Vérifier le build et l'absence de double fond**

Run: `npm run build 2>&1 | tail -3` → Expected: `[build] Complete!`
Run: `grep -c "bg-surface-container p-7 md:p-9" dist/client/index.html` → Expected: `0` (l'ancienne combinaison de classes du panneau de repli a disparu).

- [ ] **Step 6: Commit**

```bash
git add src/components/projects/
git commit -m "fix(projets): supprimer les doubles fonds des cartes

Le panneau de repli hérite du fond de la carte au lieu d'empiler un
second fond plus sombre ; ProjectCard gère la variante réalisation
avec lien externe.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 3: Supprimer la section « Ce portfolio » de la home

**Files:**
- Delete: `src/components/home/HomePortfolioStory.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/components/home/HomeMethodPreview.astro` (dernière ligne, `LinearGradient`)

**Interfaces:**
- Consumes: rien.
- Produces: la home rend 5 sections : `#accueil`, `#situation`, `#projets`, `#methode-preview`, `#travailler-ensemble`.

- [ ] **Step 1: Supprimer le composant et ses références**

```bash
git rm src/components/home/HomePortfolioStory.astro
```

Dans `src/pages/index.astro`, supprimer la ligne d'import :

```astro
import HomePortfolioStory from "../components/home/HomePortfolioStory.astro";
```

et la ligne d'utilisation :

```astro
  <HomePortfolioStory />
```

- [ ] **Step 2: Réparer la chaîne des thèmes**

`HomeMethodPreview` (theme-blue) précède maintenant `HomeContextPaths` (theme-cyan). Dans `src/components/home/HomeMethodPreview.astro`, remplacer la dernière ligne de section :

```astro
  <LinearGradient nextTheme="green" />
```

par :

```astro
  <LinearGradient nextTheme="cyan" />
```

(Ne pas toucher à `HomeContextPaths.astro` : il est déjà `theme-cyan` avec `nextTheme="blue"` en sortie, ce qui correspond aux sections finales `CtaSection`/`FaqSection` en bleu.)

- [ ] **Step 3: Vérifier le build et l'ordre des sections**

Run: `npm run build 2>&1 | tail -3` → Expected: `[build] Complete!`
Run: `grep -o 'id=\(accueil\|situation\|projets\|methode-preview\|ce-portfolio\|travailler-ensemble\)' dist/client/index.html`
Expected (dans cet ordre, sans `ce-portfolio`) :

```
id=accueil
id=situation
id=projets
id=methode-preview
id=travailler-ensemble
```

Run: `grep -rn "HomePortfolioStory" src/` → Expected: aucune sortie.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(home): retirer la section Ce portfolio

Le portfolio reste une étude de cas consultable sur /projets ; la home
se termine sur méthode puis collaboration.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 4: Créer la page de listing `/projets`

**Files:**
- Create: `src/pages/projets/index.astro`
- Modify: `src/components/Menu.tsx:6`
- Modify: `src/pages/projets/[...id].astro:11` (filtre `getStaticPaths`)

**Interfaces:**
- Consumes: `data.kind` (Task 1), `ProjectDetailedCard` avec prop `reverse` (existant), `ProjectCard` variante réalisation (Task 2).
- Produces: route `/projets` listant toutes les études de cas (grand format alterné) puis, si présentes, les réalisations (grille de cartes). Plus aucune page `/projets/{id}` générée pour une réalisation.

- [ ] **Step 1: Créer `src/pages/projets/index.astro`**

```astro
---
import { getCollection } from "astro:content";
import Layout from "../../layouts/Layout.astro";
import { Line } from "@components/Line";
import ProjectCard from "@components/projects/ProjectCard.astro";
import ProjectDetailedCard from "@components/projects/ProjectDetailedCard.astro";
import { iFactCheck } from "@udixio/icons-outlined-400/fact_check";
import { iWeb } from "@udixio/icons-outlined-400/web";

const published = await getCollection("projects", ({ data }) => !data.draft);
const byOrder = (a: (typeof published)[number], b: (typeof published)[number]) =>
  a.data.order - b.data.order;

const caseStudies = published.filter(({ data }) => data.kind === "etude-de-cas").sort(byOrder);
const realisations = published.filter(({ data }) => data.kind === "realisation").sort(byOrder);

const collectionJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://vigreux-joel.fr/projets#collection",
  url: "https://vigreux-joel.fr/projets",
  name: "Projets — Joël Vigreux",
  description:
    "Études de cas et réalisations de Joël Vigreux, développeur full-stack spécialisé dans l’écosystème TypeScript.",
  inLanguage: "fr-FR",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [...caseStudies, ...realisations].map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.data.title,
      url:
        project.data.kind === "etude-de-cas"
          ? `https://vigreux-joel.fr/projets/${project.id}`
          : project.data.externalUrl,
    })),
  },
});
---

<Layout
  showSidebar={false}
  seo={{
    title: "Projets — Joël Vigreux, développeur full-stack",
    description:
      "Études de cas détaillées et réalisations livrées : bibliothèque de composants, applications métier, sites en production.",
    openGraph: {
      basic: {
        title: "Projets — Joël Vigreux",
        type: "website",
        image: "https://vigreux-joel.fr/images/photo.webp",
        url: "https://vigreux-joel.fr/projets",
      },
      optional: {
        siteName: "Joël Vigreux",
        locale: "fr_FR",
        description:
          "Études de cas détaillées et réalisations livrées par Joël Vigreux, développeur full-stack.",
      },
      image: {
        alt: "Portrait de Joël Vigreux, développeur full-stack",
      },
    },
  }}
>
  <script type="application/ld+json" is:inline set:html={collectionJsonLd} />

  <section class="tab-menu theme-cyan bg-surface pt-32 md:pt-42 xl:pt-54">
    <div class="max-width">
      <div class="flex">
        <div><Line client:load isFirst /></div>
        <div class="padding pt-0 pb-12">
          <p class="text-title-large text-tertiary">Projets</p>
          <h1 class="mt-5 text-display-medium xl:text-display-large text-gradient">
            Des projets réels, que vous pouvez consulter.
          </h1>
          <p class="mt-7 text-body-large text-on-surface-variant max-w-3xl">
            Chaque étude de cas détaille un besoin, la solution développée et mon rôle. Aucun
            projet présenté ici n’est une maquette de démonstration.
          </p>
        </div>
      </div>

      <div class="flex">
        <div><Line client:idle icon={iFactCheck} /></div>
        <div class="padding pt-0 w-full">
          <h2 class="text-headline-large md:text-display-small">Études de cas</h2>
        </div>
      </div>

      <div class="padding-x mt-8 flex flex-col gap-8">
        {caseStudies.map((project, index) => (
          <ProjectDetailedCard project={project} reverse={index % 2 === 1} />
        ))}
      </div>

      {
        realisations.length > 0 && (
          <>
            <div class="flex mt-16 md:mt-24">
              <div>
                <Line client:idle icon={iWeb} />
              </div>
              <div class="padding pt-0 w-full">
                <h2 class="text-headline-large md:text-display-small">Autres réalisations</h2>
                <p class="mt-4 text-body-large text-on-surface-variant max-w-3xl">
                  Des livrables plus courts, consultables directement en ligne.
                </p>
              </div>
            </div>

            <div class="padding-x mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {realisations.map((project) => (
                <ProjectCard project={project} />
              ))}
            </div>
          </>
        )
      }

      <div class="pb-20 md:pb-28"></div>
    </div>
  </section>
</Layout>
```

- [ ] **Step 2: Faire pointer le menu vers la page**

Dans `src/components/Menu.tsx`, ligne 6, remplacer :

```tsx
    { label: "Projets", href: "/#projets" },
```

par :

```tsx
    { label: "Projets", href: "/projets" },
```

- [ ] **Step 3: Exclure les réalisations des pages de détail**

Dans `src/pages/projets/[...id].astro`, remplacer :

```ts
  const projects = await getCollection("projects", ({ data }) => !data.draft);
```

par :

```ts
  const projects = await getCollection(
    "projects",
    ({ data }) => !data.draft && data.kind === "etude-de-cas",
  );
```

- [ ] **Step 4: Vérifier le build et la page générée**

Run: `npm run build 2>&1 | tail -3` → Expected: `[build] Complete!`
Run: `ls dist/client/projets/` → Expected: `index.html` + les 5 dossiers d'études de cas (`mojoe`, `netsimpler`, `plateforme-agences`, `udixio-ui`, `vigreux-joel-fr`).
Run: `grep -o "Études de cas\|Autres réalisations" dist/client/projets/index.html | sort -u` → Expected: `Études de cas` seulement (aucune réalisation en collection pour l'instant, la section est bien conditionnelle).
Run: `grep -c 'href=/projets' dist/client/index.html` → Expected: au moins 1 (lien du menu).

- [ ] **Step 5: Commit**

```bash
git add src/pages/projets/index.astro src/components/Menu.tsx "src/pages/projets/[...id].astro"
git commit -m "feat(projets): créer la page de listing des projets

Études de cas en grand format alterné, section réalisations
conditionnelle, JSON-LD CollectionPage. Le menu pointe vers /projets
au lieu de l'ancre de la home ; les réalisations n'ont pas de page
de détail.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 5: Mettre à jour la spec et vérification finale

**Files:**
- Modify: `docs/superpowers/specs/2026-07-23-refonte-accueil-design.md` (section « État de l'implémentation »)

**Interfaces:** aucune.

- [ ] **Step 1: Ajouter l'addendum à la spec**

À la fin de `docs/superpowers/specs/2026-07-23-refonte-accueil-design.md`, ajouter :

```markdown

## Addendum du 2026-07-23 (après retour utilisateur)

- **La section « Ce portfolio » est supprimée de la page d’accueil** (décision
  utilisateur : suppression pure et simple, pas de bandeau de remplacement).
  Le portfolio reste une étude de cas sur `/projets`.
- **La page de listing `/projets` existe désormais** : études de cas en grand
  format alterné, puis « Autres réalisations » (section conditionnelle, vide à ce
  jour). Le menu pointe vers `/projets`.
- **Deux types de projets** via le champ `kind` : `etude-de-cas` (page dédiée,
  champs narratifs obligatoires) et `realisation` (carte simple avec lien externe,
  pas de page). Pour ajouter une réalisation : créer un `.mdx` avec
  `kind: "realisation"`, `externalUrl`, et sans `home`.
- **Doubles fonds corrigés** : le panneau de repli de `ProjectVisual` hérite du
  fond de sa carte au lieu d’empiler un `bg-surface-container` plus sombre.
```

- [ ] **Step 2: Vérification finale complète**

Run: `npm run build 2>&1 | tail -3` → Expected: `[build] Complete!`
Run: `grep -rn "home: \"story\"\|HomePortfolioStory" src/` → Expected: aucune sortie.
Run (serveur de dev, vérification des routes) :

```bash
npm run dev -- --port 4331 &
sleep 12
for u in / /projets /projets/udixio-ui /projets/vigreux-joel-fr; do
  printf "%-28s %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:4331$u)"
done
pkill -f "astro dev"
```

Expected: `200` pour les quatre routes.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/2026-07-23-refonte-accueil-design.md
git commit -m "docs(home): addendum — page /projets et retrait de la section portfolio

Co-Authored-By: Claude <noreply@anthropic.com>"
```
