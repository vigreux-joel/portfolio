import {atom} from 'nanostores'
import config, {subThemes} from '../../theme.config.ts'

export const themeStore = atom({
        sourceColorHex: config.sourceColor
    }
)


export const themeService = {


    updateTheme: (color: string | keyof typeof subThemes) => {


        if (Object.keys(subThemes).includes(color)) {
            color = subThemes[color as keyof typeof subThemes]
        }

        if (themeStore.get().sourceColorHex == color) {
            return
        }
        

        themeStore.set({
            ...themeStore.get(),
            sourceColorHex: color
        })
    },
}