import { faCommentSmile } from "@fortawesome/pro-light-svg-icons";
import { Fab } from "@udixio/ui";
import { useEffect, useRef, useState } from "react";
import { Menu } from "@components/Menu.tsx";
import classNames from "classnames";
import { motion } from "framer-motion";

export const Header = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [fabIsHovered, setFabIsHovered] = useState(false);
  const previousScrollPosition = useRef<number | null>(null);
  const hideMenuScrollPosition = useRef(0);
  const showMenuScrollPosition = useRef(0);
  const [scrollY, setScrollY] = useState<number>(0);
  const [theme, setTheme] = useState<string>("theme-blue");

  const [fabVisible, setFabVisible] = useState(true);

  const onScroll = (currentScrollPosition: number) => {
    if (previousScrollPosition.current !== null) {
      if (currentScrollPosition > previousScrollPosition.current) {
        showMenuScrollPosition.current = currentScrollPosition - 75;
      }
      if (currentScrollPosition < previousScrollPosition.current) {
        hideMenuScrollPosition.current = currentScrollPosition + 200;
      }

      if (!isMenuVisible || currentScrollPosition == 0) {
        if (currentScrollPosition <= showMenuScrollPosition.current) {
          setIsMenuVisible(true);
        }
      } else {
        if (currentScrollPosition >= hideMenuScrollPosition.current) {
          setIsMenuVisible(false);
        }
      }
      previousScrollPosition.current = currentScrollPosition;
    }
  };

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail);
    };

    window.addEventListener("themeChange", handleThemeChange);
    return () => {
      window.removeEventListener("themeChange", handleThemeChange);
    };
  }, []);

  useEffect(() => {
    onScroll(scrollY);
  }, [scrollY]);
  useEffect(() => {
    const scroll = () => {
      const currentScrollPosition =
        window.scrollY || document.documentElement.scrollTop;
      setScrollY(currentScrollPosition);
    };
    scroll();
    window.addEventListener("scroll", () => {
      if (previousScrollPosition.current == null) {
        previousScrollPosition.current = 0;
      }
      scroll();
    });
    return () => {
      window.removeEventListener("scroll", scroll);
    };
  });
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={theme}
    >
      <Menu setFabVisible={setFabVisible} fabVisible={fabVisible} />
      <Fab
        onMouseEnter={() => setFabIsHovered(true)}
        onMouseLeave={() => setFabIsHovered(false)}
        title={"Contacter Joël VIGREUX"}
        icon={faCommentSmile}
        id={"button-contact"}
        href={"#contact"}
        label={"Contacter moi"}
        className={classNames("!fixed bottom-8 right-8 z-50", {
          "opacity-0": !fabVisible,
        })}
        variant={"primary"}
        isExtended={isMenuVisible || fabIsHovered}
      ></Fab>
    </motion.div>
  );
};
