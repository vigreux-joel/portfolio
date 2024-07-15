export const Link = ({children, href, target}: { children: React.ReactNode, href: string, target?: string }) => {

    return <a
        className="text-secondary group rounded overflow-hidden relative"
        href={href} target={target}>
       <span
           className={"underline-offset-4 group-hover:no-underline group-focus-visible:no-underline underline "}>{children}</span>
    </a>
}