import {defineConfig, FontPlugin, TailwindPlugin, VariantModel} from "@udixio/theme";
import {DislikeAnalyzer, sanitizeDegreesDouble, TonalPalette} from "@material/material-color-utilities";


module.exports = defineConfig({
    sourceColor: '#1A73E8',
    variant: {
        ...VariantModel.tonalSpot,
        palettes: {
            ...VariantModel.tonalSpot.palettes,
            secondary: (sourceColorHct) =>
                TonalPalette.fromHueAndChroma(sourceColorHct.hue, 24.0),
            tertiary: (sourceColorHct) =>
                TonalPalette.fromHueAndChroma(
                    sanitizeDegreesDouble(sourceColorHct.hue + 45.0),
                    24.0
                ),
        }
    },
    colors: {
        colors: {
            tertiaryContainer: {
                tone: (s) => {
                    const proposedHct = s
                        .getPalette('tertiary')
                        .getHct((s.isDark ? 30 : 93),);
                    return DislikeAnalyzer.fixIfDisliked(proposedHct).tone;
                },
            },
        },
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
