# Spec — Plugin Antigravity `ux-guidelines` (refonte de 0)

- **Date** : 2026-06-09
- **Auteur** : Joël Vigreux
- **Statut** : en attente de relecture

## 1. Objectif

Permettre à **n'importe quel développeur** de créer et modifier une interface
**sans erreur de design**, en recevant des conseils d'experts, via une vraie
collaboration guidée et une vérification automatisée.

Le plugin actuel (`.agents/plugins/ux-guidelines/`, format Claude Code) est
abandonné : il est couplé au projet vigreux-joel.fr (udixio, Material 3, cibles
recruteurs/clients) et n'exploite pas les mécanismes natifs d'Antigravity. On
repart de 0 sur le **format plugin CLI Antigravity**.

### Principes directeurs

- **Générique + auto-détection** : aucun design system n'est codé en dur. Le
  plugin détecte celui du projet courant et s'y adapte.
- **Vérification hybride** : des checks déterministes (scripts) **et** une revue
  qualitative par une persona experte. Un changement n'est « validé » que si les
  deux passent.
- **Collaboration guidée** : un pipeline à phases avec **approval gates** — le
  développeur valide à chaque étape avant de continuer.
- **Mécanique inspirée de `obra/superpowers`** : `description` = *quand* utiliser
  (jamais le résumé du process), flowcharts réservés aux routages non-évidents,
  tables de rationalisation + listes de Red Flags pour blinder les règles de
  discipline, handover par fichiers d'artefacts.

## 2. Plateforme cible — format plugin CLI Antigravity

Référence : `https://antigravity.google/docs/cli-plugins`.

Un plugin est un bundle namespacé installé sous
`~/.gemini/antigravity-cli/plugins/<plugin_name>/`. L'agent Antigravity découvre
et charge automatiquement skills, agents, rules, MCP et hooks.

```
~/.gemini/antigravity-cli/plugins/ux-guidelines/
├── plugin.json          # marqueur requis (name, version, description, …)
├── mcp_config.json      # optionnel — non utilisé en v1
├── hooks.json           # optionnel — 1 hook advisory de drift
├── skills/              # capacités + slash-commands d'orchestration
├── agents/              # subagents personas (au format agent.json compilé)
└── rules/               # garde-fous toujours actifs
```

### Points de format vérifiés

- **Subagents** : format natif **JSON** (`agents/<nom>/agent.json`) avec
  `name`, `description`, `hidden`, et `config.customAgent` contenant
  `systemPromptSections[]` (`title`/`content`), `toolNames[]`,
  `systemPromptConfig.includeSections[]`. *(Source : discussion gemini-cli
  #27305 ; le format peut encore bouger entre versions.)*
- **Pas de dossier `workflows/`** dans le format plugin CLI. Les skills servent
  de slash-commands → l'orchestration est un **skill**.
- **`.agent/` (singulier)** est la convention workspace ; ce repo a déjà
  `.agent/skills/`. Le plugin lui vit en global sous `~/.gemini/antigravity-cli/`.

### Décision : sources Markdown → build JSON

Les agents sont **écrits en Markdown lisible** (frontmatter + corps) dans le repo
source, puis **compilés en `agent.json`** par `install.sh`. On obtient lisibilité
(édition humaine) ET compatibilité avec le loader.

## 3. Arborescence source (dans ce repo)

La source de vérité reste versionnée sous `.agents/plugins/ux-guidelines/` ;
`install.sh` la matérialise (avec compilation des agents) vers
`~/.gemini/antigravity-cli/plugins/ux-guidelines/`.

```
.agents/plugins/ux-guidelines/
├── plugin.json
├── install.sh                      # copie + compile agents .md → agent.json
├── hooks.json
├── agents/                         # SOURCES markdown (compilées à l'install)
│   ├── ux-strategist.md
│   ├── ux-copywriter.md
│   ├── ui-designer.md
│   ├── motion-designer.md
│   └── design-reviewer.md
├── rules/
│   ├── anti-ai-slop.md
│   ├── accessibility-baseline.md
│   └── design-system-adherence.md
└── skills/
    ├── detect-design-system/
    │   ├── SKILL.md
    │   └── scripts/                # extraction tokens/composants → design.md
    ├── design-review/
    │   ├── SKILL.md
    │   └── scripts/                # checks déterministes
    └── design-feature/
        └── SKILL.md                # orchestrateur guidé (slash-command)
```

## 4. Composants

### 4.1 `plugin.json`

Marqueur requis : `name` (`ux-guidelines`), `version`, `description`, `author`,
`keywords`. Champs exacts à confirmer contre la version installée d'Antigravity ;
on part du minimum `name` + `version` + `description`.

### 4.2 Agents (personas) — `agents/*.md`

Chaque persona = 1 fichier Markdown. Frontmatter commun :

```yaml
---
name: ux-strategist
description: Use when a UI feature needs its audience, business goal and narrative defined before any copy or code.
model: heavy            # heavy | light — mappé si supporté, sinon documenté
tools: [view_file, grep_search, list_dir, search_web]   # → toolNames
includeSections: [user_information, skills, user_rules, artifacts, messaging]
---

<corps markdown = systemPromptSections[0].content>
```

| Persona | Rôle | Modèle | Sortie (artefact) |
|---|---|---|---|
| `ux-strategist` | Cible, objectif business, message clé. Challenge les demandes incohérentes. | heavy | `strategy.md` |
| `ux-copywriter` | Architecture de l'information + copy anti-slop. | heavy | `copy.md` |
| `ui-designer` | Layout, hiérarchie, tokens du design system détecté. | light | `layout.md` |
| `motion-designer` | Reveals, micro/macro-interactions, reduced-motion. | light | `motion.md` |
| `design-reviewer` | Auditeur read-only. Lance la vérif hybride, rend un verdict. | light | `review-report.md` |

La méthodologie de chaque persona vit dans son system prompt (corps .md). Les
**capacités scriptées** (détection, checks) restent dans des skills réutilisables
que les personas invoquent — pas de duplication.

#### Compilation `.md` → `agent.json`

`install.sh` mappe :
- `name`, `description` → champs racine
- corps markdown → `config.customAgent.systemPromptSections[0]`
  (`title: "Agent System Instructions"`, `content: <corps>`)
- `tools` → `config.customAgent.toolNames`
- `includeSections` → `config.customAgent.systemPromptConfig.includeSections`
- `model` → conservé/mappé si le schéma le supporte, sinon ignoré (documenté)
- `hidden` : `false` pour les personas invocables, `true` pour les internes

### 4.3 Rules — `rules/*.md` (toujours actives)

Garde-fous courts (< 200 mots chacun) lus à chaque interaction — ils empêchent
les erreurs **même hors pipeline**.

1. **`anti-ai-slop.md`** — mots/formules bannis (FR + EN : « révolutionner »,
   « innover », « façonner l'avenir », « Discover how… »…), interdiction de
   l'em-dash décoratif, zéro wall of text, verbes d'action concrets. Inclut une
   **table de rationalisation** et une liste de **Red Flags**.
2. **`accessibility-baseline.md`** — contraste WCAG AA minimum, tailles de cible
   tactile, HTML sémantique, ordre des titres, labels de formulaire, états de
   focus visibles, respect de `prefers-reduced-motion`.
3. **`design-system-adherence.md`** — « lis et respecte `design.md` ; aucune
   valeur de couleur/espacement/police hors tokens. Si `design.md` est absent,
   lance d'abord `detect-design-system`. »

### 4.4 Skills — `skills/<nom>/SKILL.md`

Frontmatter `name` + `description` (= *quand* utiliser). Corps : Objectif /
Règles d'engagement / Instructions, plus `scripts/` quand pertinent.

1. **`detect-design-system/`** *(slash-command : régénère `design.md`)*
   - Scanne CSS / config Tailwind / variables de tokens / inventaire de
     composants (props, comportements) du projet courant.
   - Écrit un manifeste **`design.md`** auditable à la racine du projet
     (option A retenue), que tout le reste du pipeline relit.
   - `scripts/` : extraction des custom properties CSS, des familles de polices,
     de la palette, et de la liste des composants réutilisables.
   - Généralisation de l'ancien `/maintain-design`, dé-couplée d'udixio.

2. **`design-review/`** *(slash-command : vérification hybride)*
   - **Checks déterministes** (`scripts/`) :
     - contraste WCAG sur les paires de couleurs (tokens + usages),
     - **drift de tokens** : valeurs codées en dur absentes de `design.md`,
     - détecteur de **walls of text** (paragraphes trop longs),
     - sémantique/a11y : `alt`, ordre des titres, labels, taille de cible.
   - **Revue qualitative** : checklist suivie par la persona `design-reviewer`
     (AI slop, cohérence narrative, fidélité au design system).
   - **Verdict** : `PASS` seulement si checks **et** revue passent ; sinon liste
     d'actions correctives. Inclut Red Flags pour l'auditeur.

3. **`design-feature/`** *(slash-command : pipeline guidé)*
   - **Routage dynamique** (flowchart) : un petit changement saute
     stratégie/copy ; une nouvelle section déroule les 5 phases.
   - Enchaîne `ux-strategist → ux-copywriter → ui-designer → motion-designer →
     design-reviewer`.
   - **Approval gate** après chaque phase : pause, présente l'artefact, attend la
     validation explicite du développeur avant de continuer.
   - **Handover par artefacts** dans `docs/design/<feature-slug>/`
     (`strategy.md`, `copy.md`, `layout.md`, `motion.md`, `review-report.md`).
   - Vérifie au démarrage que `design.md` existe ; sinon invoque
     `detect-design-system`.

### 4.5 `hooks.json` (optionnel, advisory)

Un hook `PostToolUse` sur l'édition de fichiers UI (`*.tsx`, `*.astro`, `*.css`,
…) lance un check rapide de **drift de tokens** et affiche un avertissement
non-bloquant invitant à `/design-review`. Désactivable. Le cœur de la valeur
reste dans les skills/agents/rules.

### 4.6 `mcp_config.json`

Non utilisé en v1 (les scripts suffisent). Fichier présent mais vide/omis.

### 4.7 `install.sh`

- Cible : `~/.gemini/antigravity-cli/plugins/ux-guidelines/` (détecte la version,
  bascule sur `.agent/` workspace si demandé).
- Compile `agents/*.md` → `agents/<nom>/agent.json` (cf. 4.2).
- Copie `skills/`, `rules/`, `hooks.json`, `plugin.json`.
- Idempotent (ré-exécutable sans casser une install existante).

## 5. Flux de données

```
/design-feature "ajoute une section pricing"
   │
   ├─ design.md absent ? → detect-design-system → design.md
   │
   ├─ [routage dynamique] petit changement ? → saute strat/copy
   │
   ├─ ux-strategist  → docs/design/pricing/strategy.md     ── gate ──▶ dev valide
   ├─ ux-copywriter  → docs/design/pricing/copy.md         ── gate ──▶ dev valide
   ├─ ui-designer    → docs/design/pricing/layout.md       ── gate ──▶ dev valide
   ├─ motion-designer→ docs/design/pricing/motion.md       ── gate ──▶ dev valide
   └─ design-reviewer→ design-review (scripts + checklist)
                       → review-report.md  →  PASS / actions correctives
```

Les rules tournent en permanence et s'appliquent même quand le dev code à la
main hors pipeline.

## 6. Hors périmètre (v1)

- Pas de serveur MCP custom.
- Pas de rendu visuel réel (les checks de contraste opèrent statiquement sur les
  tokens et usages, pas sur un DOM rendu).
- Pas de support multi-plateforme (Cursor/Claude Code) : cible Antigravity seule.
- Pas de migration automatique de l'ancien plugin Claude Code.

## 7. Risques / à confirmer

- **Schéma exact de `plugin.json`** et **champs supportés de l'`agent.json`**
  (notamment `model`) : à valider contre la version installée d'Antigravity ;
  le format subagent est noté comme « pas encore totalement standardisé ».
- **`.agent/` vs `.agents/`** selon version : install.sh détecte.
- **Bruit du hook** de drift : prévu non-bloquant et désactivable.

## 8. Sources

- Antigravity — CLI plugins : `https://antigravity.google/docs/cli-plugins`
- Antigravity — Rules & Workflows : `https://antigravity.google/docs/rules-workflows`
- Codelab — Skills : `https://codelabs.developers.google.com/getting-started-with-antigravity-skills`
- Codelab — Pipelines agents.md/skills.md : `https://codelabs.developers.google.com/autonomous-ai-developer-pipelines-antigravity`
- Format subagent (gemini-cli #27305) : `https://github.com/google-gemini/gemini-cli/discussions/27305`
- `obra/superpowers` (mécanique des étapes) : `https://github.com/obra/superpowers`
