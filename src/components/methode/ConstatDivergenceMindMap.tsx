import {motion, useReducedMotion, useTransform, type MotionValue} from "motion/react";

const FEATURES = [
    {label: "Accès", glyph: "●"},
    {label: "Recherche", glyph: "⌕"},
    {label: "Suivi", glyph: "↗"},
];

function FeatureTile({label, glyph}: {
    label: string;
    glyph: string;
}) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest px-4 py-3">
            <span className="grid size-8 place-items-center rounded-lg bg-surface-container text-[14px] font-semibold text-on-surface-variant">
                {glyph}
            </span>
            <span className="text-[11px] font-medium text-on-surface">{label}</span>
        </div>
    );
}

export function ConstatDivergenceMindMap({progress}: {progress: MotionValue<number>}) {
    const shouldReduceMotion = useReducedMotion();
    const sceneOpacity = useTransform(progress, [0, 0.39, 0.47], [1, 1, 0]);
    const sceneY = useTransform(progress, [0, 0.39, 0.47], [0, 0, -10]);
    const placeholderOpacity = useTransform(progress, [0.08, 0.16], [1, 0]);
    const paymentOpacity = useTransform(progress, [0.08, 0.16], [0, 1]);
    const paymentScale = useTransform(progress, [0.08, 0.16, 0.2, 0.25], [0.76, 1.08, 1.08, 1]);
    const successOpacity = useTransform(progress, [0.2, 0.28], [0, 1]);
    const promptDoneOpacity = useTransform(progress, [0.14, 0.22], [0, 1]);

    return (
        <motion.div
            className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 scale-[0.44] min-[340px]:scale-[0.5] min-[400px]:scale-[0.56] sm:scale-[0.72] md:scale-[0.84] lg:scale-[0.72] min-[1100px]:scale-[0.82] min-[1180px]:scale-[0.92] xl:scale-100"
            style={{opacity: sceneOpacity, y: sceneY}}
        >
            <div className="absolute left-1/2 top-5 z-20 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-full border border-primary/25 bg-surface-container-lowest px-4 py-2.5 shadow-md">
                <span className="grid size-7 place-items-center rounded-full bg-primary text-sm font-semibold text-on-primary">✦</span>
                <span className="text-[12px] font-semibold text-on-surface">Ajouter le paiement</span>
                <motion.span
                    className="grid size-5 place-items-center rounded-full bg-tertiary text-[10px] font-bold text-on-tertiary"
                    style={{opacity: promptDoneOpacity}}
                >
                    ✓
                </motion.span>
            </div>

            <div className="absolute inset-x-12 bottom-4 top-24 flex flex-col overflow-hidden rounded-2xl border border-outline-variant/70 bg-surface-container-lowest shadow-[0_22px_60px_color-mix(in_srgb,var(--color-on-surface)_10%,transparent)]">
                <div className="flex h-11 items-center gap-2 border-b border-outline-variant/60 bg-surface-container-low px-4">
                    <span className="size-2 rounded-full bg-outline-variant" />
                    <span className="size-2 rounded-full bg-outline-variant" />
                    <span className="size-2 rounded-full bg-outline-variant" />
                    <span className="ml-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant">Application</span>
                    <motion.span
                        className="ml-auto flex items-center gap-1.5 rounded-full bg-tertiary-container px-2.5 py-1 text-[9px] font-semibold text-on-tertiary-container"
                        style={{opacity: successOpacity}}
                    >
                        <span className="size-1.5 rounded-full bg-tertiary" />
                        Démo OK
                    </motion.span>
                </div>

                <div className="grid flex-1 grid-cols-[110px_1fr]">
                    <div className="border-r border-outline-variant/60 bg-surface-container-low/55 p-4">
                        <div className="h-2 w-14 rounded-full bg-on-surface/12" />
                        <div className="mt-5 grid gap-3">
                            {["w-16", "w-12", "w-14", "w-10"].map((width, index) => (
                                <span key={index} className={`h-1.5 rounded-full bg-on-surface/10 ${width}`} />
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-4">
                        {FEATURES.map((feature) => (
                            <FeatureTile key={feature.label} {...feature} />
                        ))}

                        <div className="relative min-h-0">
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary/35 bg-primary/5 text-[11px] font-semibold text-primary"
                                style={{opacity: placeholderOpacity}}
                            >
                                <span className="grid size-7 place-items-center rounded-full border border-primary/35 text-base">+</span>
                                Paiement à générer
                            </motion.div>

                            <motion.div
                                className="absolute inset-0 flex items-center gap-3 overflow-hidden rounded-xl border border-primary/45 bg-primary-container px-4 py-3 text-on-primary-container shadow-sm"
                                style={{opacity: paymentOpacity, scale: paymentScale}}
                            >
                                {!shouldReduceMotion && (
                                    <motion.span
                                        className="absolute inset-0 bg-primary/10"
                                        animate={{opacity: [0, 0.55, 0]}}
                                        transition={{duration: 1.5, repeat: Infinity, ease: "easeInOut"}}
                                    />
                                )}
                                <span className="relative grid size-8 place-items-center rounded-lg bg-primary text-[15px] font-bold text-on-primary">€</span>
                                <span className="relative text-[12px] font-bold">Paiement</span>
                                <motion.span
                                    className="relative ml-auto grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-on-primary"
                                    style={{opacity: successOpacity}}
                                >
                                    ✓
                                </motion.span>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
