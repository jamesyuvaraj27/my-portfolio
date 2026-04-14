import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { Container, Stack } from "../ui/Layout";

/**
 * Hero Section Component
 * Split layout with text and image
 */
export const HeroSection = ({
  profile,
  onCTAClick,
  className = "",
  ...props
}) => {
  return (
    <section
      id="home"
      className={cn(
        "relative min-h-screen w-full flex items-center justify-center py-20 sm:py-28",
        className
      )}
      {...props}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl" />
      </div>

      <Container>
        <div className="grid gap-12 items-center lg:grid-cols-[1.1fr_0.9fr]">
          {/* Content */}
          <div className="space-y-8 z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-500/30 bg-primary-500/10">
                <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                <span className="text-sm font-semibold text-primary-300">Welcome to Portfolio</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-poppins font-bold leading-tight">
                <span className="block">I'm</span>
                <span className="gradient-text-vivid block">{profile?.fullName}</span>
              </h1>

              <p className="text-lg md:text-xl text-text-secondary max-w-xl">
                {profile?.title}
              </p>

              <p className="text-base text-text-muted max-w-2xl leading-relaxed">
                {profile?.summary}
              </p>
            </div>

            {/* CTA Buttons */}
            <Stack direction="horizontal" gap="md" className="flex-wrap">
              <Button size="lg" onClick={() => onCTAClick?.("projects")}>
                View My Work
              </Button>
              <Button variant="ghost" size="lg" onClick={() => onCTAClick?.("contact")}>
                Get in Touch
              </Button>
            </Stack>

            {/* Skill Badges */}
            {profile?.skillBadges && (
              <div className="flex flex-wrap gap-2 pt-4">
                {profile.skillBadges.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full text-xs font-semibold border border-primary-500/30 bg-primary-500/10 text-primary-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Social Links */}
            {profile?.socialLinks && (
              <Stack direction="horizontal" gap="md" className="pt-4">
                {profile.socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-lg border border-white/10 bg-white/5 text-text-secondary hover:border-primary-500/50 hover:bg-primary-500/10 hover:text-primary-300 transition-all duration-300"
                    title={link.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* Icon will be rendered by your icon component */}
                    <span className="text-xl">📱</span>
                  </a>
                ))}
              </Stack>
            )}
          </div>

          {/* Image/Avatar Section */}
          <div className="relative hidden lg:flex items-center justify-center">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-secondary-500/20 rounded-3xl blur-2xl" />

            {/* Avatar Card */}
            <div className="relative w-full max-w-sm aspect-square">
              <div className="glass-panel w-full h-full rounded-3xl p-4 flex items-center justify-center">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-6xl font-bold text-white">
                    {profile?.brand?.slice(0, 2).toUpperCase() || "JS"}
                  </div>
                )}
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 px-6 py-3 rounded-2xl glass-panel shadow-glow-lg max-w-xs">
                <p className="text-sm font-semibold text-primary-300 mb-1">
                  Currently
                </p>
                <p className="text-xl font-poppins font-bold text-white">
                  Open to Opportunities
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs text-text-muted uppercase tracking-widest">Scroll</span>
            <svg
              className="w-5 h-5 text-primary-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
