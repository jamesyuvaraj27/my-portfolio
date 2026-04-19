import { ExternalLink, Github } from "lucide-react";
import { cn } from "../../lib/utils";
import { Badge, Card, SectionHeader } from "../ui/Card";
import { Button } from "../ui/Button";
import { Container, Grid, Section } from "../ui/Layout";

/**
 * Project Card Component
 */
const ProjectCard = ({ project, featured = false, className = "" }) => {
  return (
    <Card
      variant={featured ? "elevated" : "minimal"}
      interactive
      className={cn(
        featured && "lg:col-span-2 lg:row-span-2",
        "p-6 space-y-4 group flex flex-col justify-between",
        className
      )}
    >
      {/* Image */}
      {project.image && (
        <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden bg-white/5">
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="space-y-3 flex-grow">
        <div>
          <h3 className="text-xl font-poppins font-bold text-white group-hover:text-primary-300 transition-colors">
            {project.name}
          </h3>
          <p className="text-sm text-text-muted mt-1">{project.category}</p>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed">
          {project.description}
        </p>

        {/* Tags */}
        {project.technologies && (
          <div className="flex flex-wrap gap-2 pt-2">
            {project.technologies.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="soft" size="sm">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge variant="soft" size="sm">
                +{project.technologies.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Links */}
      {(project.liveUrl || project.githubUrl) && (
        <div className="flex gap-2 pt-4 border-t border-white/5">
          {project.liveUrl && (
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              icon={ExternalLink}
              onClick={() => window.open(project.liveUrl, "_blank")}
            >
              Live
            </Button>
          )}
          {project.githubUrl && (
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              icon={Github}
              onClick={() => window.open(project.githubUrl, "_blank")}
            >
              Code
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

/**
 * Projects Section Component
 */
export const ProjectsSection = ({
  projects = [],
  maxDisplay = 6,
  className = "",
  ...props
}) => {
  const displayProjects = projects.slice(0, maxDisplay);

  return (
    <Section id="projects" className={cn("relative", className)} {...props}>
      <SectionHeader
        label="My Work"
        title="Featured Projects"
        description="Showcase of my best work and completed projects"
      />

      <Container className="mt-12">
        {displayProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-muted">No projects available yet.</p>
          </div>
        ) : (
          <Grid cols={3} gap="lg" className="gap-6">
            {displayProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                featured={index === 0}
              />
            ))}
          </Grid>
        )}
      </Container>
    </Section>
  );
};

export default ProjectsSection;
