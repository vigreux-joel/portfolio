import {defineConfig} from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import compressor from "astro-compressor";
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

import compress from "astro-compress";
import {vitePlugin} from "@udixio/theme";

// https://astro.build/config
export default defineConfig({
    site: "https://vigreux-joel.fr/",
    compressHTML: true,
    experimental: {},
    output: 'static',
    integrations: [react(), sitemap(), robotsTxt(), compress(), compressor(),],
    vite: {
        plugins: [tailwindcss(), vitePlugin()],
        ssr: {
            noExternal: ["react-markdown", "@udixio/theme", "@udixio/tailwind", "@udixio/ui-react", "react-obfuscate", "react-google-recaptcha-v3", "tailwindcss"]
        }
    },
    adapter: vercel()
});