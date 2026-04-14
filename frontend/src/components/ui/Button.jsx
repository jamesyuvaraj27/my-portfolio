import { cn } from "../../lib/utils";

/**
 * Premium Button Component
 * Supports multiple variants and sizes
 */
export const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  className = "",
  icon: Icon,
  iconPosition = "left",
  isLoading = false,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:shadow-lg hover:shadow-primary-500/20 active:scale-95",
    ghost:
      "border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 active:scale-95",
    outline:
      "border-2 border-primary-500 text-primary-400 hover:bg-primary-500/10 active:scale-95",
    danger:
      "bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-lg hover:shadow-red-500/20 active:scale-95",
    success:
      "bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-lg hover:shadow-green-500/20 active:scale-95",
    soft: "bg-white/5 text-white hover:bg-white/10 border border-white/10",
  };

  const sizes = {
    xs: "px-3 py-1.5 text-xs gap-1",
    sm: "px-4 py-2 text-sm gap-2",
    md: "px-6 py-3 text-base gap-2",
    lg: "px-8 py-4 text-lg gap-3",
    xl: "px-10 py-5 text-xl gap-3",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <span className="animate-spin mr-2">⚡</span>}
      {Icon && iconPosition === "left" && !isLoading && <Icon size={16} />}
      {children}
      {Icon && iconPosition === "right" && !isLoading && <Icon size={16} />}
    </button>
  );
};

export default Button;
