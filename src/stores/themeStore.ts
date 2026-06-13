import {atom} from "nanostores";
import config from "../../theme.config";
import {type ConfigInterface} from "@udixio/ui-react";

export const themeStore = atom<
    ConfigInterface
>({...config, subThemes: undefined});

// export const themeServiceStore = atom<API | null>(null);

// Hex actuellement appliqué au thème (initialisé par ThemeProvider depuis le SSR)
export const currentSourceHexStore = atom<string | undefined>(undefined);
