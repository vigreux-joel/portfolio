import {classNames, Icon} from "@udixio/ui-react";
import {useRef, useState} from "react";
import {motion, useMotionValueEvent, useScroll, useTransform} from "motion/react";

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
    
    // Pattern flexible et mature : on traque la progression de ce composant spécifique dans le viewport
    // 'start center' : démarre quand le HAUT du block (et donc du contenu adjacent) atteint le MILIEU de l'écran
    // 'end center' : finit quand le BAS du block (et du contenu adjacent) atteint le MILIEU de l'écran
    const {scrollYProgress} = useScroll({
        target: ref,
        offset: ["start center", "end center"],
    });

    // La hauteur de la ligne suit PUREMENT la progression du scroll
    const heightProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    // Le déclenchement de l'icone
    const [isVisibleIcon, setIsVisibleIcon] = useState(visible);
    
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (!visible) {
            // L'icone apparait dès que la ligne commence à se dessiner
            setIsVisibleIcon(latest > 0);
        }
    });

    return (
        <div
            ref={ref}
            className={
                "h-full ml-4 md:ml-12 flex flex-col items-center " +
                (isFirst || !icon ? "" : "gap-8")
            }
        >
            <div
                className={classNames(
                    "relative w-6 flex transition-all duration-500",
                    {
                        "scale-50 opacity-50": isFirst,
                        "opacity-100": isVisibleIcon || visible,
                        "opacity-0": !isVisibleIcon && !visible,
                    },
                )}
            >
                {icon && <Icon className={"h-6 w-full relative z-10"} icon={icon}/>}
                <div
                    className={
                        "bg-primary blur-lg rounded-full h-full w-full absolute top-0 left-0 scale-125 " +
                        (isFirst ? "hidden" : "")
                    }
                ></div>
            </div>
            <div className={"w-[3px] h-full"}>
                {/* On remplace la div par motion.div pour avoir une animation fluide à 60fps liée au scroll */}
                <motion.div
                    style={{
                        height: visible ? "100%" : heightProgress,
                    }}
                    className={
                        "relative rounded-full overflow-hidden w-full"
                    }
                >
                    <div
                        className={classNames("not-detect-theme w-full h-full absolute", {
                            "bg-primary": !isFirst && icon && !isLast,
                        })}
                    ></div>
                    <div
                        className={classNames(
                            "not-detect-theme w-full h-full theme-" + nextTheme + " bg-gradient-to-b absolute",
                            {
                                "from-primary to-transparent": isLast,
                                "from-transparent to-primary": !isLast,
                            },
                        )}
                    ></div>
                </motion.div>
            </div>
        </div>
    );
};
