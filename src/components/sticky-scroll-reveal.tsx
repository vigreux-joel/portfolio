"use client";
import React, {useRef, useState} from "react";
import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import classNames from "classnames";
import {Link} from "@components/Link.tsx";
import materialColor from "@assets/images/material-color.png"

const content: { text: React.ReactNode; media: React.ReactNode }[] = [
    {
        text: (
            <>
                <h3 className="">Conception visuelle moderne et fluide</h3>
                <p className="mt-6 text-body-large">Grâce aux guidelines de Material Design 3, je conçois des
                    interfaces fluides et adaptées à tous les écrans, assurant une navigation optimale et une
                    esthétique
                    harmonieuse.
                </p>
            </>),
        media: (
            <video className={"h-full w-full object-cover"} autoPlay loop muted>
                <source src="/video/my_compressed_video.mp4" type="video/mp4"/>
                Sorry, your browser doesn't support embedded videos.
            </video>
        ),
    },
    {
        text: (
            <>
                <h3 className="">Harmonisation des couleurs pour une identité visuelle forte</h3>
                <p className="mt-6 text-body-large">Personnalisez facilement vos applications avec des palettes de
                    couleurs cohérentes et dynamiques, inspirées par Material Design pour optimiser la lisibilité et
                    l'attrait visuel de votre site.</p>
            </>),
        media: (
            <img className={"h-full w-full object-cover"} loading={"lazy"} src={'/images/material-color.gif'}/>
        ),
    },
    {
        text: (
            <>
                <h3 className="">Renforcez votre image de marque et identité visuelle</h3>
                <p className="mt-6 text-body-large">J'optimise le design que vous me proposez afin de refléter une
                    identité visuelle forte et
                    cohérente, assurant une présentation professionnelle, attrayante et facilement adaptable.
                </p>
            </>),
        media: (
            <img className={"h-full w-full object-cover"} loading={"lazy"} src={materialColor.src}/>
        ),
    },
    {
        text: (
            <>
                <h3 className="">Dynamisez votre site avec des animations fluides</h3>
                <p className="mt-6 text-body-large">
                    À l'aide de <Link href={"https://www.framer.com/motion/"} target={"_blank"}>Framer motion</Link> je
                    conçois des
                    animations
                    fluides et engageantes qui
                    enrichissent l'expérience utilisateur et donnent vie à votre site.
                </p>
            </>),
        media: (
            <img className={"h-full w-full object-cover"} loading={"lazy"} src={'/images/material-color.gif'}/>
        ),
    },

]

export const StickyScroll = ({

                                 className,
                             }: {
    className?: string;
}) => {


    const [activeCard, setActiveCard] = React.useState(null);
    const ref = useRef<any>(null);
    const {scrollYProgress} = useScroll({
        // uncomment line 22 and comment line 23 if you DONT want the overflow container and want to have it change on the entire page scroll
        target: ref,
        // container: ref,
        offset: ["start center", "end center"],
    });
    const cardLength = content.length;
    const [displayText, setDisplayText] = useState(false)

    useMotionValueEvent(scrollYProgress, "change", (latest) => {


        const cardsBreakpoints = content.map((_, index) => index / cardLength);
        let closestBreakpointIndex = 0;
        for (let i = 0; i < cardsBreakpoints.length; i += 1) {
            // Si le point de rupture courant est supérieur à latest, interrompre la boucle
            if (cardsBreakpoints[i] > latest) {
                break;
            }
            // Sinon, mettre à jour l'indice du point de rupture le plus proche
            closestBreakpointIndex = i;
        }
        // const closestBreakpointIndex = cardsBreakpoints.reduce(
        //     (acc, breakpoint, index) => {
        //         const distance = Math.abs(latest - breakpoint);
        //         console.log("distance: ", distance)
        //         if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
        //             return index;
        //         }
        //         return acc;
        //     },
        //     0
        // );
        setDisplayText(latest > 0)
        setActiveCard(closestBreakpointIndex);
    });

    const backgroundColors = [
        "var(--slate-900)",
        "var(--black)",
        "var(--neutral-900)",
    ];
    const linearGradients = [
        "linear-gradient(to bottom right, var(--cyan-500), var(--emerald-500))",
        "linear-gradient(to bottom right, var(--pink-500), var(--indigo-500))",
        "linear-gradient(to bottom right, var(--orange-500), var(--yellow-500))",
    ];


    return (
        <motion.div
            animate={{
                backgroundColor: backgroundColors[activeCard % backgroundColors.length],
            }}
            className={"flex relative rounded-md " + className}
            ref={ref}
        >

            <motion.div
                variants={{
                    hidden: {opacity: 0, marginLeft: '-400px', filter: 'blur(10px)'},
                    visible: {opacity: 1, marginLeft: '0%', filter: 'blur(0px)'}
                }}
                initial="hidden"
                transition={{
                    duration: 0.75,
                    ease: [0.1, 0.25, 0.3, 1]
                }}
                animate={displayText ? "visible" : "hidden"} layout
                className="div left md:w-[400px] relative flex flex-col gap-32">
                {content.map((item, index) => (
                    <motion.div
                        key={index}
                        variants={{
                            hidden: {
                                opacity: 0, x: '-400px', filter: 'blur(10px)',
                                transition: {x: {delay: 1}, filter: {delay: 1}}
                            },
                            visible: {opacity: 1, x: '0%', filter: 'blur(0px)'}
                        }}
                        initial="hidden"
                        transition={{
                            duration: 0.4,
                            ease: [0.1, 0.2, 0.4, 1]
                        }}
                        animate={activeCard == index ? "visible" : "hidden"}
                        className={'my-40'}
                    >
                        {item.text}
                    </motion.div>

                ))}
            </motion.div>


            <motion.div layout
                        variants={{
                            hidden: {x: '0%'},
                            visible: {x: '0%', marginLeft: '4rem'}
                        }}
                        initial="hidden"
                        animate={displayText ? "visible" : "hidden"}
                        className={classNames(
                            "right hidden lg:flex flex-2 items-start rounded-md",
                        )}
                        transition={{
                            duration: 0.75,
                            ease: [0.1, 0.25, 0.3, 1]
                        }}
            >
                <motion.div
                    layout
                    layoutRoot
                    style={{
                        top: 'calc(50% - ' + 500 / 2 + 'px)',
                        minWidth: '100%',
                    }}
                    variants={{
                        hidden: {height: "auto",},
                        visible: {height: 500,}
                    }}
                    initial="hidden"
                    animate={displayText ? "visible" : "hidden"}
                    className={"rounded-2xl sticky overflow-hidden"}
                    transition={{
                        duration: 0.75,
                        // ease: [0.1, 0.25, 0.3, 1]
                    }}
                >
                    {content.map((card, index) => {
                        return <motion.div
                            layout
                            variants={{
                                hidden: {
                                    opacity: '0', visibility: 'hidden', transitionEnd: {
                                        display: "none",
                                    },
                                },
                                visible: {
                                    opacity: '1', visibility: 'visible', transitionEnd: {
                                        display: "block",
                                    },
                                }
                            }}
                            className={classNames("w-full h-full", {"!block": (index == activeCard) || (activeCard == null && index == 0)})}
                            initial="hidden"
                            animate={(index == activeCard) || (activeCard == null && index == 0) ? "visible" : "hidden"}
                            transition={{duration: 0}}
                        >{card.media}</motion.div>
                    })}
                </motion.div>
            </motion.div>
        </motion.div>
    );
};
