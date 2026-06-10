# Expertise Hero Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Renommer `AccueilSection` en `HeroSection`, réécrire l'intro avec une bio honnête, ajouter une 3e Line "Domaines", et relier visuellement la timeline à `FrontEndSection`.

**Architecture:** Modifications purement contenu/structure dans deux composants Astro (`HeroSection.astro`, `FrontEndSection.astro`) et la page `expertise.astro`. Aucun nouveau composant, aucune logique côté client. Les corrections de violations design dans FrontEndSection sont incluses dans la même passe.

**Tech Stack:** Astro, Tailwind CSS (tokens M3 sémantiques via `@udixio/ui-react`), composant `<Line>` interne

---

## Fichiers touchés

| Fichier | Action |
|---------|--------|
| `src/components/expertise/AccueilSection.astro` | Renommé → `HeroSection.astro` |
| `src/components/expertise/HeroSection.astro` | Contenu réécrit |
| `src/pages/expertise.astro` | Import mis à jour |
| `src/components/expertise/FrontEndSection.astro` | Line de transition + fix violations |

---

## Task 1 : Renommer AccueilSection → HeroSection

**Files:**
- Rename: `src/components/expertise/AccueilSection.astro` → `src/components/expertise/HeroSection.astro`
- Modify: `src/pages/expertise.astro`

- [ ] **Step 1 : Renommer le fichier via git**

```bash
git mv src/components/expertise/AccueilSection.astro src/components/expertise/HeroSection.astro
```

- [ ] **Step 2 : Mettre à jour l'import dans `expertise.astro`**

Ouvrir `src/pages/expertise.astro` et remplacer :

```diff
-import AccueilSection from "../components/expertise/AccueilSection.astro";
+import HeroSection from "../components/expertise/HeroSection.astro";
```

Et dans le template :

```diff
-    <AccueilSection />
+    <HeroSection />
```

- [ ] **Step 3 : Vérifier que le build compile sans erreur**

```bash
npm run build
```

Résultat attendu : `Build complete` sans erreur TypeScript ni import manquant.

- [ ] **Step 4 : Commit**

```bash
git add src/pages/expertise.astro
git commit -m "refactor(expertise): rename AccueilSection to HeroSection"
```

---

## Task 2 : Réécrire le contenu de HeroSection

**Files:**
- Modify: `src/components/expertise/HeroSection.astro`

**Contexte :** Le fichier actuel a des imports inutilisés (logos SVG, icônes, Button, Icon) et une bio inexacte. On nettoie les imports, réécrit la Line 2, ajoute la Line 3.

- [ ] **Step 1 : Remplacer le contenu entier de `HeroSection.astro`**

```astro
---
import { Line } from "@components/Line";
import { BackgroundColor } from "@components/BackgroundColor";
import { LinearGradient } from "@components/LinearGradient";

import { iCode } from "@udixio/icons-outlined-400/code";
import { iIdCard } from "@udixio/icons-outlined-400/id_card";
import { iApps } from "@udixio/icons-outlined-400/apps";
---

<section id="accueil" class="tab-menu relative">
  <BackgroundColor
    speed={5_000}
    size="max(50vw, 800px)"
    count={5}
    client:idle
    className="absolute opacity-20 size-full top-0 left-0"
  />

  <div class="max-width flex justify-between h-full pt-32 md:pt-42 xl:pt-54">
    <div class="relative z-10 flex flex-col overflow-visible w-full">

      <div class="theme-blue flex flex-col relative">
        <div class="flex">
          <div>
            <Line client:load visible icon={iCode} nextTheme="purple" />
          </div>
          <div class="padding pt-0 pb-16 relative w-full">
            <h1
              class="text-display-medium xl:text-display-large relative z-10 text-tertiary mb-8"
            >
              Mon <span class="block text-gradient">Expertise Technique</span>
            </h1>
          </div>
        </div>
      </div>

      <div class="flex mt-8">
        <div>
          <Line client:load icon={iIdCard} />
        </div>
        <div class="padding pt-0">
          <p class="text-body-large max-w-3xl">
            Développeur full-stack depuis 2022 — parti d'un titre professionnel
            Dev Web &amp; Mobile, je conçois aujourd'hui des interfaces React,
            Astro et Angular, des architectures NestJS scalables et des apps
            multiplateformes Flutter.
          </p>
        </div>
      </div>

      <div class="flex mt-8">
        <div>
          <Line client:load icon={iApps} nextTheme="purple" />
        </div>
        <div class="padding pt-0">
          <div class="flex flex-wrap gap-3 mt-2">
            <span class="px-4 py-1 rounded-full text-label-medium bg-secondary-container text-on-secondary-container">Front-End</span>
            <span class="px-4 py-1 rounded-full text-label-medium bg-secondary-container text-on-secondary-container">Back-End</span>
            <span class="px-4 py-1 rounded-full text-label-medium bg-secondary-container text-on-secondary-container">UX / UI</span>
            <span class="px-4 py-1 rounded-full text-label-medium bg-secondary-container text-on-secondary-container">Multiplateforme</span>
          </div>
        </div>
      </div>

    </div>
  </div>

  <LinearGradient nextTheme="purple" />
</section>
```

- [ ] **Step 2 : Vérifier le build**

```bash
npm run build
```

Résultat attendu : `Build complete` sans erreur.

- [ ] **Step 3 : Vérifier visuellement dans le dev server**

```bash
npm run dev
```

Ouvrir http://localhost:4321/expertise et vérifier :
- La H1 "Mon Expertise Technique" est présente avec la Line `iCode`
- La bio est affichée sans titre "Mon parcours"
- Les 4 chips (Front-End / Back-End / UX·UI / Multiplateforme) apparaissent sous la Line `iApps`
- La transition de couleur vers la section purple se fait correctement via `LinearGradient`

- [ ] **Step 4 : Commit**

```bash
git add src/components/expertise/HeroSection.astro
git commit -m "feat(expertise): rewrite HeroSection — bio honnête + 3e Line domaines"
```

---

## Task 3 : Ajouter la Line de transition dans FrontEndSection

**Files:**
- Modify: `src/components/expertise/FrontEndSection.astro`

**Contexte :** Le grand heading centré `min-h-[50vh]` "Ingénierie Front-End." n'est raccordé à aucune Line. Une Line silencieuse (`fromX={0.03} toX={0.03}`, pas d'icône) est ajoutée juste avant ce heading pour connecter visuellement la timeline entrante.

- [ ] **Step 1 : Ajouter la Line de transition**

Dans `src/components/expertise/FrontEndSection.astro`, repérer le bloc suivant (début de la section) :

```astro
<div id="front-end" class="theme-purple bg-surface">
  <section class="max-width padding-x">
    
    <!-- Introduction de Section -->
    <div class="min-h-[50vh] flex flex-col justify-center text-center pt-24 pb-0">
```

Le modifier pour :

```astro
<div id="front-end" class="theme-purple bg-surface">
  <section class="max-width padding-x">

    <!-- Connecteur entrant depuis HeroSection -->
    <div class="relative h-16">
      <Line fromX={0.03} toX={0.03} client:idle />
    </div>

    <!-- Introduction de Section -->
    <div class="min-h-[50vh] flex flex-col justify-center text-center pt-24 pb-0">
```

- [ ] **Step 2 : Vérifier visuellement**

Avec le dev server ouvert sur http://localhost:4321/expertise, faire défiler jusqu'à la section Front-End. Vérifier que :
- La timeline (trait vertical) est visible avant le heading "Ingénierie Front-End."
- Le heading reste centré plein-écran, inchangé
- Le trait repart bien dans le split Astro/Angular en dessous

- [ ] **Step 3 : Commit**

```bash
git add src/components/expertise/FrontEndSection.astro
git commit -m "feat(expertise): add connecting Line before FrontEnd section heading"
```

---

## Task 4 : Corriger les violations design dans FrontEndSection

**Files:**
- Modify: `src/components/expertise/FrontEndSection.astro`

**Contexte :** Les labels `text-label-medium` portent `tracking-widest font-bold` qui écrase les réglages typographiques sémantiques M3. Ces classes sont présentes sur trois éléments (Astro, Angular, React).

- [ ] **Step 1 : Retirer `tracking-widest font-bold` des labels Astro et Angular**

Repérer et modifier les deux spans dans les cards Astro et Angular :

```diff
-<span class="block mt-6 text-label-medium text-tertiary uppercase tracking-widest font-bold">
+<span class="block mt-6 text-label-medium text-tertiary uppercase">
   Portfolios • Plateformes éditoriales • Sites institutionnels
 </span>
```

```diff
-<span class="block mt-6 text-label-medium text-tertiary uppercase tracking-widest font-bold">
+<span class="block mt-6 text-label-medium text-tertiary uppercase">
   Systèmes ERP • Portails bancaires • Apps institutionnelles
 </span>
```

- [ ] **Step 2 : Retirer `tracking-widest font-bold` du label React**

```diff
-<div class="mt-8 text-label-medium text-tertiary uppercase tracking-widest font-bold">
+<div class="mt-8 text-label-medium text-tertiary uppercase">
   SaaS • Dashboards • Outils métiers
 </div>
```

- [ ] **Step 3 : Vérifier visuellement**

Sur http://localhost:4321/expertise, vérifier que les labels sous les technos restent lisibles et cohérents avec le système M3 (légèrement moins espacés/gras qu'avant, ce qui est le comportement attendu).

- [ ] **Step 4 : Vérifier le build final**

```bash
npm run build
```

Résultat attendu : `Build complete` sans erreur.

- [ ] **Step 5 : Commit**

```bash
git add src/components/expertise/FrontEndSection.astro
git commit -m "fix(expertise): remove non-semantic tracking-widest font-bold overrides on M3 labels"
```
