import {Button, classNames, Tab, Tabs} from "@udixio/ui-react";
import React, {useEffect, useRef, useState} from "react";
import {themeService} from "@/stores/themeStore.ts";


function formatLabel(id) {
    return id
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export const Menu = ({
                         setFabVisible,
                         fabVisible,
                     }: {
    fabVisible: boolean;
    setFabVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [menuEls, setMenuEls] = useState<Element[]>([]); // Initial ids array is set to empty
    const [themeEls, setThemeEls] = useState<Element[]>([]); // Initial ids array is set to empty

    const [activeTab, setActiveTab] = useState<number | null>(1);
    const observers = useRef<IntersectionObserver[]>([]);

    const isScrolling = useRef(false);

    useEffect(() => {
        const menuEls = Array.from(document.querySelectorAll(".tab-menu"));
        const themeEls = Array.from(document.querySelectorAll(
            ":is([class^='theme-'], [class*=' theme-']):not(.theme-undefined, .not-detect-theme )"
        ));
        setMenuEls(menuEls);
        setThemeEls(themeEls);
    }, []);


    const previousMenuEl = useRef<{ el: Element, index: number } | null>(null);
    const currentMenuEl = useRef<{ el: Element, index: number } | null>(null);
    const previousThemeEl = useRef<{ el: Element, index: number } | null>(null);
    const currentThemeEl = useRef<{ el: Element, index: number } | null>(null);
    useEffect(() => {
        if (themeEls.length == 0) return;

        const setCurrentMenu = (current: { el: Element, index: number }) => {

            if (currentMenuEl.current) {
                previousMenuEl.current = currentMenuEl.current;
            }
            currentMenuEl.current = current;

            if (current.index == themeEls.length - 1) {
                setActiveTab(null);
                setFabVisible(false);
                return
            }

            setActiveTab(current.index);
            setFabVisible(true);
        }
        const setCurrentTheme = (current: { el: Element, index: number }) => {
            if (currentThemeEl.current) {
                previousThemeEl.current = currentThemeEl.current;
            }
            currentThemeEl.current = current;

            const classes = current.el.className.split(" ");
            const themeClass =
                classes.find((cls) => cls.startsWith("theme-")) ?? "blue";

            themeService.updateTheme(themeClass.replace("theme-", ""));

            if (current.index == themeEls.length - 1) {
                themeService.updateTheme("purple");
                return
            }
        }

        // Initialize Intersection Observers for each feature
        const initObservers = () => {

            observers.current = [
                ...menuEls.map((el, index) => {
                    const observer = new IntersectionObserver(
                        ([entry]) => {
                            if (entry.isIntersecting && !isScrolling.current) {
                                setCurrentMenu({el, index});
                            } else if (!isScrolling.current && entry.target == currentMenuEl.current?.el && previousMenuEl.current) {
                                setCurrentMenu(previousMenuEl.current);
                            }

                        }, {
                            root: null, // null = viewport
                            threshold: 0, // déclenche dès qu'il y a intersection
                            rootMargin: "-20% 0px"
                        }
                    );
                    observer.observe(el);
                    return observer;
                }),
                ...themeEls.map((el, index) => {
                    const observer = new IntersectionObserver(
                        ([entry]) => {
                            if (entry.isIntersecting && !isScrolling.current) {
                                setCurrentTheme({el, index});
                            } else if (!isScrolling.current && entry.target == currentThemeEl.current?.el && previousThemeEl.current) {
                                setCurrentTheme(previousThemeEl.current);
                            }

                        }, {
                            root: null, // null = viewport
                            threshold: 0, // déclenche dès qu'il y a intersection
                            rootMargin: "-10% 0px"
                        }
                    );
                    observer.observe(el);
                    return observer;
                })
            ];
        };

        // Clean up observers on unmount
        const cleanUpObservers = () => {
            observers.current.forEach((ob) => ob.disconnect());
        };

        initObservers();

        return cleanUpObservers;
    }, [themeEls]);

    useEffect(() => {
        const handleHashChange = () => {
            isScrolling.current = true;

            setTimeout(() => {
                isScrolling.current = false;
            }, 750);
        };

        window.addEventListener("popstate", handleHashChange, false);
        return () => {
            window.removeEventListener("popstate", handleHashChange);
        };
    }, []);

    return (
        <div
            className={classNames(
                "fixed max-w-full flex transition-opacity left-1/2 duration-300 ease-in-out top-8 z-50 mx-2 backdrop-blur-lg -translate-x-1/2 overflow-hidden rounded-full border border-surface-container-highest bg-surface-container-low/80",
                {"opacity-0": activeTab === null},
            )}
        >
            <Tabs
                scrollable
                selectedTab={activeTab}
                setSelectedTab={setActiveTab}
                className={"max-w-3xl  border-none  md:overflow-hidden"}
                variant={"secondary"}
            >
                {menuEls.map((el, index) => {
                    if (index == themeEls.length - 1) {
                        return null
                    }
                    return (

                        <Tab
                            key={index}
                            className={"bg-transparent md:h-full"}
                            selected={index === activeTab}
                            href={`#${el.id}`}
                            label={formatLabel(el.id)}
                            // key={id}
                        ></Tab>

                    );

                })}
            </Tabs>
            <Button
                href={"#contact"}
                className={"m-2 hidden md:block"}
                label={"Contact"}
                allowShapeTransformation={false}
            />
        </div>
    );
};
