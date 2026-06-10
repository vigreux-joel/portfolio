import {classNames, Icon} from "@udixio/ui-react";
import {useEffect, useId, useRef, useState} from "react";
import {motion, useMotionValueEvent, useScroll, useSpring, useTransform} from "motion/react";

declare global {
    interface Window {
        __ENERGY_VIEWPORT_LOOP?: boolean;
    }
}

const ENERGY_SPEED = 1000;
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

/** Elbow path: straight lines + rounded corners.
 *  When x1 === x2, the arc radius is 0 → degenerates to a straight vertical line.
 */
function buildPath(w: number, h: number, x1: number, x2: number): string {
    const px1 = x1 * w;
    const px2 = x2 * w;
    const dx = px2 - px1;
    if (Math.abs(dx) < 1) {
        return `M${px1},0 L${px2},${h}`;
    }
    const r = Math.min(32, Math.abs(dx) / 2, h / 2 - 1);
    const dir = Math.sign(dx);
    // First corner (down→horizontal) and second corner (horizontal→down) need opposite sweeps
    // for smooth tangent-continuous, outward-facing arcs.
    const s1 = dx > 0 ? 0 : 1;
    const s2 = dx > 0 ? 1 : 0;
    const mid = h / 2;
    return [
        `M${px1},0`,
        `L${px1},${mid - r}`,
        `A${r},${r} 0 0,${s1} ${px1 + dir * r},${mid}`,
        `L${px2 - dir * r},${mid}`,
        `A${r},${r} 0 0,${s2} ${px2},${mid + r}`,
        `L${px2},${h}`,
    ].join(' ');
}

const SIDEBAR_W = 3;

export const Line = ({
    nextTheme,
    icon,
    visible,
    fromX,
    toX,
}: {
    nextTheme?: string;
    icon?: Icon;
    visible?: boolean;
    /** Connector mode: horizontal start position (0–1 fraction of container width) */
    fromX?: number;
    /** Connector mode: horizontal end position (0–1). Defaults to fromX. */
    toX?: number;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const streamPathRef = useRef<SVGPathElement>(null);
    const streamGradRef = useRef<SVGLinearGradientElement>(null);
    const sparkRef = useRef<HTMLDivElement>(null);

    const rawId = useId();
    const uid = rawId.replace(/:/g, '');

    const isConnector = fromX !== undefined;
    const effectiveToX = toX ?? fromX ?? 0;

    const [yRange, setYRange] = useState<[number, number]>([0, 1]);
    const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const update = () => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            // Position absolue sur le document
            const absoluteTop = rect.top + window.scrollY;
            const height = rect.height;
            // On déclenche quand les 2/3 de l'écran touchent l'élément.
            const triggerOffset = window.innerHeight * 0.666; 
            
            const start = absoluteTop - triggerOffset;
            const end = start + height;
            
            // Si c'est une ligne horizontale (height == 0), on donne une toute petite marge pour ne pas diviser par zéro
            setYRange([start, Math.max(start + 1, end)]);
        };
        update();
        window.addEventListener("resize", update);
        window.addEventListener("scroll", update, { passive: true }); // Optionnel si la layout change
        return () => {
            window.removeEventListener("resize", update);
            window.removeEventListener("scroll", update);
        }
    }, []);

    useEffect(() => {
        const el = isConnector ? ref.current : bodyRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            setSvgSize({ width: entry.contentRect.width, height: entry.contentRect.height });
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, [isConnector]);

    const { scrollY } = useScroll();
    // 1. On lisse UNIQUEMENT la valeur du scroll global !
    const smoothedScrollY = useSpring(scrollY, { stiffness: 60, damping: 25, restDelta: 0.001 });
    
    // 2. On map ce scroll lissé directement sur la progression (de 0 à 1)
    // Il n'y a plus aucun autre smooth. Si la ligne est horizontale (start == end),
    // elle s'affichera presque instantanément quand le scroll la touchera.
    const pathLengthProgress = useTransform(smoothedScrollY, yRange, [0, 1], { clamp: true });
    const sparkOpacity = useTransform(pathLengthProgress, [0, 0.01, 0.99, 1], [0, 1, 1, 0]);

    const [isVisibleIcon, setIsVisibleIcon] = useState(visible);
    const [isFlashing, setIsFlashing] = useState(false);
    const isLineActiveRef = useRef(visible);
    const hasIconRef = useRef(!!icon);

    useMotionValueEvent(pathLengthProgress, "change", (latest) => {
        if (!visible) {
            const active = latest > 0;
            setIsVisibleIcon(active);
            isLineActiveRef.current = active;
        }
    });

    useEffect(() => {
        const lineObj = {
            tick: (y: number, prevY: number) => {
                if (!ref.current || !streamPathRef.current || !streamGradRef.current) return;
                const rect = ref.current.getBoundingClientRect();
                const localY = y - rect.top;
                const path = streamPathRef.current;
                const total = path.getTotalLength();
                const streamLen = 200;
                
                // La position du flux (tête) est directement la distance `localY`.
                // Cela garantit une vitesse de parcours constante (1px/sec) sur le SVG 
                // indépendamment des courbes ou lignes horizontales !
                const inRange = localY > -streamLen && localY < total + streamLen;

                if (!inRange) {
                    path.style.strokeDasharray = "0 99999";
                    return;
                }

                if (total <= 0) return;
                const currentProgress = visible ? 1 : pathLengthProgress.get();
                const revealedLen = currentProgress * total;
                
                const actualHead = localY;
                const actualTail = actualHead - streamLen;

                // Restreindre le flux à la partie visible (progression)
                const clampedHead = Math.min(actualHead, revealedLen);
                const clampedTail = Math.max(0, actualTail);

                if (clampedTail >= clampedHead) {
                    path.style.strokeDasharray = "0 99999";
                    return;
                }

                if (clampedTail === 0) {
                    path.style.strokeDasharray = `${clampedHead} ${total}`;
                } else {
                    path.style.strokeDasharray = `0 ${clampedTail} ${clampedHead - clampedTail} ${total}`;
                }
                path.style.strokeDashoffset = "0";

                // Mise à jour du dégradé linéaire
                const headPoint = path.getPointAtLength(Math.min(clampedHead, total));
                const tailPoint = path.getPointAtLength(Math.min(Math.max(clampedTail, 0), total));
                
                streamGradRef.current.setAttribute("x1", String(tailPoint.x));
                streamGradRef.current.setAttribute("y1", String(tailPoint.y));
                streamGradRef.current.setAttribute("x2", String(headPoint.x));
                streamGradRef.current.setAttribute("y2", String(headPoint.y));

                if (sparkRef.current) {
                    if (actualHead >= revealedLen && actualTail <= revealedLen) {
                        sparkRef.current.classList.add("spark-active");
                    } else {
                        sparkRef.current.classList.remove("spark-active");
                    }
                }

                if (y >= rect.top && prevY < rect.top) {
                    if (isLineActiveRef.current && hasIconRef.current) {
                        setIsFlashing(true);
                        setTimeout(() => setIsFlashing(false), 400);
                    }
                }
            }
        };

        linesSet.add(lineObj);
        return () => { linesSet.delete(lineObj); };
    }, []);

    const svgW = isConnector ? svgSize.width : SIDEBAR_W;
    const pathFromX = isConnector ? fromX! : 0.5;
    const pathToX = isConnector ? effectiveToX : 0.5;
    const pathD = svgSize.height > 0 && svgW > 0
        ? buildPath(svgW, svgSize.height, pathFromX, pathToX)
        : "";

    const pathLengthVal = visible ? 1 : pathLengthProgress;

    const glowId = `glow-${uid}`;
    const gradId = `lg-${uid}`;

    const svgContent = pathD ? (
        <>
            <defs>
                {nextTheme && (
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2={svgSize.height} gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="1"/>
                        <stop className={`theme-${nextTheme}`} offset="100%" stopColor="var(--color-primary)" stopOpacity="1"/>
                    </linearGradient>
                )}
                <linearGradient id={`streamGrad-${uid}`} ref={streamGradRef} gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0"/>
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="1"/>
                </linearGradient>
            </defs>
            <motion.path
                d={pathD}
                style={{ pathLength: pathLengthVal as any }}
                stroke={nextTheme ? `url(#${gradId})` : "var(--color-primary)"}
                strokeOpacity={0.5}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
            />
            <path
                ref={streamPathRef}
                d={pathD}
                stroke={`url(#streamGrad-${uid})`}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                strokeDasharray="0 99999"
                style={{ filter: "drop-shadow(0px 0px 2px var(--color-primary))" }}
            />
        </>
    ) : null;

    if (isConnector) {
        return (
            <div
                ref={ref}
                className={`absolute inset-0 not-detect-theme theme-${nextTheme}`}
            >
                <svg className="w-full h-full overflow-visible">
                    {svgContent}
                </svg>
            </div>
        );
    }

    return (
        <div
            ref={ref}
            className={"h-full ml-4 md:ml-12 flex flex-col items-center " + (!icon ? "" : "gap-8")}
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
                .spark-glow, .spark-core {
                    opacity: 0.5; transform: scale(1);
                    transition: opacity 2s ease-out, transform 2s ease-out;
                }
                .spark-active .spark-glow, .spark-active .spark-core {
                    opacity: 1; transform: scale(1.6);
                    transition: opacity 0.1s ease-out, transform 0.1s ease-out;
                }
            `}</style>

            <div className={classNames("relative flex justify-center items-center transition-all duration-500 w-6", {
                "h-6": icon,
                "h-0": !icon,
            })}>
                {icon && (
                    <div className="relative z-10 flex justify-center items-center w-full h-full">
                        <div className={classNames(
                            "bg-primary blur-md rounded-full h-full w-full absolute top-0 left-0 scale-150 transition-opacity duration-1000",
                            { "opacity-0": !isVisibleIcon && !visible, "opacity-40 delay-300": isVisibleIcon || visible }
                        )}/>
                        <div
                            style={{
                                transitionProperty: "opacity",
                                transitionDuration: isFlashing ? "500ms" : "1000ms",
                                transitionTimingFunction: isFlashing ? "ease-in" : "ease-out"
                            }}
                            className={classNames(
                                "bg-primary blur-lg rounded-full h-full w-full absolute top-0 left-0 scale-150",
                                {
                                    "opacity-0": !isFlashing || (!isVisibleIcon && !visible),
                                    "opacity-80": isFlashing && (isVisibleIcon || visible),
                                }
                            )}
                        />
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

            <div ref={bodyRef} className="flex-1 w-[3px] relative overflow-visible">
                <svg style={{width: SIDEBAR_W, height: "100%"}} className="overflow-visible">
                    {svgContent}
                </svg>
                <motion.div
                    style={{ opacity: visible ? 0 : sparkOpacity }}
                    className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-10 pointer-events-none"
                >
                    <div ref={sparkRef} className="flex flex-col items-center justify-center animate-pulse spark-base">
                        <div className="spark-glow w-[12px] h-[12px] bg-primary rounded-full blur-[3px]"/>
                        <div className="spark-core w-[6px] h-[6px] bg-primary rounded-full absolute shadow-[0_0_8px_var(--color-primary)]"/>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
