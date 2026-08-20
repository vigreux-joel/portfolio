# ux-guidelines — Antigravity plugin

Guided UX/UI pipeline to create and modify interfaces without design errors: auto-detection of the design system, expert personas (strategy, copy, UI, motion) and qualitative verification.

## Installation

Local usage (recommended to start): the plugin is read directly from this source folder.

Deploy to the Antigravity CLI plugins directory:

```bash
./install.sh           # global: ~/.gemini/antigravity-cli/plugins/ux-guidelines
./install.sh <dir>     # to a target directory
```

`install.sh` compiles Markdown agents (`agents/*.md`) into `agent.json`.

## Contents

- **Rules** (always active): anti-AI-slop, a11y baseline, design system adherence.
- **Agents** (personas): ux-strategist, ux-copywriter, ui-designer, motion-designer, design-reviewer.
- **Skills**:
  - `detect-design-system` — generates `design.md` (tokens, fonts, palette, components).
  - `design-review` — qualitative review (spec fidelity, visual coherence, copy quality).
  - `design-feature` — guided 7-phase pipeline with approval gates, resume support, and artefact handover.
- **Hook**: non-blocking token drift warning after editing a UI file.

## Development

```bash
node --test tests/*.test.mjs      # run the test suite (Node 22+, no dependencies)
```

## To confirm depending on Antigravity version

- Exact schema for `plugin.json` and `agent.json` (`model` field).
- Format of `hooks.json` (event keys / `${TOOL_FILE_PATH}` variable).
- `.agent/` vs `.agents/` convention for workspace install.
