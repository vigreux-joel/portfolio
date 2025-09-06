import {Card as UiCard} from "@udixio/ui-react"

export const Card = ({children, className, variant = "elevated"}) => {

    return <UiCard className={className + " bg-surface-container-highest/70"} variant={variant}>{children}</UiCard>
}