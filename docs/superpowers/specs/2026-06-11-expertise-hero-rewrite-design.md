# Design Spec — Expertise Hero Rewrite & Lines Flow

**Date :** 2026-06-11  
**Scope :** `HeroSection` (ex-`AccueilSection`) + `FrontEndSection` jusqu'avant la section multiplateforme (`iDevices`)

---

## 1. Renommage

`src/components/expertise/AccueilSection.astro` → `src/components/expertise/HeroSection.astro`

Mettre à jour l'import dans `src/pages/expertise.astro` :
```diff
- import AccueilSection from "../components/expertise/AccueilSection.astro";
+ import HeroSection from "../components/expertise/HeroSection.astro";
```
Et dans le template :
```diff
- <AccueilSection />
+ <HeroSection />
```

---

## 2. HeroSection — Structure (3 Lines)

### Line 1 — iCode (inchangée)
- Icône : `iCode`
- `nextTheme` : pas de changement
- Contenu : H1 "Mon Expertise Technique" avec le span gradient (inchangé)

### Line 2 — iIdCard (bio réécrite)
- Icône : `iIdCard`
- Titre : supprimer "Mon parcours"
- Corps :

> "Développeur full-stack depuis 2022 — parti d'un titre professionnel Dev Web & Mobile, je conçois aujourd'hui des interfaces React, Astro et Angular, des architectures NestJS scalables et des apps multiplateformes Flutter."

Classe : `text-body-large max-w-3xl`

### Line 3 — iLayers (nouveau)
- Icône : `iLayers` importé depuis `@udixio/icons-outlined-400/layers` — vérifier la disponibilité au moment de l'implémentation ; fallback : `iInfo`
- `nextTheme="purple"` (transition vers FrontEndSection)
- Contenu : 4 chips de domaines

```html
<div class="flex flex-wrap gap-3 mt-2">
  <span class="px-4 py-1 rounded-full text-label-medium bg-secondary-container text-on-secondary-container">Front-End</span>
  <span class="px-4 py-1 rounded-full text-label-medium bg-secondary-container text-on-secondary-container">Back-End</span>
  <span class="px-4 py-1 rounded-full text-label-medium bg-secondary-container text-on-secondary-container">UX / UI</span>
  <span class="px-4 py-1 rounded-full text-label-medium bg-secondary-container text-on-secondary-container">Multiplateforme</span>
</div>
```

Utiliser uniquement des tokens sémantiques M3 (`bg-secondary-container`, `text-on-secondary-container`). Pas de thème par chip — le thème global de la section suffit. Pas d'opacité arbitraire.

---

## 3. FrontEndSection — Line de transition entrante

Ajouter une `<Line client:idle />` sans icône ni contenu **juste avant** le `div.min-h-[50vh]` du heading "Ingénierie Front-End.". Hauteur : `h-16` ou via la Line elle-même.

Objectif : la timeline est visuellement active avant le grand heading centré — le heading dramatique plein-écran est préservé.

```astro
<!-- Connecteur entrant depuis HeroSection -->
<div class="max-width padding-x">
  <div class="relative h-16">
    <Line fromX={0.03} toX={0.03} client:idle />
  </div>
</div>

<!-- Heading existant — inchangé -->
<div class="min-h-[50vh] flex flex-col justify-center text-center pt-24 pb-0">
  ...
</div>
```

---

## 4. FrontEndSection — Corrections design (avant multiplateforme)

| Fichier | Violation | Correction |
|---------|-----------|------------|
| FrontEndSection.astro | `bg-primary/50` sur divs connecteurs | Supprimer le background (inutile sur des divs de Lines) |
| FrontEndSection.astro | `from-purple-900/30` dans la carte React | Remplacer par `from-primary/10` |
| FrontEndSection.astro | `border-white/10` | Remplacer par `border-outline-variant` |
| FrontEndSection.astro | `tracking-widest font-bold` sur labels `text-label-medium` | Supprimer — `text-label-medium` seul définit la typographie |

---

## 5. Hors scope

- Section multiplateforme (`iDevices` et après) : pas de modification dans cette itération
- BackEndSection, UxSection, PhilosophieSection, FaqSection : inchangées
- Animations et système de Lines : inchangés
