import {Fragment, type ReactNode} from "react";
import {motion, useTransform, type MotionValue} from "motion/react";

interface FlowStep {
    title: string;
    detail: string;
}

interface Issue {
    title: string;
    detail: string;
    tone: "warning" | "error" | "neutral";
}

const PAYMENT_FLOW: FlowStep[] = [
    {title: "Bouton payer", detail: "visible"},
    {title: "Validation", detail: "fonctionne"},
    {title: "Commande", detail: "créée"},
];

const PAYMENT_ISSUES: Issue[] = [
    {title: "Validation copiée", detail: "une règle existe deux fois", tone: "warning"},
    {title: "Refus oublié", detail: "aucun parcours prévu", tone: "error"},
    {title: "Montant / droits", detail: "garantie absente", tone: "neutral"},
];

function StepCard({step, index}: {step: FlowStep; index: number}) {
    return (
        <div className="relative min-w-0 rounded-2xl border border-primary/30 bg-surface-container-high/95 px-3 py-3 text-center shadow-[0_10px_26px_color-mix(in_srgb,var(--color-primary)_7%,transparent)]">
            <span className="mx-auto mb-2 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-semibold leading-none text-on-primary">
                {index + 1}
            </span>
            <span className="block truncate text-[10px] font-semibold leading-tight text-on-surface sm:text-[11px]">
                {step.title}
            </span>
            <span className="mt-1 block text-[9px] font-normal leading-tight text-on-surface-variant sm:text-[10px]">
                {step.detail}
            </span>
        </div>
    );
}

function Connector() {
    return (
        <span className="relative h-px min-w-4 bg-primary/35">
            <span className="absolute right-0 top-1/2 size-1.5 -translate-y-1/2 rotate-45 border-r border-t border-primary/45" />
        </span>
    );
}

function IssueCard({issue, opacity}: {issue: Issue; opacity: MotionValue<number>}) {
    const toneClassName = {
        warning: "border-tertiary/55 bg-tertiary/15 text-tertiary",
        error: "border-error/60 bg-error/10 text-error",
        neutral: "border-outline/70 bg-surface-container-low/85 text-on-surface",
    }[issue.tone];

    return (
        <motion.div
            className={`min-w-0 rounded-2xl border border-dashed px-3 py-3 text-center shadow-sm ${toneClassName}`}
            style={{opacity}}
        >
            <span className="mx-auto mb-2 block h-1 w-8 rounded-full bg-current opacity-55" />
            <span className="block text-[10px] font-semibold leading-tight sm:text-[11px]">
                {issue.title}
            </span>
            <span className="mt-1 block text-[9px] font-normal leading-tight opacity-80 sm:text-[10px]">
                {issue.detail}
            </span>
        </motion.div>
    );
}

function SectionLabel({children}: {children: ReactNode}) {
    return (
        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant/80 sm:text-[10px]">
            {children}
        </span>
    );
}

export function ConstatDivergencePaymentContent({progress}: {progress: MotionValue<number>}) {
    const contentOpacity = useTransform(progress, [0.8, 0.84], [0, 1]);
    const contentScale = useTransform(progress, [0.8, 0.84], [0.96, 1]);
    const flowOpacity = useTransform(progress, [0.82, 0.88], [0, 1]);
    const duplicateOpacity = useTransform(progress, [0.86, 0.92], [0, 1]);
    const missingOpacity = useTransform(progress, [0.89, 0.95], [0, 1]);
    const securityOpacity = useTransform(progress, [0.92, 0.98], [0, 1]);
    const issueDividerOpacity = useTransform(progress, [0.86, 0.92], [0, 1]);

    return (
        <motion.div
            className="absolute inset-x-4 top-1/2 z-40 h-[88%] -translate-y-1/2 sm:inset-x-8"
            style={{
                opacity: contentOpacity,
                scale: contentScale,
                transformOrigin: "50% 50%",
            }}
        >
            <div className="absolute inset-x-[7%] top-[12%] z-20 sm:inset-x-[9%]">
                <motion.div
                    className="flex items-center justify-between gap-3"
                    style={{opacity: flowOpacity}}
                >
                    <SectionLabel>Ce qui semble livré</SectionLabel>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[9px] font-medium text-primary sm:text-[10px]">
                        cas simple
                    </span>
                </motion.div>

                <motion.div
                    className="mt-3 grid grid-cols-[1fr_18px_1fr_18px_1fr] items-center gap-2 sm:grid-cols-[1fr_28px_1fr_28px_1fr] sm:gap-3"
                    style={{opacity: flowOpacity}}
                >
                    {PAYMENT_FLOW.map((step, index) => (
                        <Fragment key={step.title}>
                            <StepCard step={step} index={index} />
                            {index < PAYMENT_FLOW.length - 1 && <Connector />}
                        </Fragment>
                    ))}
                </motion.div>
            </div>

            <motion.div
                className="absolute inset-x-[7%] top-[54%] z-20 h-px bg-gradient-to-r from-transparent via-outline-variant to-transparent sm:inset-x-[9%]"
                style={{opacity: issueDividerOpacity}}
            />

            <div className="absolute inset-x-[7%] bottom-[11%] z-20 sm:inset-x-[9%]">
                <motion.div
                    className="mb-3 flex items-center justify-between gap-3"
                    style={{opacity: issueDividerOpacity}}
                >
                    <SectionLabel>Ce que le prochain changement révèle</SectionLabel>
                    <span className="rounded-full border border-outline/60 px-2.5 py-1 text-[9px] font-medium text-on-surface-variant sm:text-[10px]">
                        dette cachée
                    </span>
                </motion.div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <IssueCard issue={PAYMENT_ISSUES[0]} opacity={duplicateOpacity} />
                    <IssueCard issue={PAYMENT_ISSUES[1]} opacity={missingOpacity} />
                    <IssueCard issue={PAYMENT_ISSUES[2]} opacity={securityOpacity} />
                </div>
            </div>
        </motion.div>
    );
}
