# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current monolithic homepage with a premium, sectioned homepage that positions Joël Vigreux as a développeur full-stack, then routes visitors toward projects, expertise, method, mission context, and profile evaluation.

**Architecture:** `src/pages/index.astro` becomes a short orchestrator. Homepage content is split into focused Astro sections under `src/components/home/`, with shared editorial data in `homeContent.ts`. The implementation removes obsolete homepage imports and reuses existing design primitives (`Line`, `BackgroundColor`, `LinearGradient`, `Card`, `Button`, `Icon`).

**Tech Stack:** Astro 6, React 19 integration, Tailwind v4 utilities, udixio Material 3 tokens/components, existing path aliases (`@components/*`, `@assets/*`, `@/*`).

---

## File structure

- Create: `src/components/home/homeContent.ts`
  - Owns static copy, CTA labels, routes, and hero highlight variants for the homepage.
- Create: `src/components/home/HomeHero.astro`
  - Owns first screen, stable title, animated differentiator line, and primary navigation CTAs.
- Create: `src/components/home/HomeContextPaths.astro`
  - Owns the two-context section: “Confier une mission” and “Évaluer mon profil”.
- Create: `src/components/home/HomeProjectsPreview.astro`
  - Owns the `/projets` preview and proof framing.
- Create: `src/components/home/HomeExpertisePreview.astro`
  - Owns the compact `/expertise` summary.
- Create: `src/components/home/HomeMethodPreview.astro`
  - Owns the compact `/methode` summary.
- Modify: `src/pages/index.astro`
  - Remove the old monolithic homepage, obsolete imports, duplicated expertise content, and missing asset dependencies.
  - Import and render the new homepage sections.
  - Keep SEO and JSON-LD on the page.

Known baseline: the current `src/pages/index.astro` imports assets/components that are absent from the workspace (`home-1.png`, `home-1-left.png`, `home-1-middle.png`, `home-1-right.png`, `home-1-stars.svg`, `WowBackdrop`). Do not spend time preserving these imports; the redesign removes them.

---

### Task 1: Add homepage content source

**Files:**
- Create: `src/components/home/homeContent.ts`

- [ ] **Step 1: Create the home directory**

Run:

```bash
mkdir -p src/components/home
```

Expected: command exits with code `0`.

- [ ] **Step 2: Add shared editorial content**

Create `src/components/home/homeContent.ts` with:

```ts
export const missionPath = "/mission";
export const profilePath = "/profil";

export const heroHighlights = [
  "orienté produit",
  "interfaces premium",
  "architecture maintenable",
  "livraison pragmatique",
  "IA utilisée avec rigueur",
] as const;

export const contextCards = [
  {
    eyebrow: "Confier une mission",
    title: "Un produit à cadrer, construire ou fiabiliser",
    description:
      "Pour avancer sur un besoin concret avec un regard produit, une exécution full-stack et une attention forte à la maintenabilité.",
    href: missionPath,
    cta: "Voir l’approche mission",
  },
  {
    eyebrow: "Évaluer mon profil",
    title: "Un développeur full-stack à intégrer à votre équipe",
    description:
      "Pour juger mon parcours, ma posture, mon niveau technique et ma capacité à contribuer dans une équipe produit exigeante.",
    href: profilePath,
    cta: "Voir mon profil candidat",
  },
] as const;

export const projectProofs = [
  "Problème initial",
  "Contraintes et arbitrages",
  "Décisions techniques",
  "Résultat produit",
] as const;

export const expertiseProofs = [
  "Interfaces web lisibles et soignées",
  "Architecture back-end maintenable",
  "APIs typées et intégrables",
  "Performance et accessibilité utiles au produit",
] as const;

export const methodProofs = [
  "Cadrage avant exécution",
  "Architecture pensée pour durer",
  "Revue, tests et sécurisation",
] as const;
```

- [ ] **Step 3: Verify the content file is discoverable**

Run:

```bash
rg --no-line-number "Évaluer mon profil|heroHighlights|missionPath" src/components/home/homeContent.ts
```

Expected output includes:

```text
export const missionPath = "/mission";
export const heroHighlights = [
    eyebrow: "Évaluer mon profil",
```

---

### Task 2: Implement the homepage hero

**Files:**
- Create: `src/components/home/HomeHero.astro`
- Read: `src/components/expertise/HeroSection.astro`
- Read: `src/components/methode/HeroSection.astro`

- [ ] **Step 1: Create the hero section**

Create `src/components/home/HomeHero.astro` with:

```astro
---
import { BackgroundColor } from "@components/BackgroundColor";
import { Line } from "@components/Line";
import { LinearGradient } from "@components/LinearGradient";
import { Button } from "@udixio/ui-react";
import { iArrowForward } from "@udixio/icons-outlined-400/arrow_forward";
import { iFactCheck } from "@udixio/icons-outlined-400/fact_check";
import { heroHighlights } from "./homeContent";

const highlightDuration = `${heroHighlights.length * 2.4}s`;
---

<section id="accueil" class="tab-menu relative overflow-hidden theme-blue">
  <BackgroundColor
    speed={7_500}
    size="max(66vw, 800px)"
    count={5}
    client:idle
    className="absolute opacity-20 size-full top-0 left-0 -z-10"
  />

  <div class="max-width flex justify-between h-full pt-32 md:pt-42 xl:pt-54">
    <div class="relative z-10 flex flex-col overflow-visible w-full">
      <div class="flex flex-col relative">
        <div class="flex">
          <div>
            <Line client:load isFirst />
          </div>

          <div class="padding pt-0 pb-16 relative w-full">
            <p class="text-title-medium text-tertiary mb-4">Joël Vigreux</p>
            <h1 class="text-display-medium xl:text-display-large relative z-10">
              Développeur <span class="block text-gradient">full-stack</span>
            </h1>

            <p class="mt-6 text-headline-small md:text-headline-medium text-on-surface">
              <span class="sr-only">
                orienté produit, interfaces premium, architecture maintenable, livraison pragmatique, IA utilisée avec rigueur
              </span>
              <span
                class="home-hero-highlight-wrap relative inline-grid overflow-hidden align-bottom text-tertiary"
                style={`--highlight-duration: ${highlightDuration};`}
                aria-hidden="true"
              >
                {heroHighlights.map((highlight, index) => (
                  <span
                    class="home-hero-highlight col-start-1 row-start-1"
                    style={`--highlight-delay: ${index * 2.4}s;`}
                  >
                    {highlight}
                  </span>
                ))}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div class="flex mt-8">
        <div>
          <Line client:load icon={iFactCheck} nextTheme="purple" />
        </div>

        <div class="padding pt-0">
          <p class="text-body-large max-w-3xl">
            Je conçois et développe des produits web fiables, lisibles et évolutifs — de l’expérience utilisateur à l’architecture technique.
          </p>
          <p class="max-w-3xl mt-6 text-on-surface-variant">
            Mon travail ne se limite pas à assembler une stack : il consiste à comprendre le besoin, cadrer les bons arbitrages et livrer une solution qui reste saine après la première version.
          </p>

          <div class="flex flex-col sm:flex-row sm:flex-wrap gap-4 mt-8">
            <Button href="/projets" icon={iArrowForward} label="Voir les projets" />
            <Button href="/methode" icon={iFactCheck} label="Comprendre ma méthode" variant="outlined" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <LinearGradient className="h-1/2" nextTheme="purple" />
</section>

<style>
  .home-hero-highlight-wrap {
    min-height: 1.2em;
  }

  .home-hero-highlight {
    opacity: 0;
    transform: translateY(0.45em);
    animation: home-hero-highlight var(--highlight-duration) ease-in-out infinite;
    animation-delay: var(--highlight-delay);
    will-change: opacity, transform;
  }

  @keyframes home-hero-highlight {
    0%,
    100% {
      opacity: 0;
      transform: translateY(0.45em);
    }

    5%,
    18% {
      opacity: 1;
      transform: translateY(0);
    }

    24% {
      opacity: 0;
      transform: translateY(-0.45em);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .home-hero-highlight {
      animation: none;
      transform: none;
      opacity: 0;
    }

    .home-hero-highlight:first-child {
      opacity: 1;
    }
  }
</style>
```

- [ ] **Step 2: Verify the fixed title and reduced-motion CSS are present**

Run:

```bash
rg --no-line-number "Développeur|full-stack|prefers-reduced-motion|home-hero-highlight" src/components/home/HomeHero.astro
```

Expected output includes:

```text
              Développeur <span class="block text-gradient">full-stack</span>
  .home-hero-highlight {
  @media (prefers-reduced-motion: reduce) {
```

---

### Task 3: Implement the two-context section

**Files:**
- Create: `src/components/home/HomeContextPaths.astro`
- Read: `docs/superpowers/specs/2026-07-07-homepage-redesign-design.md`

- [ ] **Step 1: Create the context paths section**

Create `src/components/home/HomeContextPaths.astro` with:

```astro
---
import { Card } from "@components/Card";
import { Line } from "@components/Line";
import { LinearGradient } from "@components/LinearGradient";
import { Button, Icon } from "@udixio/ui-react";
import { iArrowForward } from "@udixio/icons-outlined-400/arrow_forward";
import { iRoute } from "@udixio/icons-outlined-400/route";
import { iIdCard } from "@udixio/icons-outlined-400/id_card";
import { contextCards } from "./homeContent";

const icons = [iRoute, iIdCard];
---

<div id="contextes" class="tab-menu theme-purple bg-surface">
  <section>
    <div class="max-width">
      <div class="flex pt-8">
        <div>
          <Line client:idle icon={iRoute} nextTheme="green" />
        </div>

        <div class="padding pt-0 flex flex-col justify-center max-w-5xl">
          <h2 class="text-title-large text-tertiary" data-sidebar-label="Contextes">Deux lectures possibles</h2>
          <div class="mt-4 text-headline-large md:text-display-medium max-w-prose">
            <h3 class="text-gradient">Vous cherchez un développeur capable de prendre des décisions produit et techniques.</h3>
          </div>
          <p class="mt-6 text-body-large text-on-surface-variant max-w-prose">
            Le contexte peut changer — mission ou recrutement — mais le sujet reste le même : fiabilité, autonomie, qualité d’exécution et compréhension des enjeux métier.
          </p>
        </div>
      </div>

      <div class="padding-x mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {contextCards.map((card, index) => (
          <Card client:visible variant="filled" className="group h-full">
            <article class="p-6 md:p-8 h-full flex flex-col">
              <div class="flex items-center gap-3 mb-6">
                <span class="grid place-items-center h-12 w-12 rounded-2xl bg-secondary-container text-on-secondary-container">
                  <Icon icon={icons[index]} className="h-6 w-6" />
                </span>
                <span class="text-label-large text-tertiary uppercase tracking-wide">{card.eyebrow}</span>
              </div>

              <h3 class="text-headline-small text-on-surface">{card.title}</h3>
              <p class="mt-5 text-body-large text-on-surface-variant">{card.description}</p>

              <div class="mt-auto pt-8">
                {index === 0 ? (
                  <Button href={card.href} icon={iArrowForward} label={card.cta} />
                ) : (
                  <Button href={card.href} icon={iArrowForward} label={card.cta} variant="outlined" />
                )}
              </div>
            </article>
          </Card>
        ))}
      </div>

      <div class="flex h-24 md:h-32">
        <div>
          <Line client:idle />
        </div>
      </div>
    </div>
  </section>

  <LinearGradient nextTheme="green" />
</div>
```

- [ ] **Step 2: Verify the exact approved wording**

Run:

```bash
rg --no-line-number "Évaluer mon profil|Confier une mission|freelance|CDI" src/components/home/HomeContextPaths.astro src/components/home/homeContent.ts
```

Expected output includes:

```text
    eyebrow: "Confier une mission",
    eyebrow: "Évaluer mon profil",
```

Expected output does not include `freelance` or `CDI`.

---

### Task 4: Implement the projects preview

**Files:**
- Create: `src/components/home/HomeProjectsPreview.astro`

- [ ] **Step 1: Create the projects preview section**

Create `src/components/home/HomeProjectsPreview.astro` with:

```astro
---
import { Card } from "@components/Card";
import { Line } from "@components/Line";
import { LinearGradient } from "@components/LinearGradient";
import { BackgroundColor } from "@components/BackgroundColor";
import { Button, Icon } from "@udixio/ui-react";
import { iArrowForward } from "@udixio/icons-outlined-400/arrow_forward";
import { iFactCheck } from "@udixio/icons-outlined-400/fact_check";
import { iSearch } from "@udixio/icons-outlined-400/search";
import { iArchitecture } from "@udixio/icons-outlined-400/architecture";
import { iTaskAlt } from "@udixio/icons-outlined-400/task_alt";
import { projectProofs } from "./homeContent";

const proofIcons = [iSearch, iArchitecture, iTaskAlt, iFactCheck];
---

<div id="projets" class="tab-menu theme-green bg-surface relative overflow-hidden">
  <BackgroundColor
    speed={5_000}
    size="max(60vw, 760px)"
    count={4}
    client:idle
    className="absolute opacity-15 size-full top-0 left-0 -z-10"
  />

  <section>
    <div class="max-width relative z-10">
      <div class="flex pt-8">
        <div>
          <Line client:idle icon={iFactCheck} nextTheme="orange" />
        </div>

        <div class="padding pt-0 flex flex-col justify-center max-w-5xl">
          <h2 class="text-title-large text-tertiary" data-sidebar-label="Projets">Projets / études de cas</h2>
          <div class="mt-4 text-headline-large md:text-display-medium max-w-prose">
            <h3 class="text-gradient">Des décisions concrètes, pas seulement une stack</h3>
          </div>
          <p class="mt-6 text-body-large text-on-surface-variant max-w-prose">
            Les projets doivent montrer le problème, les contraintes, les arbitrages et ce que les choix techniques changent réellement pour le produit.
          </p>
        </div>
      </div>

      <div class="padding-x mt-12 grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] gap-6">
        <Card client:visible variant="filled" energyX className="group">
          <div class="p-6 md:p-10 h-full flex flex-col">
            <span class="text-label-large text-tertiary uppercase tracking-wide">Études de cas</span>
            <h3 class="mt-4 text-headline-medium text-on-surface max-w-prose">
              Comprendre le raisonnement derrière la livraison
            </h3>
            <p class="mt-6 text-body-large text-on-surface-variant max-w-prose">
              La future page projets doit servir de preuve : pas une galerie de captures, mais une lecture des décisions qui rendent un produit fiable, maintenable et utilisable.
            </p>
            <div class="mt-8">
              <Button href="/projets" icon={iArrowForward} label="Explorer les projets" />
            </div>
          </div>
        </Card>

        <Card client:visible variant="filled" className="group">
          <div class="p-6 md:p-8 h-full">
            <span class="text-label-large text-on-surface-variant uppercase tracking-wide">Lecture attendue</span>
            <div class="mt-6 space-y-4">
              {projectProofs.map((proof, index) => (
                <div class="flex items-center gap-3 text-body-large text-on-surface">
                  <Icon icon={proofIcons[index]} className="h-5 w-5 text-tertiary shrink-0" />
                  <span>{proof}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div class="flex h-24 md:h-32">
        <div>
          <Line client:idle />
        </div>
      </div>
    </div>
  </section>

  <LinearGradient nextTheme="orange" />
</div>
```

- [ ] **Step 2: Verify the section links to `/projets`**

Run:

```bash
rg --no-line-number 'href="/projets"|Des décisions concrètes' src/components/home/HomeProjectsPreview.astro
```

Expected output includes:

```text
            <h3 class="text-gradient">Des décisions concrètes, pas seulement une stack</h3>
              <Button href="/projets" icon={iArrowForward} label="Explorer les projets" />
```

---

### Task 5: Implement expertise and method previews

**Files:**
- Create: `src/components/home/HomeExpertisePreview.astro`
- Create: `src/components/home/HomeMethodPreview.astro`

- [ ] **Step 1: Create the expertise preview**

Create `src/components/home/HomeExpertisePreview.astro` with:

```astro
---
import { Card } from "@components/Card";
import { Line } from "@components/Line";
import { LinearGradient } from "@components/LinearGradient";
import { Button, Icon } from "@udixio/ui-react";
import { iArrowForward } from "@udixio/icons-outlined-400/arrow_forward";
import { iCode } from "@udixio/icons-outlined-400/code";
import { iApi } from "@udixio/icons-outlined-400/api";
import { iDevices } from "@udixio/icons-outlined-400/devices";
import { iTaskAlt } from "@udixio/icons-outlined-400/task_alt";
import { expertiseProofs } from "./homeContent";

const proofIcons = [iDevices, iApi, iCode, iTaskAlt];
---

<div id="expertise-preview" class="tab-menu theme-orange bg-surface">
  <section>
    <div class="max-width">
      <div class="flex pt-8">
        <div>
          <Line client:idle icon={iCode} nextTheme="blue" />
        </div>

        <div class="padding pt-0 flex flex-col justify-center max-w-5xl">
          <h2 class="text-title-large text-tertiary" data-sidebar-label="Expertise">Expertise</h2>
          <div class="mt-4 text-headline-large md:text-display-medium max-w-prose">
            <h3 class="text-gradient">Full-stack, mais orienté produit</h3>
          </div>
          <p class="mt-6 text-body-large text-on-surface-variant max-w-prose">
            Front-end, back-end, API, CMS, performance : l’expertise sert la cohérence du produit, pas une vitrine d’outils.
          </p>
        </div>
      </div>

      <div class="padding-x mt-12">
        <Card client:visible variant="filled" className="group">
          <div class="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-[.9fr_1.1fr] gap-8 items-start">
            <div>
              <span class="text-label-large text-tertiary uppercase tracking-wide">Capacités</span>
              <h3 class="mt-4 text-headline-medium text-on-surface max-w-prose">
                Relier interface, architecture et maintenabilité
              </h3>
              <p class="mt-5 text-body-large text-on-surface-variant">
                Le détail technique reste disponible sur la page expertise. La home doit seulement montrer le fil conducteur : chaque compétence sert une décision produit.
              </p>
              <div class="mt-8">
                <Button href="/expertise" icon={iArrowForward} label="Voir l’expertise" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {expertiseProofs.map((proof, index) => (
                <div class="rounded-2xl bg-surface-container-low p-5">
                  <Icon icon={proofIcons[index]} className="h-6 w-6 text-tertiary" />
                  <p class="mt-4 text-body-large text-on-surface">{proof}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div class="flex h-24 md:h-32">
        <div>
          <Line client:idle />
        </div>
      </div>
    </div>
  </section>

  <LinearGradient nextTheme="blue" />
</div>
```

- [ ] **Step 2: Create the method preview**

Create `src/components/home/HomeMethodPreview.astro` with:

```astro
---
import { Card } from "@components/Card";
import { Line } from "@components/Line";
import { Button, Icon } from "@udixio/ui-react";
import { iArrowForward } from "@udixio/icons-outlined-400/arrow_forward";
import { iFactCheck } from "@udixio/icons-outlined-400/fact_check";
import { iArchitecture } from "@udixio/icons-outlined-400/architecture";
import { iSearch } from "@udixio/icons-outlined-400/search";
import { iShield } from "@udixio/icons-outlined-400/shield";
import { methodProofs } from "./homeContent";

const proofIcons = [iSearch, iArchitecture, iShield];
---

<div id="methode-preview" class="tab-menu theme-blue bg-surface">
  <section>
    <div class="max-width">
      <div class="flex pt-8">
        <div>
          <Line client:idle icon={iFactCheck} />
        </div>

        <div class="padding pt-0 flex flex-col justify-center max-w-5xl">
          <h2 class="text-title-large text-tertiary" data-sidebar-label="Méthode">Méthode</h2>
          <div class="mt-4 text-headline-large md:text-display-medium max-w-prose">
            <h3 class="text-gradient">L’IA accélère, l’ingénierie sécurise</h3>
          </div>
          <p class="mt-6 text-body-large text-on-surface-variant max-w-prose">
            Cadrage, architecture, revue, tests et arbitrages : la méthode explique comment éviter les produits fragiles.
          </p>
        </div>
      </div>

      <div class="padding-x mt-12 mb-16">
        <Card client:visible variant="filled" energyX className="group">
          <div class="p-6 md:p-10">
            <div class="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8">
              <div>
                <span class="text-label-large text-tertiary uppercase tracking-wide">Anti-vibe coding</span>
                <h3 class="mt-4 text-headline-medium text-on-surface max-w-prose">
                  Accélérer sans perdre la maîtrise
                </h3>
                <p class="mt-5 text-body-large text-on-surface-variant">
                  L’IA peut produire vite. La différence se joue dans le cadrage, la revue, les tests et les arbitrages qui transforment du code en solution fiable.
                </p>
                <div class="mt-8">
                  <Button href="/methode" icon={iArrowForward} label="Comprendre la méthode" />
                </div>
              </div>

              <div class="space-y-4">
                {methodProofs.map((proof, index) => (
                  <div class="flex items-center gap-3 rounded-2xl bg-surface-container-low p-5">
                    <Icon icon={proofIcons[index]} className="h-5 w-5 text-tertiary shrink-0" />
                    <span class="text-body-large text-on-surface">{proof}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </section>
</div>
```

- [ ] **Step 3: Verify the preview links**

Run:

```bash
rg --no-line-number 'href="/expertise"|href="/methode"|Full-stack, mais orienté produit|L’IA accélère' src/components/home
```

Expected output includes:

```text
            <h3 class="text-gradient">Full-stack, mais orienté produit</h3>
                <Button href="/expertise" icon={iArrowForward} label="Voir l’expertise" />
            <h3 class="text-gradient">L’IA accélère, l’ingénierie sécurise</h3>
                  <Button href="/methode" icon={iArrowForward} label="Comprendre la méthode" />
```

---

### Task 6: Replace the homepage orchestrator

**Files:**
- Modify: `src/pages/index.astro`
- Read: `src/pages/expertise.astro`
- Read: `src/pages/methode.astro`

- [ ] **Step 1: Replace `src/pages/index.astro` with the new orchestrator**

Replace the complete contents of `src/pages/index.astro` with:

```astro
---
import Layout from "../layouts/Layout.astro";
import HomeHero from "../components/home/HomeHero.astro";
import HomeContextPaths from "../components/home/HomeContextPaths.astro";
import HomeProjectsPreview from "../components/home/HomeProjectsPreview.astro";
import HomeExpertisePreview from "../components/home/HomeExpertisePreview.astro";
import HomeMethodPreview from "../components/home/HomeMethodPreview.astro";

const faq = [
  {
    question: "Que peut-on trouver sur cette page d’accueil ?",
    answer:
      "Une lecture rapide de mon profil : développeur full-stack, mes contextes de collaboration, mes projets, mon expertise et ma méthode de travail.",
  },
  {
    question: "Travaillez-vous en mission ou en équipe ?",
    answer:
      "Les deux contextes sont possibles. Le site présente mon approche pour confier une mission et mon profil pour évaluer une intégration dans une équipe produit ou technique.",
  },
  {
    question: "Où voir votre niveau technique en détail ?",
    answer:
      "La page Expertise détaille les sujets front-end, back-end, architecture, CMS, performance et adaptation aux stacks existantes.",
  },
  {
    question: "Comment évaluez-vous l’usage de l’IA dans le développement ?",
    answer:
      "L’IA est un levier de vitesse, pas un pilote automatique. Ma méthode repose sur le cadrage, l’architecture, la revue de code, les tests et les arbitrages humains.",
  },
];
---

<Layout
  faq={faq}
  seo={{
    title: "Joël Vigreux - Développeur full-stack orienté produit",
    description:
      "Joël Vigreux, développeur full-stack. Conception de produits web fiables, interfaces premium, architecture maintenable et méthode d’ingénierie pragmatique.",
    openGraph: {
      basic: {
        title: "Joël Vigreux - Développeur full-stack",
        type: "website",
        image: "https://vigreux-joel.fr/images/photo.webp",
        url: "https://vigreux-joel.fr/",
      },
      optional: {
        siteName: "Joël Vigreux",
        locale: "fr_FR",
        description:
          "Développeur full-stack orienté produit : interfaces premium, architecture maintenable et livraison pragmatique.",
      },
      image: {
        alt: "Portrait de Joël Vigreux, développeur full-stack",
      },
    },
    twitter: {
      card: "summary_large_image",
      title: "Joël Vigreux - Développeur full-stack",
      description:
        "Développeur full-stack orienté produit. Interfaces premium, architecture maintenable et méthode d’ingénierie pragmatique.",
      image: "https://vigreux-joel.fr/images/photo.webp",
      imageAlt: "Portrait de Joël Vigreux",
    },
  }}
>
  <script type="application/ld+json" is:inline>
    {
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Joël Vigreux",
        "jobTitle": "Développeur full-stack",
        "url": "https://vigreux-joel.fr/",
        "image": "https://vigreux-joel.fr/images/photo.webp"
      })
    }
  </script>

  <script type="application/ld+json" is:inline>
    {
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Joël Vigreux - Développeur full-stack",
        "url": "https://vigreux-joel.fr/"
      })
    }
  </script>

  <HomeHero />
  <HomeContextPaths />
  <HomeProjectsPreview />
  <HomeExpertisePreview />
  <HomeMethodPreview />
</Layout>
```

- [ ] **Step 2: Verify obsolete imports are gone**

Run:

```bash
rg --no-line-number "WowBackdrop|home-1|StickyScroll|Obfuscate|TextField|Contact|Techno|astroLogo|nestLogo|tailwindLogo" src/pages/index.astro
```

Expected: no output, command exits with code `1`.

- [ ] **Step 3: Verify the orchestrator imports the new sections**

Run:

```bash
rg --no-line-number "HomeHero|HomeContextPaths|HomeProjectsPreview|HomeExpertisePreview|HomeMethodPreview" src/pages/index.astro
```

Expected output includes:

```text
import HomeHero from "../components/home/HomeHero.astro";
import HomeContextPaths from "../components/home/HomeContextPaths.astro";
import HomeProjectsPreview from "../components/home/HomeProjectsPreview.astro";
import HomeExpertisePreview from "../components/home/HomeExpertisePreview.astro";
import HomeMethodPreview from "../components/home/HomeMethodPreview.astro";
  <HomeHero />
  <HomeContextPaths />
  <HomeProjectsPreview />
  <HomeExpertisePreview />
  <HomeMethodPreview />
```

---

### Task 7: Build verification and fixes

**Files:**
- Potentially modify files created in Tasks 1-6 if the build reports exact syntax/type errors.

- [ ] **Step 1: Run the production build**

Run:

```bash
pnpm run build
```

Expected: build exits with code `0`.

If the build fails on an icon import from `@udixio/icons-outlined-400/*`, replace only the missing icon import with an icon already proven in the repo:

- `iArrowForward` from `@udixio/icons-outlined-400/arrow_forward`
- `iFactCheck` from `@udixio/icons-outlined-400/fact_check`
- `iSearch` from `@udixio/icons-outlined-400/search`
- `iArchitecture` from `@udixio/icons-outlined-400/architecture`
- `iCode` from `@udixio/icons-outlined-400/code`
- `iApi` from `@udixio/icons-outlined-400/api`
- `iDevices` from `@udixio/icons-outlined-400/devices`
- `iIdCard` from `@udixio/icons-outlined-400/id_card`
- `iRoute` from `@udixio/icons-outlined-400/route`
- `iShield` from `@udixio/icons-outlined-400/shield`
- `iTaskAlt` from `@udixio/icons-outlined-400/task_alt`

Run `pnpm run build` again after the targeted import fix.

- [ ] **Step 2: Verify the build removed the previous missing-home-asset failure**

Run:

```bash
rg --no-line-number "home-1|WowBackdrop" src
```

Expected: no output for `src/pages/index.astro`. If matches appear in unrelated comments or old files, inspect them and confirm they are not imported by the homepage.

- [ ] **Step 3: Start local preview for manual inspection**

Run:

```bash
pnpm run dev
```

Expected output includes a local Astro URL such as:

```text
Local
```

Open `/` and inspect:

- desktop first screen: “Joël Vigreux”, “Développeur full-stack”, animated differentiator line;
- mobile first screen: no horizontal overflow and no layout shift from the animated text;
- section 2: labels are exactly “Confier une mission” and “Évaluer mon profil”;
- links present: `/projets`, `/methode`, `/mission`, `/profil`, `/expertise`;
- footer CTA still appears through `Layout` / `Footer`.

Stop the dev server with `Ctrl+C` after inspection.

- [ ] **Step 4: Verify reduced motion manually**

In browser devtools, emulate `prefers-reduced-motion: reduce` and reload `/`.

Expected:

- the third hero line stays readable;
- only one differentiator is visible;
- no animated cycling occurs.

---

### Task 8: Final review and commit

**Files:**
- Review all files touched in Tasks 1-7.

- [ ] **Step 1: Review the final diff**

Run:

```bash
git diff -- src/pages/index.astro src/components/home
```

Expected:

- `src/pages/index.astro` is short and section-driven;
- the old monolithic homepage content is removed;
- no tech-logo toolbox grid remains on the homepage;
- no contact CTA is added inside the homepage sections;
- the footer CTA remains the contact conclusion.

- [ ] **Step 2: Check repository status**

Run:

```bash
git status --short
```

Expected:

```text
 M src/pages/index.astro
?? src/components/home/
```

Other pre-existing user changes may be present. Do not stage unrelated files.

- [ ] **Step 3: Stage only homepage files**

Run:

```bash
git add src/pages/index.astro src/components/home
```

Expected: command exits with code `0`.

- [ ] **Step 4: Commit the homepage refactor**

Run:

```bash
git commit -m "feat(home): refonte éditoriale de la page accueil"
```

Expected output includes:

```text
feat(home): refonte éditoriale de la page accueil
```

- [ ] **Step 5: Confirm final status**

Run:

```bash
git status --short
```

Expected: no staged homepage files remain. Pre-existing unrelated files may still appear.

---

## Spec coverage self-review

- Hero stable title: covered by Task 2 and Task 6.
- Dynamic differentiator line: covered by Task 2, with reduced-motion behavior.
- Two contexts without “freelance / CDI / équipe” labels: covered by Task 3.
- “Évaluer mon profil” wording: covered by Task 1 and Task 3.
- Projects preview: covered by Task 4.
- Expertise preview without toolbox grid: covered by Task 5.
- Method preview and “IA accélère, ingénierie sécurise”: covered by Task 5.
- Footer CTA remains global: covered by Task 6 and Task 8 review.
- Old monolithic homepage removal: covered by Task 6.
- Build and manual verification: covered by Task 7.
