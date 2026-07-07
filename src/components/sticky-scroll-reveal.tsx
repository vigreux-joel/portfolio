import React, {useEffect, useMemo, useRef, useState} from "react";
import {motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue} from "motion/react";
import {classNames} from "@udixio/ui-react";
import {updateTheme} from "@components/ThemeProvider.tsx";

export interface StickyScrollItem {
    text: React.ReactNode;
    /**
     * Un media statique, ou une fonction recevant la progression de scroll (0→1, remappée
     * sur la plage couverte par ce media) pour animer son contenu en continu sans re-render.
     * Optionnel : si omis, l'item hérite du media du dernier item précédent qui en définit un
     * (le media reste monté et actif sur toute la plage couverte, au lieu d'être redémonté).
     */
    media?: React.ReactNode | ((progress: MotionValue<number>) => React.ReactNode);
    theme?: Parameters<typeof updateTheme>[0];
}

function MediaRenderer({media, scrollProgress, start, end}: {
    media: NonNullable<StickyScrollItem["media"]>;
    scrollProgress: MotionValue<number>;
    start: number;
    end: number;
}) {
    const localProgress = useTransform(scrollProgress, [start, end], [0, 1], {clamp: true});
    const smoothProgress = useSpring(localProgress, {
        stiffness: 90,
        damping: 20,
        mass: 0.45,
        restDelta: 0.0005,
        restSpeed: 0.001,
    });

    return <>{typeof media === "function" ? media(smoothProgress) : media}</>;
}

export const StickyScroll = ({ content }: { content: StickyScrollItem[] }) => {
    const [isLg, setIsLg] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const initialIsLg = window.innerWidth > 1024;
            setIsLg(initialIsLg);

            let timeoutId: any;
            const handleResize = () => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    setIsLg(window.innerWidth > 1024);
                }, 100);
            };

            window.addEventListener("resize", handleResize);

            return () => {
                clearTimeout(timeoutId);
                window.removeEventListener("resize", handleResize);
            };
        }
    }, []);

    const [activeCard, setActiveCard] = React.useState<number | null>(null);
    const ref = useRef<any>(null);
    const {scrollYProgress} = useScroll({
        target: ref,
        offset: ["start center", "end center"],
    });
    const cardLength = content.length;
    const [displayText, setDisplayText] = useState(false);

    // Un "groupe" = un media défini sur un item, qui reste monté et actif jusqu'au
    // prochain item qui redéfinit un media (les items sans media héritent du précédent).
    const mediaGroups = useMemo(() => {
        const groups: { ownerIndex: number; endIndex: number; media: NonNullable<StickyScrollItem["media"]> }[] = [];
        content.forEach((item, index) => {
            if (item.media != null) {
                groups.push({ownerIndex: index, endIndex: cardLength, media: item.media});
            }
        });
        groups.forEach((group, i) => {
            if (groups[i + 1]) group.endIndex = groups[i + 1].ownerIndex;
        });
        return groups;
    }, [content, cardLength]);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (!isLg) return;
        const cardsBreakpoints = content.map((_, index) => index / cardLength);
        let closestBreakpointIndex = 0;
        for (let i = 0; i < cardsBreakpoints.length; i += 1) {
            if (cardsBreakpoints[i] > latest) {
                break;
            }
            closestBreakpointIndex = i;
        }
        setDisplayText(latest > 0);
        
        if (closestBreakpointIndex !== activeCard) {
            setActiveCard(closestBreakpointIndex);
            const theme = content[closestBreakpointIndex].theme;
            if (theme) {
                updateTheme(theme);
            }
        }
    });

    return (
        <>
            <motion.div
                className={
                    "flex relative padding-x rounded-md z-20 " +
                    (activeCard != null ? "theme-" + content[activeCard!]?.theme : "")
                }
                ref={ref}
            >
                <motion.div
                    variants={{
                        hidden: {opacity: 0, marginLeft: "-400px", filter: "blur(10px)"},
                        visible: {opacity: 1, marginLeft: "0%", filter: "blur(0px)"},
                    }}
                    initial={isLg ? "hidden" : "visible"}
                    transition={{
                        duration: 0.75,
                        ease: [0.1, 0.25, 0.3, 1],
                    }}
                    animate={displayText || !isLg ? "visible" : "hidden"}
                    layout
                    className={
                        "div mask-inverse left lg:w-[400px] w-full relative flex flex-col lg:gap-32 gap-16 "
                    }
                >
                    {content.map((item, index) => {
                        const mobileMediaGroup = mediaGroups.find(
                            (group) => index >= group.ownerIndex && index < group.endIndex
                        );

                        return (
                            <div
                                key={index}
                                className={
                                    "max-w-lg lg:max-w-full " + (index == 1 ? "self-end" : "")
                                }
                            >
                            {!isLg && mobileMediaGroup != null && (
                                <div className={classNames("mb-4 h-[360px] overflow-hidden rounded-2xl sm:h-[420px]")}>
                                    <MediaRenderer
                                        media={mobileMediaGroup.media}
                                        scrollProgress={scrollYProgress}
                                        start={mobileMediaGroup.ownerIndex / cardLength}
                                        end={mobileMediaGroup.endIndex / cardLength}
                                    />
                                </div>
                            )}
                            <motion.div
                                variants={{
                                    hidden: {
                                        opacity: 0,
                                        x: "-400px",
                                        filter: "blur(10px)",
                                        transition: {x: {delay: 1}, filter: {delay: 1}},
                                    },
                                    visible: {opacity: 1, x: "0%", filter: "blur(0px)"},
                                }}
                                initial={isLg ? "hidden" : "visible"}
                                transition={{
                                    duration: 0.4,
                                    ease: [0.1, 0.2, 0.4, 1],
                                }}
                                animate={activeCard == index || !isLg ? "visible" : "hidden"}
                                className={"lg:my-40 "}
                            >
                                {item.text}
                            </motion.div>
                        </div>
                        );
                    })}
                </motion.div>

                {isLg && (
                    <motion.div
                        layout
                        variants={{
                            hidden: {x: "0%"},
                            visible: {x: "0%", marginLeft: "4rem"},
                        }}
                        initial="hidden"
                        animate={displayText ? "visible" : "hidden"}
                        className={classNames(
                            "right hidden lg:flex flex-2 items-start rounded-md",
                        )}
                        transition={{
                            duration: 0.75,
                            ease: [0.1, 0.25, 0.3, 1],
                        }}
                    >
                        <motion.div
                            layout
                            layoutRoot
                            style={{
                                top: "calc(50% - " + 500 / 2 + "px)",
                                minWidth: "100%",
                            }}
                            variants={{
                                hidden: {maxHeight: "auto"},
                                visible: {maxHeight: 500},
                            }}
                            initial="hidden"
                            animate={displayText ? "visible" : "hidden"}
                            className={"w-full rounded-2xl sticky overflow-hidden"}
                            transition={{
                                duration: 0.75,
                                // ease: [0.1, 0.25, 0.3, 1]
                            }}
                        >
                            {mediaGroups.map((group) => {
                                const isVisible = activeCard != null
                                    ? activeCard >= group.ownerIndex && activeCard < group.endIndex
                                    : group.ownerIndex === 0;
                                return (
                                    <motion.div
                                        key={group.ownerIndex}
                                        layout
                                        variants={{
                                            hidden: {
                                                opacity: "0",
                                                visibility: "hidden",
                                                transitionEnd: {
                                                    display: "none",
                                                },
                                            },
                                            visible: {
                                                opacity: "1",
                                                visibility: "visible",
                                                transitionEnd: {
                                                    display: "block",
                                                },
                                            },
                                        }}
                                        className={classNames("w-full h-[500px]", {
                                            "!block": isVisible,
                                        })}
                                        initial="hidden"
                                        animate={isVisible ? "visible" : "hidden"}
                                        transition={{duration: 0}}
                                    >
                                        <MediaRenderer
                                            media={group.media}
                                            scrollProgress={scrollYProgress}
                                            start={group.ownerIndex / cardLength}
                                            end={group.endIndex / cardLength}
                                        />
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </motion.div>
                )}
            </motion.div>
        </>
    );
};
