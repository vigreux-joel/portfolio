---
description: Crée et maintient le fichier design.md à la racine du projet en analysant l'existant (CSS, composants, context).
allowed-tools: Read, Write, Edit, Grep, ListDir
---
# Action : Analyse du Codebase et Maintenance de design.md

Tu dois analyser le codebase de ce projet pour créer ou mettre à jour de façon exhaustive le fichier `design.md` situé à la racine. Ce fichier sert de spécification de référence technique et fonctionnelle pour le design system, l'UX et la rédaction (writing).

## 1. Phase de recherche : Analyse de l'existant

Tu dois utiliser tes outils pour analyser :
1.  **Le Design System technique :**
    *   Examine [@/src/styles/udixio.css](file:///home/joel/Documents/projets/vigreux-joel.fr/src/styles/udixio.css) et [@/src/styles/global.css](file:///home/joel/Documents/projets/vigreux-joel.fr/src/styles/global.css) pour répertorier les variables de couleur Material 3, les thèmes (`theme-blue`, `theme-green`, etc.) et les classes CSS globales utiles (`text-gradient`, `square-area`, `sub-title`, etc.).
    *   Examine [@/theme.config.ts](file:///home/joel/Documents/projets/vigreux-joel.fr/theme.config.ts) pour documenter la configuration de `@udixio/ui-react` (polices expressive/neutral, tailles par défaut, sous-thèmes).
2.  **Les Composants UI réutilisables :**
    *   Scanne le dossier [@/src/components/](file:///home/joel/Documents/projets/vigreux-joel.fr/src/components/) et identifie les composants fondamentaux (comme `Card.tsx`, `Line.tsx`, `WowBackdrop.tsx`, `Techno.tsx`).
    *   Pour chacun de ces composants, ouvre-le pour comprendre ses `Props` acceptées et son comportement interactif (effets de survol, animations).
3.  **Les Directives UX et Stratégiques :**
    *   Lis [@/CONTEXT.md](file:///home/joel/Documents/projets/vigreux-joel.fr/CONTEXT.md) pour en extraire le positionnement de Joël (Product Engineer & Full-Stack), l'approche anti-vibe coding, la hiérarchie de l'expertise (technos moteurs vs fondations) et les tunnels stratégiques.

## 2. Phase de rédaction : Création / Mise à jour de design.md

Génère ou mets à jour le fichier [@/design.md](file:///home/joel/Documents/projets/vigreux-joel.fr/design.md) (à la racine du workspace). Le document doit être structuré de façon professionnelle avec les sections suivantes :

1.  **Vision UI/UX & Positionnement :**
    *   Résumé du positionnement (Product Engineer & Full-Stack).
    *   Les deux cibles stratégiques et leurs attentes (Clients/Freelance vs Recruteurs/CTO).
    *   Les deux tunnels de navigation (`/developpement-produit` et `/profil`).
2.  **Règles UX de Mise en Page :**
    *   Règle "Finie la boîte à outils" (pas de grille de logos brute).
    *   Hiérarchie de l'expertise (Technos Moteurs vs Technos Fondations).
    *   Asymétrie et espaces négatifs (style magazine haut de gamme).
3.  **Charte de Writing (Copywriting anti-IA) :**
    *   Le ton de voix (pragmatique, senior, direct, haut de gamme).
    *   L'approche "Anti-Vibe Coding" (l'humain garant de la qualité, l'IA accélératrice de prototypage).
    *   **Banned Words (Anti-AI Slop) :** Liste des termes publicitaires clichés à bannir (révolutionner, innover, façonner l'avenir, etc.) et exemples de réécriture concrète.
4.  **Design System Technique (CSS & Thèmes) :**
    *   Les polices de caractères (`Montserrat` pour l'expressif, `Roboto` pour le neutre) et comment les utiliser.
    *   La palette de couleurs Material 3 et ses conteneurs (`bg-surface-container-low`, etc.), interdiction des transparences arbitraires.
    *   Les sous-thèmes dynamiques (`theme-blue`, `theme-green`, `theme-purple`, `theme-orange`).
    *   Les classes utilitaires du projet (`text-gradient`, `square-area`, `sub-title`, `padding`, `section`).
5.  **Catalogue des Composants Clés :**
    *   Documente les composants trouvés (ex: `Card`, `Line`, `WowBackdrop`, `Techno`) en décrivant leur but, leurs Props techniques et comment les intégrer proprement.

## 3. Validation

Une fois le fichier généré, confirme sa création ou mise à jour, affiche un court résumé de son contenu et de sa structure, puis suggère à l'utilisateur de le parcourir.
