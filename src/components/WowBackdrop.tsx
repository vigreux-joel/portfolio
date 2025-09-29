import React, {useEffect, useMemo, useRef, useState} from "react";

/**
 * WowBackdrop
 * An abstract, framework-agnostic visual animation meant to create a "wow" effect for general public and tech.
 * It renders a soft aurora/halo background blended with a few slow orbits of light dots.
 *
 * Features:
 * - Canvas-based for performance, falls back to a static SVG if prefers-reduced-motion is enabled.
 * - Uses CSS variables from the theme (e.g., --color-primary-container, --color-tertiary-container, --color-secondary-container).
 * - Reusable: control density, speed, and sizing via props.
 */
export type WowBackdropProps = {
    className?: string;
    width?: number;   // canvas width in CSS pixels (auto by default: parent size)
    height?: number;  // canvas height in CSS pixels (auto by default: parent size)
    density?: number; // number of moving glow blobs
    speed?: number;   // base speed multiplier
};

export const WowBackdrop: React.FC<WowBackdropProps> = ({
                                                            className = "",
                                                            width,
                                                            height,
                                                            density = 6,
                                                            speed = 0.2,
                                                        }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const handler = () => setReducedMotion(mq.matches);
        handler();
        mq.addEventListener?.("change", handler);
        return () => mq.removeEventListener?.("change", handler);
    }, []);

    // get themed colors from CSS variables
    const themeColors = useMemo(() => {
        if (typeof window === "undefined") return {
            primary: "#a1cdff",
            tertiary: "#c79eff",
            secondary: "#d3e4fa",
        };
        const styles = getComputedStyle(document.documentElement);
        const primary = styles.getPropertyValue("--color-primary-container").trim() || "#a1cdff";
        const tertiary = styles.getPropertyValue("--color-tertiary-container").trim() || "#c79eff";
        const secondary = styles.getPropertyValue("--color-secondary-container").trim() || "#d3e4fa";
        return {primary, tertiary, secondary};
    }, []);

    useEffect(() => {
        if (reducedMotion) return; // canvas not needed if reduced motion
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // size canvas to container with 2x overscan to avoid edge cutoffs
        const resize = () => {
            const cssW = width ?? container.clientWidth;
            const cssH = height ?? container.clientHeight;
            const overscan = 2; // render area 2x larger than visible
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.max(1, Math.floor(cssW * overscan * dpr));
            canvas.height = Math.max(1, Math.floor(cssH * overscan * dpr));
            canvas.style.width = cssW + "px";
            canvas.style.height = cssH + "px";
            // scale down drawing to fit visible area and translate to center of overscan
            ctx.setTransform(dpr * (overscan), 0, 0, dpr * (overscan), 0, 0);
        };

        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(container);

        // create glow blobs
        const count = Math.max(1, Math.floor(density));
        const blobs = Array.from({length: count}, (_, i) => {
            const angle = Math.random() * Math.PI * 2;
            // bias radii toward center; narrower range to avoid extreme dispersion
            const radius = 40 + Math.random() * 120;
            const cx = ((container.clientWidth) * 0.58);
            const cy = ((container.clientHeight) * 0.58);
            const hue = i % 3 === 0 ? themeColors.primary : (i % 3 === 1 ? themeColors.tertiary : themeColors.secondary);
            const size = 160 + Math.random() * 140; // slightly larger for stronger center light
            const vel = (0.2 + Math.random() * 0.5) * speed; // a bit slower, more cohesive
            return {angle, radius, cx, cy, color: hue, size, vel};
        });

        let raf = 0;
        let last = performance.now();

        const draw = (ts: number) => {
            const dt = Math.min(0.033, (ts - last) / 1000);
            last = ts;
            const overscan = 2;
            const dprNow = (window.devicePixelRatio || 1);
            const w = (canvas.width / (dprNow * overscan));
            const h = (canvas.height / (dprNow * overscan));
            ctx.clearRect(0, 0, w, h);

            // background halos with inner bias and safe margin so color never hits edges
            const margin = Math.min(w, h) * 0.08; // keep glow away from edges (~8%)
            ctx.save();
            // clip to inner safe area so no blob or halo can bleed to the edge
            ctx.beginPath();
            ctx.rect(margin, margin, w - margin * 2, h - margin * 2);
            ctx.clip();

            const cx = Math.min(w - margin, Math.max(margin, w * 0.62));
            const cy = Math.min(h - margin, Math.max(margin, h * 0.62));
            // Narrower central luminous core by reducing inner radius and tightening stops
            const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(w, h) * 0.45);
            grad.addColorStop(0, `${themeColors.primary}44`);
            grad.addColorStop(0.22, `${themeColors.tertiary}26`);
            grad.addColorStop(0.55, `${themeColors.secondary}12`);
            grad.addColorStop(1, "transparent");
            ctx.fillStyle = grad;
            ctx.fillRect(margin, margin, w - margin * 2, h - margin * 2);

            // moving blobs with soft light
            ctx.globalCompositeOperation = "lighter";
            blobs.forEach(b => {
                b.angle += b.vel * dt;
                const x = b.cx + Math.cos(b.angle) * b.radius;
                const y = b.cy + Math.sin(b.angle) * (b.radius * 0.5);
                // Narrow blob core to better match perceived blob diameter vs center core
                const g = ctx.createRadialGradient(x, y, 0, x, y, b.size);
                g.addColorStop(0, `${b.color}99`);
                g.addColorStop(0.35, `${b.color}3a`);
                g.addColorStop(1, "transparent");
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(x, y, b.size, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalCompositeOperation = "source-over";
            // end of clipped area for halos and blobs
            ctx.restore();

            // dotted orbits (kept inside safe area as well)
            ctx.save();
            ctx.translate(
                Math.min(w - margin, Math.max(margin, w * 0.5)),
                Math.min(h - margin, Math.max(margin, h * 0.55))
            );
            const t = ts * 0.00005 * speed;
            const safe = Math.min(w, h) - margin * 2;
            const rings = [
                {rx: safe * 0.45, ry: safe * 0.22, color: themeColors.primary},
                {rx: safe * 0.38, ry: safe * 0.18, color: themeColors.tertiary},
                {rx: safe * 0.32, ry: safe * 0.14, color: themeColors.secondary},
            ];
            rings.forEach((ring, i) => {
                ctx.save();
                ctx.rotate((i % 2 === 0 ? 1 : -1) * t * (i + 1));
                ctx.strokeStyle = `${ring.color}66`;
                ctx.lineWidth = 1.2;
                // draw ellipse outline subtly
                const steps = 128;
                ctx.beginPath();
                for (let s = 0; s <= steps; s++) {
                    const a = (s / steps) * Math.PI * 2;
                    const x = Math.cos(a) * ring.rx;
                    const y = Math.sin(a) * ring.ry;
                    if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.stroke();
                // moving dots
                const dotCount = 3;
                for (let d = 0; d < dotCount; d++) {
                    const a = t * 50 + (d / dotCount) * Math.PI * 2;
                    const x = Math.cos(a) * ring.rx;
                    const y = Math.sin(a) * ring.ry;
                    ctx.fillStyle = ring.color;
                    ctx.beginPath();
                    ctx.arc(x, y, 2 + (i === 0 ? 1 : 0), 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            });
            ctx.restore();

            raf = requestAnimationFrame(draw);
        };

        raf = requestAnimationFrame(draw);
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, [density, height, reducedMotion, speed, themeColors.primary, themeColors.secondary, themeColors.tertiary, width]);

    if (reducedMotion) {
        // Static fallback SVG using halos and subtle rings
        return (
            <div ref={containerRef} className={"pointer-events-none " + className} aria-hidden="true">
                <svg className="w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] min-w-[400px] min-h-[400px]"
                     viewBox="0 0 1040 1040" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <radialGradient id="g1" cx="55%" cy="55%" r="45%">
                            <stop offset="0%" stopColor={themeColors.primary} stopOpacity="0.28"/>
                            <stop offset="35%" stopColor={themeColors.tertiary} stopOpacity="0.18"/>
                            <stop offset="60%" stopColor={themeColors.secondary} stopOpacity="0.08"/>
                            <stop offset="100%" stopColor={themeColors.secondary} stopOpacity="0"/>
                        </radialGradient>
                    </defs>
                    {/*inner safe area to avoid touching edges; doubled viewBox for overscan*/}
                    <rect x="80" y="80" width="880" height="880" fill="url(#g1)"/>
                    <g opacity="0.6" transform="translate(520 520)">
                        <ellipse cx="0" cy="0" rx="480" ry="220" stroke={themeColors.primary} strokeOpacity="0.35"/>
                        <ellipse cx="0" cy="0" rx="400" ry="180" stroke={themeColors.tertiary} strokeOpacity="0.32"
                                 transform="rotate(25)"/>
                        <ellipse cx="0" cy="0" rx="340" ry="140" stroke={themeColors.secondary} strokeOpacity="0.28"
                                 transform="rotate(-20)"/>
                    </g>
                </svg>
            </div>
        );
    }

    return (
        <div ref={containerRef} className={"relative pointer-events-none " + className} aria-hidden="true">
            <canvas ref={canvasRef} className="block"/>
        </div>
    );
};

export default WowBackdrop;
