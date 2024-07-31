/** @type {import("tailwindcss").Config} */
import {createTheme} from '@udixio/theme'

const {fontFamily, plugins} = createTheme()

module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,svg}', './node_modules/@udixio/ui/**/*.js'],
    safelist: [
        {
            pattern: /text-(display|headline|title|label|body)-(large|medium|small)/,
        },
    ],
    darkMode: 'class',
    theme: {
        fontFamily: fontFamily,
        extend: {
            boxShadow: {
                DEFAULT: '0 4px 10px #00000008, 0 0 2px #0000000f, 0 2px 6px #0000001f',
                '1': '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
                '2': '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
                '3': '0px 1px 3px 0px rgba(0, 0, 0, 0.30), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)',
                '4': '0px 2px 3px 0px rgba(0, 0, 0, 0.30), 0px 6px 10px 4px rgba(0, 0, 0, 0.15)',
                '5': '0px 4px 4px 0px rgba(0, 0, 0, 0.30), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
            },
            flex: {
                2: '2 2 0%',
            },
            animation: {
                "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
            },
            keyframes: {
                "border-beam": {
                    "100%": {
                        "offset-distance": "100%",
                    },
                },
            }
        },
    },
    plugins: [...plugins, require('@tailwindcss/typography'), require('@tailwindcss/container-queries')],
}
