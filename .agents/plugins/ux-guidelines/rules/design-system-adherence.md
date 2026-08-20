# Rule — Design system adherence

The project's design system is the visual source of truth.

- **Read `design.md`** (project root) before any visual decision.
- **If `design.md` is absent**, run the `detect-design-system` skill first.
- **No hardcoded values**: colours, spacing, radii, fonts go through the tokens documented in `design.md`, never as literal values (`#3b82f6`, `17px`…).
- Any genuinely necessary new value must first be added to the design system, then documented in `design.md`.

## Red Flags — STOP
- You were about to write a hex colour or pixel size directly in a component.
- You make a font/spacing decision without having opened `design.md`.
