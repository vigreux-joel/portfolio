# Refonte de la page d'accueil — design

**Date :** 2026-07-23
**Statut :** implémenté (voir « État de l’implémentation » en fin de document)
**Pages concernées :** `src/pages/index.astro` et `src/components/home/*`

## Objectif

Restructurer la page d'accueil autour d'une logique **besoins → preuves → méthode → action** :
le visiteur doit d'abord se sentir concerné (réponse à ses peurs), puis voir des preuves
réelles et vérifiables, comprendre comment le travail se déroule, et enfin passer à l'action.

## Cible

1. **Priorité : clients freelance** — TPE/PME, porteurs de projet, produits existants à faire
   évoluer. La page vend un service et doit rassurer.
2. **Secondaire : recruteurs / CDI** — une porte d'entrée dédiée (carte « renfort d'équipe »
   et lien CV), sans structurer la page autour d'eux.

## Décisions actées

- **Netsimpler n'est plus la preuve centrale de la page.** La section
  `HomeExperienceProof` (« Plus de trois années à faire évoluer un SaaS ») est supprimée.
  Netsimpler ne réapparaît que comme carte *expérience* dans la grille projets, cadrée sur
  la contribution de Joël (migrations, production), jamais sur la réussite du produit.
- **Pas de carousel.** Tous les projets sont visibles sans interaction :
  1 projet phare en grand + 3 cartes secondaires.
- **Uniquement des projets réels.** Les deux fiches fictives
  (`atelier-local-demo.mdx`, `clair-habitat-demo.mdx`) sont supprimées ou passées en
  `draft: true`. Elles ne doivent plus jamais apparaître sur la home ni sur `/projets`.
- **Le portfolio lui-même devient un second projet phare**, placé en fin de page,
  qui raconte sa propre histoire et clôt la page sur une preuve.
- **Le message « maintenable / reprenable » n'est énoncé qu'une seule fois par section
  au maximum.** Chaque section porte un argument distinct (voir tableau ci-dessous).

## Plan des sections

| # | Section | Argument unique porté |
|---|---------|----------------------|
| 1 | Hero | Qui je suis, ce que j'apporte |
| 2 | Votre situation | « Je comprends votre problème et j'y réponds » |
| 3 | Projets | « Voici des preuves réelles et consultables » |
| 4 | Méthode | « Vous saurez toujours où en est le projet » |
| 5 | Ce portfolio | « Le site que vous venez de lire est la démonstration » |
| 6 | Travailler ensemble | « Voici comment on démarre » |
| 7 | FAQ | Lever les dernières objections |

---

### 1. Hero *(ajusté)*

- **H1 conservé** : « Développeur full-stack. » — clair et bon pour le SEO.
- **Tagline conservée** : « Des interfaces soignées sur des fondations solides. »
- **Paragraphe descriptif réorienté vers le lecteur.** Actuellement centré sur Joël
  (« Spécialisé dans l'écosystème TypeScript, je développe… »). Proposition :

  > Vous avez un produit à créer, une application à faire évoluer ou une équipe à
  > renforcer ? Spécialisé dans l'écosystème TypeScript, je développe et fais évoluer
  > des applications web, du front-end aux services back-end.

- **CTA** : « Voir mes projets » (ancre `#projets`) + « Me contacter » (`/contact`).
  Le lien CV descend dans la carte « renfort d'équipe » et dans « Travailler ensemble »
  (il n'a pas besoin d'être dans le hero pour une cible prioritairement client).
- Photo et mise en page conservées.

### 2. Votre situation *(nouvelle section, remplace « Un périmètre clair »)*

- **Eyebrow** : « Votre situation »
- **Titre** : « Faire avancer votre projet, quel que soit son point de départ. »
- **Intro** : une phrase qui invite le lecteur à se reconnaître.

Trois cartes, chacune construite sur le schéma **situation → peur implicite → réponse** :

| Carte | Situation | Peur adressée | Réponse |
|-------|-----------|---------------|---------|
| 1 | « Vous partez d'une idée ou de maquettes » | Que le projet n'aboutisse jamais, budget englouti | Une première version en ligne, par livraisons courtes et vérifiables |
| 2 | « Votre application existe mais n'avance plus » | Régressions, réécriture complète imposée | Reprise progressive de l'existant, sans tout casser |
| 3 | « Votre équipe a besoin de renfort » | Un profil qui ne s'intègre pas, du code que personne ne pourra reprendre | Conventions en place respectées, décisions documentées — **lien « Consulter mon CV · PDF »** |

Cette section **absorbe l'ex-« Périmètre »** (`HomeExpertisePreview`) : le contenu
interface/application/reprise d'existant est redistribué dans les cartes 1 et 2, et le
détail technique reste sur `/expertise` (lien discret en fin de section :
« Voir mon expertise technique »).

### 3. Projets *(1 phare + 3 cartes)*

- **Eyebrow** : « Projets »
- **Titre** : « Des projets réels, que vous pouvez consulter. »
- **Ancre** : `#projets` (cible du CTA hero).

**Projet phare (grand format, présentation actuelle conservée)** : **Udixio UI**
- La carte actuelle fonctionne bien : image, rôle, points de preuve, CTA étude de cas
  + lien externe.
- Argument clé conservé : « Le portfolio que vous consultez l'utilise directement. »

**Trois cartes secondaires (grille, format réduit : image ou icône, eyebrow, titre,
2 phrases, lien)** :

| Carte | Eyebrow | Contenu |
|-------|---------|---------|
| **Mojoe** | « Projet client · 2024 » | Application Flutter pour centraliser la réception des livraisons fournisseurs, la gestion du stock et la localisation des colis au retrait client. |
| **Plateforme pour agences web** | « Produit en cours · depuis 2025 » | Logiciel métier modulaire : CRM, gestion commerciale, blog, audits E-E-A-T et assistance IA. |
| **Netsimpler** | « Expérience · 3 ans sur un SaaS en production » | Cadré sur la contribution : migration progressive du front Angular vers Astro/React, restructuration du back-end vers AWS (AppSync, Cognito, Lambda). Aucune promesse sur le produit. |

**Architecture : tout piloté par la collection `projects`.** La section ne code plus
aucun projet en dur (l'actuel `HomeProjectsPreview` hardcode Udixio UI et sa liste de
preuves). À la place :

- **Chaque projet est une entrée MDX** de la collection, y compris Netsimpler et le
  portfolio lui-même. Le frontmatter s'enrichit d'un champ `highlights` (liste de points
  de preuve, remplace le tableau `proofs` hardcodé). Le champ nullable `order` définit
  uniquement la position éditoriale souhaitée commune à tous les affichages.
- **Deux composants partagés** rendent n'importe quelle entrée de la collection :
  - `ProjectCard.astro` — format adaptatif unique, compact ou détaillé selon la largeur
    de son conteneur grâce aux container queries.
- Ces composants sont réutilisables sur `/projets` pour garder une présentation unique.

**Contenu induit** : créer `src/content/projects/mojoe.mdx`,
`src/content/projects/plateforme-agences.mdx`, `src/content/projects/netsimpler.mdx`
(cadrée expérience) et `src/content/projects/vigreux-joel-fr.mdx` (l'histoire du site,
alimente la section 5). Les études de cas complètes peuvent venir dans un second temps.
La **plateforme pour agences web est privée et sans nom public** : sa carte n'a ni lien
externe ni démo, elle garde son intitulé générique et pointe vers sa page étude de cas.

### 4. Méthode *(conservée, retitrée)*

- **Eyebrow** : « Méthode »
- **Titre** : « Un déroulement lisible, du premier échange à la livraison. »
  (remplace « Un travail lisible, avant, pendant et après le développement »)
- Les **4 étapes** (Clarifier, Découper, Construire et vérifier, Transmettre) et
  l'**encart IA** sont conservés tels quels.
- Lien « Découvrir ma méthode » conservé.

### 5. Ce portfolio *(nouvelle section — second projet phare, en fin de page)*

- **Eyebrow** : « Dernier projet »
- **Titre proposé** : « Le site que vous êtes en train de consulter. »
- **Rôle** : clore la page sur une preuve vérifiable en un clic — le lecteur vient de
  parcourir le produit.
- **Rendu via `ProjectCard.astro`**, alimenté par l'entrée
  `vigreux-joel-fr.mdx` de la collection — même présentation que le phare Udixio UI.
- **Contenu — l'histoire du site** :
  - conçu comme démonstration du niveau d'exigence défendu sur la page ;
  - construit avec Astro et Udixio UI (le design system présenté plus haut, la boucle
    est bouclée) ;
  - attention portée à l'accessibilité, la performance et le référencement ;
  - le site évolue comme un vrai produit : par itérations, avec des décisions documentées.
- **CTA** : lien vers le dépôt GitHub si public, sinon lien vers une future étude de cas
  `vigreux-joel.fr` (le CV la référence déjà comme projet). À défaut, pas de CTA :
  la preuve est la page elle-même.

### 6. Travailler ensemble *(conservée)*

- Structure actuelle conservée : double entrée « Pour un projet » (CTA « Présenter votre
  projet » → `/contact`) et « Pour une équipe » (CTA « Consulter mon CV · PDF »).
- Le titre « Un projet à réaliser ou une équipe à renforcer. » reste.
- Vérifier la non-redondance avec la section 2 : « Votre situation » diagnostique,
  « Travailler ensemble » fait passer à l'action. Les textes des deux cartes doivent
  être raccourcis pour ne pas répéter la section 2 (2 phrases max chacune).

### 7. FAQ *(conservée, +1 question)*

Ajouter une question sur l'estimation, peur client non couverte :

> **Comment estimez-vous les délais et le budget ?**
> Après un premier échange, je découpe le besoin en livraisons vérifiables et j'estime
> chacune d'elles. Vous connaissez le coût et le contenu de la prochaine étape avant de
> vous engager, plutôt qu'un forfait global opaque.

(Formulation à ajuster selon la pratique réelle de facturation.)

## Composants : impact

| Composant | Sort |
|-----------|------|
| `HomeHero.astro` | Modifié (paragraphe + CTA) |
| `HomeExperienceProof.astro` | **Supprimé** |
| `HomeExpertisePreview.astro` | **Remplacé** par `HomeSituations.astro` (nouvelles cartes besoins) |
| `HomeProjectsPreview.astro` | Réécrit : phare + grille de 3 cartes, entièrement piloté par la collection |
| `ProjectCard.astro` | **Nouveau** composant adaptatif partagé de présentation |
| `HomeMethodPreview.astro` | Titre modifié uniquement |
| `HomePortfolioStory.astro` | **Nouveau** (section 5, wrapper autour de `ProjectCard`) |
| `HomeContextPaths.astro` | Textes raccourcis |
| Schéma de la collection `projects` | Champ `highlights` ajouté (points de preuve des cartes/phares) |
| `atelier-local-demo.mdx`, `clair-habitat-demo.mdx` | Supprimés ou `draft: true` |
| `mojoe.mdx`, `plateforme-agences.mdx`, `netsimpler.mdx`, `vigreux-joel-fr.mdx` | **À créer** |

Les enchaînements de thèmes couleur (`theme-blue` → `theme-green` → …) et les
`LinearGradient` devront être revus après réordonnancement des sections pour garder des
transitions cohérentes.

## SEO / données structurées

- Mettre à jour `profilePageJsonLd.description` (elle mentionne « Expérience, projet,
  expertise et méthode ») et `dateModified`.
- Les ancres `#experience` et `#expertise-preview` disparaissent ; vérifier qu'aucun lien
  interne ni la sidebar (`data-sidebar-label`) ne pointe encore vers elles.
- Nouvelles entrées sidebar : Situation, Projets, Méthode, Portfolio, Collaboration.

## Hors périmètre

- Refonte des pages `/expertise`, `/methode`, `/profil`, `/projets`.
- Rédaction complète des études de cas Mojoe et plateforme agences (seules les cartes
  de la home sont requises pour cette refonte).
- Témoignages clients (à envisager quand ils existeront).

## État de l’implémentation

Réalisé le 2026-07-23. Le build passe et les cinq pages projet sont générées.

**Choix faits pendant l’implémentation :**

- **Pilotage par la collection** : `order` détermine la priorité éditoriale. La page
  d’accueil choisit combien de projets afficher et présente le premier en détail. Aucun
  identifiant de projet n’est codé en dur dans les composants.
- **`cover` devient optionnel** dans le schéma. Les projets sans capture (Mojoe,
  plateforme agences, Netsimpler, ce portfolio) affichent un panneau de repli
  (`ProjectVisual.astro`) : dégradé thématique, titre du projet et technologies en
  pastilles. Aucune fausse capture d’écran n’a été fabriquée.
- **Lien du portfolio (point ouvert n° 1) : résolu.** Le dépôt
  `github.com/vigreux-joel/portfolio` est public, il sert de CTA secondaire
  (« Voir le code sur GitHub ») via le champ `repositoryUrl`.
- **Champs ajoutés au schéma** : `home`, `intro` (paragraphes de la présentation mise en
  avant) et `highlights` (points de preuve), qui remplacent le contenu auparavant codé en
  dur dans `HomeProjectsPreview`.
- **Chaîne des thèmes** : bleu → vert → cyan → bleu → vert → cyan → bleu
  (les sections finales `CtaSection` et `FaqSection` sont en bleu).

**Point ouvert restant :** visuels réels pour Mojoe et la plateforme agences. Le panneau
de repli tient la place proprement en attendant des captures.

## Décisions complémentaires (2026-07-23)

- La plateforme pour agences web est **privée et sans nom public** : intitulé générique
  conservé, aucun lien externe.
- Les présentations de projets sont alimentées par la collection MDX via le composant
  partagé `ProjectCard`, dont la densité dépend de la largeur du conteneur parent.

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
  `kind: "realisation"` et `externalUrl`.
- **Doubles fonds corrigés** : le panneau de repli de `ProjectVisual` hérite du
  fond de sa carte au lieu d’empiler un `bg-surface-container` plus sombre.

### Écarts par rapport au plan d’implémentation

- Les tâches 1 et 3 du plan ont été **fusionnées en un seul commit** : supprimer
  `HomePortfolioStory.astro` et adapter son unique consommateur sont indissociables.
- La page `/projets` doit fournir une prop `faq` au `Layout` : `Footer` rend
  `FaqSection` inconditionnellement et `questions.map()` échoue sinon. Une FAQ
  propre à la page projets a été rédigée (captures manquantes, étude de cas vs
  réalisation, accès au code).
