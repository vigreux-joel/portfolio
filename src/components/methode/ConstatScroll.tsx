import type {MotionValue} from "motion/react";
import {StickyScroll, type StickyScrollItem} from "@components/sticky-scroll-reveal";
import {ConstatDivergenceMedia} from "./ConstatDivergenceMedia";

export const ConstatScroll = () => {
    const content: StickyScrollItem[] = [
        {
            text: (
                <>
                    <h4 className="text-headline-small text-primary">
                        Une consigne. Une fonctionnalité.
                    </h4>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        L’IA transforme rapidement une demande en code.
                    </p>
                </>
            ),
            media: (progress: MotionValue<number>) => <ConstatDivergenceMedia progress={progress} />,
            theme: "orange",
        },
        {
            text: (
                <>
                    <h4 className="text-headline-small text-primary">
                        À l’écran, tout fonctionne
                    </h4>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        Le parcours idéal passe. La démo rassure.
                    </p>
                </>
            ),
            theme: "orange",
        },
        {
            text: (
                <>
                    <h4 className="text-headline-small text-primary">
                        Mais elle ne voit que la demande
                    </h4>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        Le métier, les risques et les exceptions restent hors du prompt.
                    </p>
                </>
            ),
            theme: "orange",
        },
        {
            text: (
                <>
                    <h4 className="text-headline-small text-primary">
                        Le non-dit devient de la dette
                    </h4>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        Ça fonctionne aujourd’hui. Sans garantie pour demain.
                    </p>
                </>
            ),
            theme: "orange",
        },
        {
            text: (
                <>
                    <h4 className="text-headline-small text-primary">
                        La vitesse a besoin d’un pilote
                    </h4>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        L’IA accélère. L’expérience anticipe.
                    </p>
                </>
            ),
            theme: "orange",
        },
    ];

    return <StickyScroll content={content} />;
};
