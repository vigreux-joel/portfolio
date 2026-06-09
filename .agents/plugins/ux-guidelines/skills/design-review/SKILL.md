---
name: design-review
description: Utilise après toute création ou modification d'UI pour vérifier le code contre l'accessibilité, le drift de tokens et les walls of text avant de livrer.
---

# Vérification hybride d'une UI

## Objectif
Garantir qu'une UI ne contient aucune erreur de design avant livraison, via des checks déterministes **et** une revue qualitative.

## Instructions
1. **Checks déterministes** sur chaque fichier modifié :
   ```bash
   node "${PLUGIN_ROOT}/skills/design-review/scripts/review.mjs" <fichier>
   ```
   Code de sortie `0` = PASS, `1` = findings à corriger.
2. **Contraste** sur les paires couleur texte/fond issues de `design.md` :
   ```bash
   node "${PLUGIN_ROOT}/skills/design-review/scripts/contrast.mjs" # importé par review au besoin
   ```
3. **Revue qualitative** (persona `design-reviewer`) : AI slop, cohérence narrative avec la page, fidélité au design system.
4. Écris le verdict consolidé dans `docs/design/<feature-slug>/review-report.md`.

## Règle de verdict
`PASS` seulement si checks déterministes **et** revue qualitative passent. Sinon, liste d'actions correctives priorisées — jamais de PASS de complaisance.
