---
name: design-review
description: Utilise après toute création ou modification d'UI pour vérifier le rendu contre la spec de design, la cohérence visuelle et la copy avant de livrer.
---

# Revue de design

## Objectif
Garantir qu'une UI respecte ses intentions de design et s'intègre visuellement dans son contexte avant livraison. La revue est qualitative — elle s'appuie sur la lecture des artefacts et du code, pas sur des scripts automatiques.

## Instructions
1. Lire `layout.md` et `motion.md` de la feature : ce sont les intentions de référence.
2. Lire le code produit et vérifier point par point que les intentions ont été respectées.
3. Vérifier la cohérence visuelle entre toutes les sections de la feature : registre commun, rythme spatial, logique de navigation.
4. Vérifier la copy contre la règle `anti-ai-slop` et l'absence de labels structurels transcrits tels quels.
5. Vérifier l'absence de valeurs en dur (couleurs, espacements) non documentées dans `design.md`.
6. Écrire le verdict consolidé dans `docs/design/<feature-slug>/review-report.md`.

## Règle de verdict
`PASS` seulement si la spec est respectée, la cohérence visuelle est assurée et la copy est propre. Sinon, liste d'actions correctives priorisées — jamais de PASS de complaisance.
