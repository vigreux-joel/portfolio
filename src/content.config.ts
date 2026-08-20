import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({
    base: "./src/content/projects",
    pattern: "**/*.{md,mdx}",
  }),
  schema: z
    .object({
      title: z.string(),
      eyebrow: z.string(),
      description: z.string(),
      /** État actuel vérifiable du projet : livré, en production, en développement… */
      status: z.string().optional(),
      /** Période de contribution, plus précise que la seule date de publication. */
      period: z.string().optional(),
      /** Public ou organisation principalement concerné par le projet. */
      audience: z.string().optional(),
      publishedAt: z.coerce.date(),
      /** Position éditoriale souhaitée. Les projets sans ordre remplissent les places libres. */
      order: z.number().int().positive().nullable().default(null),
      draft: z.boolean().default(false),
      cover: z
        .object({
          src: z.string(),
          alt: z.string(),
          width: z.number().int().positive(),
          height: z.number().int().positive(),
          caption: z.string().optional(),
        })
        .optional(),
      externalUrl: z.string().url().optional(),
      /** URL publique à enregistrer pour générer la preview vidéo du projet. */
      previewUrl: z.string().url().optional(),
      repositoryUrl: z.string().url().optional(),
      technologies: z.array(z.string()).default([]),
    })
    .strict(),
});

export const collections = { projects };
