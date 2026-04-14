import { cn } from "../../lib/utils";
import { Badge, Card, SectionHeader } from "../ui/Card";
import { Container, Section } from "../ui/Layout";

/**
 * Timeline Item Component
 */
const TimelineItem = ({ experience, isLast = false }) => {
  const startDate = new Date(experience.startDate);
  const endDate = experience.endDate ? new Date(experience.endDate) : null;

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="relative">
      {/* Timeline dot */}
      <div className="absolute left-0 top-0 w-5 h-5 -translate-x-[calc(50%+12px)]">
        <div className="w-full h-full rounded-full border-2 border-primary-500 bg-background-900 shadow-glow" />
      </div>

      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-0 top-8 -translate-x-[calc(50%+10px)] w-0.5 h-[calc(100%-32px)] bg-gradient-to-b from-primary-500 to-secondary-500" />
      )}

      {/* Card */}
      <Card variant="minimal" className="p-6 ml-6">
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-poppins font-bold text-white">
              {experience.title}
            </h3>
            <p className="text-primary-300 font-semibold">
              {experience.company}
            </p>
          </div>

          <p className="text-sm text-text-muted">
            {formatDate(startDate)} -{" "}
            {endDate ? formatDate(endDate) : "Present"}
          </p>

          {experience.description && (
            <p className="text-text-secondary leading-relaxed">
              {experience.description}
            </p>
          )}

          {experience.skills && (
            <div className="flex flex-wrap gap-2 pt-2">
              {experience.skills.map((skill) => (
                <Badge key={skill} variant="soft" size="sm">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

/**
 * Experience Section Component
 */
export const ExperienceSection = ({
  experiences = [],
  className = "",
  ...props
}) => {
  if (!experiences.length) {
    return null;
  }

  // Sort by start date descending
  const sortedExperiences = [...experiences].sort(
    (a, b) => new Date(b.startDate) - new Date(a.startDate)
  );

  return (
    <Section id="experience" className={cn("relative", className)} {...props}>
      <SectionHeader
        label="My Journey"
        title="Experience"
        description="Professional roles and meaningful projects I've worked on"
      />

      <Container className="mt-12">
        <div className="relative space-y-0 py-6">
          {sortedExperiences.map((experience, index) => (
            <TimelineItem
              key={experience.id}
              experience={experience}
              isLast={index === sortedExperiences.length - 1}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default ExperienceSection;
