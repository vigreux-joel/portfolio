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
      headline: z.string().optional(),
      description: z.string(),
      need: z.string().optional(),
      solution: z.string().optional(),
      technicalNote: z.string().optional(),
      publishedAt: z.coerce.date(),
      order: z.number().int().nonnegative(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      /**
       * "etude-de-cas" : page dédiée et présentation riche.
       * "realisation" : simple carte pointant vers le site en ligne, sans page dédiée.
       */
      kind: z.enum(["etude-de-cas", "realisation"]).default("etude-de-cas"),
      /**
       * Emplacement occupé sur la page d’accueil :
       * "feature" projet mis en avant, "card" grille secondaire.
       */
      home: z.enum(["feature", "card"]).optional(),
      /** Paragraphes affichés sous le titre dans la présentation mise en avant. */
      intro: z.array(z.string()).default([]),
      /** Points de preuve listés sur la présentation mise en avant. */
      highlights: z.array(z.string()).default([]),
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
      repositoryUrl: z.string().url().optional(),
      technologies: z.array(z.string()).default([]),
    })
    .superRefine((data, ctx) => {
      if (data.kind === "etude-de-cas") {
        for (const field of ["headline", "need", "solution", "technicalNote"] as const) {
          if (!data[field]) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [field],
              message: `Le champ « ${field} » est requis pour une étude de cas.`,
            });
          }
        }
      }
      if (data.kind === "realisation" && data.home) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["home"],
          message: "Une réalisation ne peut pas occuper d’emplacement sur la page d’accueil.",
        });
      }
    }),
});

export const collections = { projects };
