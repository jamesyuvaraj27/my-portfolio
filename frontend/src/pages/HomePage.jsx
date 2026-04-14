import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  Code2,
  Database,
  Download,
  Eye,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";
import { startTransition, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import AnimatedSection from "../components/AnimatedSection";
import CursorAura from "../components/CursorAura";
import MagneticButton from "../components/MagneticButton";
import NavBar from "../components/NavBar";
import ScrollProgress from "../components/ScrollProgress";
import Seo from "../components/Seo";
import SectionHeading from "../components/SectionHeading";
import ProjectCard from "../components/ProjectCard";
import SkillMeter from "../components/SkillMeter";

// New Design System Components
import {
  HeroSection,
  AboutSection,
  SkillsSection,
  ProjectsSection,
  ExperienceSection,
  CertificationsSection,
  ContactSection,
} from "../components/sections";

import { Container, SkeletonCard } from "../components/ui/Layout";
import api from "../lib/axios";
import { PROFILE, SKILL_CATEGORIES } from "../lib/site";
import { apiUrl, formatMonthYear, mediaUrl } from "../lib/utils";

const EMPTY_LIST = [];

const socialIconMap = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  mail: Mail,
};

const categoryIconMap = {
  frontend: Code2,
  backend: Database,
  database: Database,
  "programming languages": Code2,
  "tools & platforms": Wrench,
  default: Sparkles,
};

/**
 * Footer Component
 */
const Footer = ({ profile = PROFILE }) => {
  return (
    <footer className="border-t border-white/10 bg-background-900/80">
      <Container className="py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-poppins font-bold text-white mb-2">
              {profile.fullName}
            </h3>
            <p className="text-text-muted text-sm">
              Full-stack developer building clean, scalable web applications with modern technologies.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-text-muted hover:text-text-secondary">
              <li><a href="#home" className="hover:text-primary-300">Home</a></li>
              <li><a href="#projects" className="hover:text-primary-300">Projects</a></li>
              <li><a href="#contact" className="hover:text-primary-300">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
              Follow
            </h4>
            <div className="flex gap-3">
              {profile?.socialLinks?.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 bg-white/5 text-text-muted hover:text-primary-300 hover:border-primary-500/50 transition-all"
                  title={link.label}
                >
                  📱
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <p>&copy; 2026 {profile.fullName}. All rights reserved.</p>
          <p>Built with React, Tailwind CSS, and ❤️</p>
        </div>
      </Container>
    </footer>
  );
};

const useTypingEffect = (phrases) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (phrases.length === 0) return undefined;

    const phrase = phrases[phraseIndex];
    const doneTyping = !deleting && letterCount === phrase.length;
    const doneDeleting = deleting && letterCount === 0;
    const delay = doneTyping ? 1100 : deleting ? 38 : 74;

    const timeoutId = window.setTimeout(() => {
      if (doneTyping) {
        setDeleting(true);
        return;
      }
      if (doneDeleting) {
        setDeleting(false);
        setPhraseIndex((current) => (current + 1) % phrases.length);
        return;
      }
      setLetterCount((current) => current + (deleting ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [deleting, letterCount, phraseIndex, phrases]);

  return phrases[phraseIndex]?.slice(0, letterCount) || "";
};

const groupSkills = (skills) => {
  const knownGroups = SKILL_CATEGORIES.map((category) => ({
    category,
    skills: skills
      .filter((skill) => skill.category?.toLowerCase() === category.toLowerCase())
      .sort((a, b) => b.level - a.level),
  }));
  const extraGroups = [...new Set(skills.map((skill) => skill.category).filter(Boolean))]
    .filter((category) => !SKILL_CATEGORIES.some((item) => item.toLowerCase() === category.toLowerCase()))
    .map((category) => ({
      category,
      skills: skills.filter((skill) => skill.category === category).sort((a, b) => b.level - a.level),
    }));

  return [...knownGroups, ...extraGroups].filter((group) => group.skills.length > 0);
};

const HomePage = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTech, setSelectedTech] = useState("All");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
    rating: 5,
  });
  const [sendingMessage, setSendingMessage] = useState(false);
  const typingPhrases = useMemo(() => [
    PROFILE.role,
    "React + Node.js Builder",
    "MERN Dashboard Developer",
  ], []);
  const typedRole = useTypingEffect(typingPhrases);

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

  const projects = portfolio?.projects || EMPTY_LIST;
  const photos = portfolio?.photos || EMPTY_LIST;
  const skills = portfolio?.skills || EMPTY_LIST;
  const experience = portfolio?.experience || EMPTY_LIST;
  const certifications = portfolio?.certifications || EMPTY_LIST;
  const filters = portfolio?.filters?.tech || ["All"];
  const resumeUrl = mediaUrl(portfolio?.resume?.url);
  const resumeDownloadUrl = portfolio?.resume?.url ? apiUrl("/content/resume/download") : "";
  const logoUrl = mediaUrl(portfolio?.logo?.url);
  const featuredProject = portfolio?.featuredProjects?.[0] || projects.find((project) => project.featured);
  const selectedPhoto = photos.find((photo) => photo.featured) || photos[0] || null;
  const avatarUrl = selectedPhoto ? mediaUrl(selectedPhoto.image) : PROFILE.avatarUrl;
  const avatarAlt = selectedPhoto?.alt || `${PROFILE.fullName} avatar`;
  const skillGroups = useMemo(() => groupSkills(skills), [skills]);
  const skillBadges = skills.length
    ? skills
        .slice()
        .sort((a, b) => b.level - a.level)
        .slice(0, 6)
        .map((skill) => skill.name)
    : PROFILE.skillBadges;

  const filteredProjects = projects.filter((project) => {
    const matchesTech = selectedTech === "All" || project.techStack.includes(selectedTech);
    return matchesTech;
  });

  const stats = [
    { label: "Projects built", value: String(projects.length).padStart(2, "0"), icon: BriefcaseBusiness },
    { label: "Technologies practiced", value: String(skills.length).padStart(2, "0"), icon: Code2 },
    { label: "Certifications", value: String(certifications.length).padStart(2, "0"), icon: Award },
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

    try {
      await api.post("/content/messages", contactForm);
      toast.success("Message sent. Thanks for reaching out.");
      setContactForm({ name: "", email: "", message: "", rating: 5 });
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send your message.");
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
        description="A full-stack developer portfolio with projects, skills, experience, certifications, and a managed resume download."
      />
      <CursorAura />
      <ScrollProgress />

      <div className="page-shell pb-16 pt-28">
        <NavBar logoUrl={logoUrl} />

        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          <AnimatedSection id="home" className="glass-panel section-shell overflow-hidden border border-white/10">
            <div className="hero-grid">
              <div>
                <span className="section-chip">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                  {PROFILE.availability}
                </span>
                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
                  {PROFILE.fullName}
                </p>
                <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {PROFILE.title}
                </h1>
                <p className="mt-5 min-h-8 text-lg font-semibold text-cyan-200">
                  <span>{typedRole}</span>
                  <span className="type-caret" aria-hidden="true" />
                </p>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                  {PROFILE.valueProposition}
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                  {PROFILE.summary}
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {skillBadges.map((skill) => (
                    <span key={skill} className="skill-badge">
                      <Code2 className="h-3.5 w-3.5 text-cyan-300" />
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  {resumeUrl ? (
                    <>
                      <MagneticButton href={resumeDownloadUrl}>
                        Download Resume
                        <Download className="h-4 w-4" />
                      </MagneticButton>
                      <MagneticButton href={resumeUrl} target="_blank" rel="noreferrer" variant="secondary">
                        View Resume
                        <Eye className="h-4 w-4" />
                      </MagneticButton>
                    </>
                  ) : (
                    <>
                      <MagneticButton type="button" onClick={handleMissingResume}>
                        Download Resume
                        <Download className="h-4 w-4" />
                      </MagneticButton>
                      <MagneticButton type="button" onClick={handleMissingResume} variant="secondary">
                        View Resume
                        <Eye className="h-4 w-4" />
                      </MagneticButton>
                    </>
                  )}
                  <MagneticButton href="#projects" variant="secondary">
                    Explore Projects
                    <ArrowRight className="h-4 w-4" />
                  </MagneticButton>
                  <MagneticButton href="#contact" variant="secondary">
                    Contact Me
                    <Mail className="h-4 w-4" />
                  </MagneticButton>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  {PROFILE.socialLinks.map((link) => {
                    const Icon = socialIconMap[link.icon] || Mail;
                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                        rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
                        className="social-link"
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="hero-profile">
                <div className="avatar-frame">
                  <img src={avatarUrl} alt={avatarAlt} className="h-full w-full object-cover" />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {stats.map((stat) => (
                    <div key={stat.label} className="stat-card">
                      <stat.icon className="h-5 w-5 text-cyan-300" />
                      <p className="mt-4 text-3xl font-semibold text-white">{stat.value}</p>
                      <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection id="about" className="glass-panel section-shell" delay={60}>
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <SectionHeading
                  eyebrow="About"
                  title="A practical builder with a steady learning loop."
                  description={PROFILE.about.intro}
                />
                <div className="mt-7 grid gap-4">
                  {[
                    ["Journey", PROFILE.about.journey],
                    ["Current learning", PROFILE.about.learning],
                    ["Focus areas", PROFILE.about.focus],
                    ["Growth mindset", PROFILE.about.mindset],
                    ["Goals", PROFILE.about.goals],
                  ].map(([title, text]) => (
                    <article key={title} className="info-tile">
                      <h3 className="text-base font-semibold text-white">{title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-300">{text}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div>
                <div className="media-panel">
                  <img src={avatarUrl} alt={avatarAlt} className="mx-auto h-44 w-44 object-cover rounded-full" loading="lazy" />
                  <p className="mt-5 text-sm leading-7 text-slate-300">
                    I care about the details that make software easier to use, easier to update, and easier to trust.
                  </p>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {stats.map((stat) => (
                    <div key={`about-${stat.label}`} className="stat-card">
                      <p className="text-2xl font-semibold text-white">{stat.value}</p>
                      <p className="mt-1 text-xs text-slate-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {PROFILE.strengths.map((strength) => (
                    <span key={strength} className="strength-chip">
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection id="projects" className="glass-panel section-shell" delay={120}>
            <SectionHeading
              eyebrow="Projects"
              title="Selected work with problem, solution, stack, and outcomes."
              description="Each project card is managed from the dashboard, including uploaded media and key features."
            />

            <div className="mt-6 flex flex-wrap gap-3">
              {filters.map((filter) => (
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

            {featuredProject ? (
              <div className="mt-8">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">
                  Featured Project
                </p>
                <ProjectCard project={featuredProject} featured />
              </div>
            ) : null}

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {loading
                ? Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)
                : filteredProjects
                    .filter((project) => project._id !== featuredProject?._id)
                    .map((project) => <ProjectCard key={project._id} project={project} />)}
            </div>

            {!loading && filteredProjects.length === 0 ? (
              <div className="mt-6 rounded-[1.75rem] border border-dashed border-white/10 bg-white/[0.03] p-8 text-center text-slate-400">
                No projects matched that filter yet. Try another stack or search term.
              </div>
            ) : null}
          </AnimatedSection>

          <AnimatedSection id="skills" className="glass-panel section-shell" delay={180}>
            <SectionHeading
              eyebrow="Skills"
              title="Top skills first, grouped by how they are used."
              description="The dashboard controls this section, so new skills and levels can be updated without editing frontend code."
            />

            <div className="mt-8 grid gap-5">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => <SkeletonCard key={index} className="h-32" />)
              ) : skillGroups.length > 0 ? (
                skillGroups.map((group) => {
                  const Icon = categoryIconMap[group.category] || Sparkles;
                  return (
                    <section key={group.category} className="skill-category">
                      <div className="mb-5 flex items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-cyan-200">
                          <Icon className="h-5 w-5" />
                        </span>
                        <h3 className="text-xl font-semibold text-white">{group.category}</h3>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        {group.skills.map((skill) => (
                          <SkillMeter key={skill._id} skill={skill} />
                        ))}
                      </div>
                    </section>
                  );
                })
              ) : (
                <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-white/[0.03] p-8 text-center text-slate-400">
                  No skills added yet. Add skills from the admin dashboard when you are ready.
                </div>
              )}
            </div>
          </AnimatedSection>

          <AnimatedSection id="experience" className="glass-panel section-shell" delay={220}>
            <SectionHeading
              eyebrow="Experience"
              title="Roles, organizations, duration, and key achievements."
              description="A concise timeline focused on what changed, shipped, or improved."
            />

            <div className="relative mt-8 grid gap-5">
              {experience.map((item) => (
                <article key={item._id} className="timeline-card">
                  <span className="absolute left-5 top-7 h-4 w-4 rounded-full border border-cyan-300/50 bg-cyan-300/25 shadow-[0_0_24px_rgba(34,211,238,0.55)]" />
                  <div className="timeline-line" />
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.26em] text-slate-500">
                        {item.company}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">{item.title}</h3>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
                      {item.duration}
                    </span>
                  </div>
                  <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300">{item.description}</p>
                  {item.achievements?.length ? (
                    <ul className="mt-4 grid gap-2 text-sm text-slate-300">
                      {item.achievements.slice(0, 3).map((achievement) => (
                        <li key={achievement} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>

            {!loading && experience.length === 0 ? (
              <div className="mt-6 rounded-[1.75rem] border border-dashed border-white/10 bg-white/[0.03] p-8 text-center text-slate-400">
                No experience entries added yet. Add milestones from the admin dashboard when you are ready.
              </div>
            ) : null}
          </AnimatedSection>

          <AnimatedSection id="certifications" className="glass-panel section-shell" delay={250}>
            <SectionHeading
              eyebrow="Certifications"
              title="Proof of steady learning and applied practice."
              description="Certificate previews open in a new tab when an uploaded PDF or image is available."
            />

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {certifications.map((certification) => (
                <article key={certification._id} className="info-tile">
                  <Award className="h-6 w-6 text-cyan-300" />
                  <h3 className="mt-5 text-xl font-semibold text-white">{certification.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{certification.issuer}</p>
                  <p className="mt-3 text-sm text-slate-300">
                    Completed {formatMonthYear(certification.completionDate)}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {certification.previewFile ? (
                      <a href={mediaUrl(certification.previewFile)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/15">
                        <Eye className="h-4 w-4" />
                        Preview
                      </a>
                    ) : null}
                    {certification.credentialLink ? (
                      <a href={certification.credentialLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/[0.05]">
                        Verify
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>

            {!loading && certifications.length === 0 ? (
              <div className="mt-6 rounded-[1.75rem] border border-dashed border-white/10 bg-white/[0.03] p-8 text-center text-slate-400">
                No certifications added yet. Add certificates from the admin dashboard when they are ready.
              </div>
            ) : null}
          </AnimatedSection>

          <AnimatedSection id="contact" className="glass-panel section-shell" delay={310}>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <SectionHeading
                  eyebrow="Contact"
                  title="Let us build, learn, and ship something useful."
                  description="Send a message for internships, collaborations, code reviews, or project walkthroughs."
                />

                <div className="mt-8 space-y-4">
                  <ContactRow icon={Phone} label="Phone" value={PROFILE.phone} href={`tel:${PROFILE.phone.replace(/\s+/g, "")}`} />
                  <ContactRow icon={Mail} label="Email" value={PROFILE.email} href={`mailto:${PROFILE.email}`} />
                  <ContactRow icon={MapPin} label="Location" value={PROFILE.location} />

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Note</p>
                    <p className="mt-3 text-base font-medium text-white">
                      Open to internships and learning opportunities
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {PROFILE.socialLinks.map((link) => {
                      const Icon = socialIconMap[link.icon] || Mail;
                      return (
                        <a
                          key={link.label}
                          href={link.href}
                          target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                          rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
                          className="social-link"
                        >
                          <Icon className="h-4 w-4" />
                          {link.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>

              <form onSubmit={handleContactSubmit} className="rounded-[1.9rem] border border-white/10 bg-slate-950/45 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Name</label>
                    <input className="field-control" value={contactForm.name} onChange={(event) => handleContactChange("name", event.target.value)} placeholder="Your name" required />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                    <input type="email" className="field-control" value={contactForm.email} onChange={(event) => handleContactChange("email", event.target.value)} placeholder="you@example.com" required />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-slate-300">Message</label>
                  <textarea rows="6" className="field-control resize-none" value={contactForm.message} onChange={(event) => handleContactChange("message", event.target.value)} placeholder="Tell me about the opportunity, team, or project." required />
                </div>

                <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                  <label className="mb-2 block text-sm font-medium text-slate-300">Rate this profile</label>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 cursor-pointer transition-colors ${
                          i < contactForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
                        }`}
                        onClick={() => handleContactChange("rating", i + 1)}
                      />
                    ))}
                  </div>
                  <div className="mt-3 text-sm text-slate-300">
                    Click the stars to rate from 1 to 5.
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <MagneticButton type="submit" disabled={sendingMessage} className="disabled:opacity-70">
                    {sendingMessage ? "Sending..." : "Send Message"}
                    <ArrowRight className="h-4 w-4" />
                  </MagneticButton>
                  <p className="text-sm text-slate-400">Messages are stored securely for admin review.</p>
                </div>
              </form>
            </div>
          </AnimatedSection>
        </main>

        <footer className="mx-auto mt-4 flex w-full max-w-7xl flex-col gap-4 px-4 pb-8 pt-2 text-sm text-slate-400 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
          <p>{PROFILE.fullName} builds MERN applications with clean UI and practical admin workflows.</p>
          <div className="flex flex-wrap gap-4">
            {PROFILE.socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
                className="transition hover:text-cyan-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
};

const ContactRow = ({ href, icon, label, value }) => {
  const IconComponent = icon;
  const content = (
    <>
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-200">
        <IconComponent className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-sm text-slate-500">{label}</span>
        <span className="block text-base font-medium text-white">{value}</span>
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} className="flex items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-400/30">
        {content}
      </a>
    );
  }

  return <div className="flex items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">{content}</div>;
};

export default HomePage;
