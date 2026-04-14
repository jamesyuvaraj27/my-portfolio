import { cn } from "../../lib/utils";

/**
 * Text Input Component
 */
export const Input = ({
  label,
  error,
  icon: Icon,
  placeholder = "",
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted pointer-events-none">
            <Icon size={20} />
          </div>
        )}
        <input
          placeholder={placeholder}
          className={cn(
            "input-base",
            Icon && "pl-10",
            error && "border-red-500 bg-red-500/5 focus:border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};

/**
 * Textarea Component
 */
export const Textarea = ({
  label,
  error,
  rows = 4,
  placeholder = "",
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-text-secondary">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        placeholder={placeholder}
        className={cn(
          "textarea-base",
          error && "border-red-500 bg-red-500/5 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};

/**
 * Select Component
 */
export const Select = ({
  label,
  error,
  options = [],
  placeholder = "Select an option",
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-text-secondary">
          {label}
        </label>
      )}
      <select
        className={cn(
          "input-base appearance-none",
          error && "border-red-500 bg-red-500/5 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};

/**
 * Checkbox Component
 */
export const Checkbox = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        className={cn(
          "mt-1 w-5 h-5 rounded border-white/20 bg-white/5 cursor-pointer transition-all focus:ring-2 focus:ring-primary-500 accent-primary-500",
          className
        )}
        {...props}
      />
      <div className="flex-1">
        {label && (
          <label className="text-sm text-text-secondary cursor-pointer">
            {label}
          </label>
        )}
        {error && (
          <p className="text-xs text-red-400 mt-1">{error}</p>
        )}
      </div>
    </div>
  );
};

/**
 * Form Group Component
 */
export const FormGroup = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {children}
    </div>
  );
};

/**
 * Form Helper Text Component
 */
export const FormHelperText = ({
  type = "default",
  children,
  className = "",
  ...props
}) => {
  const typeStyles = {
    default: "text-text-muted",
    error: "text-red-400",
    success: "text-green-400",
    warning: "text-yellow-400",
  };

  return (
    <p className={cn("text-xs", typeStyles[type], className)} {...props}>
      {children}
    </p>
  );
};

export default Input;
