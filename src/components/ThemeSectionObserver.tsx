import { useEffect } from "react";
import { resetTheme, updateTheme } from "@components/ThemeProvider";

const THEME_PREFIX = "theme-";
const THEME_READING_POSITION = 0.4;

const getThemeName = (element: Element): string | undefined =>
    Array.from(element.classList)
        .find((className) => className.startsWith(THEME_PREFIX))
        ?.slice(THEME_PREFIX.length);

const getThemeAtReadingPosition = (): string | undefined => {
    const x = window.innerWidth / 2;
    const y = window.innerHeight * THEME_READING_POSITION;

    for (const element of document.elementsFromPoint(x, y)) {
        const themedElement = element.closest<HTMLElement>("[class*='theme-']");
        if (!themedElement) continue;

        const themeName = getThemeName(themedElement);
        if (themeName) return themeName;
    }
};

export const ThemeSectionObserver = () => {
    useEffect(() => {
        let animationFrame: number | undefined;

        const updateThemeFromPage = () => {
            animationFrame = undefined;
            const themeName = getThemeAtReadingPosition();
            if (themeName) updateTheme(themeName);
        };

        const scheduleUpdate = () => {
            if (animationFrame !== undefined) return;
            animationFrame = window.requestAnimationFrame(updateThemeFromPage);
        };

        const resetPageTheme = () => {
            if (animationFrame !== undefined) {
                window.cancelAnimationFrame(animationFrame);
                animationFrame = undefined;
            }
            resetTheme();
        };

        // Chaque page commence avec la palette par défaut, avant que sa première
        // section thémée ne prenne éventuellement le relais.
        resetPageTheme();
        scheduleUpdate();

        window.addEventListener("scroll", scheduleUpdate, { passive: true });
        window.addEventListener("resize", scheduleUpdate);
        document.addEventListener("astro:before-preparation", resetPageTheme);
        document.addEventListener("astro:page-load", scheduleUpdate);

        return () => {
            window.removeEventListener("scroll", scheduleUpdate);
            window.removeEventListener("resize", scheduleUpdate);
            document.removeEventListener("astro:before-preparation", resetPageTheme);
            document.removeEventListener("astro:page-load", scheduleUpdate);
            if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame);
        };
    }, []);

    return null;
};
