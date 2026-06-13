import {currentSourceHexStore, themeStore} from "@/stores/themeStore";
import {useStore} from "@nanostores/react";
import {useReducer} from "react";
import {ThemeProvider as Theme} from "@udixio/ui-react";
import {argbFromHex} from "@material/material-color-utilities";
import {sourceColor, subThemes} from "../../theme.config.ts";
import {Hct} from "@udixio/theme";
import {TailwindPlugin} from "@udixio/tailwind";

export const updateTheme = (colorName?: keyof typeof subThemes) => {
    if (colorName === undefined) return;
    
    
    const hex: string = subThemes[colorName];

    if (hex === null) {
        themeStore.set({
            ...themeStore.get(),
            sourceColor: null,
        });
        currentSourceHexStore.set(undefined);
        return;
    }

    const newHct = Hct.fromInt(argbFromHex(hex));

    const currentHex = currentSourceHexStore.get();

    if (currentHex === hex) return;

    themeStore.set({
        ...themeStore.get(),
        sourceColor: Hct.from(newHct.hue, sourceColor.chroma, sourceColor.tone),
    });
};

export const ThemeProvider = () => {


    const $themeConfig = useStore(themeStore);
    const [renderKey, remount] = useReducer((x) => x + 1, 0);

    if ($themeConfig.sourceColor == null) return null;

    return (
        <>
            <Theme
                key={renderKey}
                onLoad={(api) => {
                    const tailwind = api.plugins.getPlugin(TailwindPlugin);
                    // En dev, l'instance du plugin est mise en cache par Node et conserve
                    // ses subThemes : le CSS .dynamic .theme-* a déjà été généré pendant ce
                    // load. On les retire puis on remonte <Theme> (changement de key) pour
                    // relancer tout le pipeline avec le plugin désormais sans subThemes.
                    // Au remount la condition est fausse (subThemes === undefined) → pas de boucle.
                    if (tailwind?.options.subThemes) {
                        tailwind.options.subThemes = undefined;
                        remount();
                    }
                    // api.context.darkMode =  true;
                    // themeServiceStore.set(api);
                }}
                config={$themeConfig}
            />
        </>
    );
};
