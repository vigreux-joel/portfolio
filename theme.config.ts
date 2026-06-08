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
    responsiveBreakPoints: {
        sm: 1.125,
    },
    subThemes

})
