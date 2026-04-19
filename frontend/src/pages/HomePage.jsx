import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  Code2,
  Database,
  Download,
  ExternalLink,
  Eye,
  FolderKanban,
  Github,
  Globe,
  Instagram,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";
import { startTransition, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import AnimatedSection from "../components/AnimatedSection";
import MagneticButton from "../components/MagneticButton";
import NavBar from "../components/NavBar";
import Seo from "../components/Seo";
import { Avatar, Modal } from "../components/ui";
import api from "../lib/axios";
import { PROFILE } from "../lib/site";
import { apiUrl, formatMonthYear, mediaUrl } from "../lib/utils";

const EMPTY_LIST = [];

const socialIconMap = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  mail: Mail,
};

const categoryIconMap = {
  frontend: Layers3,
  backend: Code2,
  database: Database,
  "programming languages": Code2,
  "tools & platforms": Wrench,
  default: Sparkles,
};

const HomePage = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTech, setSelectedTech] = useState("All");
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [heroOffset, setHeroOffset] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
    rating: 0,
  });
  const [sendingMessage, setSendingMessage] = useState(false);
  const [submitState, setSubmitState] = useState({ type: "", message: "" });

  useEffect(() => {
    let ignore = false;

    const fetchPortfolio = async () => {
      try {
        const { data } = await api.get("/content/portfolio");

        if (ignore) {
          return;
        }

        startTransition(() => {
          setPortfolio(data);
        });
      } catch (error) {
        if (!ignore) {
          toast.error(error.response?.data?.message || "Unable to load portfolio content right now.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchPortfolio();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let frameId = 0;

    const handleScroll = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        setHeroOffset(window.scrollY);
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const projects = portfolio?.projects || EMPTY_LIST;
  const photos = portfolio?.photos || EMPTY_LIST;
  const skills = portfolio?.skills || EMPTY_LIST;
  const experience = portfolio?.experience || EMPTY_LIST;
  const certifications = portfolio?.certifications || EMPTY_LIST;

  const selectedPhoto = photos.find((photo) => photo.featured) || photos[0] || null;
  const avatarUrl = selectedPhoto ? mediaUrl(selectedPhoto.image) : PROFILE.avatarUrl;
  const avatarAlt = selectedPhoto?.alt || `${PROFILE.fullName} portrait`;
  const logoUrl = mediaUrl(portfolio?.logo?.url);
  const resumeUrl = mediaUrl(portfolio?.resume?.url);
  const resumeDownloadUrl = portfolio?.resume?.url ? apiUrl("/content/resume/download") : "";

  const techFilters = useMemo(() => {
    const techList = new Set();

    projects.forEach((project) => {
      (project.techStack || []).forEach((tech) => techList.add(tech));
    });

    return ["All", ...techList];
  }, [projects]);

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) =>
        selectedTech === "All" ? true : (project.techStack || []).includes(selectedTech)
      ),
    [projects, selectedTech]
  );

  const sortedSkills = useMemo(
    () => skills.slice().sort((a, b) => (b.level || 0) - (a.level || 0)),
    [skills]
  );

  const highlightedSkills = sortedSkills.slice(0, 8);
  const activeProject = filteredProjects.find((project) => project._id === activeProjectId) || null;

  const stats = [
    {
      label: "Projects",
      value: String(projects.length).padStart(2, "0"),
      detail: "Built and documented",
      icon: FolderKanban,
    },
    {
      label: "Skills",
      value: String(skills.length).padStart(2, "0"),
      detail: "Current working stack",
      icon: Code2,
    },
    {
      label: "Certifications",
      value: String(certifications.length).padStart(2, "0"),
      detail: "Verified learning milestones",
      icon: Award,
    },
  ];

  const handleContactChange = (field, value) => {
    setContactForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    setSendingMessage(true);
    setSubmitState({ type: "", message: "" });

    try {
      await api.post("/content/messages", contactForm);
      setSubmitState({
        type: "success",
        message: "Message sent successfully. I will get back to you soon.",
      });
      toast.success("Message sent. Thanks for reaching out.");
      setContactForm({ name: "", email: "", message: "", rating: 0 });
    } catch (error) {
      const message = error.response?.data?.message || "Could not send your message.";
      setSubmitState({ type: "error", message });
      toast.error(message);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleMissingResume = () => {
    toast.error("Resume is not uploaded yet. Please check back soon.");
  };

  return (
    <>
      <Seo
        title={`${PROFILE.fullName} | ${PROFILE.role}`}
        description="Minimal portfolio with projects, skills, experience, certifications, and a responsive contact workflow."
      />

      <div className="page-shell pb-12">
        <NavBar logoUrl={logoUrl} />

        <main className="container-shell flex flex-col gap-6 pb-12 pt-6">
          <AnimatedSection id="home" className="glass-panel section-shell-lg overflow-hidden">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <span className="section-chip">
                  <Sparkles className="h-4 w-4" />
                  {PROFILE.availability}
                </span>

                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-text-secondary">
                  {PROFILE.fullName}
                </p>
                <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-[-0.04em] text-text-primary sm:text-[48px] sm:leading-[1.05]">
                  Building calm, scalable web products with a clean frontend system.
                </h1>
                <p className="mt-5 max-w-2xl text-lg text-text-secondary">
                  {PROFILE.valueProposition}
                </p>
                <p className="mt-4 max-w-2xl text-base text-text-secondary">
                  {PROFILE.summary}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {resumeUrl ? (
                    <>
                      <MagneticButton href={resumeDownloadUrl}>
                        <Download className="h-4 w-4" />
                        Download Resume
                      </MagneticButton>
                      <MagneticButton href={resumeUrl} target="_blank" rel="noreferrer" variant="secondary">
                        <Eye className="h-4 w-4" />
                        View Resume
                      </MagneticButton>
                    </>
                  ) : (
                    <MagneticButton type="button" onClick={handleMissingResume}>
                      <Download className="h-4 w-4" />
                      Resume Coming Soon
                    </MagneticButton>
                  )}
                  <MagneticButton href="#projects" variant="secondary">
                    Explore Projects
                    <ArrowRight className="h-4 w-4" />
                  </MagneticButton>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  {PROFILE.socialLinks.map((link) => {
                    const Icon = socialIconMap[link.icon] || Globe;

                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                        rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
                        className="social-link"
                      >
                        <Icon className="h-4 w-4 text-primary-500" />
                        {link.label}
                      </a>
                    );
                  })}
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {stats.map((stat) => (
                    <div key={stat.label} className="stat-card p-5">
                      <stat.icon className="h-5 w-5 text-primary-500" />
                      <p className="mt-4 text-3xl font-bold tracking-[-0.03em] text-text-primary">{stat.value}</p>
                      <p className="mt-2 text-sm font-medium text-text-primary">{stat.label}</p>
                      <p className="mt-1 text-sm text-text-secondary">{stat.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div
                  className="relative rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-lg"
                  style={{ transform: `translateY(${Math.min(heroOffset * 0.06, 26)}px)` }}
                >
                  <div className="absolute inset-x-8 top-0 h-24 rounded-b-[32px] bg-gradient-to-b from-primary-500/10 to-transparent" />

                  <div className="relative grid gap-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Primary focus</p>
                        <p className="mt-1 text-xl font-semibold tracking-[-0.02em] text-text-primary">
                          Frontend architecture with reliable APIs
                        </p>
                      </div>
                      <Avatar src={avatarUrl} alt={avatarAlt} name={PROFILE.fullName} size="xl" />
                    </div>

                    <div className="rounded-[24px] border border-secondary-200 bg-secondary-100/70 p-5">
                      <p className="text-sm font-medium text-text-secondary">Current strengths</p>
                      <div className="mt-4 grid gap-3">
                        {PROFILE.strengths.slice(0, 4).map((strength) => (
                          <div
                            key={strength}
                            className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm"
                          >
                            <span className="text-sm font-medium text-text-primary">{strength}</span>
                            <ShieldCheck className="h-4 w-4 text-primary-500" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {highlightedSkills.slice(0, 4).map((skill) => {
                        const Icon =
                          categoryIconMap[(skill.category || "").toLowerCase()] || categoryIconMap.default;

                        return (
                          <div key={skill._id || skill.name} className="surface-card p-4">
                            <div className="flex items-center gap-3">
                              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-500/10 text-primary-500">
                                <Icon className="h-5 w-5" />
                              </span>
                              <div>
                                <p className="text-sm font-semibold text-text-primary">{skill.name}</p>
                                <p className="text-xs uppercase tracking-[0.18em] text-text-muted">
                                  {skill.category || "Skill"}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection id="about" className="glass-panel section-shell" delay={60}>
            <SectionIntro
              eyebrow="About"
              title="A portfolio designed around clarity, delivery, and steady improvement."
              description={PROFILE.about.intro}
            />

            <div className="mt-10 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
              <div className="surface-card-muted p-6 sm:p-7">
                <Avatar
                  src={avatarUrl}
                  alt={avatarAlt}
                  name={PROFILE.fullName}
                  size="xl"
                  className="mx-auto h-36 w-36 rounded-[32px]"
                />
                <p className="mt-6 text-center text-lg font-semibold tracking-[-0.02em] text-text-primary">
                  {PROFILE.role}
                </p>
                <p className="mt-2 text-center text-sm text-text-secondary">{PROFILE.location}</p>
                <p className="mt-5 text-sm text-text-secondary">
                  {PROFILE.about.journey}
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {PROFILE.skillBadges.map((skill) => (
                    <span key={skill} className="skill-badge">
                      <Code2 className="h-4 w-4 text-primary-500" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <AboutTile title="Current learning" text={PROFILE.about.learning} />
                <AboutTile title="Focus areas" text={PROFILE.about.focus} />
                <AboutTile title="Growth mindset" text={PROFILE.about.mindset} />
                <AboutTile title="Career goal" text={PROFILE.about.goals} />
                <div className="info-tile p-6 sm:col-span-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-500">Working style</p>
                  <p className="mt-3 text-base text-text-secondary">
                    I aim for content-first structure, clean component seams, responsive behavior, and admin workflows that stay easy to maintain.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {PROFILE.strengths.map((strength) => (
                      <span key={strength} className="strength-chip">
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection id="projects" className="glass-panel section-shell" delay={120}>
            <SectionIntro
              eyebrow="Projects"
              title="Selected work organized as a scalable card grid."
              description="Each card stays concise on first view, with a quick-view modal for deeper inspection without overwhelming the page."
            />

            <div className="mt-8 flex flex-wrap gap-3">
              {techFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedTech(filter)}
                  className={`tab-button ${selectedTech === filter ? "is-active" : ""}`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {loading
                ? Array.from({ length: 6 }).map((_, index) => <ProjectSkeleton key={index} />)
                : filteredProjects.map((project) => (
                    <article key={project._id} className="project-card flex h-full flex-col p-6">
                      <div className="overflow-hidden rounded-[20px] border border-secondary-200 bg-secondary-100">
                        {project.image ? (
                          <img
                            src={mediaUrl(project.image)}
                            alt={project.title}
                            loading="lazy"
                            className="h-48 w-full object-cover"
                          />
                        ) : (
                          <div className="grid h-48 place-items-center bg-secondary-100 text-text-muted">
                            Project preview
                          </div>
                        )}
                      </div>

                      <div className="mt-5 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold tracking-[-0.02em] text-text-primary">
                            {project.title}
                          </h3>
                          <p className="mt-2 text-sm text-text-secondary">
                            {project.description}
                          </p>
                        </div>
                        {project.featured ? (
                          <span className="section-chip !px-3 !py-2 !tracking-[0.12em]">Featured</span>
                        ) : null}
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {(project.techStack || []).slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-secondary-300 bg-secondary-100 px-3 py-1 text-xs font-medium text-text-secondary"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 flex flex-1 flex-col justify-end gap-4">
                        <div className="text-sm text-text-secondary">
                          {(project.features || []).slice(0, 2).map((feature) => (
                            <p key={feature} className="mt-1">
                              {feature}
                            </p>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => setActiveProjectId(project._id)}
                            className="magnetic-button secondary"
                          >
                            <Eye className="h-4 w-4" />
                            Quick View
                          </button>
                          {project.liveLink ? (
                            <a
                              href={project.liveLink}
                              target="_blank"
                              rel="noreferrer"
                              className="magnetic-button ghost"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Live
                            </a>
                          ) : null}
                          {project.githubLink ? (
                            <a
                              href={project.githubLink}
                              target="_blank"
                              rel="noreferrer"
                              className="magnetic-button ghost"
                            >
                              <Github className="h-4 w-4" />
                              Code
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))}
            </div>

            {!loading && filteredProjects.length === 0 ? (
              <EmptyState message="No projects matched that filter yet. Try another stack to explore more work." />
            ) : null}
          </AnimatedSection>

          <AnimatedSection id="skills" className="glass-panel section-shell" delay={180}>
            <SectionIntro
              eyebrow="Skills"
              title="An icon-led skill grid with consistent spacing and readable density."
              description="The strongest skills appear first, while category labels keep the grid understandable at a glance."
            />

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {loading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="skeleton h-40" />
                  ))
                : sortedSkills.map((skill) => {
                    const Icon =
                      categoryIconMap[(skill.category || "").toLowerCase()] || categoryIconMap.default;

                    return (
                      <article key={skill._id || skill.name} className="surface-card flex flex-col gap-5 p-6">
                        <div className="flex items-center justify-between">
                          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-500/10 text-primary-500">
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="rounded-full bg-secondary-100 px-3 py-1 text-xs font-semibold text-text-secondary">
                            {skill.level || 0}%
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-text-primary">{skill.name}</h3>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-text-muted">
                            {skill.category || "Skill"}
                          </p>
                        </div>
                        <div className="h-2 rounded-full bg-secondary-200">
                          <div
                            className="h-full rounded-full bg-primary-500 transition-all duration-300"
                            style={{ width: `${Math.min(skill.level || 0, 100)}%` }}
                          />
                        </div>
                      </article>
                    );
                  })}
            </div>

            {!loading && sortedSkills.length === 0 ? (
              <EmptyState message="No skills added yet. Add them from the admin dashboard when you are ready." />
            ) : null}
          </AnimatedSection>

          <AnimatedSection id="experience" className="glass-panel section-shell" delay={220}>
            <SectionIntro
              eyebrow="Experience"
              title="A vertical timeline focused on outcomes, not clutter."
              description="This section keeps one clear reading direction so recruiters can scan roles, duration, and achievements without losing context."
            />

            <div className="mt-10 grid gap-5">
              {loading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="skeleton h-44" />
                  ))
                : experience.map((item, index) => (
                    <article key={item._id} className="timeline-card">
                      {index !== experience.length - 1 ? <div className="timeline-line" /> : null}
                      <span className="absolute left-[14px] top-[30px] h-4 w-4 rounded-full border-4 border-white bg-primary-500 shadow-sm" />

                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-500">
                            {item.company}
                          </p>
                          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-text-primary">
                            {item.title}
                          </h3>
                        </div>
                        <span className="rounded-full bg-secondary-100 px-4 py-2 text-sm font-medium text-text-secondary">
                          {item.duration}
                        </span>
                      </div>

                      <p className="mt-5 text-sm text-text-secondary">{item.description}</p>

                      {item.achievements?.length ? (
                        <ul className="mt-5 grid gap-3">
                          {item.achievements.slice(0, 3).map((achievement) => (
                            <li key={achievement} className="flex gap-3 text-sm text-text-secondary">
                              <span className="mt-2 h-2 w-2 rounded-full bg-primary-500" />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </article>
                  ))}
            </div>

            {!loading && experience.length === 0 ? (
              <EmptyState message="No experience milestones added yet. Add them from the admin dashboard when ready." />
            ) : null}
          </AnimatedSection>

          <AnimatedSection id="certifications" className="glass-panel section-shell" delay={260}>
            <SectionIntro
              eyebrow="Certifications"
              title="Minimal cards that keep proof-of-learning lightweight and scannable."
              description="The layout avoids over-design so titles, issuers, and validation links stay easy to read on every screen size."
            />

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {loading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="skeleton h-52" />
                  ))
                : certifications.map((certification) => (
                    <article key={certification._id} className="surface-card flex h-full flex-col p-6">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-500/10 text-primary-500">
                        <Award className="h-5 w-5" />
                      </span>
                      <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-text-primary">
                        {certification.title}
                      </h3>
                      <p className="mt-2 text-sm text-text-secondary">{certification.issuer}</p>
                      <p className="mt-3 text-sm text-text-secondary">
                        Completed {formatMonthYear(certification.completionDate)}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-3">
                        {certification.previewFile ? (
                          <a
                            href={mediaUrl(certification.previewFile)}
                            target="_blank"
                            rel="noreferrer"
                            className="magnetic-button secondary"
                          >
                            <Eye className="h-4 w-4" />
                            Preview
                          </a>
                        ) : null}
                        {certification.credentialLink ? (
                          <a
                            href={certification.credentialLink}
                            target="_blank"
                            rel="noreferrer"
                            className="magnetic-button ghost"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Verify
                          </a>
                        ) : null}
                      </div>
                    </article>
                  ))}
            </div>

            {!loading && certifications.length === 0 ? (
              <EmptyState message="No certifications added yet. Add certificates from the admin dashboard when available." />
            ) : null}
          </AnimatedSection>

          <AnimatedSection id="contact" className="glass-panel section-shell" delay={320}>
            <SectionIntro
              eyebrow="Contact"
              title="A responsive contact section that stays clear on mobile and desktop."
              description="The layout keeps contact details and the form side by side on larger screens, then stacks cleanly without overflow on smaller devices."
            />

            <div className="mt-10 grid items-start gap-8 lg:grid-cols-2">
              <div className="mx-auto flex w-full max-w-xl flex-col gap-4 text-left">
                <ContactMethod
                  icon={Mail}
                  label="Email"
                  value={PROFILE.email}
                  href={`mailto:${PROFILE.email}`}
                />
                <ContactMethod
                  icon={Phone}
                  label="Phone"
                  value={PROFILE.phone}
                  href={`tel:${PROFILE.phone.replace(/\s+/g, "")}`}
                />
                <ContactMethod icon={MapPin} label="Location" value={PROFILE.location} />

                <div className="surface-card p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-500">
                    Best fit
                  </p>
                  <p className="mt-3 text-base text-text-secondary">
                    Open to internships, collaboration opportunities, portfolio reviews, and developer conversations.
                  </p>
                </div>
              </div>

              <form onSubmit={handleContactSubmit} className="mx-auto w-full max-w-xl surface-card p-6 sm:p-7">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Name"
                    value={contactForm.name}
                    onChange={(value) => handleContactChange("name", value)}
                    placeholder="Your name"
                    required
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={contactForm.email}
                    onChange={(value) => handleContactChange("email", value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="mt-4">
                  <Field
                    as="textarea"
                    label="Message"
                    value={contactForm.message}
                    onChange={(value) => handleContactChange("message", value)}
                    placeholder="Tell me about the role, project, or collaboration."
                    rows={6}
                    required
                  />
                </div>

                <div className="mt-5 rounded-[20px] border border-secondary-300 bg-secondary-100/60 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-text-primary">Rate this profile</p>
                      <p className="text-sm text-text-secondary">Default stars stay empty until you select one.</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-text-secondary shadow-sm">
                      Optional
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {Array.from({ length: 5 }, (_, index) => {
                      const isActive = index < contactForm.rating;

                      return (
                        <button
                          key={index}
                          type="button"
                          aria-label={`Rate ${index + 1} star${index === 0 ? "" : "s"}`}
                          aria-pressed={contactForm.rating === index + 1}
                          onClick={() =>
                            handleContactChange("rating", contactForm.rating === index + 1 ? 0 : index + 1)
                          }
                          className="grid h-10 w-10 place-items-center rounded-full border border-secondary-300 bg-white text-text-muted transition hover:border-primary-300 hover:text-primary-500"
                        >
                          <Star
                            className={`h-4 w-4 ${
                              isActive ? "fill-primary-500 text-primary-500" : "text-text-muted"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {submitState.message ? (
                  <div
                    className={`mt-5 rounded-2xl px-4 py-3 text-sm ${
                      submitState.type === "success"
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border border-rose-200 bg-rose-50 text-rose-700"
                    }`}
                  >
                    {submitState.message}
                  </div>
                ) : null}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <MagneticButton type="submit" disabled={sendingMessage}>
                    {sendingMessage ? "Sending..." : "Send Message"}
                    <ArrowRight className="h-4 w-4" />
                  </MagneticButton>
                  <p className="text-sm text-text-secondary">
                    Messages are stored for secure admin review.
                  </p>
                </div>
              </form>
            </div>
          </AnimatedSection>
        </main>

        <footer className="container-shell pb-8 pt-2">
          <div className="glass-panel flex flex-col gap-4 rounded-[28px] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-text-primary">{PROFILE.fullName}</p>
              <p className="text-sm text-text-secondary">
                Minimal portfolio system for recruiters, developers, and real project conversations.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
              <a href="#home" className="transition hover:text-primary-600">Home</a>
              <a href="#projects" className="transition hover:text-primary-600">Projects</a>
              <a href="#contact" className="transition hover:text-primary-600">Contact</a>
              <LinkOut href={`mailto:${PROFILE.email}`} label={`© ${new Date().getFullYear()} Portfolio`} />
            </div>
          </div>
        </footer>
      </div>

      <Modal
        isOpen={Boolean(activeProject)}
        onClose={() => setActiveProjectId(null)}
        title={activeProject?.title || "Project details"}
        description={activeProject?.description}
      >
        {activeProject ? (
          <div className="grid gap-6">
            {activeProject.image ? (
              <img
                src={mediaUrl(activeProject.image)}
                alt={activeProject.title}
                className="w-full rounded-[20px] border border-secondary-200 object-cover"
              />
            ) : null}

            <div className="grid gap-5 md:grid-cols-[1.15fr_0.85fr]">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-500">Overview</h3>
                <p className="mt-3 text-sm text-text-secondary">{activeProject.description}</p>

                {activeProject.features?.length ? (
                  <>
                    <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-primary-500">
                      Key features
                    </h3>
                    <ul className="mt-3 grid gap-2">
                      {activeProject.features.map((feature) => (
                        <li key={feature} className="flex gap-3 text-sm text-text-secondary">
                          <span className="mt-2 h-2 w-2 rounded-full bg-primary-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>

              <div className="surface-card-muted p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-500">Stack</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(activeProject.techStack || []).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-secondary-300 bg-white px-3 py-1 text-xs font-medium text-text-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {activeProject.liveLink ? (
                    <a href={activeProject.liveLink} target="_blank" rel="noreferrer" className="magnetic-button">
                      <ExternalLink className="h-4 w-4" />
                      Visit Live
                    </a>
                  ) : null}
                  {activeProject.githubLink ? (
                    <a
                      href={activeProject.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="magnetic-button secondary"
                    >
                      <Github className="h-4 w-4" />
                      View Code
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
};

const SectionIntro = ({ description, eyebrow, title }) => (
  <div className="max-w-3xl">
    <span className="section-chip">{eyebrow}</span>
    <h2 className="mt-5 text-3xl font-bold tracking-[-0.03em] text-text-primary sm:text-4xl">{title}</h2>
    <p className="mt-4 text-base text-text-secondary">{description}</p>
  </div>
);

const AboutTile = ({ text, title }) => (
  <article className="info-tile p-6">
    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-500">{title}</p>
    <p className="mt-3 text-sm text-text-secondary">{text}</p>
  </article>
);

const ContactMethod = ({ href, icon, label, value }) => {
  const Icon = icon;
  const content = (
    <div className="flex items-center gap-4">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-500/10 text-primary-500">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm text-text-secondary">{label}</p>
        <p className="text-base font-medium text-text-primary">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="surface-card p-5 transition hover:-translate-y-1 hover:shadow-md">
        {content}
      </a>
    );
  }

  return <div className="surface-card p-5">{content}</div>;
};

const Field = ({
  as = "input",
  label,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  type = "text",
  value,
}) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-text-primary">{label}</label>
    {as === "textarea" ? (
      <textarea
        rows={rows}
        className="field-control resize-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
      />
    ) : (
      <input
        type={type}
        className="field-control"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
      />
    )}
  </div>
);

const EmptyState = ({ message }) => (
  <div className="mt-8 rounded-[24px] border border-dashed border-secondary-300 bg-white/80 p-8 text-center text-sm text-text-secondary">
    {message}
  </div>
);

const ProjectSkeleton = () => (
  <div className="surface-card p-6">
    <div className="skeleton h-48 rounded-[20px]" />
    <div className="mt-5 space-y-3">
      <div className="skeleton h-6 w-2/3 rounded-xl" />
      <div className="skeleton h-4 w-full rounded-xl" />
      <div className="skeleton h-4 w-5/6 rounded-xl" />
    </div>
    <div className="mt-5 flex gap-2">
      <div className="skeleton h-8 w-20 rounded-full" />
      <div className="skeleton h-8 w-20 rounded-full" />
    </div>
  </div>
);

const LinkOut = ({ href, label }) => (
  <a href={href} className="transition hover:text-primary-600">
    {label}
  </a>
);

export default HomePage;
