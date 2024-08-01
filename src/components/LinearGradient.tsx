export const LinearGradient = ({nextTheme}: {
    nextTheme: string
}) => {

    return (
        <div
            className={`w-screen -z-10 h-32 absolute bottom-0 bg-gradient-to-b left-0 from-transparent to-surface theme-${nextTheme}`}>
        </div>
    )
}