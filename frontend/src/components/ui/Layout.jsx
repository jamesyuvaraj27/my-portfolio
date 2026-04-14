import { cn } from "../../lib/utils";

/**
 * Container Component
 * Responsive container with max-width
 */
export const Container = ({
  children,
  size = "max",
  className = "",
  ...props
}) => {
  const sizes = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    max: "max-w-7xl",
    full: "w-full",
  };

  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Section Wrapper Component
 */
export const Section = ({
  children,
  id,
  className = "",
  padding = "lg",
  space = true,
  ...props
}) => {
  const paddings = {
    xs: "py-8 sm:py-12",
    sm: "py-12 sm:py-16",
    md: "py-16 sm:py-20",
    lg: "py-20 sm:py-24",
    xl: "py-24 sm:py-32",
  };

  return (
    <section
      id={id}
      className={cn(
        "relative w-full",
        paddings[padding],
        space && "space-y-12",
        className
      )}
      {...props}
    >
      <Container>{children}</Container>
    </section>
  );
};

/**
 * Grid Component
 */
export const Grid = ({
  children,
  cols = 3,
  gap = "lg",
  className = "",
  responsive = true,
  ...props
}) => {
  const colsSize = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    6: "grid-cols-6",
  };

  const gapSize = {
    xs: "gap-4",
    sm: "gap-6",
    md: "gap-8",
    lg: "gap-10",
    xl: "gap-12",
  };

  return (
    <div
      className={cn(
        "grid",
        gapSize[gap],
        responsive ? "grid-cols-1 md:grid-cols-2 lg:" + colsSize[cols] : colsSize[cols],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Stack Component
 */
export const Stack = ({
  children,
  direction = "vertical",
  gap = "md",
  align = "start",
  className = "",
  ...props
}) => {
  const directions = {
    horizontal: "flex flex-row",
    vertical: "flex flex-col",
    h: "flex flex-row",
    v: "flex flex-col",
  };

  const gaps = {
    xs: "gap-2",
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  const aligns = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  return (
    <div
      className={cn(
        directions[direction],
        gaps[gap],
        aligns[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Skeleton Loader Component
 */
export const Skeleton = ({
  width = "100%",
  height = "100%",
  rounded = "md",
  className = "",
  ...props
}) => {
  const roundedSize = {
    xs: "rounded-xs",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  };

  return (
    <div
      className={cn(
        "skeleton-base animate-pulse",
        roundedSize[rounded],
        className
      )}
      style={{ width, height }}
      {...props}
    />
  );
};

/**
 * Skeleton Card Component
 */
export const SkeletonCard = ({ count = 3 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-panel-md p-6 space-y-4">
          <Skeleton height={24} width="60%" rounded="md" />
          <Skeleton height={16} width="100%" rounded="sm" />
          <Skeleton height={16} width="85%" rounded="sm" />
          <div className="flex gap-2 pt-2">
            <Skeleton height={32} width={80} rounded="lg" />
            <Skeleton height={32} width={100} rounded="lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Progress Bar Component
 */
export const ProgressBar = ({
  value = 0,
  max = 100,
  showLabel = true,
  animated = true,
  className = "",
  ...props
}) => {
  const percentage = (value / max) * 100;

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
        <div
          className={cn(
            "h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500 rounded-full",
            animated && "shadow-glow"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-text-muted">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};

/**
 * Divider Component
 */
export const Divider = ({
  direction = "horizontal",
  spacing = "md",
  className = "",
  ...props
}) => {
  const spacings = {
    xs: "my-2",
    sm: "my-3",
    md: "my-4",
    lg: "my-6",
    xl: "my-8",
  };

  return (
    <div
      className={cn(
        "w-full border-white/10",
        direction === "horizontal" ? "border-t" : "border-r",
        spacings[spacing],
        className
      )}
      {...props}
    />
  );
};

export default Container;
