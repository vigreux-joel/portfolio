import {themeStore} from '@/stores/themeStore.ts'
import {useStore} from '@nanostores/react'
import {ThemeProvider as Theme} from '@udixio/ui-react'
import config from '../../theme.config.ts'
import {TailwindPlugin} from "@udixio/tailwind";

export const ThemeProvider = () => {
    const $themeConfig = useStore(themeStore)


    if (!$themeConfig) {
        return null
    }

    return (
        <Theme
            config={{
                ...config,
                sourceColor: $themeConfig.sourceColorHex,
                plugins: [
                    ...config.plugins!,
                    new TailwindPlugin({
                        darkMode: 'class',
                        responsiveBreakPoints: {
                            sm: 1.125,
                        },
                    }),

                ],
            }}
        />
    )
}
