import {defineConfig, FontPlugin, Variants,} from "@udixio/theme";
import {TailwindPlugin} from "@udixio/tailwind";
import {argbFromHex, Hct, hexFromArgb, sanitizeDegreesDouble, TonalPalette} from "@material/material-color-utilities";

argbFromHex('#93b5cb')

const source = Hct.fromInt(argbFromHex('#93b5cb'))
const newSource = Hct.from(source.hue, 50, 30)

export const subThemes = {
    blue: '#94abdf',
    green: '#81b88e',
    purple: "#bba1da",
    orange: '#e69883'
}

export default defineConfig({
    sourceColor: hexFromArgb(newSource.toInt()),
    variant: {
        ...Variants.Fidelity, palettes: {
            ...Variants.Fidelity.palettes,
            tertiary: ({sourceColorHct}) =>
                TonalPalette.fromHueAndChroma(
                    sanitizeDegreesDouble(sourceColorHct.hue + 75),
                    sourceColorHct.chroma + 20,
                ),
        }
    },
    plugins: [
        new FontPlugin({
            fontStyles: {
                // display: {
                //     large: {
                //         fontWeight: 600,
                //     },
                //     medium: {
                //         fontWeight: 600,
                //     },
                //     small: {
                //         fontWeight: 600,
                //     },
                // },
                // headline: {
                //     large: {
                //         fontWeight: 600,
                //     },
                //     medium: {
                //         fontWeight: 600,
                //     },
                //     small: {
                //         fontWeight: 600,
                //     },
                // },
                // title: {
                //     large: {
                //         fontWeight: 500,
                //     },
                //     medium: {
                //         fontWeight: 500,
                //     },
                //     small: {
                //         fontWeight: 500,
                //     },
                // },
                body: {
                    large: {
                        // fontSize: 1.125,
                    },
                    medium: {
                        // fontSize: 1,
                        lineHeight: 1.25,
                    },
                    small: {
                        // fontSize: 0.875,
                        lineHeight: 1.125,
                    },
                },
            },
            fontFamily: {
                expressive: ['Montserrat', 'sans-serif'],
                neutral: ['Roboto', 'sans-serif'],
            },
        }),
        new TailwindPlugin({
            darkMode: 'class',
            responsiveBreakPoints: {
                sm: 1.125,
            },
            subThemes
        }),

    ],
})
