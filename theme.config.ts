import {argbFromHex, hexFromArgb} from "@material/material-color-utilities";
import {defineConfig} from '@udixio/ui-react';
import {Hct} from "@udixio/theme";

argbFromHex('#93b5cb')

const source = Hct.fromInt(argbFromHex('#169fff'))
const newSource = Hct.from(source.hue, 60, 25)

export const subThemes = {
    blue: hexFromArgb(newSource.toInt()),
    green: '#81b88e',
    purple: "#bba1da",
    orange: '#e69883'
}

export default defineConfig({
    sourceColor: subThemes.blue,
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
