import classNames from "classnames";
import {Button} from "@udixio/ui";
import {faChevronRight} from "@fortawesome/pro-light-svg-icons";
import {useRef, useState} from "react";
import {TextGenerateEffect} from "@components/TextGenerateEffect.tsx";
import {AnimatePresence, motion} from "framer-motion";
// import WordFadeIn from "@components/WordFadeIn.tsx";

export const Techno = ({image, experience, name, description, className}: {
    name: string
    description: string
    experience?: string
    image: any
    className?: string
}) => {

    const technoRef = useRef(null);
    const [displayMore, setDisplayMore] = useState(false)

    const handleClick = (e) => {
        setDisplayMore(!displayMore)
    }

    return (
        <div
            onClick={!displayMore ? handleClick : undefined}
            ref={technoRef}
            className={classNames("flex min-h-full gap-2 group rounded-xl", className, {
                " ": !experience,
                "flex-col p-6 ": experience,
                "cursor-pointer": experience && !displayMore
            })}>
            {/*<RippleEffect triggerRef={!displayMore ? technoRef : null}/>*/}
            <div
                className={classNames(" flex items-center  justify-center rounded-lg ",
                    {"h-10 w-10 bg-surface-container-high": !experience,},
                    {"h-16 w-16 bg-secondary-container": experience,}
                )}>
                <div dangerouslySetInnerHTML={{__html: image}} className={classNames({
                    "h-5 w-5": !experience,
                    "w-10 h-10": experience
                })}/>
            </div>
            <div className={"flex-1 flex flex-col justify-between items-start"}>
                <div>
                    <p className={classNames({
                        "text-title-small": !experience,
                        "text-title-medium mb-1 mt-2": experience
                    })}>{name}</p>
                    {!displayMore && <p className={classNames("mb-2 text-on-surface-variant", {
                        "text-body-small": !experience,
                        "text-body-medium": experience
                    })}>{description}</p>}
                    {displayMore && experience && <p className={classNames({
                        "text-body-small": !experience,
                        "text-body-medium": experience
                    })}><TextGenerateEffect words={experience}/></p>}
                </div>
                <AnimatePresence>
                    {experience && !displayMore &&
                        <motion.div
                            initial={{opacity: 1, height: "auto"}}
                            exit={{opacity: 0, height: 0}}
                            transition={{duration: .2, height: {duration: 0}}}
                        >
                            <Button
                                className={"mt-2"}
                                label={"En savoir plus"}
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