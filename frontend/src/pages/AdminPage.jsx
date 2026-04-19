import {
  ArrowLeft,
  Award,
  BriefcaseBusiness,
  FileText,
  FolderKanban,
  Image,
  LoaderCircle,
  LogOut,
  MessagesSquare,
  Save,
  Shield,
  Star,
  StarHalf,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import MagneticButton from "../components/MagneticButton";
import {
  EditorPanel,
  Field,
  FileField,
  ListPanel,
  ResourceCard,
  TextAreaField,
} from "../components/admin/AdminPanels";
import Seo from "../components/Seo";
import api from "../lib/axios";
import { formatDate, joinList, mediaUrl, splitCsv } from "../lib/utils";

const EMPTY_PROJECT = {
  title: "",
  description: "",
  techStack: "",
  features: "",
  image: "",
  imageFile: null,
  githubLink: "",
  liveLink: "",
  featured: false,
};
const EMPTY_SKILL = { name: "", level: 80, category: "Frontend" };
const EMPTY_EXPERIENCE = { title: "", company: "", duration: "", description: "", achievements: "" };
const EMPTY_CERTIFICATION = {
  title: "",
  issuer: "",
  completionDate: "",
  previewFile: "",
  previewFileUpload: null,
  credentialLink: "",
};
const EMPTY_PHOTO = {
  title: "",
  description: "",
  image: "",
  imageFile: null,
  alt: "",
  featured: false,
};
const EMPTY_TESTIMONIAL = { name: "", role: "", message: "", rating: "" };

const emptyForms = {
  project: EMPTY_PROJECT,
  skill: EMPTY_SKILL,
  experience: EMPTY_EXPERIENCE,
  certification: EMPTY_CERTIFICATION,
  photo: EMPTY_PHOTO,
  testimonial: EMPTY_TESTIMONIAL,
};

const labels = {
  projects: "project",
  skills: "skill",
  experience: "experience",
  certifications: "certification",
  photos: "photo",
  testimonials: "testimonial",
  messages: "message",
};

const toDateInputValue = (dateValue) => {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const buildFormData = (fields, fileFields = {}) => {
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    const normalizedValue = value === undefined || value === null ? "" : typeof value === "boolean" ? String(value) : value;
    formData.append(key, normalizedValue);
  });

  Object.entries(fileFields).forEach(([key, file]) => {
    if (file && file instanceof Blob) {
      formData.append(key, file);
    }
  });

  return formData;
};

const sendFormRequest = async (endpoint, payload, method = "post") => {
  const config = payload instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
  return method === "put" ? api.put(endpoint, payload, config) : api.post(endpoint, payload, config);
};

const AdminPage = () => {
  const [initialized, setInitialized] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("resume");
  const [dashboard, setDashboard] = useState({
    projects: [],
    skills: [],
    experience: [],
    certifications: [],
    testimonials: [],
    messages: [],
    resume: null,
    photos: [],
    logo: null,
  });
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [setupForm, setSetupForm] = useState({ name: "", email: "", password: "" });
  const [logoFile, setLogoFile] = useState(null);
  const [forms, setForms] = useState(emptyForms);
  const [resumeFile, setResumeFile] = useState(null);
  const [editingIds, setEditingIds] = useState({
    project: null,
    skill: null,
    experience: null,
    certification: null,
    photo: null,
    testimonial: null,
  });
  const [submitting, setSubmitting] = useState({
    auth: false,
    setup: false,
    resume: false,
    logo: false,
    project: false,
    skill: false,
    experience: false,
    certification: false,
    photo: false,
    testimonial: false,
    logout: false,
  });

  useEffect(() => {
    let ignore = false;

    const loadSession = async () => {
      setLoadingAuth(true);
      try {
        const [statusResponse, meResponse] = await Promise.allSettled([
          api.get("/auth/status"),
          api.get("/auth/me"),
        ]);

        if (ignore) return;
        if (statusResponse.status === "fulfilled") {
          setInitialized(statusResponse.value.data.initialized);
        }
        if (meResponse.status === "fulfilled") {
          setUser(meResponse.value.data.user);
          await loadDashboard();
        }
      } finally {
        if (!ignore) setLoadingAuth(false);
      }
    };

    loadSession();
    return () => {
      ignore = true;
    };
  }, []);

  const loadDashboard = async () => {
    setLoadingDashboard(true);
    try {
      const { data } = await api.get("/admin/dashboard");
      startTransition(() =>
        setDashboard({
          projects: data.projects || [],
          skills: data.skills || [],
          experience: data.experience || [],
          certifications: data.certifications || [],
          testimonials: data.testimonials || [],
          messages: data.messages || [],
          resume: data.resume || null,
          photos: data.photos || [],
          logo: data.logo || null,
        })
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load dashboard data.");
    } finally {
      setLoadingDashboard(false);
    }
  };

  const updateForm = (resource, field, value) => {
    setForms((current) => ({
      ...current,
      [resource]: { ...current[resource], [field]: value },
    }));
  };

  const resetEditor = (resource) => {
    setForms((current) => ({
      ...current,
      [resource]: { ...emptyForms[resource] },
    }));
    setEditingIds((current) => ({ ...current, [resource]: null }));
  };

  const beginEdit = (resource, item) => {
    setEditingIds((current) => ({ ...current, [resource]: item._id }));
    setForms((current) => ({
      ...current,
      [resource]:
        resource === "project"
          ? {
              title: item.title || "",
              description: item.description || "",
              techStack: joinList(item.techStack),
              features: joinList(item.features),
              image: item.image || "",
              imageFile: null,
              githubLink: item.githubLink || "",
              liveLink: item.liveLink || "",
              featured: Boolean(item.featured),
            }
          : resource === "skill"
            ? { name: item.name || "", level: item.level || 80, category: item.category || "Frontend" }
            : resource === "experience"
              ? {
                  title: item.title || "",
                  company: item.company || "",
                  duration: item.duration || "",
                  description: item.description || "",
                  achievements: joinList(item.achievements),
                }
              : resource === "certification"
                ? {
                    title: item.title || "",
                    issuer: item.issuer || "",
                    completionDate: toDateInputValue(item.completionDate),
                    previewFile: item.previewFile || "",
                    previewFileUpload: null,
                    credentialLink: item.credentialLink || "",
                  }
                : resource === "photo"
                  ? {
                      title: item.title || "",
                      description: item.description || "",
                      image: item.image || "",
                      imageFile: null,
                      alt: item.alt || "",
                      featured: Boolean(item.featured),
                    }
                  : {
                      name: item.name || "",
                      role: item.role || "",
                      message: item.message || "",
                      rating: item.rating ?? "",
                    },
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setSubmitting((current) => ({ ...current, auth: true }));
    try {
      const { data } = await api.post("/auth/login", authForm);
      setUser(data.user);
      toast.success("Welcome back.");
      await loadDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to log in.");
    } finally {
      setSubmitting((current) => ({ ...current, auth: false }));
    }
  };

  const handleSetup = async (event) => {
    event.preventDefault();
    setSubmitting((current) => ({ ...current, setup: true }));
    try {
      const { data } = await api.post("/auth/bootstrap", setupForm);
      setUser(data.user);
      setInitialized(true);
      toast.success("Admin created successfully.");
      await loadDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create admin.");
    } finally {
      setSubmitting((current) => ({ ...current, setup: false }));
    }
  };

  const handleLogout = async () => {
    setSubmitting((current) => ({ ...current, logout: true }));
    try {
      await api.post("/auth/logout");
      setUser(null);
      setDashboard({
        projects: [],
        skills: [],
        experience: [],
        certifications: [],
        testimonials: [],
        messages: [],
        resume: null,
        photos: [],
      });
      toast.success("Signed out.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to sign out.");
    } finally {
      setSubmitting((current) => ({ ...current, logout: false }));
    }
  };

  const getResourceRequest = (resource) => {
    if (resource === "project") {
      return {
        endpoint: "/admin/projects",
        payload: buildFormData(
          {
            title: forms.project.title,
            description: forms.project.description,
            techStack: splitCsv(forms.project.techStack).join(","),
            features: splitCsv(forms.project.features).join(","),
            image: forms.project.image,
            githubLink: forms.project.githubLink,
            liveLink: forms.project.liveLink,
            featured: String(forms.project.featured),
          },
          { imageFile: forms.project.imageFile }
        ),
      };
    }

    if (resource === "skill") {
      return {
        endpoint: "/admin/skills",
        payload: { ...forms.skill, level: Number(forms.skill.level) },
      };
    }

    if (resource === "experience") {
      return {
        endpoint: "/admin/experience",
        payload: { ...forms.experience, achievements: splitCsv(forms.experience.achievements) },
      };
    }

    if (resource === "certification") {
      return {
        endpoint: "/admin/certifications",
        payload: buildFormData(
          {
            title: forms.certification.title,
            issuer: forms.certification.issuer,
            completionDate: forms.certification.completionDate,
            previewFile: forms.certification.previewFile,
            credentialLink: forms.certification.credentialLink,
          },
          { previewFile: forms.certification.previewFileUpload }
        ),
      };
    }

    if (resource === "photo") {
      return {
        endpoint: "/admin/photos",
        payload: buildFormData(
          {
            title: forms.photo.title,
            description: forms.photo.description,
            image: forms.photo.image,
            alt: forms.photo.alt,
            featured: String(forms.photo.featured),
          },
          { imageFile: forms.photo.imageFile }
        ),
      };
    }

    return {
      endpoint: "/admin/testimonials",
      payload: { ...forms.testimonial, rating: Number(forms.testimonial.rating) },
    };
  };

  const handleResourceSubmit = async (resource) => {
    const { endpoint, payload } = getResourceRequest(resource);

    setSubmitting((current) => ({ ...current, [resource]: true }));
    try {
      if (editingIds[resource]) {
        await sendFormRequest(`${endpoint}/${editingIds[resource]}`, payload, "put");
        toast.success(`${capitalize(resource)} updated.`);
      } else {
        await sendFormRequest(endpoint, payload, "post");
        toast.success(`${capitalize(resource)} created.`);
      }
      await loadDashboard();
      resetEditor(resource);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || `Unable to save ${resource}.`);
    } finally {
      setSubmitting((current) => ({ ...current, [resource]: false }));
    }
  };

  const handleResumeSubmit = async () => {
    if (!resumeFile) {
      toast.error("Choose a PDF resume before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);

    setSubmitting((current) => ({ ...current, resume: true }));
    try {
      await api.post("/admin/resume", formData);
      setResumeFile(null);
      toast.success("Resume uploaded.");
      await loadDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to upload resume.");
    } finally {
      setSubmitting((current) => ({ ...current, resume: false }));
    }
  };

  const handleLogoSubmit = async () => {
    if (!logoFile) {
      toast.error("Choose a logo image before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("logo", logoFile);

    setSubmitting((current) => ({ ...current, logo: true }));
    try {
      await api.post("/admin/logo", formData);
      setLogoFile(null);
      toast.success("Logo uploaded.");
      await loadDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to upload logo.");
    } finally {
      setSubmitting((current) => ({ ...current, logo: false }));
    }
  };

  const handleDeleteLogo = async () => {
    if (!window.confirm("Remove the uploaded logo?")) return;

    try {
      await api.delete("/admin/logo");
      toast.success("Logo removed.");
      await loadDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to remove logo.");
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm("Remove the uploaded resume?")) return;

    try {
      await api.delete("/admin/resume");
      toast.success("Resume removed.");
      await loadDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to remove resume.");
    }
  };

  const handleDelete = async (resource, id) => {
    const label = labels[resource] || "item";
    if (!window.confirm(`Delete this ${label}?`)) return;

    try {
      await api.delete(`/admin/${resource}/${id}`);
      toast.success(`${capitalize(label)} deleted.`);
      await loadDashboard();
      if (resource === "projects") resetEditor("project");
      if (resource === "skills") resetEditor("skill");
      if (resource === "experience") resetEditor("experience");
      if (resource === "certifications") resetEditor("certification");
      if (resource === "photos") resetEditor("photo");
      if (resource === "testimonials") resetEditor("testimonial");
    } catch (error) {
      toast.error(error.response?.data?.message || `Unable to delete ${label}.`);
    }
  };

  const metrics = useMemo(
    () => [
      { label: "Projects", value: dashboard.projects.length, icon: FolderKanban },
      { label: "Skills", value: dashboard.skills.length, icon: Shield },
      { label: "Experience", value: dashboard.experience.length, icon: BriefcaseBusiness },
      { label: "Photos", value: dashboard.photos.length, icon: Image },
      { label: "Certifications", value: dashboard.certifications.length, icon: Award },
      { label: "Messages", value: dashboard.messages.length, icon: MessagesSquare },
    ],
    [dashboard]
  );

  return (
    <>
      <Seo
        title="AstraDev Admin"
        description="Secure admin dashboard for managing portfolio uploads, projects, skills, experience, testimonials, certifications, and messages."
      />

      <div className="admin-theme page-shell min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        {loadingAuth ? (
          <LoadingCard label="Loading admin workspace..." />
        ) : !user ? (
          <AuthScreen
            initialized={initialized}
            authForm={authForm}
            setAuthForm={setAuthForm}
            setupForm={setupForm}
            setSetupForm={setSetupForm}
            submitting={submitting}
            handleLogin={handleLogin}
            handleSetup={handleSetup}
          />
        ) : (
          <DashboardScreen
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            metrics={metrics}
            dashboard={dashboard}
            forms={forms}
            resumeFile={resumeFile}
            setResumeFile={setResumeFile}
            logoFile={logoFile}
            setLogoFile={setLogoFile}
            submitting={submitting}
            loadingDashboard={loadingDashboard}
            updateForm={updateForm}
            resetEditor={resetEditor}
            beginEdit={beginEdit}
            handleResourceSubmit={handleResourceSubmit}
            handleResumeSubmit={handleResumeSubmit}
            handleDeleteResume={handleDeleteResume}
            handleLogoSubmit={handleLogoSubmit}
            handleDeleteLogo={handleDeleteLogo}
            handleDelete={handleDelete}
            handleLogout={handleLogout}
            editingIds={editingIds}
          />
        )}
      </div>
    </>
  );
};

const LoadingCard = ({ label }) => (
  <div className="grid min-h-[80vh] place-items-center">
    <div className="glass-panel flex w-full max-w-md items-center gap-3 rounded-[2rem] px-6 py-5 text-slate-200">
      <LoaderCircle className="h-5 w-5 animate-spin text-cyan-300" />
      {label}
    </div>
  </div>
);

const AuthScreen = ({
  initialized,
  authForm,
  setAuthForm,
  setupForm,
  setSetupForm,
  submitting,
  handleLogin,
  handleSetup,
}) => (
  <div className="mx-auto grid min-h-[85vh] w-full max-w-6xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
    <section className="glass-panel rounded-[2.2rem] p-8 sm:p-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-cyan-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to portfolio
      </Link>
      <span className="section-chip mt-8">
        <Shield className="h-3.5 w-3.5 text-cyan-300" />
        Secure admin access
      </span>
      <h1 className="mt-6 text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl">
        Manage portfolio content without touching code.
      </h1>
      <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
        Upload the resume, maintain project media, organize skills, add testimonials, and review messages from one protected dashboard.
      </p>
    </section>

    <section className="glass-panel rounded-[2.2rem] p-8 sm:p-10">
      {!initialized ? (
        <>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">
            <UserPlus className="h-4 w-4" />
            First-time setup
          </div>
          <h2 className="mt-5 text-3xl font-semibold text-white">Create the first admin</h2>
          <form className="mt-8 space-y-4" onSubmit={handleSetup}>
            <Field label="Name" value={setupForm.name} onChange={(value) => setSetupForm((current) => ({ ...current, name: value }))} required />
            <Field label="Email" type="email" value={setupForm.email} onChange={(value) => setSetupForm((current) => ({ ...current, email: value }))} required />
            <Field label="Password" type="password" value={setupForm.password} onChange={(value) => setSetupForm((current) => ({ ...current, password: value }))} required />
            <MagneticButton type="submit" className="w-full" disabled={submitting.setup}>
              {submitting.setup ? "Creating admin..." : "Create admin"}
            </MagneticButton>
          </form>
        </>
      ) : (
        <>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
            <Shield className="h-4 w-4" />
            Admin login
          </div>
          <h2 className="mt-5 text-3xl font-semibold text-white">Sign in to AstraDev</h2>
          <form className="mt-8 space-y-4" onSubmit={handleLogin}>
            <Field label="Email" type="email" value={authForm.email} onChange={(value) => setAuthForm((current) => ({ ...current, email: value }))} required />
            <Field label="Password" type="password" value={authForm.password} onChange={(value) => setAuthForm((current) => ({ ...current, password: value }))} required />
            <MagneticButton type="submit" className="w-full" disabled={submitting.auth}>
              {submitting.auth ? "Signing in..." : "Sign in"}
            </MagneticButton>
          </form>
        </>
      )}
    </section>
  </div>
);

const DashboardScreen = ({
  user,
  activeTab,
  setActiveTab,
  metrics,
  dashboard,
  forms,
  resumeFile,
  setResumeFile,
  logoFile,
  setLogoFile,
  editingIds,
  submitting,
  loadingDashboard,
  updateForm,
  resetEditor,
  beginEdit,
  handleResourceSubmit,
  handleResumeSubmit,
  handleDeleteResume,
  handleLogoSubmit,
  handleDeleteLogo,
  handleDelete,
  handleLogout,
}) => {
  const tabs = ["logo", "resume", "projects", "skills", "experience", "photos", "certifications", "messages"];

  return (
    <div className="mx-auto w-full max-w-7xl">
      <header className="glass-panel rounded-[2.2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
              <Shield className="h-4 w-4" />
              Authenticated admin
            </div>
            <h1 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">Welcome, {user.name}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/[0.05]">
              <ArrowLeft className="h-4 w-4" />
              View portfolio
            </Link>
            <MagneticButton type="button" variant="secondary" onClick={handleLogout} disabled={submitting.logout}>
              <LogOut className="h-4 w-4" />
              {submitting.logout ? "Signing out..." : "Sign out"}
            </MagneticButton>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-[1.6rem] border border-white/10 bg-slate-950/45 p-5">
              <metric.icon className="h-5 w-5 text-cyan-300" />
              <p className="mt-4 text-3xl font-semibold text-white">{metric.value}</p>
              <p className="mt-2 text-sm text-slate-400">{metric.label}</p>
            </div>
          ))}
        </div>
      </header>

      <main className="mt-6 grid gap-6">
        <div className="glass-panel rounded-[2rem] p-4">
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`tab-button ${activeTab === tab ? "is-active" : ""}`}
              >
                {capitalize(tab)}
              </button>
            ))}
          </div>
        </div>

        {loadingDashboard ? <LoadingCard label="Syncing dashboard content..." /> : null}

        {activeTab === "logo" && (
          <LogoPanel
            logo={dashboard.logo}
            logoFile={logoFile}
            setLogoFile={setLogoFile}
            submitting={submitting.logo}
            onSubmit={handleLogoSubmit}
            onDelete={handleDeleteLogo}
          />
        )}

        {activeTab === "resume" && (
          <ResumePanel
            resume={dashboard.resume}
            resumeFile={resumeFile}
            setResumeFile={setResumeFile}
            submitting={submitting.resume}
            onSubmit={handleResumeSubmit}
            onDelete={handleDeleteResume}
          />
        )}

        {activeTab === "projects" && (
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <EditorPanel title={editingIds.project ? "Edit project" : "Add project"} description="Projects feed the public showcase and filter controls." onReset={() => resetEditor("project")} isEditing={Boolean(editingIds.project)}>
              <ProjectEditor form={forms.project} submitting={submitting.project} isEditing={Boolean(editingIds.project)} updateForm={updateForm} onSubmit={() => handleResourceSubmit("project")} onCancel={() => resetEditor("project")} />
            </EditorPanel>
            <ListPanel title="Project library" items={dashboard.projects} emptyLabel="No projects yet." renderItem={(project) => (
              <ResourceCard key={project._id} title={project.title} subtitle={project.techStack.join(" / ")} description={project.description} badges={project.featured ? ["Featured"] : []} onEdit={() => beginEdit("project", project)} onDelete={() => handleDelete("projects", project._id)} />
            )} />
          </div>
        )}

        {activeTab === "skills" && (
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <EditorPanel title={editingIds.skill ? "Edit skill" : "Add skill"} description="Skills power the categorized portfolio skill section." onReset={() => resetEditor("skill")} isEditing={Boolean(editingIds.skill)}>
              <SkillEditor form={forms.skill} submitting={submitting.skill} isEditing={Boolean(editingIds.skill)} updateForm={updateForm} onSubmit={() => handleResourceSubmit("skill")} onCancel={() => resetEditor("skill")} />
            </EditorPanel>
            <ListPanel title="Skill matrix" items={dashboard.skills} emptyLabel="No skills yet." renderItem={(skill) => (
              <ResourceCard key={skill._id} title={skill.name} subtitle={`${skill.category} / ${skill.level}%`} onEdit={() => beginEdit("skill", skill)} onDelete={() => handleDelete("skills", skill._id)} />
            )} />
          </div>
        )}

        {activeTab === "experience" && (
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <EditorPanel title={editingIds.experience ? "Edit experience" : "Add experience"} description="Timeline entries appear in the public experience section." onReset={() => resetEditor("experience")} isEditing={Boolean(editingIds.experience)}>
              <ExperienceEditor form={forms.experience} submitting={submitting.experience} isEditing={Boolean(editingIds.experience)} updateForm={updateForm} onSubmit={() => handleResourceSubmit("experience")} onCancel={() => resetEditor("experience")} />
            </EditorPanel>
            <ListPanel title="Timeline entries" items={dashboard.experience} emptyLabel="No experience entries yet." renderItem={(item) => (
              <ResourceCard key={item._id} title={item.title} subtitle={`${item.company} / ${item.duration}`} description={item.description} onEdit={() => beginEdit("experience", item)} onDelete={() => handleDelete("experience", item._id)} />
            )} />
          </div>
        )}

        {activeTab === "photos" && (
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <EditorPanel title={editingIds?.photo ? "Edit photo" : "Add photo"} description="Photos can be used throughout the portfolio for visual content." onReset={() => resetEditor("photo")} isEditing={Boolean(editingIds?.photo)}>
              <PhotoEditor form={forms?.photo || EMPTY_PHOTO} submitting={submitting?.photo} isEditing={Boolean(editingIds?.photo)} updateForm={updateForm} onSubmit={() => handleResourceSubmit("photo")} onCancel={() => resetEditor("photo")} />
            </EditorPanel>
            <ListPanel title="Photo gallery" items={dashboard?.photos || []} emptyLabel="No photos yet." renderItem={(photo) => (
              <ResourceCard key={photo._id} title={photo.title} subtitle={photo.description || "No description"} description={photo.image ? "Image uploaded." : "No image yet."} badges={photo.featured ? ["Featured"] : []} onEdit={() => beginEdit("photo", photo)} onDelete={() => handleDelete("photos", photo._id)} />
            )} />
          </div>
        )}

        {activeTab === "certifications" && (
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <EditorPanel title={editingIds.certification ? "Edit certification" : "Add certification"} description="Certificate cards appear with issuer, completion date, and preview links." onReset={() => resetEditor("certification")} isEditing={Boolean(editingIds.certification)}>
              <CertificationEditor form={forms.certification} submitting={submitting.certification} isEditing={Boolean(editingIds.certification)} updateForm={updateForm} onSubmit={() => handleResourceSubmit("certification")} onCancel={() => resetEditor("certification")} />
            </EditorPanel>
            <ListPanel title="Certificates" items={dashboard.certifications} emptyLabel="No certifications yet." renderItem={(certification) => (
              <ResourceCard key={certification._id} title={certification.title} subtitle={`${certification.issuer} / ${formatDate(certification.completionDate)}`} description={certification.previewFile ? "Preview file uploaded." : "No preview file yet."} onEdit={() => beginEdit("certification", certification)} onDelete={() => handleDelete("certifications", certification._id)} />
            )} />
          </div>
        )}


        {activeTab === "messages" && (
          <ListPanel title="Inbox" items={dashboard.messages} emptyLabel="No messages received yet." renderItem={(message) => (
            <article key={message._id} className="rounded-[1.7rem] border border-white/10 bg-slate-950/45 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{message.name}</h3>
                  <a href={`mailto:${message.email}`} className="mt-1 inline-block text-sm text-cyan-200 transition hover:text-cyan-100">{message.email}</a>
                  {message.rating ? (
                    <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                      <Star className="h-3.5 w-3.5 text-amber-300" />
                      {message.rating}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500">{formatDate(message.createdAt)}</span>
                  <button type="button" onClick={() => handleDelete("messages", message._id)} className="inline-flex items-center gap-2 rounded-full border border-rose-400/25 bg-rose-400/10 px-3 py-2 text-sm text-rose-200 transition hover:bg-rose-400/15">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300">{message.message}</p>
            </article>
          )} />
        )}
      </main>
    </div>
  );
};

const ResumePanel = ({ resume, resumeFile, setResumeFile, submitting, onSubmit, onDelete }) => {
  const resumeHref = mediaUrl(resume?.url);

  return (
    <section className="glass-panel rounded-[2rem] p-6 sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
            <FileText className="h-4 w-4" />
            Resume upload
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-white">Replace the public resume PDF</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Uploads are stored as files and the portfolio buttons automatically use the latest PDF.
          </p>
        </div>

        <div className="grid gap-4 rounded-[1.7rem] border border-white/10 bg-slate-950/45 p-5">
          <FileField
            label="Resume PDF"
            accept="application/pdf"
            hint="PDF only, max 8 MB"
            currentFileLabel={resumeFile?.name || resume?.originalName}
            onChange={setResumeFile}
          />
          <div className="flex flex-wrap gap-3">
            <MagneticButton type="button" onClick={onSubmit} disabled={submitting}>
              <Save className="h-4 w-4" />
              {submitting ? "Uploading..." : "Upload resume"}
            </MagneticButton>
            {resumeHref ? (
              <>
                <MagneticButton href={resumeHref} target="_blank" rel="noreferrer" variant="secondary">
                  View current
                </MagneticButton>
                <button type="button" onClick={onDelete} className="inline-flex items-center gap-2 rounded-full border border-rose-400/25 bg-rose-400/10 px-4 py-2 text-sm text-rose-200 transition hover:bg-rose-400/15">
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

const LogoPanel = ({ logo, logoFile, setLogoFile, submitting, onSubmit, onDelete }) => {
  const logoUrl = mediaUrl(logo?.url);

  return (
    <section className="glass-panel rounded-[2rem] p-6 sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
            <Image className="h-4 w-4" />
            Logo upload
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-white">Upload the navbar logo</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Upload a square logo image to replace the text marker in the navbar. The preview shows the current file shape and size.
          </p>
        </div>

        <div className="grid gap-4 rounded-[1.7rem] border border-white/10 bg-slate-950/45 p-5">
          {logoUrl ? (
            <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-[1.4rem] border border-white/10 bg-slate-950/40 shadow-lg">
              <img src={logoUrl} alt="Current site logo" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-[1.4rem] border border-dashed border-white/10 bg-white/[0.03] text-sm text-slate-400">
              No logo yet
            </div>
          )}

          <FileField
            label="Logo image"
            accept="image/png,image/jpeg,image/webp,image/avif"
            hint="Upload a square logo with rounded corners"
            currentFileLabel={logoFile?.name || logo?.originalName || "No file selected"}
            onChange={setLogoFile}
          />

          <div className="flex flex-wrap gap-3">
            <MagneticButton type="button" onClick={onSubmit} disabled={submitting || !logoFile}>
              <Save className="h-4 w-4" />
              {submitting ? "Uploading..." : "Upload logo"}
            </MagneticButton>
            {logoUrl ? (
              <button type="button" onClick={onDelete} className="inline-flex items-center gap-2 rounded-full border border-rose-400/25 bg-rose-400/10 px-4 py-2 text-sm text-rose-200 transition hover:bg-rose-400/15">
                <Trash2 className="h-4 w-4" />
                Remove logo
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProjectEditor = ({ form, submitting, isEditing, updateForm, onSubmit, onCancel }) => (
  <div className="grid gap-4">
    <Field label="Title" value={form.title} onChange={(value) => updateForm("project", "title", value)} required />
    <TextAreaField label="Description" hint="Problem and solution" value={form.description} onChange={(value) => updateForm("project", "description", value)} />
    <Field label="Tech stack" hint="Comma separated" value={form.techStack} onChange={(value) => updateForm("project", "techStack", value)} />
    <TextAreaField label="Key features" hint="Comma separated, 2 to 3 items" rows={3} value={form.features} onChange={(value) => updateForm("project", "features", value)} />
    <FileField label="Project image" accept="image/png,image/jpeg,image/webp,image/avif,image/gif" hint="Upload instead of pasting a URL" currentFileLabel={form.imageFile?.name || form.image} onChange={(file) => updateForm("project", "imageFile", file)} />
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="GitHub link" value={form.githubLink} onChange={(value) => updateForm("project", "githubLink", value)} />
      <Field label="Demo link" value={form.liveLink} onChange={(value) => updateForm("project", "liveLink", value)} />
    </div>
    <label className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200">
      <input type="checkbox" checked={form.featured} onChange={(event) => updateForm("project", "featured", event.target.checked)} />
      Mark as featured
    </label>
    <ActionButtons label={isEditing ? "Update project" : "Create project"} loading={submitting} showCancel={isEditing} onSubmit={onSubmit} onCancel={onCancel} />
  </div>
);

const SkillEditor = ({ form, submitting, isEditing, updateForm, onSubmit, onCancel }) => (
  <div className="grid gap-4">
    <Field label="Name" value={form.name} onChange={(value) => updateForm("skill", "name", value)} required />
    <Field label="Category" value={form.category} onChange={(value) => updateForm("skill", "category", value)} placeholder="Frontend, Backend, Database..." required />
    <Field label="Level" type="number" min="1" max="100" value={form.level} onChange={(value) => updateForm("skill", "level", value)} required />
    <ActionButtons label={isEditing ? "Update skill" : "Create skill"} loading={submitting} showCancel={isEditing} onSubmit={onSubmit} onCancel={onCancel} />
  </div>
);

const ExperienceEditor = ({ form, submitting, isEditing, updateForm, onSubmit, onCancel }) => (
  <div className="grid gap-4">
    <Field label="Role" value={form.title} onChange={(value) => updateForm("experience", "title", value)} required />
    <Field label="Organization" value={form.company} onChange={(value) => updateForm("experience", "company", value)} required />
    <Field label="Duration" value={form.duration} onChange={(value) => updateForm("experience", "duration", value)} required />
    <TextAreaField label="Summary" value={form.description} onChange={(value) => updateForm("experience", "description", value)} />
    <TextAreaField label="Key achievements" hint="Comma separated, 2 to 3 items" rows={3} value={form.achievements} onChange={(value) => updateForm("experience", "achievements", value)} />
    <ActionButtons label={isEditing ? "Update experience" : "Create experience"} loading={submitting} showCancel={isEditing} onSubmit={onSubmit} onCancel={onCancel} />
  </div>
);

const CertificationEditor = ({ form, submitting, isEditing, updateForm, onSubmit, onCancel }) => (
  <div className="grid gap-4">
    <Field label="Title" value={form.title} onChange={(value) => updateForm("certification", "title", value)} required />
    <Field label="Issuer" value={form.issuer} onChange={(value) => updateForm("certification", "issuer", value)} required />
    <Field label="Completion date" type="date" value={form.completionDate} onChange={(value) => updateForm("certification", "completionDate", value)} required />
    <FileField label="Preview file" accept="application/pdf,image/png,image/jpeg,image/webp,image/avif" hint="PDF or image" currentFileLabel={form.previewFileUpload?.name || form.previewFile} onChange={(file) => updateForm("certification", "previewFileUpload", file)} />
    <Field label="Credential link" value={form.credentialLink} onChange={(value) => updateForm("certification", "credentialLink", value)} />
    <ActionButtons label={isEditing ? "Update certification" : "Create certification"} loading={submitting} showCancel={isEditing} onSubmit={onSubmit} onCancel={onCancel} />
  </div>
);

const PhotoEditor = ({ form, submitting, isEditing, updateForm, onSubmit, onCancel }) => {
  const imgRef = useRef(null);
  const [crop, setCrop] = useState({ unit: 'px', width: 100, height: 100, x: 0, y: 0, aspect: 1 });
  const [showCrop, setShowCrop] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (form.imageFile && form.imageFile instanceof Blob) {
      const url = URL.createObjectURL(form.imageFile);
      setPreviewUrl(url);
      return () => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore
        }
      };
    }

    if (form.image && typeof form.image === "string") {
      setPreviewUrl(form.image);
      return;
    }

    setPreviewUrl("");
  }, [form.imageFile, form.image]);

  const onImageLoad = (e) => {
    imgRef.current = e.currentTarget;
    
    if (!e.currentTarget.width || !e.currentTarget.height) {
      toast.error("Image not loaded properly");
      return;
    }

    const size = Math.min(e.currentTarget.width, e.currentTarget.height);
    const x = (e.currentTarget.width - size) / 2;
    const y = (e.currentTarget.height - size) / 2;

    setCrop({
      unit: 'px',
      width: size,
      height: size,
      x,
      y,
      aspect: 1,
    });
  };

  const handleCropComplete = async () => {
    if (!imgRef.current) {
      toast.error('Image not loaded. Please try again.');
      return;
    }

    if (!crop || crop.width <= 0 || crop.height <= 0) {
      toast.error('Please make a valid crop selection.');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      canvas.width = Math.round(crop.width);
      canvas.height = Math.round(crop.height);

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context error');

      ctx.drawImage(
        imgRef.current,
        Math.round(crop.x * scaleX),
        Math.round(crop.y * scaleY),
        Math.round(crop.width * scaleX),
        Math.round(crop.height * scaleY),
        0,
        0,
        Math.round(crop.width),
        Math.round(crop.height)
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            toast.error('Failed to crop image');
            return;
          }

          const croppedFile = new File([blob], 'cropped-photo.jpg', { type: 'image/jpeg' });
          updateForm('photo', 'imageFile', croppedFile);
          setShowCrop(false);
          toast.success('Photo cropped successfully!');
        },
        'image/jpeg',
        0.95
      );
    } catch (error) {
      console.error('Crop error:', error);
      toast.error('Failed to crop photo');
    }
  };

  return (
    <div className="grid gap-4">
      <Field label="Title" value={form.title} onChange={(value) => updateForm('photo', 'title', value)} required />
      <TextAreaField label="Description" value={form.description} onChange={(value) => updateForm('photo', 'description', value)} />
      <FileField
        label="Photo"
        accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
        hint="Upload an image"
        currentFileLabel={form.imageFile?.name || form.image}
        onChange={(file) => {
          updateForm('photo', 'imageFile', file);
          if (file) setShowCrop(true);
        }}
      />

      {showCrop && form.imageFile && previewUrl && (
        <div className="space-y-4">
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <h4 className="mb-2 text-sm font-medium text-white">Crop Photo (Square)</h4>
            <div className="mx-auto max-w-sm">
              <ReactCrop
                crop={crop}
                onChange={setCrop}
                aspect={1}
                minWidth={50}
                minHeight={50}
                keepSelection
              >
                <img 
                  ref={imgRef}
                  src={previewUrl} 
                  alt="Crop preview" 
                  onLoad={onImageLoad}
                  className="max-w-full rounded-lg"
                />
              </ReactCrop>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={handleCropComplete}
                className="rounded-md bg-cyan-600 px-4 py-2 text-sm text-white hover:bg-cyan-700"
              >
                Apply Crop
              </button>
              <button
                type="button"
                onClick={() => setShowCrop(false)}
                className="rounded-md border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {previewUrl && (
        <div className="rounded-[1.7rem] border border-white/10 bg-slate-950/45 p-4">
          <p className="text-sm font-medium text-white">Photo preview</p>
          <img src={previewUrl} alt="Selected preview" className="mt-3 max-h-64 w-full rounded-[1.4rem] object-cover" />
        </div>
      )}

      <Field label="Alt text" value={form.alt} onChange={(value) => updateForm('photo', 'alt', value)} />
      <label className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200">
        <input type="checkbox" checked={form.featured} onChange={(event) => updateForm('photo', 'featured', event.target.checked)} />
        Mark as featured
      </label>
      <ActionButtons label={isEditing ? 'Update photo' : 'Create photo'} loading={submitting} showCancel={isEditing} onSubmit={onSubmit} onCancel={onCancel} />
    </div>
  );
};

const TestimonialEditor = ({ form, submitting, isEditing, updateForm, onSubmit, onCancel }) => (
  <div className="grid gap-4">
    <Field label="Name" value={form.name} onChange={(value) => updateForm("testimonial", "name", value)} required />
    <Field label="Role" value={form.role} onChange={(value) => updateForm("testimonial", "role", value)} required />
    <TextAreaField label="Message" value={form.message} onChange={(value) => updateForm("testimonial", "message", value)} />
    <Field label="Rating" type="number" min="1" max="5" value={form.rating} onChange={(value) => updateForm("testimonial", "rating", value)} required />
    <ActionButtons label={isEditing ? "Update testimonial" : "Create testimonial"} loading={submitting} showCancel={isEditing} onSubmit={onSubmit} onCancel={onCancel} />
  </div>
);

const ActionButtons = ({ label, loading, showCancel, onSubmit, onCancel }) => (
  <div className="flex flex-wrap gap-3">
    <MagneticButton type="button" onClick={onSubmit} disabled={loading}>
      <Save className="h-4 w-4" />
      {loading ? "Saving..." : label}
    </MagneticButton>
    {showCancel ? (
      <MagneticButton type="button" variant="secondary" onClick={onCancel}>
        <X className="h-4 w-4" />
        Cancel
      </MagneticButton>
    ) : null}
  </div>
);

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

export default AdminPage;
