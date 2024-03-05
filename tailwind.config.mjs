/** @type {import("tailwindcss").Config} */
const {
    createMaterialTheme,
    Variant,
    ContrastCurve,
    ToneDeltaPair,
    MaterialDynamicColors
} = require("@udixio/tailwind-material");
const materialTailwind = createMaterialTheme({
    colors: {
        palette: {
            primary: "#0A65EC",
            tertiary: "#6752F2",
            neutral: "#00bbff"
        },
        dynamic: {
            surface: {
                tone: (s) => (s.isDark ? 6 : 100)
            },
            primary: {
                tone: (s) => s.sourceColorHct.tone,
                contrastCurve: new ContrastCurve(1, 1, 3, 7),
                toneDeltaPair: undefined

            }
        }
    },
    fontFamily: {
        expressive: ["Montserrat", "sans-serif"],
        neutral: ["Roboto", "sans-serif"]
    },
    fontStyles: {
        displayLarge: {
            fontWeight: 700
        },
        displayMedium: {
            fontWeight: 700
        },
        displaySmall: {
            fontWeight: 700
        },
        headlineLarge: {
            fontWeight: 600
        },
        headlineMedium: {
            fontWeight: 600
        },
        headlineSmall: {
            fontWeight: 600
        },
        titleLarge: {
            fontWeight: 500
        },
        titleMedium: {
            fontWeight: 500
        },
        titleSmall: {
            fontWeight: 500
        }

    },
    darkMode: "class",
    variant: Variant.VIBRANT,
    name: "NetSimpler",
    themePath: "./theme.json"
    // contrastLevel: -0.59
});

module.exports = {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
        "./node_modules/@udixio/ui/**/*.js"],
    safelist: [
        "bg-on-tertiary-fixed-variant",
        "bg-on-primary-fixed-variant"
    ],
    darkMode: "class",
    theme: {
        colors: {

            ...materialTailwind.colors

        },
        fontFamily: materialTailwind.fontFamily,
        extend: {
            boxShadow: {
                DEFAULT: "0 4px 10px #00000008, 0 0 2px #0000000f, 0 2px 6px #0000001f"
            },
            flex: {
                "2": "2 2 0%"
            },
            maxWidth: {
                "prose": "700px",
                "screen-xl": "1440px"
            }


        }
    },
    plugins: [...materialTailwind.plugins, require("@tailwindcss/typography")
    ]
};
