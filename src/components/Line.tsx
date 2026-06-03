import {classNames, Icon} from "@udixio/ui-react";
import {useEffect, useRef, useState} from "react";
import {motion, useMotionValueEvent, useScroll, useTransform} from "motion/react";

declare global {
    interface Window {
        __ENERGY_VIEWPORT_LOOP?: boolean;
    }
}

const ENERGY_SPEED = 1000; // pixels per second
let globalStreamY = -500;
let prevStreamY = -500;
let lastFrameTime = 0;
const linesSet = new Set<{ tick: (y: number, py: number) => void }>();

const loop = (time: number) => {
    if (!lastFrameTime) lastFrameTime = time;
    const dt = (time - lastFrameTime) / 1000;
    lastFrameTime = time;

    const vh = window.innerHeight;
    
    prevStreamY = globalStreamY;
    globalStreamY += ENERGY_SPEED * dt;

    if (globalStreamY > vh + 300) {
        globalStreamY = -300;
        prevStreamY = -300;
    }

    linesSet.forEach(line => line.tick(globalStreamY, prevStreamY));

    requestAnimationFrame(loop);
};

if (typeof window !== "undefined" && !window.__ENERGY_VIEWPORT_LOOP) {
    window.__ENERGY_VIEWPORT_LOOP = true;
    requestAnimationFrame(loop);
}

export const Line = ({
                         nextTheme,
                         icon,
                         isFirst = false,
                         isLast = false,
                         visible,
                     }: {
    nextTheme?: string;
    icon?: Icon;
    isFirst?: boolean;
    isLast?: boolean;
    visible?: boolean;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const streamRef = useRef<HTMLDivElement>(null);
    
    const {scrollYProgress} = useScroll({
        target: ref,
        offset: ["start 85%", "end 85%"],
    });

    const heightProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
    
    const [isVisibleIcon, setIsVisibleIcon] = useState(visible);
    const [isFlashing, setIsFlashing] = useState(false);
    
    const isLineActiveRef = useRef(visible);
    const hasIconRef = useRef(!!icon && !isFirst);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (!visible) {
            const active = latest > 0;
            setIsVisibleIcon(active);
            isLineActiveRef.current = active;
        }
    });

    useEffect(() => {
        const lineObj = {
            tick: (y: number, prevY: number) => {
                if (!ref.current) return;
                const rect = ref.current.getBoundingClientRect();
                
                // Le rect.top est la position Y du haut de ce bloc par rapport à l'écran (viewport)
                const localY = y - rect.top;
                
                // Mettre à jour visuellement le flux d'énergie (sans setState pour du 60fps parfait)
                if (streamRef.current) {
                    if (localY > -200 && localY < rect.height + 200) {
                        streamRef.current.style.display = "block";
                        // On translate de `localY - 200` car la div fait 200px de haut
                        streamRef.current.style.transform = `translateY(${localY - 200}px)`;
                    } else {
                        streamRef.current.style.display = "none";
                    }
                }

                // Flash quand la pointe de l'énergie (y) traverse le haut de ce bloc (rect.top)
                if (y >= rect.top && prevY < rect.top) {
                    // Seulement si l'icône est présente ET que la zone a commencé à être révélée par le scroll
                    if (isLineActiveRef.current && hasIconRef.current) {
                        setIsFlashing(true);
                        setTimeout(() => setIsFlashing(false), 400);
                    }
                }
            }
        };

        linesSet.add(lineObj);
        return () => {
            linesSet.delete(lineObj);
        };
    }, []);

    return (
        <div
            ref={ref}
            className={
                "h-full ml-4 md:ml-12 flex flex-col items-center " +
                (isFirst || !icon ? "" : "gap-8")
            }
        >
            <style>{`
                @keyframes wait-flare {
                    0%, 100% { transform: scale(0.8); filter: blur(2px); opacity: 0.8; }
                    50% { transform: scale(1.2); filter: blur(6px); opacity: 1; }
                }
                .animate-wait-orb { animation: wait-flare 2s ease-in-out infinite; }
                
                @keyframes hit-flare {
                    0% { transform: scale(1.2); filter: blur(6px); opacity: 1; }
                    50% { transform: scale(2.2); filter: blur(8px); opacity: 1; background-color: #fff; }
                    100% { transform: scale(1); filter: blur(2px); opacity: 0.8; }
                }
                .animate-hit-orb { animation: hit-flare 0.4s ease-out forwards; }
            `}</style>
            
            {/* Conteneur de l'icône : largeur fixée à w-6 pour alignement X parfait */}
            <div className={classNames("relative flex justify-center items-center transition-all duration-500 w-6", {
                "h-6": icon,
                "h-0": !icon,
                "scale-50 opacity-50": isFirst, 
            })}>
                {/* Boule d'énergie (fermée) : on la cache complètement si la ligne n'est pas encore visible */}
                {icon && !isFirst && (
                    <div
                        className={classNames(
                            "absolute w-4 h-4 bg-primary rounded-full transition-all duration-700 ease-out z-20",
                            {
                                "scale-[4] opacity-0": isVisibleIcon || visible, // Éclate pour laisser passer l'icône
                                "opacity-0 scale-0": !isVisibleIcon && !visible, // Cachée tant que non visible (sous la progression)
                            }
                        )}
                    ></div>
                )}
                
                {/* L'icone : apparait quand la boule d'énergie éclate */}
                {icon && (
                    <div className="relative z-10 flex justify-center items-center w-full h-full">
                        
                        {/* Halo de base : apparaît progressivement après le zoom de l'icône */}
                        <div
                            className={classNames(
                                "bg-primary blur-md rounded-full h-full w-full absolute top-0 left-0 scale-150 transition-opacity duration-1000",
                                {
                                    "hidden": isFirst,
                                    "opacity-0": !isVisibleIcon && !visible,
                                    "opacity-40 delay-300": isVisibleIcon || visible,
                                }
                            )}
                        ></div>

                        {/* Halo de flash : s'allume au passage de l'énergie (2x plus puissant) */}
                        {/* On s'assure qu'il reste à opacity-0 si l'icône n'est pas encore active */}
                        <div
                            style={{
                                transitionProperty: "opacity",
                                transitionDuration: isFlashing ? "500ms" : "1000ms",
                                transitionTimingFunction: isFlashing ? "ease-in" : "ease-out"
                            }}
                            className={classNames(
                                "bg-primary blur-lg rounded-full h-full w-full absolute top-0 left-0 scale-150",
                                {
                                    "hidden": isFirst,
                                    "opacity-0": !isFlashing || (!isVisibleIcon && !visible),
                                    "opacity-80": isFlashing && (isVisibleIcon || visible),
                                }
                            )}
                        ></div>

                        {/* Icône avec zoom simple (0 à 100%) */}
                        <Icon 
                            className={classNames("h-6 w-full relative z-10 transition-transform duration-500 ease-out", {
                                "scale-0": !isVisibleIcon && !visible,
                                "scale-100": isVisibleIcon || visible,
                            })} 
                            icon={icon}
                        />
                    </div>
                )}
            </div>
            
            <div className={"w-[3px] h-full relative"}>
                {/* Le overflow-hidden est le secret : Le flux d'énergie ne peut PAS déborder sous la progression actuelle du scroll ! */}
                <motion.div
                    style={{
                        height: visible ? "100%" : heightProgress,
                    }}
                    className={
                        "relative rounded-full overflow-hidden w-full not-detect-theme theme-" + nextTheme
                    }
                >
                    {/* Le fond de la ligne tracée, opacity-50 pour être 50% de la lumière d'énergie */}
                    <div className={classNames("w-full h-full absolute bg-gradient-to-b opacity-50", {
                        "from-primary to-transparent": isLast,
                        "from-transparent to-primary": !isLast,
                        "bg-primary": !isFirst && icon && !isLast,
                    })}></div>
                    
                    {/* Courant d'énergie unique coordonné par rapport au VIEWPORT */}
                    <div 
                        ref={streamRef}
                        className={classNames("absolute w-full rounded-full left-0", {
                            "bg-gradient-to-b from-transparent via-primary/80 to-primary": !isLast,
                            "bg-gradient-to-b from-transparent via-primary/40 to-transparent": isLast,
                        })}
                        style={{
                            height: 200, 
                            display: 'none',
                            top: 0,
                            willChange: 'transform'
                        }}
                    ></div>
                </motion.div>
            </div>
        </div>
    );
};