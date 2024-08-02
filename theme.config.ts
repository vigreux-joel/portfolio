import {defineConfig, FontPlugin, TailwindPlugin} from "@udixio/theme";


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
                green: '#4CA66B',
                purple: "#7852A9",
                orange: '#F5704B'
            }
        }),

    ],
})
