import {classNames, Icon} from "@udixio/ui-react";
import {useEffect, useId, useRef, useState} from "react";
import {motion, useMotionValueEvent, useScroll, useSpring, useTransform} from "motion/react";

declare global {
    interface Window {
        __ENERGY_VIEWPORT_LOOP?: boolean;
    }
}

const ENERGY_SPEED = 1000;

let globalDistance = 0;
let lastFrameTime = 0;

export interface EnergyNodeRegistration {
    getTop: () => number;
    getBottom: () => number;
    getTotal: () => number;
    tick: (localY: number) => void;
}
const linesSet = new Set<EnergyNodeRegistration>();

export const registerEnergyNode = (node: EnergyNodeRegistration) => {
    linesSet.add(node);
};
export const unregisterEnergyNode = (node: EnergyNodeRegistration) => {
    linesSet.delete(node);
};

const loop = (time: number) => {
    if (!lastFrameTime) lastFrameTime = time;
    const dt = (time - lastFrameTime) / 1000;
    lastFrameTime = time;

    globalDistance += ENERGY_SPEED * dt;

    // 1. Récupérer et trier toutes les lignes par position verticale
    const lines = Array.from(linesSet).map(l => ({
        reg: l,
        top: l.getTop(),
        bottom: l.getBottom(),
        total: l.getTotal(),
        trackStart: 0
    })).sort((a, b) => a.top - b.top);

    // 2. Grouper les lignes qui sont parallèles (sur la même ligne horizontale)
    const groupedLines: (typeof lines)[] = [];
    for (const line of lines) {
        let added = false;
        for (const group of groupedLines) {
            if (Math.abs(group[0].top - line.top) < 50) {
                group.push(line);
                added = true;
                break;
            }
        }
        if (!added) groupedLines.push([line]);
    }

    // 3. Construire le chemin 1D continu
    let currentTrackPos = 0;
    let prevBottom = 0;

    for (let i = 0; i < groupedLines.length; i++) {
        const group = groupedLines[i];
        const groupTop = Math.min(...group.map(l => l.top));
        
        if (i > 0) {
            const gap = Math.max(0, groupTop - prevBottom);
            currentTrackPos += gap;
        }

        let maxTotal = 0;
        let maxBottom = 0;
        for (const line of group) {
            line.trackStart = currentTrackPos;
            maxTotal = Math.max(maxTotal, line.total);
            maxBottom = Math.max(maxBottom, line.bottom);
        }
        
        currentTrackPos += maxTotal;
        prevBottom = maxBottom;
    }

    // Espacement entre deux comètes : juste un peu plus long que le plus grand
    // élément (marge +400) pour que la suivante arrive ~0,2 s après que la
    // précédente soit sortie, sans que deux comètes se chevauchent sur un même
    // élément. Plancher innerHeight*2 pour les pages sans grand élément.
    const longestLine = Math.max(...lines.map(l => l.total));
    const COMET_SPACING = Math.max(longestLine + 300, window.innerHeight * 1.3);

    // 4. Mettre à jour chaque ligne avec une infinité de comètes espacées
    for (const group of groupedLines) {
        for (const line of group) {
            let mod = (globalDistance - line.trackStart) % COMET_SPACING;
            if (mod < 0) mod += COMET_SPACING;
            
            // On décale de la taille de la comète (200px)
            const localY = mod - 200;
            line.reg.tick(localY);
        }
    }

    requestAnimationFrame(loop);
};

if (typeof window !== "undefined" && !window.__ENERGY_VIEWPORT_LOOP) {
    window.__ENERGY_VIEWPORT_LOOP = true;
    requestAnimationFrame(loop);
}

/** Elbow path: straight lines + rounded corners.
 *  When x1 === x2, the arc radius is 0 → degenerates to a straight vertical line.
 */
function buildPath(w: number, h: number, x1: number, x2: number, px1Offset: number = 0, px2Offset: number = 0): string {
    const px1 = x1 * w + px1Offset;
    const px2 = x2 * w + px2Offset;
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
    image,
    visible,
    fromX,
    toX,
    fromPx,
    toPx,
    isFirst,
    isLast,
    className,
}: {
    nextTheme?: string;
    icon?: Icon;
    /** Raw SVG string (e.g. a techno logo) rendered as the line node instead of an icon. */
    image?: string;
    visible?: boolean;
    /** Connector mode: horizontal start position (0–1 fraction of container width) */
    fromX?: number;
    /** Connector mode: horizontal end position (0–1). Defaults to fromX. */
    toX?: number;
    /** Connector mode: pixel offset added to fromX (to anchor on a fixed px lane like the spine ml-12). */
    fromPx?: number;
    /** Connector mode: pixel offset added to toX. Defaults to fromPx. */
    toPx?: number;
    isFirst?: boolean;
    isLast?: boolean;
    className?: string;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const streamPathRef = useRef<SVGPathElement>(null);
    const streamGradRef = useRef<SVGLinearGradientElement>(null);
    const sparkRef = useRef<SVGGElement>(null);

    const rawId = useId();
    const uid = rawId.replace(/:/g, '');

    const isConnector = fromX !== undefined || toX !== undefined;
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
    const pathOpacity = useTransform(pathLengthProgress, [0, 0.001], [0, 1]);

    const [isVisibleIcon, setIsVisibleIcon] = useState(visible);
    const [isFlashing, setIsFlashing] = useState(false);
    const flashTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const sparkLastHitRef = useRef<number>(0);
    const isLineActiveRef = useRef(visible);
    const hasNode = !!icon || !!image;
    const hasIconRef = useRef(hasNode);

    useMotionValueEvent(pathLengthProgress, "change", (latest) => {
        if (!visible) {
            const active = latest > 0;
            setIsVisibleIcon(active);
            isLineActiveRef.current = active;
        }
    });

    useEffect(() => {
        let prevLocalY = -1000;
        const lineObj: EnergyNodeRegistration = {
            getTop: () => {
                if (!ref.current) return 0;
                return ref.current.getBoundingClientRect().top + window.scrollY;
            },
            getBottom: () => {
                if (!ref.current) return 0;
                const rect = ref.current.getBoundingClientRect();
                return rect.top + window.scrollY + rect.height;
            },
            getTotal: () => {
                if (!streamPathRef.current) return 0;
                return streamPathRef.current.getTotalLength();
            },
            tick: (localY: number) => {
                if (!ref.current || !streamPathRef.current || !streamGradRef.current) return;
                
                const path = streamPathRef.current;
                const total = path.getTotalLength();
                if (total <= 0) return;
                const currentProgress = visible ? 1 : pathLengthProgress.get();
                const revealedLen = currentProgress * total;

                const streamLen = 200;
                
                // La position du flux (tête) est directement la distance `localY`.
                const inRange = localY > -streamLen && localY < total + streamLen;

                const actualHead = localY;
                const actualTail = actualHead - streamLen;

                if (sparkRef.current) {
                    const pt = path.getPointAtLength(revealedLen);
                    
                    let scale = 1;
                    let opacity = 0.2;
                    const now = Date.now();

                    if (actualHead >= revealedLen && actualTail <= revealedLen) {
                        sparkLastHitRef.current = now;
                        scale = 2.5;
                        opacity = 1;
                    } else if (sparkLastHitRef.current > 0) {
                        const elapsed = now - sparkLastHitRef.current;
                        const duration = 5000;
                        if (elapsed < duration) {
                            const progress = elapsed / duration;
                            // ease-out-ish decay
                            const easeProgress = 1 - Math.pow(1 - progress, 3);
                            scale = 2.5 - 1.5 * easeProgress;
                            opacity = 1 - 0.8 * easeProgress;
                        }
                    }

                    // Cache l'étincelle complètement si la ligne n'est pas en cours de dessin (ni à 0% ni à 100%)
                    if (currentProgress <= 0 || currentProgress >= 1) {
                        opacity = 0;
                        scale = 0;
                    }

                    // Apply the transforms to the group. The opacity will affect the whole group.
                    sparkRef.current.style.transform = `translate(${pt.x}px, ${pt.y}px) scale(${scale})`;
                    sparkRef.current.style.opacity = String(opacity);
                }

                if (!inRange) {
                    path.style.display = "none";
                    return;
                }

                // Restreindre le flux à la partie visible (progression)
                const clampedHead = Math.min(actualHead, revealedLen);
                const clampedTail = Math.max(0, actualTail);

                if (clampedTail >= clampedHead) {
                    path.style.display = "none";
                    return;
                }

                path.style.display = "block";
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

                if (localY >= 0 && prevLocalY < 0) {
                    if (isLineActiveRef.current && hasIconRef.current) {
                        setIsFlashing(true);
                        if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
                        flashTimeoutRef.current = setTimeout(() => setIsFlashing(false), 200);
                    }
                }
                prevLocalY = localY;
            }
        };

        linesSet.add(lineObj);
        return () => { linesSet.delete(lineObj); };
    }, []);
    const svgW = isConnector ? svgSize.width : SIDEBAR_W;
    const pathFromX = isConnector ? (fromX ?? 0) : 0.5;
    const pathToX = isConnector ? (toX ?? pathFromX) : 0.5;
    
    // Auto-adjust pixel offsets for mobile spine (28px) vs desktop spine (60px) if they match 60
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    let finalFromPx = fromPx ?? (pathFromX === 0 || pathFromX === 1 ? 60 : 0);
    let finalToPx = toPx ?? (pathToX === 0 || pathToX === 1 ? 60 : 0);
    
    if (isMobile) {
        if (finalFromPx === 60) finalFromPx = 28;
        if (finalToPx === 60) finalToPx = 28;
    }

    const pathD = svgSize.height > 0 && svgW > 0
        ? buildPath(svgW, svgSize.height, pathFromX, pathToX, finalFromPx, finalToPx)
        : "";

    const pathLengthVal = visible ? 1 : pathLengthProgress;

    const glowId = `glow-${uid}`;
    const gradId = `lg-${uid}`;

    const needsGradient = nextTheme || isFirst || isLast;

    const svgContent = pathD ? (
        <>
            <defs>
                {needsGradient && (
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2={svgSize.height} gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={isFirst ? "0" : "1"}/>
                        {(isFirst || isLast) && <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="1"/>}
                        <stop className={nextTheme ? `theme-${nextTheme}` : ""} offset="100%" stopColor="var(--color-primary)" stopOpacity={isLast ? "0" : "1"}/>
                    </linearGradient>
                )}
                <linearGradient id={`streamGrad-${uid}`} ref={streamGradRef} gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0"/>
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="1"/>
                </linearGradient>
            </defs>
            <motion.path
                d={pathD}
                style={{ 
                    pathLength: pathLengthVal as any,
                    opacity: visible ? 1 : pathOpacity 
                }}
                stroke={needsGradient ? `url(#${gradId})` : "var(--color-primary)"}
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
            <motion.g
                ref={sparkRef}
                style={{ opacity: visible ? 0 : sparkOpacity }}
                className="spark-base"
            >
                <circle cx={0} cy={0} r={4} className="spark-glow fill-primary" style={{ filter: 'blur(2px)' }} />
                <circle cx={0} cy={0} r={2} className="spark-core fill-primary" style={{ filter: 'drop-shadow(0 0 6px var(--color-primary))' }} />
            </motion.g>
        </>
    ) : null;

    if (isConnector) {
        return (
            <div
                ref={ref}
                className={classNames(
                    "absolute inset-0 not-detect-theme",
                    { [`theme-${nextTheme}`]: !!nextTheme },
                    className,
                )}
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
            className={classNames(
                "h-full ml-4 md:ml-12 flex flex-col items-center",
                { "gap-8": hasNode },
                className,
            )}
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

            <div className={classNames("relative flex justify-center items-center transition-all duration-500 w-6", {
                "h-6": hasNode,
                "h-0": !hasNode,
            })}>
                {hasNode && (
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
                        {icon ? (
                            <Icon
                                className={classNames("h-6 w-full relative z-10 transition-transform duration-500 ease-out", {
                                    "scale-0": !isVisibleIcon && !visible,
                                    "scale-100": isVisibleIcon || visible,
                                })}
                                icon={icon}
                            />
                        ) : (
                            <div
                                dangerouslySetInnerHTML={{ __html: image! }}
                                className={classNames("h-6 w-6 relative z-10 flex items-center justify-center fill-on-surface transition-transform duration-500 ease-out [&>svg]:h-full [&>svg]:w-full", {
                                    "scale-0": !isVisibleIcon && !visible,
                                    "scale-100": isVisibleIcon || visible,
                                })}
                            />
                        )}
                    </div>
                )}
            </div>

            <div ref={bodyRef} className="flex-1 w-[3px] relative overflow-visible">
                <svg style={{width: SIDEBAR_W, height: "100%"}} className="overflow-visible">
                    {svgContent}
                </svg>
            </div>
        </div>
    );
};
