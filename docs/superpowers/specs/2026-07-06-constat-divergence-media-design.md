# Design — `ConstatDivergenceMedia`

Date : 2026-07-06

## Contexte

Le composant `src/components/methode/ConstatDivergenceMedia.tsx` est utilisé dans la page `methode`, via le sticky scroll. Il accompagne la section qui explique le risque d’un produit construit rapidement avec l’IA sans pilotage expert.

Le contenu d’origine reste la référence : l’IA peut produire vite, mais la vitesse ne garantit ni la justesse, ni la cohérence, ni la maintenabilité. Le problème à illustrer n’est pas que “le code s’écroule” ou que l’application cesse immédiatement de fonctionner. Le produit peut rester joli et utilisable en surface, tout en accumulant des défauts internes qui rendent les évolutions suivantes plus coûteuses, plus incertaines et moins maîtrisées.

## Objectif de l’animation

Montrer visuellement cette idée :

> L’IA produit vite, mais sans pilotage, chaque évolution peut masquer des défauts internes. Le produit devient moins maîtrisable et moins flexible, même s’il continue à donner une impression de livraison rapide.

L’illustration doit rester vulgarisée. Elle ne doit pas parler directement de “contexte IA”, ni entrer dans une explication technique brute. Les causes internes peuvent être suggérées par leurs conséquences visibles : duplications, oublis, contrôles absents, incohérences locales.

## Contraintes de design

- Le premier état ne doit jamais être vide.
- L’illustration doit occuper toute la largeur disponible du média sticky.
- Le focus sur une fonctionnalité doit être un vrai mouvement de caméra, pas un remplacement complet de scène.
- Le chaos doit rester lisible : une seule idée principale par phase.
- L’animation doit contenir des micro-mouvements constants, mais rester sobre.
- Les textes dans la scène doivent être courts ; l’argument détaillé reste dans le contenu gauche du sticky scroll.
- L’exemple “ajout d’une offre Pro” est écarté : il perd le visiteur et rend le problème trop spécifique.
- Le terme “règle locale” est écarté : il est trop abstrait et peu explicite dans ce contexte.

## Structure narrative

La narration se déroule en cinq moments.

1. **Les fonctionnalités apparaissent à toute vitesse**
   - L’application est déjà visible dès le début.
   - Des fonctionnalités apparaissent rapidement autour du noyau : `Profil`, `Recherche`, `Suivi`, `Paiement`, `Notifications`.
   - Le ressenti doit être positif au départ : le produit semble avancer vite.

2. **Très vite, tout semble relié**
   - Des connexions apparaissent entre les fonctionnalités.
   - Les signaux circulent dans les liens.
   - L’app paraît cohérente vue de loin.

3. **Mais que contient réellement une fonctionnalité ?**
   - La caméra se déplace et zoome réellement vers `Paiement`.
   - Le reste de l’application ne disparaît pas brutalement : il sort progressivement du cadre.
   - Certains liens restent visibles aux bords pour rappeler que `Paiement` dépend encore du reste.

4. **C’est ici que la dette se forme**
   - `Paiement` s’ouvre et révèle sa structure interne.
   - Le flux principal reste fonctionnel : `Interface → Traitement → Transaction`.
   - Les défauts apparaissent ensuite :
     - un deuxième bloc `Traitement` apparaît comme copie séparée ;
     - la branche `Échecs & remboursements` est absente ou interrompue ;
     - `Sécurité / tests` reste non garanti.

5. **Livré ne veut pas dire maîtrisé**
   - Une conclusion courte synthétise l’idée.
   - L’objectif n’est pas de dire “il faut réparer”, mais de montrer que le produit livré n’est pas forcément maîtrisé.

## Chorégraphie du scroll

Les bornes exactes pourront être ajustées pendant l’implémentation, mais le comportement cible est le suivant :

- `0–18%` : l’application est déjà visible ; les fonctionnalités apparaissent vite.
- `18–40%` : les connexions se dessinent ; l’ensemble semble cohérent.
- `40–56%` : la caméra se déplace vers `Paiement` et zoome sans remplacer la scène.
- `56–64%` : le flux interne `Interface → Traitement → Transaction` apparaît.
- `64–70%` : la duplication de `Traitement` devient visible.
- `70–76%` : la branche `Échecs & remboursements` reste vide ou cassée.
- `76–82%` : `Sécurité / tests` devient explicitement non garanti.
- `82–100%` : l’overlay de conclusion apparaît.

## Design visuel

### Vue globale

La vue initiale est une carte abstraite d’application. Elle ne doit pas ressembler à une interface complète réaliste, car cela dilue le message. Elle doit représenter un produit en construction : un noyau central, des fonctionnalités, puis des liens.

Les fonctionnalités doivent apparaître rapidement, mais proprement. Au départ, le produit doit donner une impression d’efficacité, pas de chaos immédiat.

### Zoom sur `Paiement`

Après le mouvement de caméra, `Paiement` devient le centre de la scène. La structure interne doit être plus hiérarchisée que linéaire :

- au centre : le flux principal `Interface → Traitement → Transaction` ;
- au-dessus du bloc `Traitement` : une copie séparée de `Traitement`, pour montrer la duplication ;
- sous le flux : `Échecs & remboursements`, présenté comme absent ou interrompu ;
- près de la transaction : `Sécurité / tests`, présenté comme non garanti ;
- aux extrémités : des liens externes, par exemple `Panier` à gauche et `Commandes` à droite, pour rappeler que `Paiement` n’est pas isolé.

La duplication doit être visible directement. Elle ne doit pas être seulement suggérée par un label.

### Conclusion

La conclusion visuelle doit être courte :

> Livré ne veut pas dire maîtrisé.

Elle peut être accompagnée d’une phrase secondaire très courte, si nécessaire :

> Sans pilotage, chaque évolution peut laisser une partie du produit hors cohérence.

## Texte associé dans le sticky scroll

Le texte de gauche doit rester proche de l’intention d’origine, mais adapté à la nouvelle illustration.

Proposition de structure :

1. **Les fonctionnalités apparaissent à toute vitesse**
   - `Accès, recherche, suivi, paiement, profil… en surface, le produit semble avancer très vite.`

2. **Très vite, tout semble relié**
   - `Les écrans se connectent, les données circulent, les parcours semblent complets. Vu de l’extérieur, l’app paraît cohérente.`

3. **Mais que contient réellement une fonctionnalité ?**
   - `Derrière un paiement, il n’y a pas qu’un bouton. Il faut aligner les états, les données, les erreurs, les contrôles et les autres modules.`

4. **C’est ici que la dette se forme**
   - `Sans pilotage, une évolution peut être ajoutée localement : une logique est dupliquée, un cas d’échec est oublié, un contrôle reste implicite.`

5. **Livré ne veut pas dire maîtrisé**
   - `Le produit continue de fonctionner, mais chaque ajout devient moins sûr : ce qui manque n’est pas toujours visible au moment de la livraison.`

Cette rédaction évite de faire du “contexte IA” le sujet principal. Elle garde l’IA comme contraste : produire vite n’est pas la même chose que faire évoluer un produit de manière cohérente.

## Architecture composant

Le composant doit être organisé autour d’une scène persistante.

- `ConstatDivergenceMedia`
  - reçoit la progression lissée depuis le sticky scroll ;
  - orchestre les phases ;
  - calcule la caméra virtuelle et les états d’affichage.

- `ApplicationMap`
  - affiche le noyau de l’app, les fonctionnalités et les connexions ;
  - reste présent pendant toute l’animation ;
  - ne doit pas être remplacé par une autre scène au moment du zoom.

- `FeatureNode`
  - affiche une fonctionnalité générique ;
  - supporte apparition, mise en avant, respiration subtile.

- `ConnectionPath`
  - affiche les liens entre fonctionnalités ;
  - supporte une circulation discrète pour montrer que les modules échangent.

- `PaymentZoom`
  - s’attache visuellement au node `Paiement` ;
  - révèle les éléments internes progressivement ;
  - porte les états du focus : flux principal, duplication, absence, incertitude.

- `ConclusionOverlay`
  - affiche la synthèse finale ;
  - ne doit pas couvrir trop tôt les informations du zoom.

Les données visuelles peuvent être décrites dans des tableaux constants (`FEATURES`, `CONNECTIONS`, `PAYMENT_PARTS`) afin d’éviter une logique dispersée dans le JSX.

## Progression et sticky scroll

Le sticky scroll doit fournir au média une valeur de progression lissée avant l’entrée dans `ConstatDivergenceMedia`. La scène ne doit pas recevoir une valeur trop brute, car cela rend les transitions saccadées et réduit la qualité perçue.

Le lissage doit rester local au rendu média, par exemple dans le renderer qui appelle le composant média. Il ne doit pas perturber la logique d’activation des textes du sticky scroll. Les textes peuvent rester pilotés par l’étape active ; le média, lui, utilise une progression adoucie pour la caméra et les transitions.

## Responsive

Sur desktop, l’animation principale utilise la caméra réelle.

Sur mobile ou largeur réduite, il est acceptable de transformer l’animation en snapshots correspondant aux cinq moments narratifs. La priorité mobile est la compréhension, pas la reproduction exacte de la caméra desktop.

## Accessibilité et mouvement réduit

- Respecter `prefers-reduced-motion`.
- En mouvement réduit :
  - désactiver les boucles constantes ;
  - réduire l’amplitude du zoom caméra ;
  - conserver les étapes principales par apparition progressive.
- Ne pas transmettre les états uniquement par couleur :
  - duplication = deux blocs visibles ;
  - absence = branche interrompue ou emplacement vide ;
  - incertitude = contour pointillé et label court ;
  - cohérence apparente = connexions propres au départ.

## Vérification prévue

Après implémentation, vérifier :

- le premier état affiche déjà l’application ;
- le média occupe toute la largeur du conteneur ;
- le focus sur `Paiement` est bien un zoom depuis la carte, pas un remplacement ;
- la duplication est visible directement ;
- les défauts restent compréhensibles sans lire un paragraphe dans l’illustration ;
- les animations constantes ne nuisent pas à la lisibilité ;
- le rendu mobile reste compréhensible ;
- le comportement `prefers-reduced-motion` reste utilisable ;
- le build ou le check TypeScript pertinent du projet ne révèle pas d’erreur liée à ce changement.

## Hors périmètre

- Ne pas transformer cette section en explication technique complète de l’IA.
- Ne pas ajouter une interface applicative réaliste complète.
- Ne pas faire de l’exemple `Paiement` une démonstration métier détaillée.
- Ne pas ajouter de barre de progression dans le média.
- Ne pas ajouter de badges type `vérifié / inconnu / manquant` en haut de l’illustration.
