import { cn } from "../../lib/utils";

/**
 * Premium Card Component
 * Base for all card designs
 */
export const Card = ({
  children,
  variant = "default",
  interactive = false,
  elevated = false,
  className = "",
  ...props
}) => {
  const variants = {
    default: "glass-panel-md",
    elevated: "glass-panel border-white/10 shadow-lg",
    minimal: "rounded-2xl border border-white/5 bg-white/[0.02]",
    dark: "rounded-2xl border border-white/5 bg-black/40",
  };

  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-300",
        variants[variant],
        interactive && "cursor-pointer hover:translate-y-[-4px] hover:shadow-glow",
        elevated && "shadow-glow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Premium Badge Component
 */
export const Badge = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
  ...props
}) => {
  const variants = {
    primary:
      "border border-primary-500/30 bg-primary-500/10 text-primary-300",
    secondary:
      "border border-secondary-500/30 bg-secondary-500/10 text-secondary-300",
    success:
      "border border-green-500/30 bg-green-500/10 text-green-300",
    warning:
      "border border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
    danger:
      "border border-red-500/30 bg-red-500/10 text-red-300",
    soft: "border border-white/20 bg-white/10 text-white",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && <Icon size={14} />}
      {children}
    </span>
  );
};

/**
 * Section Header Component
 */
export const SectionHeader = ({
  label,
  title,
  description,
  className = "",
  ...props
}) => {
  return (
    <div className={cn("mb-12 text-center", className)} {...props}>
      {label && (
        <span className="section-chip mb-4 inline-block">
          {label}
        </span>
      )}
      {title && (
        <h2 className="text-4xl md:text-5xl font-poppins font-bold mb-4 gradient-text-vivid">
          {title}
        </h2>
      )}
      {description && (
        <p className="max-w-3xl mx-auto text-lg text-text-secondary">
          {description}
        </p>
      )}
    </div>
  );
};

/**
 * Glass Panel Component
 */
export const GlassPanel = ({
  children,
  blur = "md",
  className = "",
  ...props
}) => {
  const blurSize = {
    xs: "backdrop-blur-xs",
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
  };

  return (
    <div
      className={cn(
        "glass-panel",
        blurSize[blur],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Gradient Divider Component
 */
export const GradientDivider = ({ className = "", ...props }) => {
  return (
    <div
      className={cn(
        "h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-30",
        className
      )}
      {...props}
    />
  );
};

/**
 * Stat Component
 */
export const Stat = ({
  icon: Icon,
  label,
  value,
  suffix,
  description,
  className = "",
  ...props
}) => {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Icon && (
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/30 mb-3">
          <Icon className="text-primary-400" size={24} />
        </div>
      )}
      {label && (
        <p className="text-sm font-semibold text-text-muted uppercase tracking-wide">
          {label}
        </p>
      )}
      {value && (
        <p className="text-3xl md:text-4xl font-poppins font-bold">
          {value}
          {suffix && <span className="text-lg text-text-secondary">{suffix}</span>}
        </p>
      )}
      {description && (
        <p className="text-sm text-text-secondary">{description}</p>
      )}
    </div>
  );
};

export default Card;
