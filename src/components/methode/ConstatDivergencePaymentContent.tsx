import type {ReactNode} from "react";
import {motion, useTransform, type MotionValue} from "motion/react";

function PaymentBox({children, className = ""}: {children: ReactNode; className?: string}) {
    return (
        <div className={`rounded-xl border border-primary/35 bg-surface-container-high px-3 py-2 text-center text-[10px] font-medium leading-tight text-on-surface shadow-sm sm:text-[11px] ${className}`}>
            {children}
        </div>
    );
}

function PaymentIssue({children, className = "", opacity}: {
    children: ReactNode;
    className?: string;
    opacity: MotionValue<number>;
}) {
    return (
        <motion.div
            className={`rounded-xl border border-dashed px-3 py-2 text-center text-[10px] font-medium leading-tight shadow-sm sm:text-[11px] ${className}`}
            style={{opacity}}
        >
            {children}
        </motion.div>
    );
}

export function ConstatDivergencePaymentContent({progress}: {progress: MotionValue<number>}) {
    const contentOpacity = useTransform(progress, [0.8, 0.84], [0, 1]);
    const contentScale = useTransform(progress, [0.8, 0.84], [0.96, 1]);
    const flowOpacity = useTransform(progress, [0.82, 0.88], [0, 1]);
    const duplicateOpacity = useTransform(progress, [0.86, 0.92], [0, 1]);
    const missingOpacity = useTransform(progress, [0.89, 0.95], [0, 1]);
    const securityOpacity = useTransform(progress, [0.92, 0.98], [0, 1]);

    return (
        <motion.div
            className="absolute inset-x-4 top-1/2 z-40 h-[88%] -translate-y-1/2 sm:inset-x-8"
            style={{
                opacity: contentOpacity,
                scale: contentScale,
                transformOrigin: "50% 50%",
            }}
        >
            <motion.div
                className="absolute inset-x-[8%] top-[25%] z-20 grid grid-cols-[1fr_18px_1fr_18px_1fr] items-center gap-2 sm:inset-x-[10%] sm:grid-cols-[1fr_28px_1fr_28px_1fr] sm:gap-3"
                style={{opacity: flowOpacity}}
            >
                <PaymentBox>
                    <span className="block">Bouton payer</span>
                    <span className="mt-1 block text-[9px] font-normal text-on-surface-variant sm:text-[10px]">visible</span>
                </PaymentBox>
                <span className="h-px bg-primary/45" />
                <PaymentBox>
                    <span className="block">Validation</span>
                    <span className="mt-1 block text-[9px] font-normal text-on-surface-variant sm:text-[10px]">fonctionne</span>
                </PaymentBox>
                <span className="h-px bg-primary/45" />
                <PaymentBox>
                    <span className="block">Commande créée</span>
                    <span className="mt-1 block text-[9px] font-normal text-on-surface-variant sm:text-[10px]">cas simple</span>
                </PaymentBox>
            </motion.div>

            <motion.div
                className="absolute inset-x-[8%] bottom-[21%] z-20 grid grid-cols-3 gap-2 sm:inset-x-[10%] sm:gap-3"
            >
                <PaymentIssue opacity={duplicateOpacity} className="border-tertiary/60 bg-tertiary/15 text-tertiary">
                    Validation copiée
                    <span className="mt-1 block text-[9px] font-normal sm:text-[10px]">copie séparée</span>
                </PaymentIssue>
                <PaymentIssue opacity={missingOpacity} className="border-error/60 bg-error/10 text-error">
                    Refus oublié
                    <span className="mt-1 block text-[9px] font-normal sm:text-[10px]">parcours absent</span>
                </PaymentIssue>
                <PaymentIssue opacity={securityOpacity} className="border-outline bg-surface-container-low text-on-surface">
                    Montant / droits
                    <span className="mt-1 block text-[9px] font-normal text-error sm:text-[10px]">non garanti</span>
                </PaymentIssue>
            </motion.div>
        </motion.div>
    );
}
