import {Card as UiCard, classNames} from "@udixio/ui-react"
import useMouse from "@react-hook/mouse-position";
import {useRef, useState} from "react";
import {AnimatePresence, motion} from "motion/react";
import {v4 as uuidv4} from "uuid";

export const Card = ({children, className, variant = "elevated", ...restProps}) => {

    const ref = useRef<any>(null);
    const {x, y} = useMouse(ref, {
        enterDelay: 100,
        leaveDelay: 100,
    });


    const [uuid, setUuid] = useState(uuidv4())
    return <UiCard ref={ref}
                   style={{ cornerShape: "superellipse(2)" }}
                    className={classNames(
        "rounded-[1.5rem] bg-surface-container-high/50 bg-radial-[at_90%_90%]" ,
          " from-secondary-container/20 to-transparent backdrop-blur-xl overflow-clip",
          "group",
        className,
      )} variant={variant} {...restProps}>

        {/* Bordure lumineuse qui suit la souris (Spotlight Border) */}
        <AnimatePresence>
            {(x != null && y != null) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-0 pointer-events-none rounded-[inherit]"
                    style={{
                        padding: "1px", // Épaisseur fine pour la bordure
                        background: `radial-gradient(300px circle at ${x}px ${y}px, var(--color-primary), transparent 100%) border-box`,
                        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude"
                    }}
                />
            )}
        </AnimatePresence>

        {/* Halo lumineux intérieur très doux et sans banding */}
        <AnimatePresence>
            {(x != null && y != null) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 z-0 pointer-events-none rounded-[inherit]"
                    style={{
                        // Utilisation d'un dégradé CSS (bien plus lisse que le SVG étiré)
                        background: `radial-gradient(500px circle at ${x}px ${y}px, rgba(255, 255, 255, 0.05), transparent 100%)`,
                    }}
                />
            )}
        </AnimatePresence>

        {/* Calque de bruit propre à la carte pour lisser le halo et donner de la texture */}
        <div
            className="absolute inset-0 z-0 pointer-events-none opacity-10 mix-blend-overlay rounded-[inherit]"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            }}
        />

        {children}
    </UiCard>
}