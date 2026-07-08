import type {ReactNode} from "react";
import {motion, useTransform, type MotionValue} from "motion/react";

interface FlowStep {
    title: string;
    glyph: string;
}

interface Issue {
    title: string;
    label: string;
    type: "duplicate" | "missing" | "unguarded";
}

const PAYMENT_FLOW: FlowStep[] = [
    {title: "Payer", glyph: "1"},
    {title: "Valider", glyph: "2"},
    {title: "Créer", glyph: "3"},
];

const PAYMENT_ISSUES: Issue[] = [
    {title: "Doublon", label: "x2", type: "duplicate"},
    {title: "Oubli", label: "×", type: "missing"},
    {title: "Fragile", label: "!", type: "unguarded"},
];

function StepCard({step}: {step: FlowStep}) {
    return (
        <div className="relative grid min-w-0 place-items-center rounded-2xl border border-primary/30 bg-surface-container-high/95 px-2 py-3 text-center shadow-[0_10px_26px_color-mix(in_srgb,var(--color-primary)_7%,transparent)]">
            <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-semibold leading-none text-on-primary shadow-sm">
                ✓
            </span>
            <span className="grid size-9 place-items-center rounded-full border border-primary/30 bg-primary/10 text-[13px] font-semibold text-primary sm:size-10">
                {step.glyph}
            </span>
            <span className="mt-2 block truncate text-[10px] font-semibold leading-tight text-on-surface sm:text-[11px]">
                {step.title}
            </span>
        </div>
    );
}

function Connector() {
    return (
        <span className="relative h-0.5 min-w-4 overflow-hidden rounded-full bg-primary/25">
            <span className="absolute inset-y-0 left-0 w-2/3 rounded-full bg-primary/65" />
            <span className="absolute right-0 top-1/2 size-1.5 -translate-y-1/2 rotate-45 border-r-2 border-t-2 border-primary/65" />
        </span>
    );
}

function IssueCard({issue, opacity}: {issue: Issue; opacity: MotionValue<number>}) {
    const toneClassName = {
        duplicate: "border-tertiary/55 bg-tertiary/15 text-tertiary",
        missing: "border-error/60 bg-error/10 text-error",
        unguarded: "border-outline/70 bg-surface-container-low/85 text-on-surface",
    }[issue.type];

    return (
        <motion.div
            className={`relative min-w-0 overflow-hidden rounded-2xl border border-dashed px-2 py-3 text-center shadow-sm ${toneClassName}`}
            style={{opacity}}
        >
            <IssueVisual issue={issue} />
            <span className="mt-2 block text-[10px] font-semibold leading-tight sm:text-[11px]">
                {issue.title}
            </span>
        </motion.div>
    );
}

function IssueVisual({issue}: {issue: Issue}) {
    if (issue.type === "duplicate") {
        return (
            <span className="relative mx-auto block h-11 w-14">
                <span className="absolute left-1 top-2 h-7 w-9 rounded-lg border border-current bg-current/10" />
                <span className="absolute left-4 top-0 h-7 w-9 rounded-lg border border-current bg-current/15 shadow-sm" />
                <span className="absolute bottom-0 right-0 rounded-full bg-current px-1.5 py-0.5 text-[9px] font-bold leading-none text-on-primary">
                    {issue.label}
                </span>
            </span>
        );
    }

    if (issue.type === "missing") {
        return (
            <span className="relative mx-auto grid h-11 w-16 place-items-center">
                <span className="absolute left-1 top-1/2 h-0.5 w-5 -translate-y-1/2 bg-current/55" />
                <span className="absolute left-7 top-1/2 h-0.5 w-4 -translate-y-1/2 border-t border-dashed border-current/60" />
                <span className="absolute right-1 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full border border-current bg-current/10 text-[12px] font-bold leading-none">
                    {issue.label}
                </span>
            </span>
        );
    }

    return (
        <span className="relative mx-auto grid h-11 w-14 place-items-center">
            <span className="absolute top-0 h-10 w-9 rounded-t-2xl rounded-b-lg border border-current bg-current/10" />
            <span className="absolute h-10 w-px rotate-[24deg] bg-current/70" />
            <span className="relative grid size-6 place-items-center rounded-full bg-current text-[12px] font-bold leading-none text-on-primary">
                {issue.label}
            </span>
        </span>
    );
}

function SectionLabel({children}: {children: ReactNode}) {
    return (
        <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant/80 sm:text-[9px]">
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
                    <SectionLabel>Visible</SectionLabel>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[9px] font-medium text-primary sm:text-[10px]">
                        cas simple
                    </span>
                </motion.div>

                <motion.div
                    className="mt-3 grid grid-cols-[1fr_18px_1fr_18px_1fr] items-center gap-2 sm:grid-cols-[1fr_28px_1fr_28px_1fr] sm:gap-3"
                    style={{opacity: flowOpacity}}
                >
                    <StepCard step={PAYMENT_FLOW[0]} />
                    <Connector />
                    <StepCard step={PAYMENT_FLOW[1]} />
                    <Connector />
                    <StepCard step={PAYMENT_FLOW[2]} />
                </motion.div>
            </div>

            <motion.div
                className="absolute inset-x-[7%] top-[53%] z-20 h-px bg-gradient-to-r from-transparent via-outline-variant to-transparent sm:inset-x-[9%]"
                style={{opacity: issueDividerOpacity}}
            />

            <div className="absolute inset-x-[7%] bottom-[9%] z-20 sm:inset-x-[9%]">
                <motion.div
                    className="mb-2 flex items-center justify-between gap-3 sm:mb-3"
                    style={{opacity: issueDividerOpacity}}
                >
                    <SectionLabel>Sous la surface</SectionLabel>
                    <span className="rounded-full border border-outline/60 px-2.5 py-1 text-[8px] font-medium text-on-surface-variant sm:text-[9px]">
                        dette
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
