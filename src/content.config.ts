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
      heroContext: z.string().optional(),
      heroResponse: z.string().optional(),
      faq: z
        .array(
          z.object({
            question: z.string().min(1),
            answer: z.string().min(1),
          }),
        )
        .default([]),
      description: z.string(),
      /** Rôle réellement tenu sur le projet, affiché dans le résumé de crédibilité. */
      role: z.string().optional(),
      /** État actuel vérifiable du projet : livré, en production, en développement… */
      status: z.string().optional(),
      /** Période de contribution, plus précise que la seule date de publication. */
      period: z.string().optional(),
      /** Public ou organisation principalement concerné par le projet. */
      audience: z.string().optional(),
      /** Résultats ou preuves observables, sans métrique inventée. */
      outcomes: z.array(z.string()).default([]),
      need: z.string().optional(),
      solution: z.string().optional(),
      technicalNote: z.string().optional(),
      publishedAt: z.coerce.date(),
      /** Position éditoriale souhaitée. Les projets sans ordre remplissent les places libres. */
      order: z.number().int().positive().nullable().default(null),
      draft: z.boolean().default(false),
      /**
       * "etude-de-cas" : page dédiée et présentation riche.
       * "realisation" : page dédiée concise présentant l’essentiel et le lien public.
       */
      kind: z.enum(["etude-de-cas", "realisation"]).default("etude-de-cas"),
      /** Introduction unique affichée dans la présentation détaillée. */
      intro: z.string().optional(),
      /** Complément court affiché avec une emphase plus discrète que l’introduction. */
      supportingText: z.string().optional(),
      /** Points de preuve listés sur la présentation détaillée. */
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
      /** URL publique à enregistrer pour générer la preview vidéo du projet. */
      previewUrl: z.string().url().optional(),
      repositoryUrl: z.string().url().optional(),
      technologies: z.array(z.string()).default([]),
    })
    .superRefine((data, ctx) => {
      if (data.kind === "etude-de-cas") {
        for (const field of [
          "headline",
          "heroContext",
          "heroResponse",
          "need",
          "solution",
          "technicalNote",
        ] as const) {
          if (!data[field]) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [field],
              message: `Le champ « ${field} » est requis pour une étude de cas.`,
            });
          }
        }
        if (data.faq.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["faq"],
            message: "Une étude de cas doit proposer au moins deux questions fréquentes.",
          });
        }
      }
      if (data.kind === "realisation" && !data.externalUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["externalUrl"],
          message: "Une réalisation doit pointer vers un site consultable (externalUrl).",
        });
      }
    }),
});

export const collections = { projects };
