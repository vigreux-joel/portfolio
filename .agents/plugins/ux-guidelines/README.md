# ux-guidelines — plugin Antigravity

Pipeline UX/UI guidé pour créer et modifier des interfaces sans erreur de design : auto-détection du design system, conseils d'experts (stratégie, copy, UI, motion) et vérification hybride.

## Installation

Usage local (recommandé pour démarrer) : le plugin est lu directement depuis ce dossier source.

Déploiement vers le répertoire de plugins Antigravity CLI :

```bash
./install.sh           # global : ~/.gemini/antigravity-cli/plugins/ux-guidelines
./install.sh <dir>     # dans un répertoire cible
```

`install.sh` compile les agents Markdown (`agents/*.md`) en `agent.json`.

## Contenu

- **Rules** (toujours actives) : anti-AI-slop, socle a11y, adhérence au design system.
- **Agents** (personas) : ux-strategist, ux-copywriter, ui-designer, motion-designer, design-reviewer.
- **Skills** :
  - `detect-design-system` — génère `design.md` (tokens, polices, palette, composants).
  - `design-review` — vérification hybride (contraste, drift de tokens, walls of text, a11y) + revue qualitative.
  - `design-feature` — pipeline guidé avec approval gates et handover par artefacts.
- **Hook** : avertissement non-bloquant de drift de tokens après édition d'un fichier UI.

## Développement

```bash
node --test tests/*.test.mjs      # lance la suite de tests (Node 22+, aucune dépendance)
```

## À confirmer selon la version d'Antigravity

- Schéma exact de `plugin.json` et de `agent.json` (champ `model`).
- Format de `hooks.json` (clés d'événements / variables `${TOOL_FILE_PATH}`).
- Convention `.agent/` vs `.agents/` pour une install workspace.
