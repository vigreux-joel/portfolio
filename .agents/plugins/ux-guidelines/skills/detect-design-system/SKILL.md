---
name: detect-design-system
description: Utilise quand un projet n'a pas de design.md, qu'il vient de changer de tokens/polices/composants, ou avant de lancer une feature UI sur un projet inconnu.
---

# Détection du design system → design.md

## Objectif
Produire (ou rafraîchir) le manifeste `design.md` à la racine du projet, source d'auto-détection lue par tout le pipeline.

## Instructions
1. Lance le scan :
   ```bash
   node "${PLUGIN_ROOT}/skills/detect-design-system/scripts/detect.mjs" "$PWD"
   ```
2. Ouvre le `design.md` généré. Les sections **Tokens / Polices / Palette / Composants** sont remplies automatiquement.
3. Complète à la main la section **Charte UX & Writing** (positionnement, cibles, ton de voix) — la détection ne peut pas l'inférer.
4. Confirme à l'utilisateur le résumé (nb de tokens/polices/composants) et invite-le à relire.

## Règles d'engagement
- Ne réécris jamais à la main les sections auto-générées : relance le script.
- Ne supprime pas la charte UX rédigée par l'humain lors d'un rafraîchissement (à terme, fusionner ; pour l'instant, prévenir avant d'écraser).
