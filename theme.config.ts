import {defineConfig} from '@udixio/tailwind';
import {Color} from "@udixio/theme";

export const sourceColor = Color.from({hue: 280, chroma: 45, tone: 75})

export const subThemes = {
    blue: sourceColor,
    green: sourceColor.withHue(155),
    cyan: sourceColor.withHue(205),
}

export default defineConfig({
    sourceColor,
    palettes: {
        secondary: ({sourceColor}) => ({
            hue: sourceColor.hue + 5,
            chroma: sourceColor.chroma * 0.625,
        }),
        tertiary: ({sourceColor}) => ({
            hue: sourceColor.hue + 55,
            chroma: sourceColor.chroma,
        }),
    },
    fontStyles: {
        display: {
            large: {
                fontWeight: 500,
                // fontSize: 5,
                // lineHeight: 5.8,
            },
            medium: {
                fontWeight: 500,
                // fontSize: 4,
                // lineHeight: 4.5,
            },
            small: {
                fontWeight: 500,
                // fontSize: 3,
                // lineHeight: 3.5,
            },
        },
        headline: {
            large: {
                fontWeight: 500,
                // fontSize: 2.5,
                // lineHeight: 3.5,
            },
            medium: {
                fontWeight: 500,
                // fontSize: 2,
                // lineHeight: 2.6,
            },
            small: {
                fontWeight: 500,
                // fontSize: 1.5,
                // lineHeight: 2,
            },
        },
    },
    fontFamily: {
        expressive: ["var(--font-clash-grotesk)"],
        neutral: ["var(--font-inter)"],
    },
    responsiveBreakPoints: {
        lg: 1.2,
        xl: 1.3,
    },
    subThemes,
    outFile: 'src/styles/udixio.generated.css',
})
