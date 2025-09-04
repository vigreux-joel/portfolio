import {defineConfig, FontPlugin, getRotatedHue, Variants,} from "@udixio/theme";
import {TailwindPlugin} from "@udixio/tailwind";
import {TonalPalette} from "@material/material-color-utilities";


export default defineConfig({
    sourceColor: '#93b5cb',
    variant: {
        ...Variants.Fidelity, palettes: {
            ...Variants.Fidelity.palettes,
            tertiary: ({sourceColorHct}) =>
                TonalPalette.fromHueAndChroma(
                    getRotatedHue(
                        sourceColorHct,
                        [0, 20, 71, 161, 333, 360],
                        [-40, 48, -32, 40, -32],
                    ),
                    48,
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
            subThemes: {
                blue: '#1A73E8',
                green: '#4CA66B',
                purple: "#7852A9",
                orange: '#F5704B'
            }
        }),

    ],
})
