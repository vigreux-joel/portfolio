import classNames from "classnames";

export const Techno = ({children, name, description, className, displayMore}: {
    name: string
    description: string
    children: React.ReactNode
    className?: string
    displayMore?: boolean
}) => {

    return <div
        className={classNames("flex gap-2 p-3 state-on-secondary-container rounded-xl", className, {
            "items-center ": !displayMore,
            "flex-col ": displayMore
        })}>
        <div
            className={classNames(" flex items-center  justify-center rounded-lg bg-surface-container-high",
                {"h-10 w-10": !displayMore,},
                {"h-12 w-12": displayMore,}
            )}>
            <div className={classNames({
                "h-5 w-5": !displayMore,
                "w-6 h-6": displayMore
            })}>
                {children}
            </div>
        </div>
        <div>
            <p className={classNames({
                "text-title-small": !displayMore,
                "text-title-medium mb-1 mt-2": displayMore
            })}>{name}</p>
            <p className={classNames({
                "text-body-small": !displayMore,
                "text-body-medium": displayMore
            })}>{description}</p>
        </div>
    </div>
}