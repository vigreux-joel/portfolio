import classNames from "classnames";
import {Button} from "@udixio/ui";
import {faChevronRight} from "@fortawesome/pro-light-svg-icons";
import {useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
// import WordFadeIn from "@components/WordFadeIn.tsx";

export type TechnoProps = {
    name: string
    description: string
    image?: any
    className?: string
    children?: any
    variant?: "primary" | "secondary"
    buttonLabel?: string
}

export const Techno = ({
                           children,
                           image,
                           name,
                           description,
                           className,
                           variant = "secondary",
                           buttonLabel = "Voir mon experience",
                           ...rest
                       }: TechnoProps) => {

    const technoRef = useRef(null);
    const [displayMore, setDisplayMore] = useState(false)

    const handleClick = (e) => {
        setDisplayMore(!displayMore)
    }

    return (
        <div
            onClick={(children) ? handleClick : undefined}
            ref={technoRef}
            className={classNames("flex gap-4 min-h-full group rounded-xl", className, {
                " ": variant == "secondary",
                "flex-col": variant == "primary",
                "cursor-pointer": (children) && !displayMore
            })}
            {...rest}
        >
            {/*<RippleEffect triggerRef={!displayMore ? technoRef : null}/>*/}
            {image && <div
                className={classNames("transition-all duration-300 flex items-center  justify-center rounded-lg ",
                    {"bg-surface-container-high": !((children) && (!displayMore)),},
                    {"bg-secondary-container group-hover:bg-surface-container-highest": (children) && (!displayMore),},
                    {"h-14 w-14 ": variant == "secondary",},
                    {"h-16 w-16": variant == "primary",}
                )}>
                <div dangerouslySetInnerHTML={{__html: image}} className={classNames({
                    "h-6 w-6 fill-on-surface-variant": variant == "secondary",
                    "w-10 h-10 fill-on-secondary-container": variant == "primary"
                })}/>
            </div>}
            <div className={"flex-1 flex flex-col justify-between items-start"}>
                <div>
                    <p className={classNames({
                        "text-title-small": variant == "secondary",
                        "text-title-medium mb-2 mt-4": variant == "primary"
                    })}>{name}</p>

                    <div className={"relative"}>
                        <p className={classNames("transition-all duration-300 delay-200 text-on-surface-variant max-w-prose", {
                            "text-body-small": variant == "secondary",
                            "text-body-medium": variant == "primary",
                        })}>{description}</p>
                    </div>


                    {children && displayMore && <motion.div animate={{opacity: 1, height: "auto"}}
                                                            initial={{opacity: 0, height: 0}}
                                                            transition={{
                                                                duration: .4,
                                                                delay: .3,
                                                                height: {duration: 0}
                                                            }} className={"mt-8"}>
                        {children}
                    </motion.div>}
                </div>


                <AnimatePresence>
                    {(children) && !displayMore &&
                        <motion.div
                            initial={{opacity: 1, height: "auto"}}
                            exit={{opacity: 0, height: 0}}
                            transition={{duration: .2, height: {duration: 0}}}
                        >
                            <Button
                                className={"mt-2"}
                                label={buttonLabel}
                                iconPosition={"right"}
                                icon={faChevronRight}
                                variant={"text"}
                            />
                        </motion.div>
                    }
                </AnimatePresence>


            </div>
        </div>)
}