import { cn } from "../../lib/utils";

export const Container = ({
  children,
  className = "",
  size = "max",
  ...props
}) => {
  const sizes = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-[1200px]",
    max: "max-w-[1200px]",
    full: "w-full",
  };

  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizes[size], className)} {...props}>
      {children}
    </div>
  );
};

export const Section = ({
  children,
  className = "",
  id,
  padding = "lg",
  space = true,
  ...props
}) => {
  const paddings = {
    xs: "py-8",
    sm: "py-12",
    md: "py-16",
    lg: "py-20",
    xl: "py-24",
  };

  return (
    <section id={id} className={cn("relative w-full", paddings[padding], space && "space-y-10", className)} {...props}>
      <Container>{children}</Container>
    </section>
  );
};

export const Grid = ({
  children,
  className = "",
  cols = 3,
  gap = "md",
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

  const responsiveCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
    6: "grid-cols-2 md:grid-cols-3 xl:grid-cols-6",
  };

  const gapSize = {
    xs: "gap-2",
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
    xl: "gap-10",
  };

  return (
    <div className={cn("grid", gapSize[gap], responsive ? responsiveCols[cols] : colsSize[cols], className)} {...props}>
      {children}
    </div>
  );
};

export const Stack = ({
  children,
  align = "start",
  className = "",
  direction = "vertical",
  gap = "md",
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
    <div className={cn(directions[direction], gaps[gap], aligns[align], className)} {...props}>
      {children}
    </div>
  );
};

export const Skeleton = ({ className = "", height = "100%", rounded = "md", width = "100%", ...props }) => {
  const roundedSize = {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-[20px]",
    full: "rounded-full",
  };

  return (
    <div
      className={cn("skeleton", roundedSize[rounded], className)}
      style={{ width, height }}
      {...props}
    />
  );
};

export const SkeletonCard = ({ className = "", count = 3 }) => (
  <div className={cn("space-y-4", className)}>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="surface-card p-6">
        <Skeleton height={180} rounded="xl" />
        <div className="mt-5 space-y-3">
          <Skeleton height={22} width="65%" />
          <Skeleton height={14} />
          <Skeleton height={14} width="82%" />
        </div>
      </div>
    ))}
  </div>
);

export const ProgressBar = ({
  animated = true,
  className = "",
  max = 100,
  showLabel = true,
  value = 0,
  ...props
}) => {
  const percentage = max ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <div className="h-2 w-full rounded-full bg-secondary-200">
        <div
          className={cn("h-full rounded-full bg-primary-500 transition-all", animated && "duration-300")}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel ? <span className="text-xs font-medium text-text-secondary">{Math.round(percentage)}%</span> : null}
    </div>
  );
};

export const Divider = ({ className = "", direction = "horizontal", spacing = "md", ...props }) => {
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
        "border-secondary-300",
        direction === "horizontal" ? "w-full border-t" : "h-full border-r",
        spacings[spacing],
        className
      )}
      {...props}
    />
  );
};

export default Container;
