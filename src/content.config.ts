import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({
    base: "./src/content/projects",
    pattern: "**/*.{md,mdx}",
  }),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string(),
    headline: z.string(),
    description: z.string(),
    need: z.string(),
    solution: z.string(),
    technicalNote: z.string(),
    publishedAt: z.coerce.date(),
    order: z.number().int().nonnegative(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    cover: z.object({
      src: z.string(),
      alt: z.string(),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      caption: z.string().optional(),
    }),
    externalUrl: z.string().url().optional(),
    repositoryUrl: z.string().url().optional(),
    technologies: z.array(z.string()).default([]),
  }),
});

export const collections = { projects };
