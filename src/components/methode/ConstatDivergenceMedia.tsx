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
    const labelOpacity = useTransform(progress, [0.74, 0.8], [1, feature.selected ? 0 : 1]);
    const surfaceOpacity = useTransform(progress, [0.74, 0.8], [1, feature.selected ? 0 : 1]);
    const solidBorderOpacity = useTransform(progress, [0.74, 0.8], [1, feature.selected ? 0 : 1]);
    const dashedBorderOpacity = useTransform(progress, [0.74, 0.8], [0, feature.selected ? 1 : 0]);
    const selectedGlowOpacity = useTransform(progress, [0.68, 0.8], [feature.selected ? 1 : 0, 0]);
    const selectedGlow = feature.selected ? "" : "shadow-sm";

    return (
        <motion.div
            className={feature.selected
                ? "absolute z-40 -translate-x-1/2 -translate-y-1/2"
                : "absolute z-20 -translate-x-1/2 -translate-y-1/2"
            }
            style={{left: feature.x, top: feature.y, opacity, scale}}
        >
            <motion.div
                className={`relative whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-medium text-on-surface ${selectedGlow}`}
                animate={shouldReduceMotion ? undefined : {y: [0, -2, 0]}}
                transition={{duration: 3 + feature.at * 5, repeat: Infinity, ease: "easeInOut"}}
            >
                {feature.selected && (
                    <motion.span
                        className="absolute inset-0 rounded-full ring-1 ring-primary/45 shadow-lg"
                        style={{opacity: selectedGlowOpacity}}
                    />
                )}
                <motion.span
                    className="absolute inset-0 rounded-full bg-surface-container-high"
                    style={{opacity: surfaceOpacity}}
                />
                <motion.span
                    className="absolute inset-0 rounded-full border border-primary/40"
                    style={{opacity: solidBorderOpacity}}
                />
                {feature.selected && (
                    <motion.span
                        className="absolute inset-0 rounded-full border border-dashed border-primary/70"
                        style={{opacity: dashedBorderOpacity}}
                    />
                )}
                <motion.span className="relative" style={{opacity: labelOpacity}}>
                    <span className="mr-1.5 inline-block size-1.5 rounded-full bg-primary" />
                    {feature.label}
                </motion.span>
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
        <div className={`rounded-[3px] border border-primary/35 bg-surface-container-high px-1 py-0.5 text-center text-[2.2px] font-medium leading-tight text-on-surface shadow-sm ${className}`}>
            {children}
        </div>
    );
}

function PaymentZoom({progress}: {progress: MotionValue<number>}) {
    const shouldReduceMotion = useReducedMotion();
    const panelOpacity = useTransform(progress, [0.84, 0.88], [0, 1]);
    const panelScale = useTransform(progress, [0.84, 0.88], [0.12, 1]);
    const flowOpacity = useTransform(progress, [0.87, 0.91], [0, 1]);
    const duplicateOpacity = useTransform(progress, [0.9, 0.94], [0, 1]);
    const missingOpacity = useTransform(progress, [0.93, 0.97], [0, 1]);
    const securityOpacity = useTransform(progress, [0.95, 0.99], [0, 1]);

    return (
        <motion.div
            className="absolute left-[168px] top-[292px] z-30 h-[46px] w-[92px] -translate-x-1/2 -translate-y-1/2"
            style={{opacity: panelOpacity, scale: panelScale, transformOrigin: "50% 50%"}}
        >
            <div className="absolute left-0 top-1/2 hidden -translate-x-[86%] -translate-y-1/2 text-[2px] font-medium text-on-surface-variant sm:block">
                Panier
            </div>
            <div className="absolute right-0 top-1/2 hidden translate-x-[92%] -translate-y-1/2 text-[2px] font-medium text-on-surface-variant sm:block">
                Commandes
            </div>

            <motion.div className="absolute inset-x-4 top-[17px] z-20 grid grid-cols-3 items-center gap-1" style={{opacity: flowOpacity}}>
                <PaymentBox>Interface</PaymentBox>
                <PaymentBox>Traitement</PaymentBox>
                <PaymentBox>Transaction</PaymentBox>
            </motion.div>

            <motion.div
                className="absolute left-[36px] top-[4px] z-10 w-[20px]"
                style={{opacity: duplicateOpacity}}
                animate={shouldReduceMotion ? undefined : {x: [0, 4, 0], rotate: [0, -1.5, 0]}}
                transition={{duration: 2.2, repeat: Infinity, ease: "easeInOut"}}
            >
                <PaymentBox className="border-tertiary/60 bg-tertiary/15 text-tertiary">
                    Traitement
                    <span className="mt-0.5 block text-[1.8px] font-normal">copie séparée</span>
                </PaymentBox>
            </motion.div>

            <motion.div className="absolute left-[24px] top-[31px] z-20 w-[34px]" style={{opacity: missingOpacity}}>
                <div className="rounded-[3px] border border-dashed border-error/60 bg-error/10 px-1 py-0.5 text-center text-[2.2px] font-medium leading-tight text-error">
                    Échecs & remboursements
                    <span className="mx-auto mt-0.5 block h-px w-4 bg-error/60" />
                    <span className="mt-0.5 block text-[1.8px] font-normal">absent</span>
                </div>
            </motion.div>

            <motion.div className="absolute right-[4px] top-[31px] z-20 w-[25px]" style={{opacity: securityOpacity}}>
                <div className="rounded-[3px] border border-dashed border-outline bg-surface-container-low px-1 py-0.5 text-center text-[2.2px] font-medium leading-tight text-on-surface">
                    Sécurité / tests
                    <span className="mt-0.5 block text-[1.8px] font-normal text-error">non garanti</span>
                </div>
            </motion.div>

            <svg className="absolute inset-0 size-full" viewBox="0 0 92 46" aria-hidden="true">
                <motion.g style={{opacity: flowOpacity}} fill="none" stroke="var(--color-primary)" strokeLinecap="round" strokeWidth="1.2">
                    <path d="M34 23 H37" />
                    <path d="M55 23 H58" />
                    <path d="M0 24 H13" strokeDasharray="2 2" />
                    <path d="M79 24 H92" strokeDasharray="2 2" />
                </motion.g>
                <motion.g style={{opacity: missingOpacity}} fill="none" stroke="var(--color-error)" strokeLinecap="round" strokeWidth="1.2" strokeDasharray="5 6">
                    <path d="M46 26 C45 29 45 31 46 33" />
                </motion.g>
            </svg>
        </motion.div>
    );
}

function ConclusionOverlay({progress}: {progress: MotionValue<number>}) {
    const opacity = useTransform(progress, [0.98, 1], [0, 1]);
    const y = useTransform(progress, [0.98, 1], [18, 0]);

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
    const cameraX = useTransform(progress, [0.4, 0.8, 1], [0, shouldReduceMotion ? 96 : 713, shouldReduceMotion ? 96 : 713]);
    const cameraY = useTransform(progress, [0.4, 0.8, 1], [0, shouldReduceMotion ? -66 : -497, shouldReduceMotion ? -66 : -497]);
    const cameraScale = useTransform(progress, [0.4, 0.8, 1], [1, shouldReduceMotion ? 1.18 : 5.4, shouldReduceMotion ? 1.18 : 5.4]);

    return (
        <div className="relative h-full w-full overflow-hidden bg-surface-container-low">
            <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 scale-[0.58] sm:scale-[0.74] md:scale-[0.86] xl:scale-100">
                <motion.div className="absolute inset-0" style={{x: cameraX, y: cameraY, scale: cameraScale}}>
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
            </div>

            <ConclusionOverlay progress={progress} />
        </div>
    );
}
