import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { recordProjectPage } from "./screenshot";

interface ProjectToRender {
  slug: string;
  sourcePath: string;
  url: string;
}

function readScalar(frontmatter: string, field: string): string | null {
  const value = frontmatter.match(new RegExp(`^${field}:\\s*["']?([^"'\\n]+)["']?\\s*$`, "m"))?.[1];
  return value?.trim() || null;
}

async function findProjectsWithoutCover(root: string): Promise<ProjectToRender[]> {
  const projectsDirectory = path.join(root, "src", "content", "projects");
  const files = (await fs.readdir(projectsDirectory)).filter((file) => /\.mdx?$/.test(file));
  const projects: ProjectToRender[] = [];

  for (const file of files) {
    const sourcePath = path.join(projectsDirectory, file);
    const source = await fs.readFile(sourcePath, "utf8");
    const frontmatter = source.match(/^---\s*\n([\s\S]*?)\n---/)?.[1];

    const previewUrl = frontmatter ? readScalar(frontmatter, "previewUrl") : null;
    if (
      !frontmatter ||
      !previewUrl ||
      /^cover:\s*$/m.test(frontmatter) ||
      /^draft:\s*true\s*$/m.test(frontmatter)
    ) {
      continue;
    }

    projects.push({
      slug: path.basename(file, path.extname(file)),
      sourcePath,
      url: previewUrl,
    });
  }

  return projects;
}

async function isCurrent(sourcePath: string, ...outputs: string[]): Promise<boolean> {
  const sourceStats = await fs.stat(sourcePath);
  const outputStats = await Promise.all(outputs.map((output) => fs.stat(output).catch(() => null)));
  return outputStats.every((stats) => stats && stats.mtimeMs >= sourceStats.mtimeMs);
}

async function generateProjectMedia(
  root: string,
  logger: AstroIntegrationLogger,
): Promise<void> {
  const projects = await findProjectsWithoutCover(root);
  const capturesDirectory = path.join(root, "public", "images", "projects", "generated");
  const videosDirectory = path.join(root, "public", "videos", "projects");
  await Promise.all([
    fs.mkdir(capturesDirectory, { recursive: true }),
    fs.mkdir(videosDirectory, { recursive: true }),
  ]);

  let generated = 0;
  for (const [index, project] of projects.entries()) {
    const capturePath = path.join(capturesDirectory, `${project.slug}.webp`);
    const videoPath = path.join(videosDirectory, `${project.slug}.webm`);

    if (await isCurrent(project.sourcePath, capturePath, videoPath)) continue;

    logger.info(`Rendu ${index + 1}/${projects.length} : ${project.slug}`);
    await recordProjectPage({
      url: project.url,
      capturePath,
      videoPath,
    });
    generated += 1;
  }

  logger.info(
    generated > 0
      ? `${generated} rendu${generated > 1 ? "s" : ""} vidéo et capture généré${generated > 1 ? "s" : ""}.`
      : "Les vidéos et captures des projets sont à jour.",
  );
}

export default function customIntegration(): AstroIntegration {
  let root = process.cwd();

  return {
    name: "project-media-generator",
    hooks: {
      "astro:config:done": ({ config }) => {
        root = fileURLToPath(config.root);
      },
      "astro:server:start": async ({ logger }) => {
        try {
          await generateProjectMedia(root, logger);
        } catch (error) {
          logger.error(`La génération des médias projet a échoué : ${String(error)}`);
        }
      },
    },
  };
}
