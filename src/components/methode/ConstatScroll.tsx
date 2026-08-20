import type {MotionValue} from "motion/react";
import {StickyScroll, type StickyScrollItem} from "@components/sticky-scroll-reveal";
import {ConstatDivergenceMedia} from "./ConstatDivergenceMedia";

export const ConstatScroll = () => {
    const content: StickyScrollItem[] = [
        {
            text: (
                <>
                    <h3 className="text-headline-small text-primary">
                        Une demande claire
                    </h3>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        « Ajoute le paiement. » Le besoin paraît précis, et l’IA peut produire
                        rapidement l’interface, les appels et la logique nécessaires.
                    </p>
                </>
            ),
            media: (progress: MotionValue<number>) => <ConstatDivergenceMedia progress={progress} />,
            theme: "cyan",
        },
        {
            text: (
                <>
                    <h3 className="text-headline-small text-primary">
                        Quelques secondes plus tard…
                    </h3>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        Le bouton répond, la transaction aboutit, le parcours idéal passe.
                        À l’écran, la fonctionnalité semble terminée.
                    </p>
                </>
            ),
            theme: "cyan",
        },
        {
            text: (
                <>
                    <h3 className="text-headline-small text-primary">
                        L’IA a bien répondu
                    </h3>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        Elle a traduit le prompt en code avec efficacité. Mais elle ne connaît ni
                        vos règles métier ni vos contraintes réelles si elles ne lui sont pas transmises.
                    </p>
                </>
            ),
            theme: "cyan",
        },
        {
            text: (
                <>
                    <h3 className="text-headline-small text-primary">
                        Mais le produit dépasse le prompt
                    </h3>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        Que faire d’un paiement interrompu, d’un droit mal attribué ou d’un état
                        incohérent ? Ces décisions invisibles structurent pourtant la fiabilité du produit.
                    </p>
                </>
            ),
            theme: "cyan",
        },
        {
            text: (
                <>
                    <h3 className="text-headline-small text-primary">
                        L’expérience transforme la vitesse en maîtrise
                    </h3>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        Un professionnel repère ces non-dits, les transforme en règles explicites
                        et choisit où les garantir. L’IA accélère alors une direction maîtrisée.
                    </p>
                </>
            ),
            theme: "cyan",
        },
    ];

    return <StickyScroll content={content} />;
};
