"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import classNames from "classnames";
import { Link } from "@components/Link.tsx";
import { BackgroundColor } from "@components/BackgroundColor.tsx";

const content: {
  text: React.ReactNode;
  media: React.ReactNode;
  theme?: string;
}[] = [
  {
    text: (
      <>
        <h3 className="text-headline-small text-primary">
          Conception visuelle moderne et fluide
        </h3>
        <p className="lg:mt-6 mt-2 text-body-large">
          Grâce aux guidelines de Material Design 3, je conçois des interfaces
          fluides et adaptées à tous les écrans, assurant une navigation
          optimale et une esthétique harmonieuse.
        </p>
      </>
    ),
    media: (
      <video className={"h-full w-full object-cover"} autoPlay loop muted>
        <source src="/video/output.mp4" type="video/mp4" />
        Sorry, your browser doesn't support embedded videos.
      </video>
    ),
    theme: "purple",
  },
  {
    text: (
      <>
        <h3 className="text-headline-small text-primary">
          Harmonisation des couleurs pour une identité visuelle forte
        </h3>
        <p className="lg:mt-6 mt-2 text-body-large">
          Personnalisez facilement vos applications avec des palettes de
          couleurs cohérentes et dynamiques, inspirées par Material Design pour
          optimiser la lisibilité et l'attrait visuel de votre site.
        </p>
      </>
    ),
    media: (
      <img
        className={"h-full w-full object-cover"}
        loading={"lazy"}
        src={"/images/material-theme.webp"}
      />
    ),
    theme: "blue",
  },
  {
    text: (
      <>
        <h3 className="text-headline-small text-primary">
          Dynamisez votre site avec des animations fluides
        </h3>
        <p className="lg:mt-6 mt-2 text-body-large">
          À l'aide de{" "}
          <Link href={"https://www.framer.com/motion/"} target={"_blank"}>
            Framer motion
          </Link>
          , je conçois des animations fluides et engageantes qui enrichissent
          l'expérience utilisateur et donnent vie à votre site.
        </p>
      </>
    ),
    media: (
      <div
        className={
          "bg-primary/80 w-full h-full flex items-center justify-center backdrop-blur"
        }
      >
        <div className={"h-32 w-32 p-6 bg-surface-variant rounded-2xl"}>
          <svg
            className={" "}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
          >
            <motion.path
              d="M0 100V0l50 50 50-50v100L75 75l-25 25-25-25z"
              variants={{
                hidden: {
                  pathLength: 0,
                  fill: "rgb(var(--colors-inverse-primary)/0)",
                },
                visible: {
                  pathLength: 1,
                  fill: "rgb(var(--colors-surface)/1)",
                },
              }}
              className="stroke-2 stroke-surface"
              initial="hidden"
              animate="visible"
              transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
            />
          </svg>
        </div>
      </div>
    ),
    theme: "green",
  },
];

export const StickyScroll = () => {
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const initialIsLg = window.innerWidth > 1024;
      setIsLg(initialIsLg);

      const handleResize = () => {
        setIsLg(window.innerWidth > 1024);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const [activeCard, setActiveCard] = React.useState<number | null>(null);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const cardLength = content.length;
  const [displayText, setDisplayText] = useState(false);
  const [isOverlay, setIsOverlay] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsOverlay(latest > 0 && latest < 1);
    if (!isLg) return;
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    let closestBreakpointIndex = 0;
    for (let i = 0; i < cardsBreakpoints.length; i += 1) {
      if (cardsBreakpoints[i] > latest) {
        break;
      }
      window.screenX;
      closestBreakpointIndex = i;
    }
    setDisplayText(latest > 0);
    setActiveCard(closestBreakpointIndex);
    const themeChangeEvent = new CustomEvent("themeChange", {
      detail: "theme-" + content[closestBreakpointIndex].theme,
    });
    window.dispatchEvent(themeChangeEvent);
  });

  return (
    <>
      <AnimatePresence>
        {isOverlay && (
          <motion.div
            initial={"hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            animate={"visible"}
            transition={{ duration: 1 }}
            exit={"hidden"}
            className={
              "fixed h-screen w-screen bg-surface top-0  z-10 left-0 " +
              (activeCard != null ? "theme-" + content[activeCard!]?.theme : "")
            }
          >
            {isLg && <BackgroundColor />}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={
          "flex relative padding-x rounded-md z-20 " +
          (activeCard != null ? "theme-" + content[activeCard!]?.theme : "")
        }
        ref={ref}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, marginLeft: "-400px", filter: "blur(10px)" },
            visible: { opacity: 1, marginLeft: "0%", filter: "blur(0px)" },
          }}
          initial={isLg ? "hidden" : "visible"}
          transition={{
            duration: 0.75,
            ease: [0.1, 0.25, 0.3, 1],
          }}
          animate={displayText || !isLg ? "visible" : "hidden"}
          layout
          className={
            "div mask-inverse left lg:w-[400px] w-full relative flex flex-col lg:gap-32 gap-16 "
          }
        >
          {content.map((item, index) => (
            <div
              className={
                "max-w-lg lg:max-w-full " + (index == 1 ? "self-end" : "")
              }
            >
              {!isLg && (
                <div className={classNames("rounded-2xl mb-4 overflow-hidden")}>
                  {item.media}
                </div>
              )}
              <motion.div
                key={index}
                variants={{
                  hidden: {
                    opacity: 0,
                    x: "-400px",
                    filter: "blur(10px)",
                    transition: { x: { delay: 1 }, filter: { delay: 1 } },
                  },
                  visible: { opacity: 1, x: "0%", filter: "blur(0px)" },
                }}
                initial={isLg ? "hidden" : "visible"}
                transition={{
                  duration: 0.4,
                  ease: [0.1, 0.2, 0.4, 1],
                }}
                animate={activeCard == index || !isLg ? "visible" : "hidden"}
                className={"lg:my-40 "}
              >
                {item.text}
              </motion.div>
            </div>
          ))}
        </motion.div>

        {isLg && (
          <motion.div
            layout
            variants={{
              hidden: { x: "0%" },
              visible: { x: "0%", marginLeft: "4rem" },
            }}
            initial="hidden"
            animate={displayText ? "visible" : "hidden"}
            className={classNames(
              "right hidden lg:flex flex-2 items-start rounded-md",
            )}
            transition={{
              duration: 0.75,
              ease: [0.1, 0.25, 0.3, 1],
            }}
          >
            <motion.div
              layout
              layoutRoot
              style={{
                top: "calc(50% - " + 500 / 2 + "px)",
                minWidth: "100%",
              }}
              variants={{
                hidden: { height: "auto" },
                visible: { height: 500 },
              }}
              initial="hidden"
              animate={displayText ? "visible" : "hidden"}
              className={"rounded-2xl sticky overflow-hidden"}
              transition={{
                duration: 0.75,
                // ease: [0.1, 0.25, 0.3, 1]
              }}
            >
              {content.map((card, index) => {
                return (
                  <motion.div
                    layout
                    variants={{
                      hidden: {
                        opacity: "0",
                        visibility: "hidden",
                        transitionEnd: {
                          display: "none",
                        },
                      },
                      visible: {
                        opacity: "1",
                        visibility: "visible",
                        transitionEnd: {
                          display: "block",
                        },
                      },
                    }}
                    className={classNames("w-full h-full", {
                      "!block":
                        index == activeCard ||
                        (activeCard == null && index == 0),
                    })}
                    initial="hidden"
                    animate={
                      index == activeCard || (activeCard == null && index == 0)
                        ? "visible"
                        : "hidden"
                    }
                    transition={{ duration: 0 }}
                  >
                    {card.media}
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};
