import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Download,
  Upload,
  Settings,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";
import { Card, Badge, Stat, SectionHeader } from "../ui/Card";
import { Container, Grid, Stack, Section } from "../ui/Layout";
import { cn } from "../../lib/utils";

/**
 * Admin Dashboard Stats Component
 */
export const AdminStats = ({ stats = {} }) => {
  const defaultStats = {
    totalProjects: 0,
    totalSkills: 0,
    totalExperience: 0,
    totalCertifications: 0,
    ...stats,
  };

  return (
    <Grid cols={4} gap="lg" className="mb-12">
      <Stat
        icon={() => (
          <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded" />
        )}
        label="Projects"
        value={defaultStats.totalProjects}
      />
      <Stat
        icon={() => (
          <div className="w-6 h-6 bg-gradient-to-br from-secondary-500 to-accent-pink rounded" />
        )}
        label="Skills"
        value={defaultStats.totalSkills}
      />
      <Stat
        icon={() => (
          <div className="w-6 h-6 bg-gradient-to-br from-accent-cyan to-primary-500 rounded" />
        )}
        label="Experience"
        value={defaultStats.totalExperience}
      />
      <Stat
        icon={() => (
          <div className="w-6 h-6 bg-gradient-to-br from-accent-purple to-accent-pink rounded" />
        )}
        label="Certifications"
        value={defaultStats.totalCertifications}
      />
    </Grid>
  );
};

/**
 * Admin Tabs Component
 */
export const AdminTabs = ({
  tabs = [],
  activeTab,
  onTabChange,
  className = "",
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex gap-2 border-b border-white/10 overflow-x-auto",
        className
      )}
      {...props}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange?.(tab.id)}
          className={cn(
            "px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all duration-300 border-b-2 -mb-px",
            activeTab === tab.id
              ? "border-primary-500 text-primary-300"
              : "border-transparent text-text-muted hover:text-text-secondary"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

/**
 * Admin Content List Item Component
 */
export const AdminListItem = ({
  item,
  onEdit,
  onDelete,
  onToggleVisibility,
  columns = [],
  className = "",
  ...props
}) => {
  return (
    <div
      className={cn(
        "glass-panel-md p-4 rounded-xl flex items-center justify-between gap-4 group hover:bg-white/[0.06]",
        className
      )}
      {...props}
    >
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
        {columns.map((col) => (
          <div key={col} className="truncate">
            <p className="text-sm text-text-secondary capitalize">
              {item[col]?.toString().slice(0, 50)}
            </p>
          </div>
        ))}
      </div>

      <Stack direction="h" gap="sm" className="flex-shrink-0">
        {onToggleVisibility && (
          <button
            onClick={() => onToggleVisibility?.(item.id)}
            className="p-2 rounded-lg border border-white/10 bg-white/5 text-text-muted hover:text-text-secondary transition-all hover:bg-white/10"
            title={item.isVisible ? "Hide" : "Show"}
          >
            {item.isVisible ? (
              <Eye size={16} />
            ) : (
              <EyeOff size={16} />
            )}
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit?.(item.id)}
            className="p-2 rounded-lg border border-white/10 bg-white/5 text-primary-400 hover:text-primary-300 hover:border-primary-400/50 transition-all hover:bg-primary-500/10"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete?.(item.id)}
            className="p-2 rounded-lg border border-white/10 bg-white/5 text-red-400 hover:text-red-300 hover:border-red-400/50 transition-all hover:bg-red-500/10"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        )}
      </Stack>
    </div>
  );
};

/**
 * Admin Modal Component
 */
export const AdminModal = ({
  isOpen,
  title,
  children,
  onClose,
  onSave,
  isSaving = false,
  className = "",
  ...props
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className={cn("relative max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4 space-y-6 p-8", className)} {...props}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-poppins font-bold text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">{children}</div>

        <Stack direction="h" gap="md" className="justify-end pt-4 border-t border-white/10">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={onSave} isLoading={isSaving} disabled={isSaving}>
            Save Changes
          </Button>
        </Stack>
      </Card>
    </div>
  );
};

/**
 * Admin Header Component
 */
export const AdminHeader = ({ onLogout, userName = "Admin", className = "", ...props }) => {
  return (
    <div
      className={cn(
        "glass-panel-md p-4 flex items-center justify-between mb-8 rounded-2xl",
        className
      )}
      {...props}
    >
      <div>
        <h1 className="text-3xl font-poppins font-bold text-white">
          Admin Dashboard
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Welcome back, <span className="text-primary-300">{userName}</span>
        </p>
      </div>

      <Stack direction="h" gap="md">
        <Button variant="ghost" size="md" icon={Settings}>
          Settings
        </Button>
        <Button
          variant="danger"
          size="md"
          icon={LogOut}
          onClick={onLogout}
        >
          Logout
        </Button>
      </Stack>
    </div>
  );
};

/**
 * Admin Upload Area Component
 */
export const AdminUploadArea = ({
  onUpload,
  accept = "image/*",
  maxSize = 5242880, // 5MB
  className = "",
  ...props
}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.size > maxSize) {
      alert("File too large");
      return;
    }
    onUpload?.(file);
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={cn(
        "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
        isDragActive
          ? "border-primary-500 bg-primary-500/10"
          : "border-white/10 bg-white/5 hover:border-primary-500/50"
      )}
      {...props}
    >
      <Upload className="mx-auto mb-3 text-primary-400" size={32} />
      <p className="font-semibold text-white mb-1">
        Drag and drop your file here
      </p>
      <p className="text-sm text-text-muted">or click to select</p>
      <input
        type="file"
        accept={accept}
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="hidden"
      />
    </div>
  );
};

/**
 * Admin Section Wrapper Component
 */
export const AdminSection = ({
  title,
  description,
  children,
  action,
  className = "",
  ...props
}) => {
  return (
    <Section className={cn("space-y-6", className)} {...props}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-poppins font-bold text-white">
            {title}
          </h2>
          {description && (
            <p className="text-text-muted mt-1">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>

      <div className="space-y-4">{children}</div>
    </Section>
  );
};

export default AdminStats;
