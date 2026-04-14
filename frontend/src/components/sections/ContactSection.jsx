import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { Stat, SectionHeader, Card } from "../ui/Card";
import { Input, FormGroup, Textarea } from "../ui/Input";
import { Container, Section } from "../ui/Layout";

/**
 * Contact Form Component
 */
const ContactForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit?.(formData);
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <Card variant="minimal" className="p-8 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormGroup>
          <Input
            label="Your Name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            disabled={isLoading}
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            disabled={isLoading}
          />

          <Input
            label="Subject (Optional)"
            name="subject"
            placeholder="What's this about?"
            value={formData.subject}
            onChange={handleChange}
            disabled={isLoading}
          />

          <Textarea
            label="Message"
            name="message"
            placeholder="Tell me more about your project or inquiry..."
            rows={6}
            value={formData.message}
            onChange={handleChange}
            error={errors.message}
            disabled={isLoading}
          />
        </FormGroup>

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
        >
          Send Message
        </Button>
      </form>
    </Card>
  );
};

/**
 * Contact Section Component
 */
export const ContactSection = ({
  profile,
  onMessageSend,
  className = "",
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await onMessageSend?.(formData);
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Section id="contact" className={cn("relative", className)} {...props}>
      <SectionHeader
        label="Get in Touch"
        title="Let's Work Together"
        description="Have a project in mind? Let's discuss how we can collaborate."
      />

      <Container className="mt-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          {/* Contact Info */}
          <div className="space-y-6">
            {profile?.email && (
              <Stat
                icon={Mail}
                label="Email"
                value={profile.email}
                className="cursor-pointer hover:opacity-80"
                onClick={() => window.location.href = `mailto:${profile.email}`}
              />
            )}

            {profile?.phone && (
              <Stat
                icon={Phone}
                label="Phone"
                value={profile.phone}
                className="cursor-pointer hover:opacity-80"
                onClick={() =>
                  window.location.href = `tel:${profile.phone}`
                }
              />
            )}

            {profile?.location && (
              <Stat
                icon={MapPin}
                label="Location"
                value={profile.location}
              />
            )}

            {/* Social Links */}
            {profile?.socialLinks && profile.socialLinks.length > 0 && (
              <div className="pt-6 border-t border-white/10">
                <p className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-4">
                  Connect on Social
                </p>
                <div className="flex flex-wrap gap-3">
                  {profile.socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="inline-flex items-center justify-center w-12 h-12 rounded-lg border border-white/10 bg-white/5 text-text-secondary hover:border-primary-500/50 hover:bg-primary-500/10 hover:text-primary-300 transition-all duration-300"
                      title={link.label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-lg">🔗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <ContactForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </Container>
    </Section>
  );
};

export default ContactSection;
