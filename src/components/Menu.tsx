import {Button, classNames, Tab, Tabs} from "@udixio/ui-react";
import React, {useEffect, useState} from "react";

const MENU_ITEMS = [
    { label: "Accueil", href: "/" },
    { label: "Projets", href: "/#projets" },
    { label: "Expertise", href: "/expertise" },
    { label: "Méthode", href: "/methode" },
];

export const Menu = ({
                         setFabVisible,
                     }: {
    fabVisible: boolean;
    setFabVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [activeTab, setActiveTab] = useState<number | null>(null);
    const [isContactActive, setIsContactActive] = useState(false);

    useEffect(() => {
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
