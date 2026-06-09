---
name: ux-guidelines
description: Compétence obligatoire à activer pour toute création ou modification d'interface utilisateur, de composants, de pages web, d'UX globale, de parcours utilisateur (UX), ou pour la rédaction de textes et le copywriting (writing) sur le portfolio de Joël Vigreux.
---
# Directives Globales UI, UX & Writing (Portfolio Joël Vigreux)

En tant qu'Expert UI/UX et Copywriter Senior, tu dois respecter ces directives pour chaque modification visuelle, structurelle ou textuelle. L'objectif est de produire une expérience utilisateur (UX) fluide, un design visuel (UI) premium et un copywriting (Writing) sans clichés d'IA ("AI slop").

---

## 1. Design Visuel (UI) & Intégration Technique

Respecte scrupuleusement le système de design basé sur `@udixio/tailwind` et [udixio.css](file:///home/joel/Documents/projets/vigreux-joel.fr/src/styles/udixio.css).

### A. Clés de Couleurs et Hiérarchie (Material 3)
*   **Pas de Transparence Arbitraire :** N'ajoute pas d'opacités manuelles (ex: `/70` ou `opacity-*`) pour "atténuer" une couleur ou tenter de créer de la hiérarchie.
    *   *Pour les fonds :* Utilise la palette de conteneurs Material 3 : `bg-surface-container-low`, `bg-surface-container`, `bg-surface-container-high`, `bg-surface-container-highest`.
    *   *Pour le texte :* Utilise `text-on-surface-variant` (texte secondaire) au lieu d'atténuer `text-on-surface`.
*   **Sub-Themes Dynamiques :** Les composants doivent s'adapter au thème de couleur actif. Si tu enveloppes une section dans une classe thématique (`theme-blue`, `theme-green`, `theme-purple`, `theme-orange`), toutes les variables de couleur héritées (`primary`, `secondary`, `surface-container`, etc.) s'adaptent automatiquement sans style codé en dur.

### B. Typographie & Polices
*   **Polices Expressives (Titres, Display, Headline) :** Mappent automatiquement la police `Montserrat` (ex: `text-display-large`, `text-headline-medium`).
*   **Polices Neutres (Corps de texte, Boutons, Labels, Titles) :** Mappent automatiquement la police `Roboto` (ex: `text-title-medium`, `text-body-large`, `text-label-large`).
*   **Règle :** Utilise systématiquement les rôles textuels standardisés de Material 3 (`text-*`) pour conserver l'application automatique de la police, du poids et de la taille correspondante. Évite de forcer des polices ou tailles en pixels à la main.

### C. Composition Spatiale & Profondeur
*   **Asymétrie et rythme :** Évite les grilles symétriques 50/50 systématiques. Utilise des décalages, de l'espace négatif généreux et des compositions asymétriques pour donner un rythme éditorial (type magazine haut de gamme).
*   **Profondeur visuelle :** Utilise les effets de profondeur natifs (fonds floutés avec glassmorphism, texture de grain, gradients de la couleur primaire à la couleur tertiaire) pour faire ressortir les informations importantes.

### D. Mouvement & Animations (Motion)
*   **Focus High-Impact :** Concentre le mouvement sur des moments précis de transition (comme l'entrée d'une section au défilement) plutôt que d'éparpiller des micro-animations désordonnées et distrayantes sur chaque bouton ou texte.
*   **Accessibilité :** Assure-toi que l'expérience reste parfaitement fonctionnelle et simplifiée si `prefers-reduced-motion` est détecté.

### E. Composants Standards de l'Interface
*   **Conteneurs (`Card`) :** Utilise le composant `<Card />` existant pour tout conteneur ou bloc d'informations. Il encapsule déjà tous les styles physiques et interactifs (flou de fond glassmorphism, effet spotlight interactif, coins en superellipse). Ne recrée pas de styles de cartes personnalisés à la main.
*   **Lignes narratives (`Line`) :** Utilise le composant `<Line />` pour séparer ou lier visuellement les sections de manière animée et interactive.

---

## 2. Expérience Utilisateur (UX) & Parcours

L'UX doit refléter le positionnement de Joël : **Product Engineer & Développeur Full-Stack**.

### A. Structuration de l'Expertise (Finie la "Boîte à outils")
*   **Ne crée jamais de simples grilles de logos ou de badges de compétences.** C'est un anti-pattern UX qui dévalorise l'expertise.
*   **Hiérarchise l'expertise dans la structure :**
    *   *Technologies "Moteurs" (AWS, Astro, React, Angular) :* Mises en avant visuellement par des sections dédiées ou des `Cards` interactives premium.
    *   *Technologies "Fondations" (TypeScript, Tailwind, a11y) :* Intégrées subtilement dans le discours et les paragraphes descriptifs comme preuves de rigueur et d'ingénierie, et non sous forme de badges isolés.
*   **Espaces vides :** Comble toujours les espaces vides par des textes narratifs accrocheurs ou des layouts asymétriques élégants.

### B. Tunnels Stratégiques
Toutes les pages et liens doivent guider l'utilisateur vers l'un des deux tunnels clés :
1.  **Tunnel Produit (`/developpement-produit`) :** Cible *Clients / Freelance*. Met l'accent sur le ROI, la vélocité, le design UI/UX léché combiné à une architecture AWS adaptée au budget.
2.  **Tunnel Profil (`/profil`) :** Cible *Recruteurs / CTOs*. Met l'accent sur l'ingénierie pure, la sécurité, l'architecture AWS robuste, l'esprit d'équipe, et le rôle de garant de la qualité (Code Review).

---

## 3. Charte de Rédaction & Copywriting (Writing)

Le writing est le pilier qui transforme une interface esthétique en outil de conversion. Il doit refléter l'ADN de Joël : **pragmatisme architectural** et **rigueur humaine**.

### A. Ton & Voix
*   **Pragmatique & Direct :** Pas de fioritures. Sois clair, concis et factuel.
*   **Professionnel & Senior :** Exprime de l'assurance technique sans arrogance. Parle de valeur métier, d'architecture propre et de ROI.
*   **Haut de gamme :** Le vocabulaire doit être soigné et précis.
*   **Humain & Garanti :** Mets en avant l'approche "Anti-Vibe Coding". Explique que l'IA est utilisée pour aller vite (prototypage, génération), mais que c'est la rigueur humaine (tests automatisés, Code Review stricte) qui garantit l'absence de dette technique et la sécurité.

### B. Chasse au "Cliché d'IA" (Anti-AI Slop)
Les agents IA ont tendance à utiliser un langage trop corporatif et pompeux. **Bannis définitivement** les termes et tournures suivants :
*   *❌ "Révolutionner", "Innover", "Façonner l'avenir", "Dans le paysage numérique d'aujourd'hui"* (Formules creuses).
*   *❌ "Découvrez comment...", "Nous vous accompagnons...", "Optimiser votre potentiel"* (Style commercial générique).
*   *❌ Les superlatifs non prouvés : "révolutionnaire", "ultime", "inégalé"*.
*   *Préfère :* Des phrases affirmatives directes, des verbes d'action concrets et des explications basées sur des faits (ex: au lieu de "Innover avec AWS", écris "Déployer sur AWS pour réduire vos coûts fixes de 30%").

### C. Règles de Langue
*   Rédige par défaut en **français de haute qualité**, avec une orthographe et une grammaire impeccables.
*   Utilise le "je" pour exprimer la posture de Joël sur son portfolio personnel, ou le "nous" si le contexte décrit une collaboration étroite avec le client sur un produit.

---

## 4. Maintenance du fichier `design.md`

Pour que cette charte et l'état de l'art technique du projet restent synchronisés, le projet dispose d'un fichier `design.md` à la racine.
*   **Mise à jour systématique :** À chaque fois que tu ajoutes, modifies ou supprimes un composant UI important, une règle de style, ou un élément de la charte UX/Writing, tu dois mettre à jour le fichier `design.md` pour refléter l'existant.
*   **Commande slash :** Tu peux utiliser la commande `/maintain-design` (fournie par ce plugin) pour automatiser la détection et la mise à jour de `design.md` par rapport aux fichiers du projet.
