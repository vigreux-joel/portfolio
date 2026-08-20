# Refonte de la page d’accueil

Date : 2026-07-07

## Objectif

Refondre uniquement la page d’accueil pour qu’elle soit cohérente avec les pages `/expertise`, `/methode` et la future page `/projets`.

La home ne doit plus dupliquer la page expertise. Elle doit devenir une porte d’entrée premium qui présente clairement Joël Vigreux comme développeur full-stack, puis oriente vers les bonnes preuves : projets, expertise, méthode et contact.

## Positionnement validé

Le titre principal ne doit pas remplacer “développeur full-stack” par “Product Engineer”.

Positionnement retenu :

```text
Joël Vigreux
Développeur full-stack
[différenciant dynamique]
```

Le métier principal reste stable et immédiatement compréhensible. Le différenciant dynamique enrichit le positionnement sans brouiller la lecture.

Différenciants possibles :

- orienté produit
- interfaces premium
- architecture maintenable
- livraison pragmatique
- IA utilisée avec rigueur

La logique “Product Engineer” reste présente dans le ton et les preuves, mais elle ne remplace pas l’intitulé principal.

## Publics visés

La home doit rester lisible pour deux contextes professionnels :

- un décideur qui veut confier une mission ou faire avancer un produit ;
- un recruteur, CTO ou cabinet qui veut évaluer le profil de Joël pour une équipe.

Ce n’est pas une page qui “cible tout le monde”. La promesse centrale reste unique :

> un développeur full-stack capable de prendre de bonnes décisions produit et techniques.

Les deux contextes sont deux lectures possibles du même profil, pas deux offres commerciales séparées.

## Structure retenue

### 1. Hero

Rôle : poser immédiatement l’identité, le métier principal et le niveau d’exigence.

Contenu cible :

```text
Joël Vigreux
Développeur full-stack
orienté produit / interfaces premium / architecture maintenable / livraison pragmatique
```

Texte de soutien :

```text
Je conçois et développe des produits web fiables, lisibles et évolutifs — de l’expérience utilisateur à l’architecture technique.
```

CTA recommandés :

- Voir les projets
- Comprendre ma méthode

Le CTA de contact principal reste porté par le footer global.

### 2. Deux lectures possibles

Rôle : orienter sans créer un assistant de choix ou un effet “quiz”.

Titre cible :

```text
Vous cherchez un développeur capable de prendre des décisions produit et techniques.
```

Texte de soutien :

```text
Le contexte peut changer — mission ou recrutement — mais le sujet reste le même : fiabilité, autonomie, qualité d’exécution et compréhension des enjeux métier.
```

Deux cartes équilibrées :

#### Carte 1 — Confier une mission

Titre :

```text
Un produit à cadrer, construire ou fiabiliser
```

Texte :

```text
Pour avancer sur un besoin concret avec un regard produit, une exécution full-stack et une attention forte à la maintenabilité.
```

CTA :

```text
Voir l’approche mission
```

#### Carte 2 — Évaluer mon profil

Titre :

```text
Un développeur full-stack à intégrer à votre équipe
```

Texte :

```text
Pour juger mon parcours, ma posture, mon niveau technique et ma capacité à contribuer dans une équipe produit exigeante.
```

CTA :

```text
Voir mon profil candidat
```

Cette section doit éviter les labels “freelance / CDI / équipe” dans l’interface principale. Ces termes rendent la disponibilité trop visible et donnent l’impression de jouer sur trop de tableaux.

### 3. Projets / études de cas

Rôle : donner des preuves concrètes avant les grandes déclarations.

Angle :

```text
Des décisions concrètes, pas seulement une stack
```

La section doit teaser la future page `/projets` sous forme d’études de cas : problème, contraintes, décisions, résultat.

Elle peut inclure une carte projet mise en avant ou une promesse éditoriale si la page projets n’est pas encore complète.

CTA :

```text
Explorer les projets
```

### 4. Expertise

Rôle : résumer la page `/expertise` sans la recopier.

Angle :

```text
Full-stack, mais orienté produit
```

Texte cible :

```text
Front-end, back-end, API, CMS, performance : l’expertise sert la cohérence du produit, pas une vitrine d’outils.
```

La section ne doit pas redevenir une grille de logos ou une liste exhaustive de technologies. Elle doit renvoyer vers `/expertise` pour le détail.

CTA :

```text
Voir l’expertise
```

### 5. Méthode

Rôle : relier la home à la posture de `/methode`.

Angle :

```text
L’IA accélère, l’ingénierie sécurise
```

Texte cible :

```text
Cadrage, architecture, revue, tests et arbitrages : la méthode explique comment éviter les produits fragiles.
```

CTA :

```text
Comprendre la méthode
```

### 6. Footer CTA existant

Rôle : conclure sans surcharger la home avec un CTA de contact supplémentaire.

La page prépare la confiance. Le footer global prend le relais avec le CTA de contact existant.

## Architecture de composants proposée

La page d’accueil doit être découpée en sections dédiées pour éviter de conserver un fichier monolithique.

Composants proposés :

- `HomeHero`
- `HomeContextPaths`
- `HomeProjectsPreview`
- `HomeExpertisePreview`
- `HomeMethodPreview`

`src/pages/index.astro` doit idéalement redevenir un orchestrateur court qui importe ces sections.

Les composants doivent respecter les conventions déjà présentes :

- design system Material 3 / udixio ;
- classes sémantiques de typographie existantes ;
- tokens de surface (`bg-surface`, `bg-surface-container`, etc.) ;
- thèmes existants (`theme-blue`, `theme-green`, `theme-purple`, `theme-orange`) ;
- pas de grille “toolbox” centrée sur les logos de technologies.

## Animation du hero

Le texte animé ne doit pas porter le métier principal.

Stable :

```text
Joël Vigreux
Développeur full-stack
```

Dynamique :

```text
orienté produit
interfaces premium
architecture maintenable
livraison pragmatique
IA utilisée avec rigueur
```

Contraintes :

- maximum 4 à 5 variantes ;
- animation sobre ;
- lisible sans JavaScript si possible ;
- compatible `prefers-reduced-motion` ;
- ne pas générer de layout shift important ;
- le contenu SEO principal doit rester stable dans le HTML.

## Navigation et liens

Liens existants :

- `/projets`
- `/expertise`
- `/methode`
- `/contact`

Liens vers les deux contextes :

- `Voir l’approche mission` doit pointer vers une future page dédiée au contexte mission.
- `Voir mon profil candidat` doit pointer vers une future page dédiée au contexte recrutement/profil.

La création de ces deux pages est hors scope de cette refonte. Pour cette spec, la home est conçue comme si ces pages existaient déjà.

Le nom exact des routes pourra être fixé au moment du plan d’implémentation, mais la rédaction de la home doit rester indépendante de ce choix technique.

## Données et états

La home est essentiellement statique.

Données éditoriales à isoler si cela simplifie l’implémentation :

- variantes du texte dynamique du hero ;
- cartes de la section “Deux lectures possibles” ;
- cartes de prévisualisation projets/expertise/méthode ;
- libellés de CTA et destinations de liens.

L’animation du hero peut reposer sur un petit tableau de chaînes. Elle ne doit pas imposer de dépendance lourde ni rendre le contenu principal invisible au chargement.

## Cas limites et accessibilité

Points à sécuriser pendant l’implémentation :

- si l’animation est désactivée ou réduite, le hero doit rester compréhensible ;
- les boutons vers les futures pages mission/profil doivent rester clairement nommés, même si les routes exactes sont fixées plus tard ;
- la section “Deux lectures possibles” doit rester équilibrée sur mobile, probablement en une colonne ;
- le titre principal ne doit pas dépendre d’un texte animé pour être compris ;
- les contrastes doivent rester alignés avec les tokens Material 3 existants ;
- aucune section ne doit recréer une grille exhaustive de technologies.

## Vérification attendue

La refonte devra être vérifiée par :

- un build Astro ;
- une lecture responsive desktop/mobile ;
- une vérification des liens principaux ;
- une vérification du comportement `prefers-reduced-motion` si l’animation est implémentée ;
- une relecture du premier écran pour confirmer que “Développeur full-stack” reste le message principal.

## Hors scope

Cette spec ne couvre pas :

- la création des deux pages dédiées mission/profil ;
- la création complète de la page `/projets` ;
- une refonte du menu ;
- une refonte du footer ;
- une refonte globale du design system ;
- une grille exhaustive de technologies.

## Critères de succès

La refonte est réussie si :

- le premier écran identifie clairement Joël Vigreux comme développeur full-stack ;
- le positionnement paraît premium sans perdre en lisibilité recruteur ;
- la home ne duplique plus la page `/expertise` ;
- les deux contextes “mission” et “profil” sont compréhensibles sans effet tutoriel ;
- la page prépare naturellement le CTA de contact du footer ;
- les liens vers `/projets`, `/expertise` et `/methode` ont chacun un rôle clair ;
- la page reste cohérente avec la posture “IA accélère, ingénierie sécurise”.

## Validation utilisateur

Direction validée pendant le brainstorming :

- conserver “Développeur full-stack” comme métier principal ;
- utiliser un différenciant dynamique en troisième ligne ;
- présenter deux lectures possibles du profil ;
- remplacer “Évaluer ma candidature” par “Évaluer mon profil” ;
- rester focalisé uniquement sur la home, en supposant que les deux pages dédiées existent déjà.
