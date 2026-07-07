import { StickyScroll } from "@components/sticky-scroll-reveal";
import { ConstatDivergenceMedia } from "./ConstatDivergenceMedia";

export const ConstatScroll = () => {
    const content = [
        {
            text: (
                <>
                    <h4 className="text-headline-small text-primary">Les fonctionnalités apparaissent à toute vitesse</h4>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        Accès, recherche, suivi, paiement, profil : chaque demande devient rapidement un
                        résultat visible. En quelques jours, l'application semble presque complète.
                    </p>
                </>
            ),
            media: (progress: any) => <ConstatDivergenceMedia progress={progress} />,
            theme: "orange",
        },
        {
            text: (
                <>
                    <h4 className="text-headline-small text-primary">Très vite, tout semble relié</h4>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        Les fonctionnalités échangent des données et partagent des comportements. Vue de
                        l'extérieur, l'application fonctionne et sa structure paraît cohérente.
                    </p>
                </>
            ),
            theme: "orange",
        },
        {
            text: (
                <>
                    <h4 className="text-headline-small text-primary">Mais que contient réellement une fonctionnalité ?</h4>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        Derrière un profil qui semble terminé, l'interface, les états, la logique, les données
                        et les contrôles doivent rester cohérents avec le reste du produit.
                    </p>
                </>
            ),
            theme: "orange",
        },
        {
            text: (
                <>
                    <h4 className="text-headline-small text-primary">C'est ici que la dette se forme</h4>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        Une interface est dupliquée, les erreurs sont oubliées, une exception contourne la
                        logique commune, les données sont accédées directement et les contrôles ne suivent pas.
                    </p>
                </>
            ),
            theme: "orange",
        },
        {
            text: (
                <>
                    <h4 className="text-headline-small text-primary">Livré ne veut pas dire maîtrisé</h4>
                    <p className="lg:mt-6 mt-2 text-body-large text-on-surface-variant">
                        Le produit devient <span className="font-medium text-on-surface">incomplet</span>,
                        {' '}<span className="font-medium text-on-surface">incohérent</span> et
                        {' '}<span className="font-medium text-on-surface">incertain</span>. Le pilotage permet
                        à toutes ses dimensions d'évoluer ensemble, au rythme de la production.
                    </p>
                </>
            ),
            theme: "orange",
        },
    ];

    return <StickyScroll content={content} />;
};
