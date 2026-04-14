import { Award, Download, ExternalLink } from "lucide-react";
import { cn } from "../../lib/utils";
import { Badge, Card, SectionHeader } from "../ui/Card";
import { Button } from "../ui/Button";
import { Container, Grid, Section } from "../ui/Layout";

/**
 * Certification Card Component
 */
const CertificationCard = ({ certification, className = "" }) => {
  return (
    <Card variant="minimal" interactive className={cn("p-6", className)}>
      <div className="space-y-4">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-500/10 border border-primary-500/30">
          <Award className="text-primary-400" size={24} />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-poppins font-bold text-white">
            {certification.name}
          </h3>
          <p className="text-primary-300 font-semibold">
            {certification.issuer}
          </p>
          {certification.issueDate && (
            <p className="text-sm text-text-muted">
              Issued {new Date(certification.issueDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
              })}
            </p>
          )}
        </div>

        {/* Description */}
        {certification.description && (
          <p className="text-text-secondary text-sm">
            {certification.description}
          </p>
        )}

        {/* Tags */}
        {certification.skills && (
          <div className="flex flex-wrap gap-2 pt-1">
            {certification.skills.slice(0, 2).map((skill) => (
              <Badge key={skill} variant="soft" size="sm">
                {skill}
              </Badge>
            ))}
          </div>
        )}

        {/* Links */}
        {(certification.certificateUrl || certification.credentialUrl) && (
          <div className="flex gap-2 pt-4 border-t border-white/5">
            {certification.certificateUrl && (
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                icon={Download}
                onClick={() =>
                  window.open(certification.certificateUrl, "_blank")
                }
              >
                Certificate
              </Button>
            )}
            {certification.credentialUrl && (
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                icon={ExternalLink}
                onClick={() =>
                  window.open(certification.credentialUrl, "_blank")
                }
              >
                Verify
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

/**
 * Certifications Section Component
 */
export const CertificationsSection = ({
  certifications = [],
  className = "",
  ...props
}) => {
  if (!certifications.length) {
    return null;
  }

  return (
    <Section id="certifications" className={cn("relative", className)} {...props}>
      <SectionHeader
        label="Credentials"
        title="Certifications & Achievements"
        description="Professional certifications and recognized accomplishments"
      />

      <Container className="mt-12">
        <Grid cols={3} gap="lg" className="gap-6">
          {certifications.map((cert) => (
            <CertificationCard key={cert.id} certification={cert} />
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default CertificationsSection;
