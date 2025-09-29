import {Card as UiCard} from "@udixio/ui-react"
import useMouse from "@react-hook/mouse-position";
import {useRef, useState} from "react";
import {AnimatePresence, motion} from "motion/react";
import {v4 as uuidv4} from "uuid";

export const Card = ({children, className, variant = "elevated"}) => {

    const ref = useRef<any>(null);
    const {x, y} = useMouse(ref, {
        enterDelay: 100,
        leaveDelay: 100,
    });


    const [uuid, setUuid] = useState(uuidv4())
    return <UiCard ref={ref} className={className + " bg-surface-container/80"} variant={variant}>
        <AnimatePresence>
            {(x != null && y != null) &&
                <motion.svg
                    initial={{width: 0, opacity: 1}}
                    animate={{width: "clamp(1000px, 200%, 9999px)", opacity: 1}}
                    transition={{duration: 0.5}}
                    exit={{width: 0, opacity: 0}}
                    layoutId={"card-svg"}
                    style={{
                        y,
                        x,
                        translateX: "-50%",
                        translateY: "-50%",
                    }}
                    className={"absolute -z-10 h-auto  text-surface-variant top-0 left-0 pointer-events-none"}
                    xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"

                >
                    <radialGradient id={"grad-" + uuid} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop
                            offset="0%"
                            style={{
                                stopColor: "currentColor",
                                stopOpacity: 1,
                                transition: "1s"
                            }}
                        />

                        <stop
                            offset="100%"
                            className={" text-surface-container-highest/70"}
                            style={{
                                stopColor: "currentColor",
                                stopOpacity: 0,
                                transition: "1s"
                            }}
                        />
                    </radialGradient>
                    <circle cx="128" cy="128" r="128" fill={`url(#${"grad-" + uuid})`}/>
                </motion.svg>}
        </AnimatePresence>

        {children}
    </UiCard>
}