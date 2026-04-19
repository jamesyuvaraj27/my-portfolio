import { cn } from "../../lib/utils";

export const Card = ({
  children,
  className = "",
  elevated = false,
  interactive = false,
  variant = "default",
  ...props
}) => {
  const variants = {
    default: "surface-card",
    muted: "surface-card-muted",
    glass: "glass-panel-sm",
    minimal: "rounded-2xl border border-secondary-300 bg-white",
  };

  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-200",
        variants[variant],
        interactive && "hover:-translate-y-1 hover:shadow-md",
        elevated && "shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const Badge = ({
  children,
  className = "",
  icon: Icon,
  size = "md",
  variant = "primary",
  ...props
}) => {
  const sizes = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-sm",
  };

  const variants = {
    primary: "border border-primary-200 bg-primary-500/10 text-primary-600",
    secondary: "border border-secondary-300 bg-secondary-100 text-text-secondary",
    success: "border border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border border-amber-200 bg-amber-50 text-amber-700",
    danger: "border border-rose-200 bg-rose-50 text-rose-700",
    soft: "border border-secondary-300 bg-white text-text-secondary",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      {children}
    </span>
  );
};

export const SectionHeader = ({ className = "", description, label, title, ...props }) => (
  <div className={cn("max-w-3xl", className)} {...props}>
    {label ? <span className="section-chip">{label}</span> : null}
    {title ? (
      <h2 className="mt-5 text-3xl font-bold tracking-[-0.03em] text-text-primary sm:text-4xl">{title}</h2>
    ) : null}
    {description ? <p className="mt-4 text-base text-text-secondary">{description}</p> : null}
  </div>
);

export const GlassPanel = ({ children, className = "", ...props }) => (
  <div className={cn("glass-panel rounded-[28px]", className)} {...props}>
    {children}
  </div>
);

export const GradientDivider = ({ className = "", ...props }) => (
  <div className={cn("h-px w-full bg-gradient-to-r from-transparent via-primary-500/20 to-transparent", className)} {...props} />
);

export const Stat = ({ className = "", description, icon: Icon, label, suffix, value, ...props }) => (
  <div className={cn("surface-card p-5", className)} {...props}>
    {Icon ? (
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-500/10 text-primary-500">
        <Icon className="h-5 w-5" />
      </span>
    ) : null}
    {label ? <p className="mt-4 text-sm font-medium text-text-secondary">{label}</p> : null}
    {value ? (
      <p className="mt-2 text-3xl font-bold tracking-[-0.03em] text-text-primary">
        {value}
        {suffix ? <span className="ml-1 text-base font-medium text-text-secondary">{suffix}</span> : null}
      </p>
    ) : null}
    {description ? <p className="mt-2 text-sm text-text-secondary">{description}</p> : null}
  </div>
);

export default Card;
