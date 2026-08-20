import {motion, useReducedMotion, useTransform, type MotionValue} from "motion/react";

function ShieldIcon() {
    return (
        <svg className="size-12" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <path d="M24 4 40 10v11c0 10.5-6.5 18.3-16 23-9.5-4.7-16-12.5-16-23V10l16-6Z" fill="currentColor" opacity=".16" />
            <path d="M24 4 40 10v11c0 10.5-6.5 18.3-16 23-9.5-4.7-16-12.5-16-23V10l16-6Z" stroke="currentColor" strokeWidth="2" />
            <path d="m17 24 5 5 10-11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ProductIcon() {
    return (
        <span className="relative block h-12 w-16 rounded-lg border-2 border-current bg-current/5">
            <span className="absolute inset-x-0 top-0 h-3 border-b-2 border-current opacity-50" />
            <span className="absolute bottom-2 left-2 h-4 w-5 rounded-sm bg-current opacity-25" />
            <span className="absolute bottom-2 right-2 grid size-5 place-items-center rounded-full bg-current text-[10px] font-black text-surface">✓</span>
        </span>
    );
}

export function ConstatDivergenceConclusion({progress}: {progress: MotionValue<number>}) {
    const shouldReduceMotion = useReducedMotion();
    const opacity = useTransform(progress, [0.79, 0.87], [0, 1]);
    const scale = useTransform(progress, [0.79, 0.87], [0.97, 1]);
    const aiOpacity = useTransform(progress, [0.82, 0.87], [0, 1]);
    const expertiseOpacity = useTransform(progress, [0.86, 0.91], [0, 1]);
    const resultOpacity = useTransform(progress, [0.91, 0.97], [0, 1]);
    const resultScale = useTransform(progress, [0.91, 0.97], [0.84, 1]);

    return (
        <motion.div
            className="absolute left-1/2 top-1/2 z-50 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 scale-[0.44] min-[340px]:scale-[0.5] min-[400px]:scale-[0.56] sm:scale-[0.72] md:scale-[0.84] lg:scale-[0.72] min-[1100px]:scale-[0.82] min-[1180px]:scale-[0.92] xl:scale-100"
            style={{opacity, scale}}
        >
            <div className="absolute inset-x-10 top-10 flex items-center justify-center gap-3">
                <motion.div
                    className="grid h-[190px] w-[140px] place-items-center rounded-2xl border border-outline-variant/70 bg-surface-container-lowest p-4 text-center shadow-md"
                    style={{opacity: aiOpacity}}
                >
                    <span>
                        <motion.span
                            className="mx-auto grid size-20 place-items-center rounded-2xl bg-primary-container text-4xl text-on-primary-container"
                            animate={shouldReduceMotion ? undefined : {scale: [1, 1.05, 1]}}
                            transition={{duration: 2, repeat: Infinity, ease: "easeInOut"}}
                        >
                            ✦
                        </motion.span>
                        <strong className="mt-4 block text-[17px] text-on-surface">IA</strong>
                        <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant">Vitesse</span>
                    </span>
                </motion.div>

                <motion.span className="text-[30px] font-light text-on-surface-variant" style={{opacity: expertiseOpacity}}>+</motion.span>

                <motion.div
                    className="grid h-[190px] w-[140px] place-items-center rounded-2xl border border-primary/40 bg-primary/5 p-4 text-center text-primary shadow-md"
                    style={{opacity: expertiseOpacity}}
                >
                    <span>
                        <span className="mx-auto grid size-20 place-items-center rounded-2xl bg-primary-container text-on-primary-container">
                            <ShieldIcon />
                        </span>
                        <strong className="mt-4 block text-[17px] text-on-surface">Expérience</strong>
                        <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Contexte</span>
                    </span>
                </motion.div>

                <motion.span className="text-[30px] font-light text-on-surface-variant" style={{opacity: resultOpacity}}>=</motion.span>

                <motion.div
                    className="grid h-[190px] w-[140px] place-items-center rounded-2xl bg-on-surface p-4 text-center text-surface shadow-xl"
                    style={{opacity: resultOpacity, scale: resultScale}}
                >
                    <span>
                        <span className="mx-auto grid size-20 place-items-center rounded-2xl bg-primary text-on-primary">
                            <ProductIcon />
                        </span>
                        <strong className="mt-4 block text-[17px]">Produit fiable</strong>
                        <span className="mx-auto mt-1 block max-w-full whitespace-nowrap text-[10px] font-semibold opacity-65">Vite · solide</span>
                    </span>
                </motion.div>
            </div>

        </motion.div>
    );
}
