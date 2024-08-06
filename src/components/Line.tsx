import {Icon} from "@udixio/ui";
import {type IconDefinition} from "@fortawesome/pro-light-svg-icons";
import classNames from "classnames";
import {useRef, useState} from "react";
import {useMotionValueEvent, useScroll} from "framer-motion";

export const Line = ({nextTheme, icon, isFirst, isLast, visible}: {
    nextTheme?: string
    icon?: IconDefinition
    isFirst: boolean
    isLast: boolean
    visible?: boolean
}) => {

    const ref = useRef(null)
    const {scrollYProgress} = useScroll({
        target: ref,
        offset: ["start 90%", "end start"]
    })

    const [isVisibleLine, setIsVisibleLine] = useState(visible)
    const [isVisibleIcon, setIsVisibleIcon] = useState(visible)
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        setIsVisibleIcon(latest > 0)
        setIsVisibleLine(icon ? latest > 0.25 : latest > 0)
    })

    return (
        <div ref={ref}
             className={"h-full ml-8 md:ml-12 flex flex-col items-center " + (isFirst || !icon ? '' : 'gap-8')}>
            <div className={classNames("relative w-6 flex  transition-all duration-500", {
                "scale-50 opacity-50": isFirst,
                "opacity-100": isVisibleIcon,
                "opacity-0": !isVisibleIcon,
            })}>
                <Icon className={"h-6 w-full relative z-10  "} icon={icon}/>
                <div
                    className={"bg-primary blur-lg rounded-full h-full w-full absolute top-0 left-0 scale-125 " + (isFirst ? 'hidden' : '')}></div>
            </div>
            <div className={'w-[3px] h-full'}>
                <div
                    style={{
                        height: isVisibleLine ? "100%" : 0,
                    }}
                    className={"h-full transition-all duration-500 delay-300 relative rounded-full overflow-hidden"}>
                    <div className={classNames("w-full h-full absolute", {
                        'bg-primary': !isFirst && icon && !isLast
                    })}>

                    </div>
                    <div
                        className={
                            classNames("w-full h-full theme-" + nextTheme + " bg-gradient-to-b absolute",
                                {
                                    "from-primary to-transparent": isLast,
                                    "from-transparent to-primary": !isLast
                                }
                            )}>
                    </div>
                </div>

            </div>
        </div>
    )
}