import React, {useEffect, useRef, useState} from "react";
import {motion, useMotionValueEvent, useScroll} from "motion/react";
import {Link} from "@components/Link.tsx";
import {classNames} from "@udixio/ui-react";
import {updateTheme} from "@components/ThemeProvider.tsx";

export interface StickyScrollItem {
    text: React.ReactNode;
    media: React.ReactNode;
    theme?: string;
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
                    {content.map((item, index) => (
                        <div
                            className={
                                "max-w-lg lg:max-w-full " + (index == 1 ? "self-end" : "")
                            }
                        >
                            {!isLg && (
                                <div className={classNames("rounded-2xl mb-4 overflow-hidden")}>
                                    {item.media}
                                </div>
                            )}
                            <motion.div
                                key={index}
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
                    ))}
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
                            className={"rounded-2xl sticky overflow-hidden"}
                            transition={{
                                duration: 0.75,
                                // ease: [0.1, 0.25, 0.3, 1]
                            }}
                        >
                            {content.map((card, index) => {
                                return (
                                    <motion.div
                                        key={index}
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
                                            "!block":
                                                index == activeCard ||
                                                (activeCard == null && index == 0),
                                        })}
                                        initial="hidden"
                                        animate={
                                            index == activeCard || (activeCard == null && index == 0)
                                                ? "visible"
                                                : "hidden"
                                        }
                                        transition={{duration: 0}}
                                    >
                                        {card.media}
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
