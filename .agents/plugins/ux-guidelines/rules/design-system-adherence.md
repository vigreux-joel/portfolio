# Règle — Adhérence au design system

Le design system du projet est la source de vérité visuelle.

- **Lis `design.md`** (racine du projet) avant toute décision visuelle.
- **Si `design.md` est absent**, lance d'abord le skill `detect-design-system`.
- **Aucune valeur en dur** : couleurs, espacements, rayons, polices passent par les tokens documentés dans `design.md`, jamais par une valeur littérale (`#3b82f6`, `17px`…).
- Toute nouvelle valeur réellement nécessaire doit d'abord être ajoutée au design system, puis documentée dans `design.md`.

## Red Flags — STOP
- Tu allais écrire une couleur hexadécimale ou une taille en px directement dans un composant.
- Tu prends une décision de police/espacement sans avoir ouvert `design.md`.
