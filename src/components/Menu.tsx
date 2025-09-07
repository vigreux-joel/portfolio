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
    const [ids, setIds] = useState<string[]>([]); // Initial ids array is set to empty

    const [activeTab, setActiveTab] = useState<number | null>(1);
    const observers = useRef<IntersectionObserver[]>([]);

    const isScrolling = useRef(false);

    useEffect(() => {
        const features = Array.from(document.querySelectorAll(".tab-menu"));
        const featureIds = features.map((feature) => feature.id).filter(String);
        setIds(featureIds);
    }, []);


    const previousEl = useRef<{ el: Element, index: number } | null>(null);
    const currentEl = useRef<{ el: Element, index: number } | null>(null);
    useEffect(() => {
        if (!ids) return;

        const setCurrent = (current: { el: Element, index: number }) => {

            if (currentEl.current) {
                previousEl.current = currentEl.current;
            }
            currentEl.current = current;

            const classes = current.el.className.split(" ");
            const themeClass =
                classes.find((cls) => cls.startsWith("theme-")) ?? "blue";

            themeService.updateTheme(themeClass.replace("theme-", ""));

            if (current.index == ids.length - 1) {
                setActiveTab(null);
                setFabVisible(false);
                themeService.updateTheme("purple");
                return
            }

            setActiveTab(current.index);
            setFabVisible(true);
        }

        // Initialize Intersection Observers for each feature
        const initObservers = () => {
            observers.current = ids.map((id, index) => {
                const el = document.getElementById(id)!;
                const observer = new IntersectionObserver(
                    ([entry]) => {
                        if (entry.isIntersecting && !isScrolling.current) {
                            setCurrent({el, index});
                        } else if (!isScrolling.current && entry.target == currentEl.current?.el && previousEl.current) {
                            setCurrent(previousEl.current);
                        }
                    }, {
                        root: null, // null = viewport
                        threshold: 0, // déclenche dès qu'il y a intersection
                        rootMargin: "-20% 0px"
                    }
                );
                observer.observe(el);
                return observer;
            });
        };

        // Clean up observers on unmount
        const cleanUpObservers = () => {
            observers.current.forEach((ob) => ob.disconnect());
        };

        initObservers();

        return cleanUpObservers;
    }, [ids]);

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
                {ids.map((id, index) => {
                    if (index == ids.length - 1) {
                        return null
                    }

                    return (

                        <Tab
                            className={"bg-transparent md:h-full"}
                            selected={index === activeTab}
                            href={`#${id}`}
                            label={formatLabel(id)}
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
