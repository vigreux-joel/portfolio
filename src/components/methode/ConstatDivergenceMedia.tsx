import type {MotionValue} from "motion/react";

import {ConstatDivergenceConclusion} from "./ConstatDivergenceConclusion";
import {ConstatDivergenceMindMap} from "./ConstatDivergenceMindMap";
import {ConstatDivergencePaymentContent} from "./ConstatDivergencePaymentContent";

export function ConstatDivergenceMedia({progress}: {progress: MotionValue<number>}) {
    return (
        <div className="relative h-full w-full overflow-hidden bg-surface-container-low">
            <ConstatDivergenceMindMap progress={progress} />
            <ConstatDivergencePaymentContent progress={progress} />
            <ConstatDivergenceConclusion progress={progress} />
        </div>
    );
}
