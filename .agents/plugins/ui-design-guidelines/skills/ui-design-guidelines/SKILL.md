---
name: ui-design-guidelines
description: Compétence obligatoire à activer pour toute création ou modification d'interface utilisateur, de composants ou de pages web.
---
# Directives d'Intégration et de Design Visuel

Tu agis en tant qu'Expert UI/UX. Lors de la conception, génération ou modification d'interfaces sur ce site, respecte ce cadre de pensée et ces directives techniques pour produire un résultat premium, mémorable et exempt d'esthétique générique d'IA ("AI slop").

## 1. Design Thinking (Réflexion avant codage)
Avant d'écrire la moindre ligne de code, pose-toi ces quatre questions :
1.  **Purpose (Utilité) :** Quel problème cette section ou page résout-elle pour le visiteur ?
2.  **Tone (Direction Artistique) :** Comment s'inscrit-elle dans notre style visuel (premium, texturé, immersif) ?
3.  **Constraints (Contraintes) :** Quels sont les composants existants (`Card`, `Line`) ou variables de couleurs de [udixio.css](file:///home/joel/Documents/projets/vigreux-joel.fr/src/styles/udixio.css) à réutiliser ?
4.  **Differentiation (Signature visuelle) :** Quelle est l'interaction ou l'asymétrie visuelle qui rendra cette section mémorable ?

---

## 2. Intégration du Design System (Directives Techniques)

### A. Clés de Couleurs et Hiérarchie (Material 3)
Les couleurs sont gérées dynamiquement par `@udixio/tailwind` à partir de [udixio.css](file:///home/joel/Documents/projets/vigreux-joel.fr/src/styles/udixio.css).

*   **Pas de Transparence Arbitraire :** N'ajoute pas d'opacités manuelles (ex: `/70` ou `opacity-*`) pour "atténuer" une couleur ou tenter de créer de la hiérarchie.
    *   *Pour les fonds :* Utilise la palette de conteneurs Material 3 : `bg-surface-container-low`, `bg-surface-container`, `bg-surface-container-high`, `bg-surface-container-highest`.
    *   *Pour le texte :* Utilise `text-on-surface-variant` (texte secondaire) au lieu d'atténuer `text-on-surface`.
*   **Sub-Themes Dynamiques :** Les composants doivent s'adaptent au thème de couleur actif. Si tu enveloppes une section dans une classe thématique (`theme-blue`, `theme-green`, `theme-purple`, `theme-orange`), toutes les variables de couleur héritées (`primary`, `secondary`, `surface-container`, etc.) s'adaptent automatiquement sans style codé en dur.

### B. Typographie & Polices
Les polices sont mappées de manière centralisée dans [udixio.css](file:///home/joel/Documents/projets/vigreux-joel.fr/src/styles/udixio.css) :
*   **Polices Expressives (Titres, Display, Headline) :** Mappent automatiquement la police `Montserrat` (ex: `text-display-large`, `text-headline-medium`).
*   **Polices Neutres (Corps de texte, Boutons, Labels, Titles) :** Mappent automatiquement la police `Roboto` (ex: `text-title-medium`, `text-body-large`, `text-label-large`).
*   **Règle :** Utilise systématiquement les rôles textuels standardisés de Material 3 (`text-*`) pour conserver l'application automatique de la police, du poids et de la taille correspondante. Évite de forcer des polices ou tailles en pixels à la main.

### C. Composition Spatiale & Mise en page
*   **Asymétrie et rythme :** Évite les grilles symétriques 50/50 systématiques et répétitives. Utilise des décalages, de l'espace négatif généreux et des compositions asymétriques pour donner un rythme éditorial de type magazine de luxe.
*   **Profondeur visuelle :** Utilise les effets de profondeur natifs (fonds floutés avec glassmorphism, texture de grain, gradients de la couleur primaire à la couleur tertiaire) pour faire ressortir les informations importantes.

### D. Mouvement & Animations (Motion)
*   **Focus High-Impact :** Concentre le mouvement sur des moments précis de transition (comme l'entrée d'une section au défilement) plutôt que d'éparpiller des micro-animations désordonnées et distrayantes sur chaque bouton ou texte.
*   **Accessibilité :** Assure-toi que l'expérience reste parfaitement fonctionnelle et simplifiée si `prefers-reduced-motion` est détecté.

### E. Composants Standards de l'Interface
*   **Conteneurs (`Card`) :** Utilise le composant `<Card />` existant pour tout conteneur ou bloc d'informations. Il encapsule déjà tous les styles physiques et interactifs (flou de fond glassmorphism, effet spotlight interactif, coins en superellipse). Ne recrée pas de styles de cartes personnalisés à la main.
*   **Lignes narratives (`Line`) :** Utilise le composant `<Line />` pour séparer ou lier visuellement les sections de manière animée et interactive.
