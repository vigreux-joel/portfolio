export const Link = ({children, href, target}: { children: React.ReactNode, href: string, target?: string }) => {

    return <a
        className="text-secondary group rounded overflow-hidden relative focus-visible:text-primary hover:text-primary"
        href={href} target={target}>
       <span
           className={"underline-offset-4 underline "}>{children}</span>
    </a>
}