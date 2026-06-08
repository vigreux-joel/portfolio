import {Button, classNames, Tab, Tabs} from "@udixio/ui-react";
import React, {useEffect, useRef, useState} from "react";
import {themeService} from "@/stores/themeStore.ts";

const MENU_ITEMS = [
    { label: "Accueil", href: "/" },
    { label: "Projets", href: "/projets" },
    { label: "Expertise", href: "/expertise" },
];

export const Menu = ({
                         setFabVisible,
                         fabVisible,
                     }: {
    fabVisible: boolean;
    setFabVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [themeEls, setThemeEls] = useState<Element[]>([]);
    const [activeTab, setActiveTab] = useState<number | null>(null);
    const [isContactActive, setIsContactActive] = useState(false);
    const observers = useRef<IntersectionObserver[]>([]);
    const isScrolling = useRef(false);

    useEffect(() => {
        const themeEls = Array.from(document.querySelectorAll(
            ":is([class^='theme-'], [class*=' theme-']):not(.theme-undefined, .not-detect-theme )"
        ));
        setThemeEls(themeEls);
        
        // Determiner l'onglet actif selon l'URL
        const path = window.location.pathname;
        const index = MENU_ITEMS.findIndex(item => {
            if (item.href === "/") return path === "/";
            return path.startsWith(item.href);
        });
        setActiveTab(index >= 0 ? index : null);
        setIsContactActive(path.startsWith("/contact"));
        
        // Le FAB (contact button en bas) doit se cacher si on est sur la page contact
        setFabVisible(!path.startsWith("/contact"));
    }, [setFabVisible]);


    const previousThemeEl = useRef<{ el: Element, index: number } | null>(null);
    const currentThemeEl = useRef<{ el: Element, index: number } | null>(null);
    
    useEffect(() => {
        if (themeEls.length == 0) return;

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

        // Initialize Intersection Observers for themes
        const initObservers = () => {
            observers.current = [
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
                "fixed max-w-full flex transition-opacity left-1/2 duration-300 ease-in-out top-8 z-50 mx-2 backdrop-blur-lg -translate-x-1/2 overflow-hidden rounded-full border border-surface-container-highest bg-surface-container-low/80"
            )}
        >
            <Tabs
                scrollable
                selectedTab={activeTab !== null ? activeTab : (isContactActive ? MENU_ITEMS.length : null)}
                setSelectedTab={() => {}}
                className={"max-w-3xl border-none bg-transparent md:overflow-hidden"}
                variant={"secondary"}
            >
                {MENU_ITEMS.map((item, index) => (
                    <Tab
                        key={index}
                        className={" md:h-full whitespace-nowrap"}
                        selected={index === activeTab}
                        href={item.href}
                        label={item.label}
                    />
                ))}
            </Tabs>
            <Button
                href={"/contact"}
                className={classNames("m-2 hidden md:block", {
                    "ring-2 ring-primary": isContactActive
                })}
                label={"Contact"}
                allowShapeTransformation={false}
            />
        </div>
    );
};
