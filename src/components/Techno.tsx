import classNames from "classnames";
import { Icon } from "@udixio/ui";
import { type IconDefinition } from "@fortawesome/pro-light-svg-icons";
import { useRef } from "react";

export type TechnoProps = {
  name: string;
  image?: any;
  icon?: IconDefinition;
  className?: string;
  children?: any;
  variant?: "primary" | "secondary";
  buttonLabel?: string;
};

export const Techno = ({
  children,
  image,
  name,
  className,
  variant = "secondary",
  buttonLabel = "Voir mon experience",
  icon,
  ...rest
}: TechnoProps) => {
  const technoRef = useRef(null);

  return (
    <div
      ref={technoRef}
      className={classNames("flex gap-4 group rounded-xl", className, {
        " ": variant == "secondary",
        "flex-col": variant == "primary",
      })}
      {...rest}
    >
      {(image || icon) && (
        <div
          className={classNames(
            "transition-all duration-300 flex items-center  justify-center rounded-lg ",
            { "h-14 w-14  bg-surface-container-high": variant == "secondary" },
            { "h-16 w-16 bg-secondary-container": variant == "primary" },
          )}
        >
          {image && (
            <div
              dangerouslySetInnerHTML={{ __html: image }}
              className={classNames({
                "h-6 w-6 fill-on-surface-variant": variant == "secondary",
                "w-10 h-10 fill-on-secondary-container": variant == "primary",
              })}
            />
          )}
          {icon && (
            <Icon
              className={classNames({
                "h-6 w-6 fill-on-surface-variant": variant == "secondary",
                "w-10 h-10 fill-on-secondary-container": variant == "primary",
              })}
              icon={icon}
            />
          )}
        </div>
      )}
      <div className={"flex-1 flex flex-col justify-between items-start"}>
        <div>
          <p
            className={classNames({
              "text-title-small": variant == "secondary",
              "text-title-medium mb-4 mt-2": variant == "primary",
            })}
          >
            {name}
          </p>
          <div className={"relative"}>
            <div
              className={classNames(
                "transition-all duration-300 delay-200 text-on-surface-variant max-w-prose",
                {
                  "text-body-small": variant == "secondary",
                  "text-body-medium": variant == "primary",
                },
              )}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
