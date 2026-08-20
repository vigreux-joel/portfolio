# Spécifications de Design, d'UX & de Writing — Portfolio Joël Vigreux

Ce document est la source de vérité pour le design visuel (UI), l'expérience utilisateur (UX) et la charte éditoriale (Writing) du portfolio de Joël Vigreux. Il rassemble les règles conceptuelles et techniques pour garantir la cohérence et le niveau de qualité premium du site.

---

## 1. Vision UX & Positionnement

### A. Le Rôle & Positionnement
Joël Vigreux se positionne en tant que **Product Engineer & Développeur Full-Stack**. 
L'objectif du site est de démontrer une double expertise : une forte sensibilité produit et design (UI/UX) couplée à une rigueur d'ingénierie et d'architecture système (notamment AWS et Clean Code).

### B. Cibles Stratégiques
L'UX et le contenu doivent s'adresser simultanément à deux profils distincts :
*   **Les Clients / Freelance :** Ils recherchent le **ROI**, la **vélocité**, et des interfaces utilisateur soignées et engageantes qui valorisent leur produit.
*   **Les Recruteurs / CTOs :** Ils recherchent la **sécurité**, la **séniorité**, l'architecture robuste (AWS/microservices) et un esprit d'équipe/de transmission (Code Reviews, mentorship).

### C. Tunnels de Conversion
Les liens et appels à l'action doivent orienter les flux d'utilisateurs vers deux tunnels distincts :
1.  **Tunnel Produit (`/developpement-produit`) :** Dédié à la création de produits complets, de l'idée au marché (UI/UX + architecture AWS optimisée pour le budget).
2.  **Tunnel Profil (`/profil`) :** Dédié à l'ingénierie pure, la sécurité, l'architecture cloud et le rôle de garant de la qualité logicielle (Code Review, tests).

---

## 2. Règles UX de Structure & Mise en Page

### A. Présentation des Compétences ("Anti-Boîte à Outils")
*   **Règle d'or :** Ne jamais créer de grilles symétriques de logos simples ou de badges de technologies isolées. C'est un anti-pattern UX qui dévalorise le profil.
*   **Hiérarchisation de l'expertise :**
    *   **Technologies "Moteurs" (AWS, Astro, React, Angular) :** Elles propulsent les projets et doivent être mises en avant visuellement à l'aide de composants dédiés (ex. cartes premium, sections asymétriques).
    *   **Technologies "Fondations" (TypeScript, Tailwind, a11y) :** Elles sont le gage de la rigueur et doivent être intégrées subtilement au fil du discours textuel (paragraphes) pour prouver l'excellence technique sans encombrer l'espace visuel.

### B. Rythme & Composition Visuelle
*   **Asymétrie éditoriale :** Évite les layouts symétriques à 50/50 répétitifs. Préfère les décalages, l'utilisation généreuse d'espace négatif (vide) et les structures fluides inspirées des magazines de luxe.
*   **Comblement des espaces :** Les zones vides inattendues doivent être valorisées par des accroches textuelles narratives courtes ou des motifs asymétriques soignés, jamais par du remplissage générique.

---

## 3. Charte Éditoriale & Writing (Anti-AI Slop)

Le copywriting doit refléter la personnalité professionnelle de Joël. Il doit rejeter le verbiage automatique des intelligences artificielles au profit d'un ton d'ingénieur senior.

### A. Ton de Voix
*   **Pragmatique & Direct :** Allez droit au but. Exprimez les concepts complexes simplement.
*   **Haut de gamme & Professionnel :** Vocabulaire technique précis, formulation soignée, posture de consultant senior.
*   **Rigueur Humaine (L'approche "Anti-Vibe Coding") :** Expliquez clairement que l'IA est un formidable accélérateur de prototypage et de vitesse d'exécution, mais que la robustesse, la sécurité et l'absence de dette technique reposent exclusivement sur la rigueur humaine (tests automatisés, Code Review stricte).

### B. Mots & Expressions à Bannir (Anti-AI Slop)
Les clichés marketing d'IA affaiblissent le message technique. Ils sont proscrits :
*   ❌ *Révolutionner, Innover, Façonner l'avenir, Transformer vos idées.* (Trop vagues).
*   ❌ *Dans le paysage numérique d'aujourd'hui, À l'ère du digital.* (Clichés d'introduction).
*   ❌ *Découvrez comment nous pouvons vous accompagner..., Optimiser votre potentiel.* (Trop corporate commercial).
*   ❌ Les superlatifs non quantifiés (*ultime, inégalé, révolutionnaire*).

**Exemple de réécriture :**
*   *Avant (IA slop) :* "Innovez et révolutionnez votre entreprise grâce à nos solutions cloud AWS sur mesure."
*   *Après (Direct/Senior) :* "Déployez sur AWS pour réduire vos coûts fixes d'infrastructure tout en assurant une haute disponibilité."

---

## 4. Spécifications Techniques du Design System

Les styles du site sont centralisés et gérés dynamiquement dans [src/styles/udixio.css](file:///home/joel/Documents/projets/vigreux-joel.fr/src/styles/udixio.css) et configurés via [theme.config.ts](file:///home/joel/Documents/projets/vigreux-joel.fr/theme.config.ts).

### A. Couleurs & Hiérarchie Material 3
Les couleurs s'adaptent dynamiquement au mode actif (clair/sombre).
*   **Interdiction des opacités manuelles :** N'ajoute pas de pourcentages d'opacités arbitraires aux couleurs de texte ou de fond (comme `/70` ou `opacity-70`).
*   **Hiérarchie de fond :** Utilise la palette de conteneurs Material 3 :
    *   `bg-surface` (fond général)
    *   `bg-surface-container-low` (niveau d'élévation bas)
    *   `bg-surface-container` (niveau intermédiaire)
    *   `bg-surface-container-high` (niveau élevé)
    *   `bg-surface-container-highest` (niveau le plus élevé)
*   **Hiérarchie de texte :** 
    *   Texte principal : `text-on-surface`
    *   Texte secondaire : `text-on-surface-variant`
*   **Sub-Themes :** Le composant parent peut définir une couleur thématique locale en appliquant l'une des classes suivantes :
    *   `theme-blue` (Thème par défaut)
    *   `theme-green`
    *   `theme-cyan`
    Allégées par `@udixio/tailwind`, toutes les couleurs sémantiques (`primary`, `secondary`, `surface-container`, etc.) se remappent dynamiquement.

### B. Typographies & Rôles Textuels
*   **Police Expressive (Titres, Display, Headline) :** Mappe automatiquement `Montserrat`.
    *   Classes associées : `text-display-large`, `text-display-medium`, `text-display-small`, `text-headline-large`, `text-headline-medium`, `text-headline-small`.
*   **Police Neutre (Texte de corps, Labels, Boutons, Petits titres) :** Mappe automatiquement `Roboto`.
    *   Classes associées : `text-title-large`, `text-title-medium`, `text-title-small`, `text-body-large`, `text-body-medium`, `text-body-small`, `text-label-large`, `text-label-medium`, `text-label-small`.
*   **Règle :** Utilise systématiquement ces classes de rôles sémantiques Material 3 pour garantir l'uniformité des poids, tailles et interlignages. Ne définis pas de tailles de police ad-hoc en pixels dans le code.

### C. Classes Utilitaires Globales
Disponibles dans [src/styles/global.css](file:///home/joel/Documents/projets/vigreux-joel.fr/src/styles/global.css) :
*   `section` : Combine `padding` et `max-width` (max 2xl, centré) pour créer une section standard.
*   `text-gradient` : Applique un dégradé de la couleur `primary` vers la couleur `tertiary` avec clip sur le texte.
*   `sub-title` : Utilisé pour les en-têtes de section secondaires. Crée un texte en lettres capitales coloré en `tertiary`, précédé d'une ligne horizontale colorée en `primary` (sauf si `.text-center` est appliqué).
*   `square-area` : Un conteneur arrondi (`rounded-xl`) avec un fond `bg-surface-container-lowest` et une ombre physique douce.
*   `buttons` : Gère le regroupement de boutons ou de liens avec espacement (`gap-4`) et passage automatique en pleine largeur sur mobile (min-width: 400px pour revenir en taille auto).

---

## 5. Catalogue des Composants Clés

Ces composants React/TypeScript sont localisés dans `src/components/` et doivent être privilégiés pour toute intégration visuelle.

### A. Card (`src/components/Card.tsx`)
Conteneur physique haut de gamme conçu pour encadrer des blocs d'informations clés.
*   **Fonctionnalités :** 
    *   Flou de fond glassmorphism (`backdrop-blur-xl`).
    *   Angles adoucis en superellipse (`cornerShape: "superellipse(2)"`).
    *   **Spotlight Border :** Bordure lumineuse interactive qui suit précisément la souris au survol.
    *   **Halo intérieur :** Doux halo de lumière blanche (`opacity-5`) qui suit également le curseur.
    *   **Grain texture :** Calque de bruit SVG mixé en incrustation (`mix-blend-overlay`, `opacity-10`) pour lisser le gradient et ajouter une texture matérielle premium.
*   **Props :**
    *   `children` : Contenu de la carte.
    *   `className?: string` : Classes CSS additionnelles.
    *   `variant?: string` : Variante de la carte (défaut : `"elevated"`).

### B. Line (`src/components/Line.tsx`)
Séparateur vertical hautement interactif reliant les sections au fil du défilement.
*   **Fonctionnalités :**
    *   **Scroll-driven draw :** La ligne s'anime et se dessine de haut en bas selon la progression exacte du défilement de l'utilisateur.
    *   **Spark de lecture :** Une tête de lecture lumineuse animée (pulse + halo) marque l'avancée du tracé de la ligne et disparaît proprement aux extrémités.
    *   **Courant d'énergie :** Un flux d'énergie rapide traverse périodiquement la ligne à 60fps (géré par `requestAnimationFrame` sur les coordonnées absolues de l'écran) pour dynamiser la mise en page.
    *   **Orbes et Icônes :** Des icônes de transition peuvent être insérées. Elles s'animent en taille (zoom) et en éclat (flash de lumière intense) au moment précis où le courant d'énergie les traverse.
*   **Props :**
    *   `nextTheme?: string` : Thème de la ligne suivante (`"blue"`, `"green"`, `"cyan"`) pour colorer le gradient du courant d'énergie.
    *   `icon?: Icon` : Icône Material 3 (importée de `@udixio/ui-react`) à placer sur la ligne.
    *   `isFirst?: boolean` : Désactive le trait supérieur et réduit la taille du premier orbe.
    *   `isLast?: boolean` : Estompe progressivement le trait inférieur vers le transparent.
    *   `visible?: boolean` : Rend la ligne statiquement visible en entier immédiatement (sans animation au scroll).

### C. Techno (`src/components/Techno.tsx`)
Composant spécialisé dans la mise en valeur textuelle et graphique d'une compétence ou d'un outil.
*   **Props :**
    *   `name: string` : Nom de la technologie.
    *   `image?: string` : Code HTML/SVG de l'icône brute (injecté via `dangerouslySetInnerHTML`).
    *   `icon?: Icon` : Composant Icon de `@udixio/ui-react`.
    *   `variant?: "primary" | "secondary"` :
        *   `"primary"` : Mise en page verticale (colonne), icône de 16x16, titre moyen (`text-title-medium`), description moyenne (`text-body-medium`). Adapté aux technos **Moteurs**.
        *   `"secondary"` : Mise en page horizontale (ligne), icône de 14x14, titre petit (`text-title-small`), description petite (`text-body-small`). Adapté aux technos secondaires ou compléments.
    *   `children?: ReactNode` : Paragraphe descriptif ou preuve d'expertise (au format texte).

### D. WowBackdrop (`src/components/WowBackdrop.tsx`)
Garant de l'effet d'immersion visuelle haut de gamme sans impacter les performances de rendu.
*   **Fonctionnalités :**
    *   **Aurora Halo :** Génère un arrière-plan flou et coloré qui change subtilement de forme.
    *   **Dotted Orbits :** Anime des orbites elliptiques de points lumineux tournant à vitesse variable.
    *   **Canvas rendering :** Exécution ultra-performante sur un Canvas 2D avec gestion du ratio de pixels (DPR) et suréchantillonnage (overscan) pour éviter les coupures aux bords.
    *   **Accessibilité (Reduced Motion) :** Détecte automatiquement l'option système `prefers-reduced-motion` pour basculer sur un rendu SVG statique pré-généré de haute qualité sans calculs d'animations CPU/GPU.
*   **Props :**
    *   `density?: number` : Nombre de blobs de lumière en mouvement (défaut : `6`).
    *   `speed?: number` : Multiplicateur de vitesse de rotation (défaut : `0.2`).
    *   `className?: string` : Classes CSS additionnelles pour le positionnement.
