import {motion, useReducedMotion, useTransform, type MotionValue} from "motion/react";

interface Feature {
    id: string;
    label: string;
    at: number;
    overviewLeft: string;
    overviewTop: string;
    externalLeft: string;
    externalTop: string;
    selected?: boolean;
}

const FEATURES: Feature[] = [
    {id: "access", label: "Accès", at: 0.02, overviewLeft: "15%", overviewTop: "25%", externalLeft: "max(40px, 8%)", externalTop: "20%"},
    {id: "search", label: "Recherche", at: 0.06, overviewLeft: "40%", overviewTop: "14%", externalLeft: "min(calc(100% - 48px), 92%)", externalTop: "20%"},
    {id: "tracking", label: "Suivi", at: 0.1, overviewLeft: "82%", overviewTop: "28%", externalLeft: "min(calc(100% - 40px), 92%)", externalTop: "78%"},
    {id: "payment", label: "Paiement", at: 0.14, overviewLeft: "20%", overviewTop: "76%", externalLeft: "max(45px, 8%)", externalTop: "78%"},
    {id: "profile", label: "Profil", at: 0.18, overviewLeft: "73%", overviewTop: "74%", externalLeft: "50%", externalTop: "50%", selected: true},
];

function FeatureNode({feature, progress}: {feature: Feature; progress: MotionValue<number>}) {
    const shouldReduceMotion = useReducedMotion();
    const appearOpacity = useTransform(progress, [feature.at, feature.at + 0.035], [0, 1]);
    const appearScale = useTransform(progress, [feature.at, feature.at + 0.035], [0.55, 1]);
    const left = useTransform(progress, [0.42, 0.56], [feature.overviewLeft, feature.externalLeft]);
    const top = useTransform(progress, [0.42, 0.56], [feature.overviewTop, feature.externalTop]);
    const zoomScale = useTransform(progress, [0.42, 0.56], [1, feature.selected ? 1.35 : 0.72]);
    const zoomOpacity = useTransform(progress, [0.42, 0.54], [1, feature.selected ? 0 : 0.62]);
    const opacity = useTransform([appearOpacity, zoomOpacity], ([appear, zoom]: number[]) => appear * zoom);
    const scale = useTransform([appearScale, zoomScale], ([appear, zoom]: number[]) => appear * zoom);

    return (
        <motion.div
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{left, top, opacity, scale}}
        >
            <motion.div
                className="relative whitespace-nowrap rounded-full border border-primary/40 bg-surface-container-high px-3 py-2 text-[10px] font-medium text-on-surface shadow-sm sm:px-4 sm:text-[11px]"
                animate={shouldReduceMotion ? undefined : {y: [0, -2, 0]}}
                transition={{duration: 3 + feature.at * 6, repeat: Infinity, ease: "easeInOut"}}
            >
                <span className="mr-1.5 inline-block size-1.5 rounded-full bg-primary"/>
                {feature.label}
            </motion.div>
        </motion.div>
    );
}

function DrawnPath({d, progress, at, divergent = false}: {
    d: string;
    progress: MotionValue<number>;
    at: number;
    divergent?: boolean;
}) {
    const pathLength = useTransform(progress, [at, at + 0.08], [0, 1]);
    const opacity = useTransform(progress, [at, at + 0.04, 0.42, 0.54], [0, divergent ? 0.6 : 0.5, divergent ? 0.6 : 0.5, 0]);

    return (
        <motion.path
            d={d}
            fill="none"
            stroke={divergent ? "var(--color-tertiary)" : "var(--color-primary)"}
            strokeDasharray={divergent ? "4 5" : undefined}
            strokeLinecap="round"
            strokeWidth={divergent ? 1.2 : 1.5}
            style={{pathLength, opacity}}
        />
    );
}

function FlowDot({d, progress, at, delay = 0}: {
    d: string;
    progress: MotionValue<number>;
    at: number;
    delay?: number;
}) {
    const shouldReduceMotion = useReducedMotion();
    const opacity = useTransform(progress, [at, at + 0.04, 0.42, 0.52], [0, 0.7, 0.7, 0]);
    if (shouldReduceMotion) return null;

    return (
        <motion.circle r="2" fill="var(--color-primary)" style={{opacity}}>
            <animateMotion path={d} dur="3.2s" begin={`${delay}s`} repeatCount="indefinite"/>
        </motion.circle>
    );
}

type InternalState = "duplicate" | "missing" | "exception" | "bypass" | "unknown";

interface InternalPart {
    id: string;
    label: string;
    left: string;
    top: string;
    at: number;
    state: InternalState;
    result: string;
}

const INTERNAL_PARTS: InternalPart[] = [
    {id: "ui", label: "Interface", left: "38%", top: "34%", at: 0.5, state: "duplicate", result: "dupliquée"},
    {id: "states", label: "États", left: "62%", top: "34%", at: 0.53, state: "missing", result: "erreurs absentes"},
    {id: "logic", label: "Logique", left: "40%", top: "61%", at: 0.56, state: "exception", result: "exception locale"},
    {id: "data", label: "Données", left: "60%", top: "66%", at: 0.59, state: "bypass", result: "accès direct"},
    {id: "controls", label: "Contrôles", left: "76%", top: "52%", at: 0.62, state: "unknown", result: "non vérifiés"},
];

function InternalNode({part, progress}: {part: InternalPart; progress: MotionValue<number>}) {
    const opacity = useTransform(progress, [part.at, part.at + 0.045], [0, 1]);
    const scale = useTransform(progress, [part.at, part.at + 0.045], [0.75, 1]);
    const resultOpacity = useTransform(progress, [0.66 + (part.at - 0.5) * 0.4, 0.75], [0, 1]);
    const healthyOpacity = useTransform(progress, [0.64, 0.72], [1, 0.16]);

    return (
        <motion.div
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{left: part.left, top: part.top, opacity, scale}}
        >
            {part.state === "duplicate" && (
                <motion.div
                    className="absolute inset-0 rounded-lg border border-tertiary/60 bg-tertiary/15 px-3 py-2 text-[10px] text-tertiary"
                    style={{opacity: resultOpacity}}
                    animate={{x: [0, 14], y: [0, -10], rotate: [0, 5]}}
                    transition={{duration: 0.45, ease: "easeOut"}}
                >
                    {part.label}
                </motion.div>
            )}
            <motion.div
                className="relative rounded-lg border border-primary/35 bg-surface-container-high px-3 py-2 text-center text-[10px] font-medium text-on-surface sm:text-[11px]"
                style={{opacity: part.state === "missing" ? healthyOpacity : 1}}
            >
                {part.label}
            </motion.div>
            <motion.span
                className={part.state === "missing"
                    ? "absolute left-1/2 top-[calc(100%+5px)] -translate-x-1/2 whitespace-nowrap text-[9px] text-on-surface-variant line-through"
                    : "absolute left-1/2 top-[calc(100%+5px)] -translate-x-1/2 whitespace-nowrap text-[9px] font-medium text-error"
                }
                style={{opacity: resultOpacity}}
            >
                {part.result}
            </motion.span>
            {part.state === "unknown" && (
                <motion.span
                    className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-error text-[9px] text-on-error"
                    style={{opacity: resultOpacity}}
                >
                    ?
                </motion.span>
            )}
        </motion.div>
    );
}

/**
 * Vue d'ensemble de l'application, puis zoom sur une fonctionnalité. Les autres
 * fonctionnalités deviennent ses dépendances externes pendant que ses choix internes
 * révèlent duplications, omissions, exceptions et contrôles non vérifiés.
 */
export function ConstatDivergenceMedia({progress}: {progress: MotionValue<number>}) {
    const shouldReduceMotion = useReducedMotion();
    const overviewOpacity = useTransform(progress, [0, 0.42, 0.56], [1, 1, 0]);
    const appOpacity = useTransform(progress, [0, 0.06, 0.42, 0.53], [0, 1, 1, 0]);
    const appScale = useTransform(progress, [0, 0.08, 0.42, 0.53], [0.7, 1, 1, 1.25]);
    const linksLabelOpacity = useTransform(progress, [0.21, 0.29, 0.38, 0.45], [0, 1, 1, 0]);

    const zoomOpacity = useTransform(progress, [0.45, 0.56, 0.82, 0.89], [0, 1, 1, 0]);
    const boundaryScale = useTransform(progress, [0.45, 0.57], [0.82, 1]);
    const internalLinksOpacity = useTransform(progress, [0.51, 0.61], [0, 0.45]);
    const badLinkOpacity = useTransform(progress, [0.67, 0.75], [0, 0.8]);

    const summaryOpacity = useTransform(progress, [0.84, 0.92], [0, 1]);
    const summaryY = useTransform(progress, [0.84, 0.92], [16, 0]);

    const spokePaths = [
        "M300 200 C220 145 150 115 90 100",
        "M300 200 C285 120 270 85 240 56",
        "M300 200 C390 135 440 115 492 112",
        "M300 200 C220 255 165 290 120 304",
        "M300 200 C365 250 410 285 438 296",
    ];

    return (
        <div className="relative h-full w-full overflow-hidden bg-surface-container-low">
            <motion.div className="absolute inset-0" style={{opacity: overviewOpacity}}>
                <svg className="absolute inset-0 size-full" viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">
                    {spokePaths.map((path, index) => (
                        <DrawnPath key={path} d={path} progress={progress} at={0.16 + index * 0.018}/>
                    ))}
                    <DrawnPath d="M90 100 C185 40 390 45 492 112" progress={progress} at={0.25} divergent/>
                    <DrawnPath d="M120 304 C220 350 355 345 438 296" progress={progress} at={0.29} divergent/>
                    {spokePaths.map((path, index) => (
                        <FlowDot key={`dot-${path}`} d={path} progress={progress} at={0.2} delay={index * 0.55}/>
                    ))}
                </svg>

                <motion.div
                    className="absolute left-1/2 top-1/2 z-10 grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-primary/50 bg-surface-container-low text-center"
                    style={{opacity: appOpacity, scale: appScale}}
                >
                    <motion.span
                        className="absolute inset-1 rounded-full border border-primary/30"
                        animate={shouldReduceMotion ? undefined : {scale: [1, 1.28, 1], opacity: [0.55, 0, 0.55]}}
                        transition={{duration: 2.8, repeat: Infinity, ease: "easeInOut"}}
                    />
                    <span>
                        <span className="block text-[8px] uppercase tracking-wider text-on-surface-variant">Application</span>
                        <span className="text-[11px] font-semibold text-on-surface">fonctionne</span>
                    </span>
                </motion.div>

                {FEATURES.map((feature) => (
                    <FeatureNode key={feature.id} feature={feature} progress={progress}/>
                ))}

                <motion.span
                    className="absolute left-1/2 top-[7%] -translate-x-1/2 text-[10px] font-medium text-on-surface-variant"
                    style={{opacity: linksLabelOpacity}}
                >
                    Les fonctionnalités semblent former un ensemble cohérent
                </motion.span>
            </motion.div>

            <motion.div className="absolute inset-0" style={{opacity: zoomOpacity}}>
                <motion.div
                    className="absolute inset-[13%] rounded-[42%] border border-dashed border-primary/35 sm:inset-[15%]"
                    style={{scale: boundaryScale}}
                />
                <div className="absolute left-1/2 top-[7%] z-30 -translate-x-1/2 text-center">
                    <span className="block text-[9px] uppercase tracking-[0.18em] text-primary">Zoom</span>
                    <span className="text-title-small font-medium text-on-surface">À l'intérieur de « Profil »</span>
                </div>

                <svg className="absolute inset-0 size-full" viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">
                    <motion.g style={{opacity: internalLinksOpacity}} fill="none" stroke="var(--color-primary)" strokeWidth="1.2" strokeLinecap="round">
                        <path d="M228 136 C270 125 325 125 372 136"/>
                        <path d="M228 136 C225 175 230 210 240 244"/>
                        <path d="M372 136 C365 180 360 220 360 264"/>
                        <path d="M240 244 C285 255 325 260 360 264"/>
                        <path d="M360 264 C395 245 420 225 456 208"/>
                        <path d="M48 80 C120 105 170 120 228 136" strokeDasharray="4 5"/>
                        <path d="M552 80 C490 115 430 170 456 208" strokeDasharray="4 5"/>
                        <path d="M552 312 C470 300 415 280 360 264" strokeDasharray="4 5"/>
                        <path d="M48 312 C120 285 185 260 240 244" strokeDasharray="4 5"/>
                    </motion.g>
                    <motion.path
                        d="M228 136 C330 165 315 245 360 264"
                        fill="none"
                        stroke="var(--color-error)"
                        strokeDasharray="5 5"
                        strokeLinecap="round"
                        strokeWidth="1.6"
                        style={{opacity: badLinkOpacity}}
                    />
                </svg>

                {FEATURES.filter((feature) => !feature.selected).map((feature) => (
                    <FeatureNode key={`external-${feature.id}`} feature={feature} progress={progress}/>
                ))}

                {INTERNAL_PARTS.map((part) => (
                    <InternalNode key={part.id} part={part} progress={progress}/>
                ))}
            </motion.div>

            <motion.div
                className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-surface-container-low px-8 text-center"
                style={{opacity: summaryOpacity, y: summaryY}}
            >
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary">Le résultat</span>
                <h5 className="mt-3 text-headline-medium text-on-surface sm:text-headline-large">
                    Livré ne veut pas dire maîtrisé.
                </h5>
                <p className="mt-4 max-w-lg text-body-medium text-on-surface-variant">
                    Le produit fonctionne, mais sa surface, ses parcours, sa logique et ses garanties
                    n'évoluent plus ensemble.
                </p>
                <div className="mt-7 flex items-center gap-3 text-[10px] font-medium uppercase tracking-wider text-on-surface-variant sm:gap-6 sm:text-[11px]">
                    <span>Incomplet</span><i className="size-1 rounded-full bg-outline-variant"/>
                    <span>Incohérent</span><i className="size-1 rounded-full bg-outline-variant"/>
                    <span>Incertain</span>
                </div>
            </motion.div>
        </div>
    );
}
