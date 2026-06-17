import React from "react";
import { StickyScroll } from "../sticky-scroll-reveal";
import { motion } from "motion/react";
import { Button } from "@udixio/ui-react";
import { iArrowOutward } from "@udixio/icons-outlined-400/arrow_outward";

export const FrontEndUxScroll = () => {
    const content = [
        {
            text: (
                <>
                    <h4 className="text-headline-small text-primary">
                        L'expérience utilisateur comme priorité
                    </h4>
                    <p className="lg:mt-6 mt-2 text-body-large">
                        L'excellence d'une application ne se limite pas à son code : elle se ressent. Mon approche est centrée sur l'utilisateur, combinant une esthétique soignée à une navigation parfaitement fluide.
                    </p>
                </>
            ),
            media: (
                <video
                    className={"md:h-[320px] h-[200px] lg:h-full w-full object-cover bg-surface-container-low"}
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src="/video/output.mp4" type="video/mp4"/>
                    Sorry, your browser doesn't support embedded videos.
                </video>
            ),
            theme: "purple",
        },
        {
            text: (
                <>
                    <h4 className="text-headline-small text-primary">
                        Architecture UI
                    </h4>
                    <p className="lg:mt-6 mt-2 text-body-large">
                        Habitué aux standards comme Material 3, j'intègre vos maquettes avec une exigence millimétrée. Je traduis votre charte graphique en un système technique solide, pour garantir un rendu visuel harmonieux, sans la moindre friction pour vous.
                    </p>
                    <div className="mt-8">
                        <Button 
                            variant="outlined" 
                            href="/projets/udixio-ui" 
                            icon={iArrowOutward} 
                            label="Voir l'étude de cas Udixio UI" 
                        />
                    </div>
                </>
            ),
            media: (
                <img
                    className={"w-full md:h-[320px] h-[200px] lg:h-full object-cover bg-surface-container-low"}
                    loading={"lazy"}
                    alt={"Illustration de layout"}
                    src={"/images/material-theme.webp"}
                />
            ),
            theme: "blue",
        },
        {
            text: (
                <>
                    <h4 className="text-headline-small text-primary">
                        Motion Design & Fluidité
                    </h4>
                    <p className="lg:mt-6 mt-2 text-body-large">
                        Les animations ne sont pas de simples gadgets. Elles guident l'utilisateur et renforcent l'identité du projet. Je développe des interfaces fluides à 60 fps, enrichies de micro-interactions qui rendent chaque action intuitive et mémorable.
                    </p>
                </>
            ),
            media: (
                <div
                    className={
                        "bg-primary/80 w-full md:h-[320px] h-[200px] lg:h-full flex items-center justify-center backdrop-blur"
                    }
                >
                    <div className={"h-32 w-32 p-6 bg-surface-variant rounded-2xl"}>
                        <svg
                            className={" "}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 100 100"
                        >
                            <motion.path
                                d="M0 100V0l50 50 50-50v100L75 75l-25 25-25-25z"
                                variants={{
                                    hidden: {
                                        pathLength: 0,
                                        fill: "rgb(var(--color-inverse-primary)/0)",
                                    },
                                    visible: {
                                        pathLength: 1,
                                        fill: "rgb(var(--color-surface)/1)",
                                    },
                                }}
                                className="stroke-2 stroke-surface"
                                initial="hidden"
                                animate="visible"
                                transition={{repeat: Infinity, duration: 2, ease: "easeOut"}}
                            />
                        </svg>
                    </div>
                </div>
            ),
            theme: "green",
        },
    ];

    return <StickyScroll content={content} />;
};
