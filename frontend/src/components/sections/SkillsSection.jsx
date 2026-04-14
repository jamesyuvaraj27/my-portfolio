import { cn } from "../../lib/utils";
import { Card, SectionHeader } from "../ui/Card";
import { Container, Grid, ProgressBar, Section } from "../ui/Layout";

/**
 * Skills Section Component
 */
export const SkillsSection = ({
  skills = [],
  className = "",
  ...props
}) => {
  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <Section id="skills" className={cn("relative", className)} {...props}>
      <SectionHeader
        label="My Expertise"
        title="Skills & Proficiencies"
        description="Technologies and tools I've mastered and use daily"
      />

      <Container className="mt-12">
        <div className="space-y-12">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="space-y-6">
              <h3 className="text-2xl font-poppins font-bold text-white">
                {category}
              </h3>

              <Grid cols={1} className="gap-6">
                {categorySkills
                  .sort((a, b) => b.level - a.level)
                  .map((skill) => (
                    <Card
                      key={skill.id}
                      variant="minimal"
                      className="p-6 space-y-3 hover:bg-white/[0.05]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-white">
                          {skill.name}
                        </h4>
                        <span className="text-sm font-bold text-primary-400">
                          {Math.round((skill.level / 5) * 100)}%
                        </span>
                      </div>

                      <ProgressBar
                        value={skill.level}
                        max={5}
                        showLabel={false}
                      />

                      {skill.description && (
                        <p className="text-sm text-text-muted pt-2">
                          {skill.description}
                        </p>
                      )}
                    </Card>
                  ))}
              </Grid>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default SkillsSection;
