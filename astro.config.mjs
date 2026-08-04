import {defineConfig, fontProviders} from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import compressor from "astro-compressor";
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

import compress from "astro-compress";
import {vitePlugin} from "@udixio/theme";
import {customIntegration} from "./integrations/index.ts";

const isBuild = process.argv.includes("build");

// https://astro.build/config
export default defineConfig({
    site: "https://vigreux-joel.fr/",
    redirects: {
        "/methode": "/approche",
    },
    compressHTML: true,
    experimental: {},
    output: 'static',
    integrations: [customIntegration(), react(), mdx(), sitemap(), robotsTxt(), compress(), compressor()],
    fonts: [
        {
            provider: fontProviders.google(),
            name: "Inter",
            cssVariable: "--font-inter",
        },
        {
            provider: fontProviders.local(),
            name: "Clash Grotesk",
            cssVariable: "--font-clash-grotesk",
            options: {
                variants: [
                    {
                        weight: 200,
                        style: "normal",
                        src: [
                            "./src/assets/fonts/clash-grotesk/ClashGrotesk-Extralight.woff2",
                        ],
                    },
                    {
                        weight: 300,
                        style: "normal",
                        src: ["./src/assets/fonts/clash-grotesk/ClashGrotesk-Light.woff2"],
                    },
                    {
                        weight: 400,
                        style: "normal",
                        src: [
                            "./src/assets/fonts/clash-grotesk/ClashGrotesk-Regular.woff2",
                        ],
                    },
                    {
                        weight: 500,
                        style: "normal",
                        src: ["./src/assets/fonts/clash-grotesk/ClashGrotesk-Medium.woff2"],
                    },
                    {
                        weight: 600,
                        style: "normal",
                        src: [
                            "./src/assets/fonts/clash-grotesk/ClashGrotesk-Semibold.woff2",
                        ],
                    },
                    {
                        weight: 700,
                        style: "normal",
                        src: ["./src/assets/fonts/clash-grotesk/ClashGrotesk-Bold.woff2"],
                    },
                ],
            },
        },
    ],
    vite: {
        cacheDir: isBuild ? "node_modules/.vite-build" : "node_modules/.vite",
        plugins: [tailwindcss(), vitePlugin()],
        ssr: {
            noExternal: ["react-markdown", "@udixio/theme", "@udixio/tailwind", "@udixio/ui-react", "react-obfuscate", "react-google-recaptcha-v3", "tailwindcss"]
        },
        optimizeDeps: {
            exclude: [
                "@udixio/ui-react",
                "@udixio/ui-react/theme-worker",

            ],
        },
    },
    adapter: vercel()
});
