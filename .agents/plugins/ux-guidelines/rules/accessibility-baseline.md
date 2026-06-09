# Rule — Accessibility baseline

Non-negotiable a11y constraints on any produced or modified UI.

- **Contrast**: text/content at minimum WCAG AA (4.5:1 normal text, 3:1 large text / interface elements).
- **Touch targets**: interactive area of at least 24×24 px (aim for 44×44 px on mobile).
- **Semantic HTML**: meaningful tags (`button`, `nav`, `main`, `header`…), no clickable `div` without a role.
- **Heading hierarchy**: a single `h1`, no level skips (`h2` → `h4`).
- **Forms**: every field has an associated `label`.
- **Images**: meaningful `alt` (or `alt=""` if purely decorative).
- **Focus**: visible focus state on every interactive element.
- **Motion**: respect `prefers-reduced-motion`.
