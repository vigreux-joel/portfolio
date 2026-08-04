import {Card as UiCard, classNames} from "@udixio/ui-react"
import {useEffect, useRef, useState} from "react";
import {AnimatePresence, motion} from "motion/react";
import {v4 as uuidv4} from "uuid";
import {useIsPowered} from "../hooks/useIsPowered";
import {type EnergyNodeRegistration, registerEnergyNode, unregisterEnergyNode} from "./Line";

export const Card = ({children, className, variant = "elevated", energyX, energyXOut, proximityPercent = 100, ...restProps}: any) => {

    const ref = useRef<any>(null);

    // Suivi global de la souris + proximité à la carte : la bordure et le halo
    // réagissent dès que le curseur s'APPROCHE (plus seulement au survol).
    //   mx,my = position du curseur relative à la carte (peut sortir de [0,w]/[0,h])
    //   prox  = 0 (au-delà du rayon) → 1 (sur la carte), selon la distance au rectangle
    const [mouse, setMouse] = useState<{ mx: number; my: number; prox: number }>({ mx: 0, my: 0, prox: 0 });
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            const el = ref.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            // rayon d'activation autour de la carte basé sur un pourcentage de sa taille maximale
            const proximityPx = Math.max(rect.width, rect.height) * (proximityPercent / 100);
            // distance du curseur au rectangle de la carte (0 si à l'intérieur)
            const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
            const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
            const dist = Math.hypot(dx, dy);
            // evite la division par zéro si proximityPx est 0
            const prox = proximityPx > 0 ? Math.max(0, 1 - dist / proximityPx) : (dist === 0 ? 1 : 0);
            setMouse(prev => {
                // loin et déjà éteint → on évite un re-render à chaque mouvement de souris
                if (prox === 0 && prev.prox === 0) return prev;
                return { mx: e.clientX - rect.left, my: e.clientY - rect.top, prox };
            });
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    const [uuid, setUuid] = useState(uuidv4())
    const isPowered = useIsPowered(ref);

    const energyBorderRef = useRef<HTMLDivElement>(null);
    const resolvedEnergyX = energyX === true ? "50%" : energyX;
    const resolvedEnergyXOut = energyXOut ?? resolvedEnergyX;

    useEffect(() => {
        if (resolvedEnergyX === undefined) return;

        // Position horizontale (0–1) du point d'entrée (haut) et de sortie (bas).
        const toFrac = (v: any): number => {
            if (v === true || v === undefined || v === null) return 0.5;
            const n = typeof v === "number" ? v : parseFloat(String(v));
            if (isNaN(n)) return 0.5;
            return n > 1 ? n / 100 : n; // accepte "50%", 50 ou 0.5
        };
        const entryFrac = toFrac(resolvedEnergyX);
        const exitFrac = toFrac(resolvedEnergyXOut);

        const node: EnergyNodeRegistration = {
            getTop: () => {
                if (!ref.current) return 0;
                return ref.current.getBoundingClientRect().top + window.scrollY;
            },
            getBottom: () => {
                if (!ref.current) return 0;
                return ref.current.getBoundingClientRect().bottom + window.scrollY;
            },
            // = HAUTEUR de la carte (et non le périmètre). Crucial : sur la "piste" 1D
            // de la boucle, la carte occupe exactement son extension verticale, donc la
            // comète atteint la sortie (bas) au moment précis où le flux global franchit
            // le bas de la carte → l'arrivée sur la Line suivante est synchrone (plus de
            // latence). Le périmètre complet est calé dans ce budget vertical : la comète
            // va simplement plus vite autour de la carte que sur une ligne droite.
            getTotal: () => {
                if (!ref.current) return 0;
                return ref.current.getBoundingClientRect().height;
            },
            tick: (head: number) => {
                const el = energyBorderRef.current;
                if (!ref.current || !el) return;
                const r = ref.current.getBoundingClientRect();
                const w = r.width, H = r.height;

                // Deux chemins symétriques le long du périmètre (en pixels), du point
                // d'entrée (haut) au point de sortie (bas) :
                //   gauche : entrée → coin haut-gauche → bord gauche → sortie
                //   droite : entrée → coin haut-droit  → bord droit  → sortie
                const topL = entryFrac * w, botL = exitFrac * w;
                const topR = (1 - entryFrac) * w, botR = (1 - exitFrac) * w;
                const lenL = topL + H + botL;   // longueur du périmètre (gauche), px
                const lenR = topR + H + botR;   // (droite)
                const exitRun = 220;            // glisse sous le bord bas pour disparaître en mouvement

                // head est en "unités de piste" calées sur la hauteur H :
                //   head ∈ [0, H]  → on trace tout le périmètre (proportionnellement) ;
                //   head > H       → on glisse sous la carte (sortie en mouvement).
                const visible = head >= 0 && head <= H + exitRun;
                el.style.transitionDuration = visible ? "100ms" : "400ms";
                el.style.opacity = visible ? "0.5" : "0"; // 2× moins visible que la normale

                // Distance px le long du périmètre, proportionnelle à la progression verticale
                const segL = head <= H ? (head / H) * lenL : lenL + (head - H);
                let lx: number, ly: number;
                if (segL <= topL) { lx = topL - segL; ly = 0; }            // haut : entrée → coin
                else if (segL <= topL + H) { lx = 0; ly = segL - topL; }   // côté gauche : descente
                else if (segL <= lenL) { lx = segL - topL - H; ly = H; }   // bas : coin → sortie
                else { lx = botL; ly = H + (segL - lenL); }                // glisse sous la sortie

                const segR = head <= H ? (head / H) * lenR : lenR + (head - H);
                let rx: number, ry: number;
                if (segR <= topR) { rx = entryFrac * w + segR; ry = 0; }
                else if (segR <= topR + H) { rx = w; ry = segR - topR; }
                else if (segR <= lenR) { rx = w - (segR - topR - H); ry = H; }
                else { rx = w - botR; ry = H + (segR - lenR); }

                el.style.setProperty('--energy-r', `${H * 0.5}px`); // lueur = 50% de la hauteur
                el.style.setProperty('--ex-l', `${lx}px`);
                el.style.setProperty('--ey-l', `${ly}px`);
                el.style.setProperty('--ex-r', `${rx}px`);
                el.style.setProperty('--ey-r', `${ry}px`);
            }
        };

        registerEnergyNode(node);
        return () => unregisterEnergyNode(node);
    }, [resolvedEnergyX, resolvedEnergyXOut]);

    return <UiCard ref={ref}
                   style={{ cornerShape: "superellipse(2)" }}
                    className={classNames(

        "rounded-3xl  bg-radial-[at_90%_90%]" ,
          " from-secondary-container/20 to-transparent backdrop-blur-xl overflow-clip",
          "group",
       "transition-bg duration-1000",
        {
            "bg-surface-container/50": isPowered,
            "bg-surface-container-low ": !isPowered
        },
                        className,
      )} variant={variant} {...restProps}>

        {/* Bordure lumineuse : s'active au survol ET à l'approche de la souris */}
        <AnimatePresence>
            {(mouse.prox > 0 && isPowered) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: mouse.prox }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-0 pointer-events-none rounded-[inherit]"
                    style={{
                        padding: "2px", // Épaisseur fine pour la bordure
                        background: `radial-gradient(300px circle at ${mouse.mx}px ${mouse.my}px, var(--color-primary), transparent 100%) border-box`,
                        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude"
                    }}
                />
            )}
        </AnimatePresence>

        {/* Bordure lumineuse (Energie qui passe) */}
        {resolvedEnergyX !== undefined && isPowered && (
            <div
                ref={energyBorderRef}
                // z-30 : au-dessus du contenu (vidéo, texte) pour que la lueur du bord
                // reste visible sur les 4 côtés. Sans danger : seul l'anneau de 2px est
                // peint (reste transparent via le masque) et pointer-events-none.
                className="absolute inset-0 z-30 pointer-events-none rounded-[inherit]"
                style={{
                    opacity: 0, // React only sets this on mount, DOM manages it later
                    padding: "2px",
                    // Deux comètes qui parcourent le périmètre depuis le point d'entrée
                    // (haut) vers le point de sortie (bas). tick() déplace les points
                    // (--ex-l,--ey-l) et (--ex-r,--ey-r) le long du contour ; le masque
                    // ne garde que l'anneau de 2px → la lueur suit réellement le bord.
                    // Rayon de la lueur = --energy-r (réglé par tick() à 50% de la hauteur de la carte).
                    background: `radial-gradient(var(--energy-r, 160px) circle at var(--ex-l, -1000px) var(--ey-l, -1000px), var(--color-primary), transparent 70%), radial-gradient(var(--energy-r, 160px) circle at var(--ex-r, -1000px) var(--ey-r, -1000px), var(--color-primary), transparent 70%)`,
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    transitionProperty: "opacity",
                    transitionTimingFunction: "ease-out"
                }}
            />
        )}

        {/* Halo lumineux intérieur : suit aussi la souris à l'approche */}
        <AnimatePresence>
            {(mouse.prox > 0 && isPowered) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: mouse.prox }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-0 pointer-events-none rounded-[inherit] "
                    style={{
                        // Utilisation d'un dégradé CSS (bien plus lisse que le SVG étiré)
                        background: `radial-gradient(750px circle at ${mouse.mx}px ${mouse.my}px, rgba(255, 255, 255, 0.05), transparent 100%)`,
                    }}
                />
            )}
        </AnimatePresence>

        {/* Calque de bruit propre à la carte pour lisser le halo et donner de la texture */}
        <div
            className="absolute inset-0 z-0 pointer-events-none opacity-10 mix-blend-overlay "
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.425' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                // Une tuile en pixels évite que le grain s'étire avec les dimensions de la carte.
                backgroundSize: "200px 200px",
                backgroundRepeat: "repeat"
            }}
        />

        {children}
    </UiCard>
}
