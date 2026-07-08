import {motion, useTransform, type MotionValue} from "motion/react";

export function ConstatDivergenceConclusion({progress}: {progress: MotionValue<number>}) {
    const opacity = useTransform(progress, [0.92, 0.98], [0, 1]);
    const y = useTransform(progress, [0.92, 0.98], [12, 0]);

    return (
        <motion.div
            className="absolute inset-x-4 bottom-4 z-50 rounded-2xl border border-outline-variant/70 bg-surface-container-low/90 px-5 py-4 text-center shadow-lg backdrop-blur-sm sm:inset-x-8"
            style={{opacity, y}}
        >
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary">Le constat</span>
            <h5 className="mt-2 text-title-medium text-on-surface sm:text-title-large">
                Livré ne veut pas dire maîtrisé.
            </h5>
            <p className="mx-auto mt-2 max-w-lg text-body-small text-on-surface-variant sm:text-body-medium">
                Le parcours simple fonctionne, mais le prochain changement révèle les copies,
                les oublis et les garanties absentes.
            </p>
        </motion.div>
    );
}
