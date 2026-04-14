import { ExternalLink, Github, Sparkles } from "lucide-react";

import { mediaUrl } from "../lib/utils";

const ProjectCard = ({ featured = false, project }) => {
  const imageSrc = mediaUrl(project.image);
  const features = project.features || [];
  const techStack = project.techStack || [];

  return (
    <article className={`project-card group ${featured ? "lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:gap-6" : ""}`}>
      <div className="relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-slate-900/80">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={project.title}
            loading="lazy"
            className={`${featured ? "h-full min-h-72" : "h-52"} w-full object-cover transition duration-500 group-hover:scale-105`}
          />
        ) : (
          <div className={`${featured ? "min-h-72" : "h-52"} flex w-full items-center justify-center bg-[linear-gradient(135deg,_rgba(20,184,166,0.28),_rgba(17,24,39,0.92))] text-sm text-slate-300`}>
            Preview coming soon
          </div>
        )}
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          {project.featured ? "Featured" : "Live Build"}
        </div>
      </div>

      <div className={featured ? "mt-5 lg:mt-0" : ""}>
        <div className="mt-5 flex items-start justify-between gap-4 lg:mt-0">
          <div>
          <h3 className="text-xl font-semibold text-white">{project.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">{project.description}</p>
          </div>
        </div>

        {features.length > 0 ? (
          <ul className="mt-5 grid gap-2 text-sm text-slate-300">
            {features.slice(0, 3).map((feature) => (
              <li key={feature} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium text-slate-200"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/15"
            >
              <ExternalLink className="h-4 w-4" />
              Demo
            </a>
          )}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/[0.05]"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
