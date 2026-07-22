import {hexFromArgb} from "@material/material-color-utilities";
import {defineConfig} from '@udixio/ui-react';
import {Hct} from "@udixio/theme";

export const sourceColor = Hct.from(280, 45, 75)

export const subThemes = {
    blue: hexFromArgb(sourceColor.toInt()),
    green: hexFromArgb(Hct.from(161, sourceColor.hue, sourceColor.tone).toInt()),
    cyan: hexFromArgb(Hct.from(205, sourceColor.hue, sourceColor.tone).toInt()),
}

export default defineConfig({
    sourceColor,
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
        xl: 1.4,
    },
    subThemes
})
