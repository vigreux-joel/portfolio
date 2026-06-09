---
name: design-review
description: Use after any UI creation or modification to verify the render against the design spec, visual coherence and copy before delivery.
---

# Design review

## Objective
Ensure a UI respects its design intentions and integrates visually into its context before delivery. The review is qualitative — it relies on reading artefacts and code, not automated scripts.

## Instructions
1. Read the feature's `layout.md` and `motion.md`: these are the reference intentions.
2. Read the produced code and verify point by point that the intentions were respected.
3. Verify visual coherence across all sections of the feature: shared register, spatial rhythm, navigation logic.
4. Verify copy against the `anti-ai-slop` rule and the absence of structural labels transcribed as plain text.
5. Verify the absence of hardcoded values (colours, spacing) not documented in `design.md`.
6. Write the consolidated verdict in `docs/design/<feature-slug>/review-report.md`.

## Verdict rule
`PASS` only if the spec is respected, visual coherence is ensured and copy is clean. Otherwise, prioritised list of corrective actions — never a compliant PASS.
