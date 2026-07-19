import {classNames, Fab} from "@udixio/ui-react";
import {Menu} from "@components/Menu.tsx";
import {motion} from "motion/react";
import {useEffect, useRef, useState} from "react";
import {iComment} from "@udixio/icons-outlined-400/comment";

export const Header = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(true);
    const [fabIsHovered, setFabIsHovered] = useState(false);
    const previousScrollPosition = useRef<number | null>(null);
    const hideMenuScrollPosition = useRef(0);
    const showMenuScrollPosition = useRef(0);
    const [scrollY, setScrollY] = useState<number>(0);
    const [fabVisible, setFabVisible] = useState(true);
    const [isCompactViewport, setIsCompactViewport] = useState(false);

    const onScroll = (currentScrollPosition: number) => {
        if (previousScrollPosition.current !== null) {
            if (currentScrollPosition > previousScrollPosition.current) {
                showMenuScrollPosition.current = currentScrollPosition - 75;
            }
            if (currentScrollPosition < previousScrollPosition.current) {
                hideMenuScrollPosition.current = currentScrollPosition + 200;
            }

            if (!isMenuVisible || currentScrollPosition === 0) {
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
        onScroll(scrollY);
    }, [scrollY]);

    useEffect(() => {
        const scroll = () => {
            const currentScrollPosition =
                window.scrollY || document.documentElement.scrollTop;
            setScrollY(currentScrollPosition);
        };

        scroll();
        const handleScroll = () => {
            if (previousScrollPosition.current == null) {
                previousScrollPosition.current = 0;
            }
            scroll();
        };
        window.addEventListener("scroll", handleScroll, {passive: true});
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 767px)");
        const updateViewport = () => setIsCompactViewport(mediaQuery.matches);

        updateViewport();
        mediaQuery.addEventListener("change", updateViewport);
        return () => mediaQuery.removeEventListener("change", updateViewport);
    }, []);

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5}}
        >
            <Menu setFabVisible={setFabVisible} fabVisible={fabVisible}/>
            <Fab
                onMouseEnter={() => setFabIsHovered(true)}
                onMouseLeave={() => setFabIsHovered(false)}
                title={"Contacter Joël VIGREUX"}
                icon={iComment}
                id={"button-contact"}
                href={"/contact"}
                label={"Contactez-moi"}
                className={classNames("!fixed bottom-8 right-8 z-50", {
                    "opacity-0": !fabVisible,
                })}
                variant={"primary"}
                extended={!isCompactViewport && (isMenuVisible || fabIsHovered)}
            ></Fab>
        </motion.div>
    );
};
