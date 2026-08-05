import type { CollectionEntry } from "astro:content";

type Project = CollectionEntry<"projects">;

const byPublicationAndTitle = (a: Project, b: Project): number => {
  const publicationDifference = b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
  if (publicationDifference !== 0) return publicationDifference;

  return a.data.title.localeCompare(b.data.title, "fr");
};

/**
 * Place chaque projet à la position éditoriale demandée ou à la première place libre
 * qui la suit. Les projets sans ordre remplissent ensuite les positions restées libres.
 */
export function sortProjects(projects: readonly Project[]): Project[] {
  const positioned = projects
    .filter((project) => project.data.order !== null)
    .sort((a, b) => a.data.order! - b.data.order! || byPublicationAndTitle(a, b));
  const unpositioned = projects
    .filter((project) => project.data.order === null)
    .sort(byPublicationAndTitle);
  const slots: Array<Project | undefined> = [];

  for (const project of positioned) {
    let index = project.data.order! - 1;
    while (slots[index]) index += 1;
    slots[index] = project;
  }

  for (const project of unpositioned) {
    let index = 0;
    while (slots[index]) index += 1;
    slots[index] = project;
  }

  return slots.filter((project): project is Project => Boolean(project));
}
