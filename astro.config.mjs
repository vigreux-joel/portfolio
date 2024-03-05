import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import critters from "astro-critters";
import robotsTxt from 'astro-robots-txt';
import compressor from "astro-compressor";
export default defineConfig({
    site: "https://vigreux-joel.fr/",
    compressHTML: true,
    experimental: {
    },
    output: 'static',
    integrations: [ react(), tailwind({
        applyBaseStyles: false
    }),
        sitemap(), compressor(), critters({
            Exclude: ["File.html"]
        }), robotsTxt(),
    ],
    vite: {
        ssr: {
            noExternal: ["primereact", "@mui/material", "react-markdown"]
        }
    }
});
