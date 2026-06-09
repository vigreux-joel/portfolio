#!/usr/bin/env bash
set -euo pipefail

# Déploie le plugin ux-guidelines vers le répertoire de plugins Antigravity CLI,
# en compilant les agents Markdown en agent.json.
#
# Usage : ./install.sh            -> install globale (~/.gemini/antigravity-cli/plugins)
#         ./install.sh <dir>      -> install dans <dir>/ux-guidelines

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST_ROOT="${1:-$HOME/.gemini/antigravity-cli/plugins}"
DEST="$DEST_ROOT/ux-guidelines"

echo "Source : $SRC"
echo "Cible  : $DEST"

rm -rf "$DEST"
mkdir -p "$DEST"

# Copie des composants statiques
cp "$SRC/plugin.json" "$DEST/"
cp "$SRC/hooks.json" "$DEST/"
cp -R "$SRC/rules" "$DEST/"
cp -R "$SRC/skills" "$DEST/"
cp -R "$SRC/tools" "$DEST/"

# Compilation des agents .md -> agents/<name>/agent.json
mkdir -p "$DEST/agents"
node "$SRC/tools/compile-agents.mjs" "$SRC/agents" "$DEST/agents"

echo "Installation terminée."
echo "Agents compilés :"
ls -1 "$DEST/agents"
