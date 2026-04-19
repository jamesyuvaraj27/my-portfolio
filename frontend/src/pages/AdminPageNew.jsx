import {
  Plus,
  BarChart3,
  FileText,
  FolderKanban,
  Award,
  Briefcase,
  Code2,
  Image,
  Mail,
  Settings,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import toast from "react-hot-toast";

import { Button } from "../components/ui/Button";
import { Container, Section, Grid, Stack } from "../components/ui/Layout";
import { Card, SectionHeader } from "../components/ui/Card";
import {
  AdminHeader,
  AdminStats,
  AdminTabs,
  AdminListItem,
  AdminModal,
  AdminUploadArea,
  AdminSection,
} from "../components/admin/AdminComponents";
import Seo from "../components/Seo";
import api from "../lib/axios";

/**
 * Admin Dashboard Page
 * Complete portfolio content management interface
 */
const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [portfolio, setPortfolio] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  // Modal states
  const [_editingItem, setEditingItem] = useState(null);
  const [_showModal, setShowModal] = useState(false);

  // Fetch portfolio data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/admin/portfolio");
        setPortfolio(data);
        setIsAuthenticated(true);
      } catch (error) {
        if (error.response?.status === 401) {
          setIsAuthenticated(false);
        } else {
          toast.error("Failed to load portfolio data");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-lg bg-primary-500/20 animate-pulse mx-auto" />
          <p className="text-text-muted">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setIsAuthenticated(false);
    } catch {
      toast.error("Failed to logout");
    }
  };

  const stats = {
    totalProjects: portfolio?.projects?.length || 0,
    totalSkills: portfolio?.skills?.length || 0,
    totalExperience: portfolio?.experience?.length || 0,
    totalCertifications: portfolio?.certifications?.length || 0,
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "certifications", label: "Certifications" },
    { id: "messages", label: "Messages" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <>
      <Seo title="Admin Dashboard | Portfolio" noindex />

      <div className="min-h-screen bg-background text-text-primary">
        <Container className="py-8">
          {/* Admin Header */}
          <AdminHeader onLogout={handleLogout} userName="Admin" />

          {/* Stats */}
          {activeTab === "dashboard" && <AdminStats stats={stats} />}

          {/* Tabs */}
          <AdminTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab Content */}
          <Section className="mt-8 space-y-6">
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <AdminSection
                title="Overview"
                description="Summary of your portfolio content"
              >
                <Grid cols={2} gap="lg">
                  <Card variant="minimal" className="p-6">
                    <div className="space-y-2">
                      <FolderKanban className="text-primary-400" size={24} />
                      <p className="text-sm text-text-muted">Recent Activity</p>
                      <p className="text-lg font-semibold text-white">Last updated 2 hours ago</p>
                    </div>
                  </Card>
                  <Card variant="minimal" className="p-6">
                    <div className="space-y-2">
                      <BarChart3 className="text-secondary-400" size={24} />
                      <p className="text-sm text-text-muted">Profile Views</p>
                      <p className="text-lg font-semibold text-white">1,234 views</p>
                    </div>
                  </Card>
                </Grid>
              </AdminSection>
            )}

            {/* Projects Tab */}
            {activeTab === "projects" && (
              <AdminSection
                title="Projects"
                description="Manage your portfolio projects"
                action={
                  <Button icon={Plus} onClick={() => setShowModal(true)}>
                    Add Project
                  </Button>
                }
              >
                <div className="space-y-4">
                  {portfolio?.projects?.map((project) => (
                    <AdminListItem
                      key={project.id}
                      item={project}
                      columns={["name", "category", "status"]}
                      onEdit={(id) => setEditingItem(id)}
                      onDelete={() => toast("Delete feature coming soon")}
                    />
                  ))}
                </div>
                {!portfolio?.projects?.length && (
                  <Card variant="minimal" className="p-8 text-center">
                    <p className="text-text-muted">No projects yet. Create your first one!</p>
                  </Card>
                )}
              </AdminSection>
            )}

            {/* Skills Tab */}
            {activeTab === "skills" && (
              <AdminSection
                title="Skills"
                description="Manage your technical skills"
                action={
                  <Button icon={Plus} onClick={() => setShowModal(true)}>
                    Add Skill
                  </Button>
                }
              >
                <div className="space-y-4">
                  {portfolio?.skills?.map((skill) => (
                    <AdminListItem
                      key={skill.id}
                      item={skill}
                      columns={["name", "category", "level"]}
                      onEdit={(id) => setEditingItem(id)}
                    />
                  ))}
                </div>
                {!portfolio?.skills?.length && (
                  <Card variant="minimal" className="p-8 text-center">
                    <p className="text-text-muted">No skills added yet.</p>
                  </Card>
                )}
              </AdminSection>
            )}

            {/* Experience Tab */}
            {activeTab === "experience" && (
              <AdminSection
                title="Experience"
                description="Manage your professional experience"
                action={
                  <Button icon={Plus} onClick={() => setShowModal(true)}>
                    Add Experience
                  </Button>
                }
              >
                <div className="space-y-4">
                  {portfolio?.experience?.map((exp) => (
                    <AdminListItem
                      key={exp.id}
                      item={exp}
                      columns={["title", "company", "duration"]}
                      onEdit={(id) => setEditingItem(id)}
                    />
                  ))}
                </div>
                {!portfolio?.experience?.length && (
                  <Card variant="minimal" className="p-8 text-center">
                    <p className="text-text-muted">No experience entries yet.</p>
                  </Card>
                )}
              </AdminSection>
            )}

            {/* Certifications Tab */}
            {activeTab === "certifications" && (
              <AdminSection
                title="Certifications"
                description="Manage your certifications"
                action={
                  <Button icon={Plus} onClick={() => setShowModal(true)}>
                    Add Certification
                  </Button>
                }
              >
                <div className="space-y-4">
                  {portfolio?.certifications?.map((cert) => (
                    <AdminListItem
                      key={cert.id}
                      item={cert}
                      columns={["name", "issuer", "issueDate"]}
                      onEdit={(id) => setEditingItem(id)}
                    />
                  ))}
                </div>
                {!portfolio?.certifications?.length && (
                  <Card variant="minimal" className="p-8 text-center">
                    <p className="text-text-muted">No certifications added yet.</p>
                  </Card>
                )}
              </AdminSection>
            )}

            {/* Messages Tab */}
            {activeTab === "messages" && (
              <AdminSection
                title="Messages"
                description="View messages from your portfolio visitors"
              >
                <div className="space-y-4">
                  <Card variant="minimal" className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-white">John Doe</p>
                          <p className="text-sm text-text-muted">john@example.com</p>
                        </div>
                        <span className="text-xs text-text-muted">2 hours ago</span>
                      </div>
                      <p className="text-text-secondary">
                        I'd like to discuss a potential collaboration opportunity...
                      </p>
                    </div>
                  </Card>
                </div>
              </AdminSection>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <AdminSection
                title="Settings"
                description="Configure your portfolio"
              >
                <Card variant="minimal" className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                      Portfolio Title
                    </label>
                    <input
                      type="text"
                      placeholder="My Awesome Portfolio"
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                      Bio
                    </label>
                    <textarea
                      placeholder="Tell visitors about yourself..."
                      className="textarea-base"
                      rows={4}
                    />
                  </div>
                  <Button fillWidth>Save Settings</Button>
                </Card>
              </AdminSection>
            )}
          </Section>
        </Container>
      </div>
    </>
  );
};

export default AdminPage;
