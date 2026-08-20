import {motion, useTransform, type MotionValue} from "motion/react";

interface UnsaidItem {
    label: string;
    glyph: string;
    at: number;
}

const UNSAID_ITEMS: UnsaidItem[] = [
    {label: "Métier", glyph: "◇", at: 0.55},
    {label: "Exceptions", glyph: "!", at: 0.59},
    {label: "Sécurité", glyph: "⌾", at: 0.63},
];

function FlowArrow() {
    return (
        <span className="relative h-px w-8 bg-primary/40">
            <span className="absolute -right-px -top-0.5 size-1.5 rotate-45 border-r border-t border-primary/60" />
        </span>
    );
}

function UnsaidCard({item, progress}: {item: UnsaidItem; progress: MotionValue<number>}) {
    const opacity = useTransform(progress, [item.at, item.at + 0.06], [0, 1]);
    const y = useTransform(progress, [item.at, item.at + 0.06], [10, 0]);

    return (
        <motion.div
            className="relative flex h-[76px] items-center gap-3 rounded-xl border border-dashed border-error/50 bg-error-container/35 px-4 text-on-error-container"
            style={{opacity, y}}
        >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-error/40 bg-error-container text-lg font-bold text-error">
                {item.glyph}
            </span>
            <span className="text-[11px] font-bold">{item.label}</span>
            <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-error text-[12px] font-black text-on-error shadow-sm">
                ?
            </span>
        </motion.div>
    );
}

export function ConstatDivergencePaymentContent({progress}: {progress: MotionValue<number>}) {
    const sceneOpacity = useTransform(progress, [0.39, 0.47, 0.78, 0.85], [0, 1, 1, 0]);
    const sceneY = useTransform(progress, [0.39, 0.47, 0.78, 0.85], [12, 0, 0, -10]);
    const requestOpacity = useTransform(progress, [0.42, 0.48], [0, 1]);
    const aiOpacity = useTransform(progress, [0.45, 0.51], [0, 1]);
    const resultOpacity = useTransform(progress, [0.48, 0.54], [0, 1]);
    const dividerScale = useTransform(progress, [0.52, 0.6], [0, 1]);
    const verdictOpacity = useTransform(progress, [0.66, 0.74], [0, 1]);

    return (
        <motion.div
            className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 scale-[0.44] min-[340px]:scale-[0.5] min-[400px]:scale-[0.56] sm:scale-[0.72] md:scale-[0.84] lg:scale-[0.72] min-[1100px]:scale-[0.82] min-[1180px]:scale-[0.92] xl:scale-100"
            style={{opacity: sceneOpacity, y: sceneY}}
        >
            <div className="absolute inset-x-12 top-[54px] flex items-center justify-center gap-4">
                <motion.div
                    className="flex h-[86px] w-[150px] items-center gap-3 rounded-2xl border border-outline-variant/70 bg-surface-container-lowest px-4 shadow-sm"
                    style={{opacity: requestOpacity}}
                >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-container-high text-lg font-bold text-on-surface">€</span>
                    <span>
                        <span className="block text-[8px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant">Demandé</span>
                        <strong className="mt-1 block text-[12px] text-on-surface">Paiement</strong>
                    </span>
                </motion.div>

                <motion.div className="flex items-center gap-4" style={{opacity: aiOpacity}}>
                    <FlowArrow />
                    <span className="grid size-[72px] place-items-center rounded-full bg-primary text-[28px] text-on-primary shadow-lg">✦</span>
                    <FlowArrow />
                </motion.div>

                <motion.div
                    className="relative grid h-[86px] w-[150px] place-items-center rounded-2xl border border-tertiary/35 bg-tertiary-container text-center text-on-tertiary-container shadow-sm"
                    style={{opacity: resultOpacity}}
                >
                    <span>
                        <span className="mx-auto grid size-8 place-items-center rounded-full bg-tertiary text-sm font-bold text-on-tertiary">✓</span>
                        <strong className="mt-2 block text-[12px]">Ça fonctionne</strong>
                    </span>
                </motion.div>
            </div>

            <motion.div
                className="absolute inset-x-12 top-[188px] flex origin-left items-center gap-3"
                style={{scaleX: dividerScale}}
            >
                <span className="h-px flex-1 bg-error/35" />
                <span className="rounded-full bg-error-container px-3 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-on-error-container">
                    hors du prompt
                </span>
                <span className="h-px flex-1 bg-error/35" />
            </motion.div>

            <div className="absolute inset-x-12 top-[226px] grid grid-cols-3 gap-4">
                {UNSAID_ITEMS.map((item) => (
                    <UnsaidCard key={item.label} item={item} progress={progress} />
                ))}
            </div>

            <motion.div
                className="absolute inset-x-20 bottom-8 flex items-center justify-center gap-3 rounded-2xl bg-on-surface px-5 py-3 text-center text-surface shadow-lg"
                style={{opacity: verdictOpacity}}
            >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-error text-[13px] font-black text-on-error">?</span>
                <strong className="text-[12px]">L’IA ne devine pas le non-dit.</strong>
            </motion.div>
        </motion.div>
    );
}
