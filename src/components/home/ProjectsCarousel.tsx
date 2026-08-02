import {useState} from "react";
import {Card, Carousel, CarouselItem, Icon, IconButton} from "@udixio/ui-react";
import {iArrowBack} from "@udixio/icons-outlined-400/arrow_back";
import {iArrowForward} from "@udixio/icons-outlined-400/arrow_forward";

export interface ProjectSlide {
  id: string;
  title: string;
  eyebrow: string;
  headline: string;
  cover: {
    src: string;
    alt: string;
    width: number;
    height: number;
    caption?: string;
  };
}

interface Props {
  projects: ProjectSlide[];
}

export function ProjectsCarousel({ projects }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleProjects = projects.length > 1;

  if (projects.length === 0) return null;

  const showProject = (index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, projects.length - 1)));
  };

  return (
    <section aria-label="Projets sélectionnés" aria-roledescription="carousel">
      <Carousel
        aria-label="Liste des projets"
        className="!h-[520px] outline-none md:!h-[560px]"
        gap={24}
        index={activeIndex}
        onChange={setActiveIndex}
        outputRange={[280, 480]}
        scrollSensitivity={1.1}
      >
        {projects.map((project) => (
          <CarouselItem key={project.id} className="!rounded-[28px]">
            <Card variant="filled" interactive className="h-full !rounded-[28px]">
              <a
                href={`/projets/${project.id}`}
                className="relative z-10 flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-primary"
                aria-label={`Découvrir le projet ${project.title}`}
              >
                <img
                  src={project.cover.src}
                  alt={project.cover.alt}
                  width={project.cover.width}
                  height={project.cover.height}
                  loading="lazy"
                  className="h-64 w-full shrink-0 object-cover md:h-72"
                />

                <div className="flex min-h-0 flex-1 flex-col p-6">
                  <p className="line-clamp-1 text-secondary">{project.eyebrow}</p>
                  <h3 className="mt-3 text-headline-medium text-on-surface">{project.title}</h3>
                  <p className="mt-2 line-clamp-2 text-body-large text-on-surface-variant">{project.headline}</p>

                  <span className="group mt-auto inline-flex items-center gap-2 pt-4 text-label-large text-primary">
                    <span>Découvrir le projet</span>
                    <Icon
                      icon={iArrowForward}
                      className="size-4 transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </a>
            </Card>
          </CarouselItem>
        ))}
      </Carousel>

      <div className="mt-8 flex items-center justify-between gap-6 border-t border-outline-variant pt-5">
        <p className="text-label-large text-on-surface-variant" aria-live="polite">
          {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </p>
        <div className="flex items-center gap-3" aria-label="Navigation entre les projets">
          <IconButton
            icon={iArrowBack}
            label="Projet précédent"
            variant="outlined"
            size="large"
            shape="rounded"
            disabled={!hasMultipleProjects || activeIndex === 0}
            onClick={() => showProject(activeIndex - 1)}
          />
          <IconButton
            icon={iArrowForward}
            label="Projet suivant"
            variant="filled"
            size="large"
            shape="rounded"
            disabled={!hasMultipleProjects || activeIndex === projects.length - 1}
            onClick={() => showProject(activeIndex + 1)}
          />
        </div>
      </div>
    </section>
  );
}
