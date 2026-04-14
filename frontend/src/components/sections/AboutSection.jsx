import { cn } from "../../lib/utils";
import { Card, SectionHeader, Stat } from "../ui/Card";
import { Container, Grid, Section, Stack } from "../ui/Layout";

/**
 * About Section Component
 */
export const AboutSection = ({
  profile,
  className = "",
  ...props
}) => {
  return (
    <Section id="about" className={cn("relative", className)} {...props}>
      <SectionHeader
        label="Who I Am"
        title="About Me"
        description="A full-stack developer passionate about building clean, scalable web applications"
      />

      <div className="grid gap-12 items-center lg:grid-cols-2 mt-12">
        {/* Image */}
        <div className="hidden lg:block relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-secondary-500/20 rounded-3xl blur-2xl" />
          <div className="relative glass-panel rounded-3xl p-2">
            <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile?.fullName}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <span className="text-7xl">💼</span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {profile?.about && (
            <div className="space-y-4">
              {Object.entries(profile.about).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <h3 className="text-lg font-poppins font-semibold text-primary-300 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </h3>
                  <p className="text-text-secondary leading-relaxed max-w-2xl">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          {profile?.strengths && (
            <div className="grid grid-cols-2 gap-4 pt-6">
              {profile.strengths.slice(0, 4).map((strength) => (
                <Card key={strength} variant="minimal" className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✨</span>
                    <span className="text-sm font-semibold text-text-primary">
                      {strength}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Info Cards */}
          {profile && (
            <Grid cols={2} gap="sm" className="mt-6">
              {profile.availability && (
                <Card variant="minimal" className="p-4">
                  <p className="text-xs text-text-muted uppercase tracking-wide">
                    Availability
                  </p>
                  <p className="text-sm font-semibold text-primary-300 mt-1">
                    {profile.availability}
                  </p>
                </Card>
              )}
              {profile.location && (
                <Card variant="minimal" className="p-4">
                  <p className="text-xs text-text-muted uppercase tracking-wide">
                    Location
                  </p>
                  <p className="text-sm font-semibold text-text-secondary mt-1">
                    {profile.location}
                  </p>
                </Card>
              )}
            </Grid>
          )}
        </div>
      </div>
    </Section>
  );
};

export default AboutSection;
