import {defineConfig} from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import compressor from "astro-compressor";
import vercel from '@astrojs/vercel/serverless';

import compress from "astro-compress";
import purgecss from "astro-purgecss";

// https://astro.build/config
export default defineConfig({
    site: "https://vigreux-joel.fr/",
    compressHTML: true,
    experimental: {},
    output: 'hybrid',
    integrations: [react(), tailwind({
        applyBaseStyles: false
    }), sitemap(), robotsTxt(), purgecss(), compress(), compressor(),],
    vite: {
        ssr: {
            noExternal: ["react-markdown", "@udixio/theme", "react-obfuscate", "react-google-recaptcha-v3"]
        }
    },
    adapter: vercel()
});