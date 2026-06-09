---
name: detect-design-system
description: Use when a project has no design.md, when tokens/fonts/components have changed, or before launching a UI feature on an unknown project.
---

# Design system detection → design.md

## Objective
Produce (or refresh) the `design.md` manifest at the project root — the auto-detection source read by the entire pipeline.

## Instructions
1. Run the scan:
   ```bash
   node "${PLUGIN_ROOT}/skills/detect-design-system/scripts/detect.mjs" "$PWD"
   ```
2. Open the generated `design.md`. The **Tokens / Fonts / Palette / Components** sections are filled automatically.
3. Manually complete the **UX & Writing Charter** section (positioning, targets, tone of voice) — detection cannot infer it.
4. Confirm to the user the summary (number of tokens/fonts/components) and invite them to review.

## Engagement rules
- Never rewrite auto-generated sections by hand: re-run the script.
- Don't delete the human-written UX charter when refreshing (eventually merge; for now, warn before overwriting).
