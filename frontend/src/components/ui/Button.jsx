import { LoaderCircle } from "lucide-react";

import { cn } from "../../lib/utils";

export const Button = ({
  children,
  className = "",
  disabled = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = "left",
  isLoading = false,
  size = "md",
  variant = "primary",
  ...props
}) => {
  const sizes = {
    xs: "min-h-9 px-3 text-xs",
    sm: "min-h-10 px-4 text-sm",
    md: "min-h-11 px-5 text-sm",
    lg: "min-h-12 px-6 text-base",
  };

  const variants = {
    primary: "bg-primary-500 text-white shadow-sm hover:bg-primary-600",
    secondary: "border border-secondary-300 bg-white text-text-primary shadow-sm hover:border-primary-200",
    ghost: "border border-secondary-300 bg-transparent text-text-secondary hover:bg-primary-500/5 hover:text-primary-600",
    danger: "bg-danger-500 text-white hover:bg-danger-600",
    success: "bg-success-500 text-white hover:bg-success-600",
    soft: "bg-secondary-100 text-text-primary hover:bg-secondary-200",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ease-in-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        sizes[size],
        variants[variant],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
      {Icon && iconPosition === "left" && !isLoading ? <Icon className="h-4 w-4" /> : null}
      {children}
      {Icon && iconPosition === "right" && !isLoading ? <Icon className="h-4 w-4" /> : null}
    </button>
  );
};

export default Button;
