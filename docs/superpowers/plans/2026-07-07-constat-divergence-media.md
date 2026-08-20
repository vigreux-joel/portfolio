# Constat Divergence Media Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the `ConstatDivergenceMedia` sticky-scroll illustration so it shows a fast AI-produced app, then a real camera zoom into `Paiement`, revealing duplicated, missing, and non-guaranteed internal parts without making the scene unreadable.

**Architecture:** Keep one persistent animated scene instead of swapping between unrelated layouts. `StickyScroll` owns media persistence and smoothed progress; `ConstatDivergenceMedia` owns the camera, overview map, payment zoom, and final conclusion. The left sticky text carries the detailed argument; the media uses short labels only.

**Tech Stack:** Astro, React 19, `motion/react`, Tailwind utility classes, existing `StickyScroll` component.

---

## File structure

- Modify `src/components/sticky-scroll-reveal.tsx`
  - Keep the existing inherited media-group behavior.
  - Ensure the first media/text state is not hidden at the beginning of the sticky scroll.
  - Keep smoothed `MotionValue<number>` progress before passing it to media functions.

- Modify `src/components/methode/ConstatScroll.tsx`
  - Align the left sticky text with the validated five-step narrative.
  - Use `Paiement` consistently as the zoom focus instead of `Profil`.
  - Type the media function as `MotionValue<number>` instead of `any`.

- Replace `src/components/methode/ConstatDivergenceMedia.tsx`
  - Rebuild the component around one persistent scene.
  - Use a camera transform on an app map.
  - Reveal payment internals progressively.
  - Preserve `prefers-reduced-motion`.

---

### Task 1: Keep the sticky media visible from the first state

**Files:**
- Modify: `src/components/sticky-scroll-reveal.tsx`

- [ ] **Step 1: Set the initial active card to the first item**

In `StickyScroll`, replace:

```tsx
const [activeCard, setActiveCard] = React.useState<number | null>(null);
```

with:

```tsx
const [activeCard, setActiveCard] = React.useState<number>(0);
```

- [ ] **Step 2: Make the text/media container visible by default**

Replace:

```tsx
const [displayText, setDisplayText] = useState(false);
```

with:

```tsx
const [displayText, setDisplayText] = useState(true);
```

- [ ] **Step 3: Simplify the visible media-group test**

Replace:

```tsx
const isVisible = activeCard != null
    ? activeCard >= group.ownerIndex && activeCard < group.endIndex
    : group.ownerIndex === 0;
```

with:

```tsx
const isVisible = activeCard >= group.ownerIndex && activeCard < group.endIndex;
```

- [ ] **Step 4: Keep the existing smooth progress behavior**

Do not change this block; verify it remains present in `MediaRenderer`:

```tsx
const localProgress = useTransform(scrollProgress, [start, end], [0, 1], {clamp: true});
const smoothProgress = useSpring(localProgress, {
    stiffness: 90,
    damping: 20,
    mass: 0.45,
    restDelta: 0.0005,
    restSpeed: 0.001,
});

return <>{typeof media === "function" ? media(smoothProgress) : media}</>;
```

- [ ] **Step 5: Run a focused search**

Run:

```bash
rg -n "activeCard|displayText|smoothProgress" src/components/sticky-scroll-reveal.tsx
```

Expected:

- `activeCard` is initialized to `0`.
- `displayText` is initialized to `true`.
- `smoothProgress` is still passed to media functions.

- [ ] **Step 6: Commit**

```bash
git add src/components/sticky-scroll-reveal.tsx
git commit -m "fix: keep sticky media visible initially"
```

---

### Task 2: Align the sticky text with the validated narrative

**Files:**
- Modify: `src/components/methode/ConstatScroll.tsx`

- [ ] **Step 1: Replace the file content**

Replace `src/components/methode/ConstatScroll.tsx` with:

```tsx
import type {MotionValue} from "motion/react";
import {StickyScroll} from "@components/sticky-scroll-reveal";
import {ConstatDivergenceMedia} from "./ConstatDivergenceMedia";

export const ConstatScroll = () => {
    const content = [
        {
            text: (
                <>
                    <h4 className="text-headline-small text-primary">
                        Les fonctionnalités apparaissent à toute vitesse
                    </h4>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        Accès, recherche, suivi, paiement, profil… en surface, le produit
                        semble avancer très vite.
                    </p>
                </>
            ),
            media: (progress: MotionValue<number>) => <ConstatDivergenceMedia progress={progress} />,
            theme: "orange",
        },
        {
            text: (
                <>
                    <h4 className="text-headline-small text-primary">
                        Très vite, tout semble relié
                    </h4>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        Les écrans se connectent, les données circulent, les parcours semblent
                        complets. Vu de l’extérieur, l’application paraît cohérente.
                    </p>
                </>
            ),
            theme: "orange",
        },
        {
            text: (
                <>
                    <h4 className="text-headline-small text-primary">
                        Mais que contient réellement une fonctionnalité ?
                    </h4>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        Derrière un paiement, il n’y a pas qu’un bouton. Il faut aligner les
                        états, les données, les erreurs, les contrôles et les autres modules.
                    </p>
                </>
            ),
            theme: "orange",
        },
        {
            text: (
                <>
                    <h4 className="text-headline-small text-primary">
                        C’est ici que la dette se forme
                    </h4>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        Sans pilotage, une évolution peut être ajoutée localement : une logique
                        est dupliquée, un cas d’échec est oublié, un contrôle reste implicite.
                    </p>
                </>
            ),
            theme: "orange",
        },
        {
            text: (
                <>
                    <h4 className="text-headline-small text-primary">
                        Livré ne veut pas dire maîtrisé
                    </h4>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        Le produit continue de fonctionner, mais chaque ajout devient moins sûr :
                        ce qui manque n’est pas toujours visible au moment de la livraison.
                    </p>
                </>
            ),
            theme: "orange",
        },
    ];

    return <StickyScroll content={content} />;
};
```

- [ ] **Step 2: Verify the rejected wording is gone**

Run:

```bash
rg -n "offre Pro|règle locale|réparer|réparé|Derrière un profil" src/components/methode/ConstatScroll.tsx
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/methode/ConstatScroll.tsx
git commit -m "copy: align constat sticky narrative"
```

---

### Task 3: Replace the media with the camera-based application map

**Files:**
- Modify: `src/components/methode/ConstatDivergenceMedia.tsx`

- [ ] **Step 1: Replace the file content**

Replace `src/components/methode/ConstatDivergenceMedia.tsx` with:

```tsx
import type {ReactNode} from "react";
import {motion, useReducedMotion, useTransform, type MotionValue} from "motion/react";

interface Feature {
    id: string;
    label: string;
    x: number;
    y: number;
    at: number;
    selected?: boolean;
}

interface Connection {
    id: string;
    d: string;
    at: number;
    dashed?: boolean;
}

const FEATURES: Feature[] = [
    {id: "access", label: "Accès", x: 120, y: 105, at: 0.02},
    {id: "search", label: "Recherche", x: 300, y: 64, at: 0.06},
    {id: "tracking", label: "Suivi", x: 480, y: 122, at: 0.1},
    {id: "payment", label: "Paiement", x: 168, y: 292, at: 0.14, selected: true},
    {id: "profile", label: "Profil", x: 438, y: 294, at: 0.18},
];

const CONNECTIONS: Connection[] = [
    {id: "core-access", d: "M300 200 C238 152 185 120 120 105", at: 0.18},
    {id: "core-search", d: "M300 200 C294 145 292 102 300 64", at: 0.2},
    {id: "core-tracking", d: "M300 200 C365 145 420 125 480 122", at: 0.22},
    {id: "core-payment", d: "M300 200 C244 238 204 262 168 292", at: 0.24},
    {id: "core-profile", d: "M300 200 C354 238 400 266 438 294", at: 0.26},
    {id: "access-search", d: "M120 105 C170 52 238 46 300 64", at: 0.3, dashed: true},
    {id: "payment-profile", d: "M168 292 C238 346 360 344 438 294", at: 0.33, dashed: true},
    {id: "tracking-payment", d: "M480 122 C390 176 270 244 168 292", at: 0.36, dashed: true},
];

function FeatureNode({feature, progress}: {feature: Feature; progress: MotionValue<number>}) {
    const shouldReduceMotion = useReducedMotion();
    const opacity = useTransform(progress, [feature.at, feature.at + 0.035], [0, 1]);
    const scale = useTransform(progress, [feature.at, feature.at + 0.035], [0.72, 1]);
    const selectedGlow = feature.selected ? "ring-1 ring-primary/45 shadow-lg" : "";

    return (
        <motion.div
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{left: feature.x, top: feature.y, opacity, scale}}
        >
            <motion.div
                className={`relative whitespace-nowrap rounded-full border border-primary/40 bg-surface-container-high px-4 py-2 text-[11px] font-medium text-on-surface shadow-sm ${selectedGlow}`}
                animate={shouldReduceMotion ? undefined : {y: [0, -2, 0]}}
                transition={{duration: 3 + feature.at * 5, repeat: Infinity, ease: "easeInOut"}}
            >
                <span className="mr-1.5 inline-block size-1.5 rounded-full bg-primary" />
                {feature.label}
            </motion.div>
        </motion.div>
    );
}

function ConnectionPath({connection, progress}: {connection: Connection; progress: MotionValue<number>}) {
    const pathLength = useTransform(progress, [connection.at, connection.at + 0.08], [0, 1]);
    const opacity = useTransform(progress, [connection.at, connection.at + 0.04, 0.4, 0.58], [0, 0.58, 0.58, 0.3]);

    return (
        <motion.path
            d={connection.d}
            fill="none"
            stroke={connection.dashed ? "var(--color-tertiary)" : "var(--color-primary)"}
            strokeDasharray={connection.dashed ? "5 6" : undefined}
            strokeLinecap="round"
            strokeWidth={connection.dashed ? 1.2 : 1.5}
            style={{pathLength, opacity}}
        />
    );
}

function FlowDot({connection, progress, delay}: {
    connection: Connection;
    progress: MotionValue<number>;
    delay: number;
}) {
    const shouldReduceMotion = useReducedMotion();
    const opacity = useTransform(progress, [0.22, 0.3, 0.52, 0.6], [0, 0.7, 0.7, 0]);

    if (shouldReduceMotion) return null;

    return (
        <motion.circle r="2" fill="var(--color-primary)" style={{opacity}}>
            <animateMotion path={connection.d} dur="3.4s" begin={`${delay}s`} repeatCount="indefinite" />
        </motion.circle>
    );
}

function AppCore({progress}: {progress: MotionValue<number>}) {
    const shouldReduceMotion = useReducedMotion();
    const opacity = useTransform(progress, [0, 0.01], [1, 1]);
    const scale = useTransform(progress, [0, 0.08], [0.9, 1]);

    return (
        <motion.div
            className="absolute left-[300px] top-[200px] z-10 grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-primary/50 bg-surface-container-low text-center"
            style={{opacity, scale}}
        >
            <motion.span
                className="absolute inset-1 rounded-full border border-primary/25"
                animate={shouldReduceMotion ? undefined : {scale: [1, 1.22, 1], opacity: [0.5, 0, 0.5]}}
                transition={{duration: 2.8, repeat: Infinity, ease: "easeInOut"}}
            />
            <span>
                <span className="block text-[8px] uppercase tracking-wider text-on-surface-variant">Application</span>
                <span className="text-[11px] font-semibold text-on-surface">fonctionne</span>
            </span>
        </motion.div>
    );
}

function PaymentBox({children, className = ""}: {children: ReactNode; className?: string}) {
    return (
        <div className={`rounded-xl border border-primary/35 bg-surface-container-high px-3 py-2 text-center text-[10px] font-medium text-on-surface shadow-sm ${className}`}>
            {children}
        </div>
    );
}

function PaymentZoom({progress}: {progress: MotionValue<number>}) {
    const shouldReduceMotion = useReducedMotion();
    const panelOpacity = useTransform(progress, [0.52, 0.6], [0, 1]);
    const panelScale = useTransform(progress, [0.52, 0.6], [0.84, 1]);
    const flowOpacity = useTransform(progress, [0.56, 0.64], [0, 1]);
    const duplicateOpacity = useTransform(progress, [0.64, 0.7], [0, 1]);
    const missingOpacity = useTransform(progress, [0.7, 0.76], [0, 1]);
    const securityOpacity = useTransform(progress, [0.76, 0.82], [0, 1]);

    return (
        <motion.div
            className="absolute left-[168px] top-[292px] z-30 h-[230px] w-[360px] -translate-x-1/2 -translate-y-1/2"
            style={{opacity: panelOpacity, scale: panelScale}}
        >
            <div className="absolute left-0 top-1/2 -translate-x-[86%] -translate-y-1/2 text-[10px] font-medium text-on-surface-variant">
                Panier
            </div>
            <div className="absolute right-0 top-1/2 translate-x-[92%] -translate-y-1/2 text-[10px] font-medium text-on-surface-variant">
                Commandes
            </div>

            <motion.div className="absolute inset-x-7 top-[88px] z-20 grid grid-cols-3 items-center gap-3" style={{opacity: flowOpacity}}>
                <PaymentBox>Interface</PaymentBox>
                <PaymentBox>Traitement</PaymentBox>
                <PaymentBox>Transaction</PaymentBox>
            </motion.div>

            <motion.div
                className="absolute left-[154px] top-[34px] z-10 w-[92px]"
                style={{opacity: duplicateOpacity}}
                animate={shouldReduceMotion ? undefined : {x: [0, 4, 0], rotate: [0, -1.5, 0]}}
                transition={{duration: 2.2, repeat: Infinity, ease: "easeInOut"}}
            >
                <PaymentBox className="border-tertiary/60 bg-tertiary/15 text-tertiary">
                    Traitement
                    <span className="mt-1 block text-[8px] font-normal">copie séparée</span>
                </PaymentBox>
            </motion.div>

            <motion.div className="absolute left-[126px] top-[164px] z-20 w-[120px]" style={{opacity: missingOpacity}}>
                <div className="rounded-xl border border-dashed border-error/60 bg-error/10 px-3 py-2 text-center text-[10px] font-medium text-error">
                    Échecs & remboursements
                    <span className="mx-auto mt-2 block h-px w-14 bg-error/60" />
                    <span className="mt-1 block text-[8px] font-normal">absent</span>
                </div>
            </motion.div>

            <motion.div className="absolute right-[18px] top-[154px] z-20 w-[104px]" style={{opacity: securityOpacity}}>
                <div className="rounded-xl border border-dashed border-outline bg-surface-container-low px-3 py-2 text-center text-[10px] font-medium text-on-surface">
                    Sécurité / tests
                    <span className="mt-1 block text-[8px] font-normal text-error">non garanti</span>
                </div>
            </motion.div>

            <svg className="absolute inset-0 size-full" viewBox="0 0 360 230" aria-hidden="true">
                <motion.g style={{opacity: flowOpacity}} fill="none" stroke="var(--color-primary)" strokeLinecap="round" strokeWidth="1.2">
                    <path d="M105 111 H144" />
                    <path d="M216 111 H255" />
                    <path d="M0 115 H52" strokeDasharray="5 6" />
                    <path d="M308 115 H360" strokeDasharray="5 6" />
                </motion.g>
                <motion.g style={{opacity: missingOpacity}} fill="none" stroke="var(--color-error)" strokeLinecap="round" strokeWidth="1.2" strokeDasharray="5 6">
                    <path d="M180 125 C178 142 178 151 180 163" />
                </motion.g>
            </svg>
        </motion.div>
    );
}

function ConclusionOverlay({progress}: {progress: MotionValue<number>}) {
    const opacity = useTransform(progress, [0.84, 0.92], [0, 1]);
    const y = useTransform(progress, [0.84, 0.92], [18, 0]);

    return (
        <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-surface-container-low/95 px-8 text-center backdrop-blur-sm"
            style={{opacity, y}}
        >
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary">Le constat</span>
            <h5 className="mt-3 text-headline-medium text-on-surface sm:text-headline-large">
                Livré ne veut pas dire maîtrisé.
            </h5>
            <p className="mt-4 max-w-lg text-body-medium text-on-surface-variant">
                Sans pilotage, chaque évolution peut laisser une partie du produit hors cohérence.
            </p>
        </motion.div>
    );
}

export function ConstatDivergenceMedia({progress}: {progress: MotionValue<number>}) {
    const shouldReduceMotion = useReducedMotion();
    const cameraX = useTransform(progress, [0.4, 0.56], [0, shouldReduceMotion ? 0 : 125]);
    const cameraY = useTransform(progress, [0.4, 0.56], [0, shouldReduceMotion ? 0 : -80]);
    const cameraScale = useTransform(progress, [0.4, 0.56], [1, shouldReduceMotion ? 1.08 : 1.55]);
    const overviewHintOpacity = useTransform(progress, [0.2, 0.3, 0.44, 0.52], [0, 1, 1, 0]);
    const zoomHintOpacity = useTransform(progress, [0.54, 0.62, 0.78, 0.84], [0, 1, 1, 0]);

    return (
        <div className="relative h-full w-full overflow-hidden bg-surface-container-low">
            <motion.div
                className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2"
                style={{x: cameraX, y: cameraY, scale: cameraScale}}
            >
                <svg className="absolute inset-0 size-full" viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">
                    {CONNECTIONS.map((connection) => (
                        <ConnectionPath key={connection.id} connection={connection} progress={progress} />
                    ))}
                    {CONNECTIONS.slice(0, 5).map((connection, index) => (
                        <FlowDot key={`flow-${connection.id}`} connection={connection} progress={progress} delay={index * 0.45} />
                    ))}
                </svg>

                <AppCore progress={progress} />

                {FEATURES.map((feature) => (
                    <FeatureNode key={feature.id} feature={feature} progress={progress} />
                ))}

                <PaymentZoom progress={progress} />
            </motion.div>

            <motion.div
                className="absolute left-1/2 top-[7%] z-40 -translate-x-1/2 rounded-full border border-outline-variant/70 bg-surface-container-low/85 px-4 py-2 text-center text-[10px] font-medium text-on-surface-variant backdrop-blur-sm"
                style={{opacity: overviewHintOpacity}}
            >
                Vu de loin, tout semble relié
            </motion.div>

            <motion.div
                className="absolute left-1/2 top-[7%] z-40 -translate-x-1/2 rounded-full border border-outline-variant/70 bg-surface-container-low/85 px-4 py-2 text-center text-[10px] font-medium text-on-surface-variant backdrop-blur-sm"
                style={{opacity: zoomHintOpacity}}
            >
                Dans une seule fonctionnalité, les écarts deviennent visibles
            </motion.div>

            <ConclusionOverlay progress={progress} />
        </div>
    );
}
```

- [ ] **Step 2: Verify the old rejected model is gone**

Run:

```bash
rg -n "À l'intérieur de « Profil »|INTERNAL_PARTS|exception locale|accès direct|règle locale|offre Pro" src/components/methode/ConstatDivergenceMedia.tsx
```

Expected: no output.

- [ ] **Step 3: Verify the validated payment terms are present**

Run:

```bash
rg -n "Paiement|Traitement|copie séparée|Échecs|remboursements|Sécurité|non garanti|Livré ne veut pas dire maîtrisé" src/components/methode/ConstatDivergenceMedia.tsx
```

Expected: output includes all validated labels.

- [ ] **Step 4: Commit**

```bash
git add src/components/methode/ConstatDivergenceMedia.tsx
git commit -m "feat: rebuild constat divergence media"
```

---

### Task 4: Run verification and adjust only if needed

**Files:**
- Verify: `src/components/sticky-scroll-reveal.tsx`
- Verify: `src/components/methode/ConstatScroll.tsx`
- Verify: `src/components/methode/ConstatDivergenceMedia.tsx`

- [ ] **Step 1: Run Astro build**

Run:

```bash
pnpm run build
```

Expected:

- Build completes successfully, or
- Build fails only because of an existing unrelated project issue. If it fails, copy the first error and confirm whether it references one of the three modified files.

- [ ] **Step 2: Run a source-level consistency check**

Run:

```bash
rg -n "À l'intérieur de « Profil »|Derrière un profil|offre Pro|règle locale|réparer|réparé|exception locale|accès direct" src/components/methode/ConstatScroll.tsx src/components/methode/ConstatDivergenceMedia.tsx
```

Expected: no output.

- [ ] **Step 3: Run a source-level required-label check**

Run:

```bash
rg -n "Paiement|Traitement|copie séparée|Échecs|remboursements|Sécurité|non garanti|Livré ne veut pas dire maîtrisé" src/components/methode/ConstatScroll.tsx src/components/methode/ConstatDivergenceMedia.tsx
```

Expected:

- `Paiement` appears in both files.
- `Traitement`, `copie séparée`, `Échecs`, `remboursements`, `Sécurité`, and `non garanti` appear in `ConstatDivergenceMedia.tsx`.
- `Livré ne veut pas dire maîtrisé` appears in both files.

- [ ] **Step 4: Manual visual review**

Start the dev server:

```bash
pnpm run dev
```

Open `/methode` and verify:

- the sticky media is not empty at the first state;
- the illustration fills the media container width;
- features appear quickly around the app core;
- links appear before the zoom;
- the scene zooms into `Paiement` instead of replacing the whole media;
- `Traitement` duplication is visible as a real duplicate block;
- `Échecs & remboursements` reads as absent/interrupted;
- `Sécurité / tests` reads as non guaranteed;
- the final overlay appears only near the end;
- mobile renders readable media blocks inside each text item.

- [ ] **Step 5: Commit verification fixes if any were needed**

If visual or build fixes were required, commit only the changed files:

```bash
git add src/components/sticky-scroll-reveal.tsx src/components/methode/ConstatScroll.tsx src/components/methode/ConstatDivergenceMedia.tsx
git commit -m "fix: polish constat divergence animation"
```

If no fixes were needed, do not create an empty commit.
