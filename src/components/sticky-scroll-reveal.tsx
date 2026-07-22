import React, {useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore} from "react";
import {motion, useMotionValueEvent, useScroll, useTransform, type MotionValue} from "motion/react";
import {updateTheme} from "@components/ThemeProvider.tsx";

export interface StickyScrollItem {
    text: React.ReactNode;
    /**
     * Un média statique, ou une fonction recevant la progression de scroll (0→1,
     * remappée sur toute la plage couverte par ce média).
     *
     * Si un item ne définit pas de média, il conserve celui du dernier item qui en
     * possède un. Le média reste ainsi monté pendant toute sa séquence.
     */
    media?: React.ReactNode | ((progress: MotionValue<number>) => React.ReactNode);
    theme?: Parameters<typeof updateTheme>[0];
}

interface MediaGroup {
    ownerIndex: number;
    endIndex: number;
    media: NonNullable<StickyScrollItem["media"]>;
}

const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeToDesktopQuery(callback: () => void) {
    if (typeof window === "undefined") return () => undefined;

    const query = window.matchMedia(DESKTOP_QUERY);
    query.addEventListener("change", callback);
    return () => query.removeEventListener("change", callback);
}

function getDesktopSnapshot() {
    return typeof window !== "undefined" && window.matchMedia(DESKTOP_QUERY).matches;
}

function getServerDesktopSnapshot() {
    return false;
}

function useDesktopLayout() {
    return useSyncExternalStore(
        subscribeToDesktopQuery,
        getDesktopSnapshot,
        getServerDesktopSnapshot,
    );
}

function MediaRenderer({media, scrollProgress, start, end}: {
    media: NonNullable<StickyScrollItem["media"]>;
    scrollProgress: MotionValue<number>;
    start: number;
    end: number;
}) {
    // La progression suit directement le scroll. Le ressort précédent pouvait rester
    // en retard après un geste rapide et laisser l'illustration dans un état intermédiaire.
    const localProgress = useTransform(scrollProgress, [start, end], [0, 1], {clamp: true});

    return <>{typeof media === "function" ? media(localProgress) : media}</>;
}

function AnimatedText({children}: {children: React.ReactNode}) {
    const textRef = useRef<HTMLDivElement>(null);
    const {scrollYProgress} = useScroll({
        target: textRef,
        offset: ["start 92%", "end 18%"],
    });
    const opacity = useTransform(
        scrollYProgress,
        [0, 0.22],
        [0, 1],
    );
    const x = useTransform(
        scrollYProgress,
        [0, 0.22],
        [-56, 0],
    );
    const filter = useTransform(
        scrollYProgress,
        [0, 0.22],
        ["blur(7px)", "blur(0px)"],
    );

    return (
        <motion.div
            ref={textRef}
            style={{opacity, x, filter, willChange: "transform, opacity, filter"}}
        >
            {children}
        </motion.div>
    );
}

export const StickyScroll = ({content}: {content: StickyScrollItem[]}) => {
    const isDesktop = useDesktopLayout();
    const [activeCard, setActiveCard] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const cardLength = Math.max(content.length, 1);

    const {scrollYProgress} = useScroll({
        target: containerRef,
        offset: ["start center", "end center"],
    });

    const mediaGroups = useMemo<MediaGroup[]>(() => {
        const groups: MediaGroup[] = [];

        content.forEach((item, index) => {
            if (item.media != null) {
                groups.push({ownerIndex: index, endIndex: cardLength, media: item.media});
            }
        });

        groups.forEach((group, index) => {
            const nextGroup = groups[index + 1];
            if (nextGroup) group.endIndex = nextGroup.ownerIndex;
        });

        return groups;
    }, [content, cardLength]);

    const syncActiveCard = useCallback((progress: number) => {
        const boundedProgress = Math.min(Math.max(progress, 0), 1);
        const nextCard = Math.min(Math.floor(boundedProgress * cardLength), cardLength - 1);
        setActiveCard((currentCard) => currentCard === nextCard ? currentCard : nextCard);
    }, [cardLength]);

    useMotionValueEvent(scrollYProgress, "change", syncActiveCard);

    // Synchronise aussi un chargement en milieu de page ou un retour via l'historique,
    // sans attendre le prochain événement de scroll.
    useEffect(() => {
        syncActiveCard(scrollYProgress.get());
    }, [scrollYProgress, syncActiveCard]);

    useEffect(() => {
        const theme = content[activeCard]?.theme;
        if (theme) updateTheme(theme);
    }, [activeCard, content]);

    const activeTheme = content[activeCard]?.theme;

    return (
        <div
            ref={containerRef}
            className={`relative z-20 flex items-stretch gap-16 rounded-md padding-x ${activeTheme ? `theme-${activeTheme}` : ""}`}
        >
            <div className="relative flex w-full flex-col lg:w-[400px] lg:shrink-0">
                {content.map((item, index) => {
                    const mobileMediaGroup = mediaGroups.find(
                        (group) => index >= group.ownerIndex && index < group.endIndex,
                    );

                    return (
                        <div
                            key={index}
                            className="w-full max-w-lg py-8 sm:py-12 lg:flex lg:min-h-[65vh] lg:max-w-full lg:items-center lg:py-0"
                        >
                            <div className="w-full">
                                {!isDesktop && mobileMediaGroup && (
                                    <div className="mb-6 h-[360px] overflow-hidden rounded-2xl sm:h-[420px] lg:hidden">
                                        <MediaRenderer
                                            media={mobileMediaGroup.media}
                                            scrollProgress={scrollYProgress}
                                            start={mobileMediaGroup.ownerIndex / cardLength}
                                            end={mobileMediaGroup.endIndex / cardLength}
                                        />
                                    </div>
                                )}

                                <AnimatedText>{item.text}</AnimatedText>
                            </div>
                        </div>
                    );
                })}
            </div>

            {isDesktop && mediaGroups.length > 0 && (
                <div className="hidden min-w-0 flex-1 self-stretch lg:block">
                    <div
                        className="sticky h-[500px] w-full overflow-hidden rounded-2xl"
                        style={{top: "max(1rem, calc(50vh - 250px))"}}
                    >
                        {mediaGroups.map((group) => {
                            const isVisible = activeCard >= group.ownerIndex && activeCard < group.endIndex;

                            return (
                                <motion.div
                                    key={group.ownerIndex}
                                    className="absolute inset-0 h-[500px] w-full"
                                    initial={false}
                                    animate={{opacity: isVisible ? 1 : 0}}
                                    transition={{duration: 0.16, ease: "easeOut"}}
                                    style={{
                                        pointerEvents: isVisible ? "auto" : "none",
                                        zIndex: isVisible ? 1 : 0,
                                    }}
                                    aria-hidden={!isVisible}
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
                    </div>
                </div>
            )}
        </div>
    );
};
