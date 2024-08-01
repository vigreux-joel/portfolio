const defineConfig = require('@udixio/theme').defineConfig
const TailwindPlugin = require('@udixio/theme').TailwindPlugin
const FontPlugin = require('@udixio/theme').FontPlugin
const VariantModel = require('@udixio/theme').VariantModel
const ContrastCurve = require('@udixio/theme').ContrastCurve

module.exports = defineConfig({
    sourceColor: '#73C2FB',
    colors: {
        colors: {
            tertiaryContainer: {
                tone: (s) => (s.isDark ? 30 : 93),
            },
        },
    },
    plugins: [
        [
            FontPlugin,
            TailwindPlugin.config({
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
        ],
        [
            TailwindPlugin,
            TailwindPlugin.config({
                darkMode: 'class',
                responsiveBreakPoints: {
                    sm: 1.1,
                },
                subThemes: {
                    green: '#4CA66B',
                    purple: "#7852A9",
                    blue: '#C2E7FE'
                }
            }),
        ],
    ],
})
