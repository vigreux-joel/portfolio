import {classNames} from "@udixio/ui-react";

export const LinearGradient = ({nextTheme, className =''}: {
    nextTheme: string
className?: string
}) => {

    return (
        <div
            className={classNames("w-screen -z-20 h-64 pointer-events-none absolute bottom-0 bg-gradient-to-b left-0 from-transparent to-surface",`theme-${nextTheme}`, className) }>
        </div>
    )
}