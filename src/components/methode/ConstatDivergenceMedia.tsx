import type {MotionValue} from "motion/react";

import {ConstatDivergenceConclusion} from "./ConstatDivergenceConclusion";
import {ConstatDivergenceMindMap} from "./ConstatDivergenceMindMap";
import {ConstatDivergencePaymentContent} from "./ConstatDivergencePaymentContent";

export function ConstatDivergenceMedia({progress}: {progress: MotionValue<number>}) {
    return (
        <div
            className="relative h-full w-full overflow-hidden bg-surface-container-low"
            aria-hidden="true"
        >
            <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_center,var(--color-outline-variant)_1px,transparent_1px)] [background-size:22px_22px]" />
            <div className="absolute -left-24 -top-24 size-72 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-28 -right-20 size-80 rounded-full bg-tertiary/5 blur-3xl" />
            <ConstatDivergenceMindMap progress={progress} />
            <ConstatDivergencePaymentContent progress={progress} />
            <ConstatDivergenceConclusion progress={progress} />
        </div>
    );
}
