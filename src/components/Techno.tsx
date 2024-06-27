import classNames from "classnames";

export const Techno = ({image, experience, name, description, className}: {
    name: string
    description: string
    experience?: string
    image: any
    className?: string
    // displayMore?: boolean
}) => {

    return <div
        className={classNames("flex gap-2  rounded-xl", className, {
            " ": !experience,
            "flex-col p-4": experience
        })}>
        <div
            className={classNames(" flex items-center  justify-center rounded-lg bg-surface-container-high",
                {"h-10 w-10": !experience,},
                {"h-16 w-16": experience,}
            )}>
            <div dangerouslySetInnerHTML={{__html: image}} className={classNames({
                "h-5 w-5": !experience,
                "w-10 h-10": experience
            })}/>
        </div>
        <div className={"flex-1"}>
            <p className={classNames({
                "text-title-small": !experience,
                "text-title-medium mb-1 mt-2": experience
            })}>{name}</p>
            <p className={classNames("mb-2 text-on-surface-variant", {
                "text-body-small": !experience,
                "text-body-medium": experience
            })}>{description}</p>
            {/*<p className={classNames({*/}
            {/*    "text-body-small": !experience,*/}
            {/*    "text-body-medium": experience*/}
            {/*})}>{experience}</p>*/}
        </div>
    </div>
}