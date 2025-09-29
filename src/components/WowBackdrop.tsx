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
    return { primary, tertiary, secondary };
  }, []);

  useEffect(() => {
    if (reducedMotion) return; // canvas not needed if reduced motion
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // size canvas to container
    const resize = () => {
      const cssW = width ?? container.clientWidth;
      const cssH = height ?? container.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(cssW * dpr));
      canvas.height = Math.max(1, Math.floor(cssH * dpr));
      canvas.style.width = cssW + "px";
      canvas.style.height = cssH + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // create glow blobs
    const count = Math.max(1, Math.floor(density));
    const blobs = Array.from({ length: count }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 60 + Math.random() * 180;
      const cx = (container.clientWidth * 0.6);
      const cy = (container.clientHeight * 0.6);
      const hue = i % 3 === 0 ? themeColors.primary : (i % 3 === 1 ? themeColors.tertiary : themeColors.secondary);
      const size = 140 + Math.random() * 180;
      const vel = (0.3 + Math.random() * 0.7) * speed; // radians per sec scale
      return { angle, radius, cx, cy, color: hue, size, vel };
    });

    let raf = 0;
    let last = performance.now();

    const draw = (ts: number) => {
      const dt = Math.min(0.033, (ts - last) / 1000);
      last = ts;
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);

      // background halos
      const grad = ctx.createRadialGradient(w * 0.7, h * 0.7, 40, w * 0.7, h * 0.7, Math.max(w, h) * 0.6);
      grad.addColorStop(0, `${themeColors.primary}22`);
      grad.addColorStop(0.5, `${themeColors.tertiary}18`);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // moving blobs with soft light
      ctx.globalCompositeOperation = "lighter";
      blobs.forEach(b => {
        b.angle += b.vel * dt;
        const x = b.cx + Math.cos(b.angle) * b.radius;
        const y = b.cy + Math.sin(b.angle) * (b.radius * 0.55);
        const g = ctx.createRadialGradient(x, y, 0, x, y, b.size);
        g.addColorStop(0, `${b.color}99`);
        g.addColorStop(0.6, `${b.color}33`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, b.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalCompositeOperation = "source-over";

      // dotted orbits
      ctx.save();
      ctx.translate(w * 0.5, h * 0.55);
      const t = ts * 0.00005 * speed;
      const rings = [
        { rx: Math.min(w, h) * 0.45, ry: Math.min(w, h) * 0.22, color: themeColors.primary },
        { rx: Math.min(w, h) * 0.38, ry: Math.min(w, h) * 0.18, color: themeColors.tertiary },
        { rx: Math.min(w, h) * 0.32, ry: Math.min(w, h) * 0.14, color: themeColors.secondary },
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
        <svg className="w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] min-w-[400px] min-h-[400px]" viewBox="0 0 520 520" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="g1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={themeColors.primary} stopOpacity="0.25"/>
              <stop offset="100%" stopColor={themeColors.primary} stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="g2" cx="65%" cy="35%" r="40%">
              <stop offset="0%" stopColor={themeColors.tertiary} stopOpacity="0.3"/>
              <stop offset="100%" stopColor={themeColors.tertiary} stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="g3" cx="35%" cy="65%" r="35%">
              <stop offset="0%" stopColor={themeColors.secondary} stopOpacity="0.25"/>
              <stop offset="100%" stopColor={themeColors.secondary} stopOpacity="0"/>
            </radialGradient>
          </defs>
          <rect width="520" height="520" fill="url(#g1)"/>
          <rect width="520" height="520" fill="url(#g2)"/>
          <rect width="520" height="520" fill="url(#g3)"/>
          <g opacity="0.6">
            <ellipse cx="260" cy="260" rx="240" ry="110" stroke={themeColors.primary} strokeOpacity="0.4"/>
            <ellipse cx="260" cy="260" rx="200" ry="90" stroke={themeColors.tertiary} strokeOpacity="0.35" transform="rotate(25 260 260)"/>
            <ellipse cx="260" cy="260" rx="170" ry="70" stroke={themeColors.secondary} strokeOpacity="0.3" transform="rotate(-20 260 260)"/>
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
