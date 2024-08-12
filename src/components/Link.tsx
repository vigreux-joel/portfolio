export const Link = ({
  children,
  href,
  target,
  className,
}: {
  children: React.ReactNode;
  href: string;
  target?: string;
  className?: string;
}) => {
  return (
    <a
      className={
        "text-secondary group rounded overflow-hidden relative focus-visible:text-primary hover:text-primary underline-offset-4 underline !text-bold" +
        className
      }
      href={href}
      target={target}
    >
      {children}
    </a>
  );
};
