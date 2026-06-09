---
name: ux-guidelines
description: This skill should be used when the user asks to "create a user interface", "modify a component", "design a web page", or mentions "UX", "user journey", or "copywriting". Guides the creation of distinctive, production-grade frontend interfaces that avoid generic AI aesthetics.
version: 0.1.0
---

# Global UX, UI & Design Thinking Guidelines

This skill guides the creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details, creative choices, and narrative structure.

**CRITICAL INSTRUCTION:** Project-specific design rules (exact fonts, color palettes, spacing tokens, and components like `@udixio` or Material 3) are located in the `design.md` file at the root of the project. **Read and adhere to `design.md` for technical design system constraints**, while using this `SKILL.md` for creative mindset and UX methodology.

---

## 1. Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
*   **Purpose**: What problem does this interface solve? Who uses it? (e.g., Product Funnel vs. Profile Funnel).
*   **Context & Narrative**: Analyze the rest of the page. The technologies and content must tell a coherent story (e.g., don't just list tech; associate them with business value or application complexity).
*   **Tone**: Choose a clear conceptual direction (e.g., editorial/magazine, refined minimalist, brutalist, high-end tech). The key is intentionality, not intensity.
*   **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?
*   **Propose Choices**: Do not impose a single structure on the developer. Reflect on the best way to present the content based on its meaning, and propose 2 or 3 narrative/visual layout concepts before writing the code.

---

## 2. Frontend Aesthetics Guidelines

Focus on:
*   **Spatial Composition**: Create unexpected layouts. Use asymmetry, overlaps, diagonal flow, and generous negative space or controlled density. **Zero "Wall of Text":** Avoid long, dense paragraphs. Use short, punchy sentences. The information must be scannable. Do not use generic grids or isolated badges ("toolbox" style) without context.
*   **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to flat backgrounds. Apply creative forms (gradients, noise textures, layered transparencies, dramatic shadows) based on the rules found in `design.md`.
*   **Typography & Color Strategy**: Follow the project's `design.md` for specific font families and color variables. Ensure intentional pairing: combine distinctive display text with refined body text. Use dominant colors with sharp accents rather than timid, evenly-distributed palettes.
*   **Motion**: Use animations for effects and micro-interactions (e.g., Framer Motion if defined in `design.md`). Focus on high-impact moments (like well-orchestrated staggered reveals on scroll) rather than scattering distracting micro-interactions on every element.

**NEVER use generic AI-generated aesthetics.** Interpret creatively and make unexpected choices that feel genuinely designed for the context. Match the implementation complexity to the aesthetic vision. Elegance comes from executing the vision well.

---

## 3. Copywriting & Tone

Writing is the pillar that transforms an aesthetic interface into a conversion tool.
*   **Pragmatic & Direct:** No frills. Be clear, concise, and factual. Focus on business value, clean architecture, and ROI.
*   **Hunting "AI Slop":** Permanently ban phrases like "Revolutionize", "Innovate", "Shape the future", or generic commercial style ("Discover how..."). Prefer concrete action verbs and fact-based explanations. See the `examples/` directory for "AI Slop" vs "High-End Differentiated Design".
*   **Language:** Write by default in high-quality French (unless specified otherwise) with impeccable spelling and grammar.

---

## 4. Dedicated Subagents for Specialized Tasks (Mandatory)

To ensure the best possible UX and avoid blind mistakes, delegate specific tasks to the dedicated subagents provided in this plugin:
*   **`ux-context-architect`**: Before any major structural change, spawn this subagent to research the repository. Its role is to read surrounding files, understand the existing layout patterns, map out the overall narrative of the page, and propose conceptual directions.
*   **`ux-code-reviewer`**: After proposing or generating code, use this subagent to review the code for "AI slop", structural flaws, accessibility (a11y) issues, and exact alignment with `design.md` constraints before presenting the final result to the user.

---

## 5. Maintenance of the `design.md` file

*   **Systematic update:** Whenever adding, modifying, or deleting a significant UI component, a style rule, or an element of the UX/Writing charter, update the `design.md` file to reflect the current state.
*   **Slash command:** Recommend the `/maintain-design` command to automate the detection and update of `design.md` against the project files.

---
## Additional Resources
*   **`examples/` directory**: Refer to this directory for concrete examples of Generic AI Slop vs. High-End Differentiated Design to align with the bold aesthetics requested.
