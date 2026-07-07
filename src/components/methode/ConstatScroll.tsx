import type {MotionValue} from "motion/react";
import {StickyScroll, type StickyScrollItem} from "@components/sticky-scroll-reveal";
import {ConstatDivergenceMedia} from "./ConstatDivergenceMedia";

export const ConstatScroll = () => {
    const content: StickyScrollItem[] = [
        {
            text: (
                <>
                    <h4 className="text-headline-small text-primary">
                        Les fonctionnalités apparaissent à toute vitesse
                    </h4>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        Accès, recherche, suivi, paiement, profil… en surface, le produit
                        semble avancer très vite.
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
                        Très vite, tout semble relié
                    </h4>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        Les écrans se connectent, les données circulent, les parcours semblent
                        complets. Vu de l’extérieur, l’application paraît cohérente.
                    </p>
                </>
            ),
            theme: "orange",
        },
        {
            text: (
                <>
                    <h4 className="text-headline-small text-primary">
                        Mais que contient réellement une fonctionnalité ?
                    </h4>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        Derrière un module Paiement, il n’y a pas qu’un bouton. Il faut aligner les
                        états, les données, les erreurs, les contrôles et les autres modules.
                    </p>
                </>
            ),
            theme: "orange",
        },
        {
            text: (
                <>
                    <h4 className="text-headline-small text-primary">
                        C’est ici que la dette se forme
                    </h4>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        Sans pilotage, une évolution peut être ajoutée localement : une logique
                        est dupliquée, un cas d’échec est oublié, un contrôle reste implicite.
                    </p>
                </>
            ),
            theme: "orange",
        },
        {
            text: (
                <>
                    <h4 className="text-headline-small text-primary">
                        Livré ne veut pas dire maîtrisé
                    </h4>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        Le produit continue de fonctionner, mais chaque ajout devient moins sûr :
                        ce qui manque n’est pas toujours visible au moment de la livraison.
                    </p>
                </>
            ),
            theme: "orange",
        },
    ];

    return <StickyScroll content={content} />;
};
