import { cn } from "../../lib/utils";

export const Avatar = ({
  alt,
  className = "",
  name,
  size = "lg",
  src,
}) => {
  const sizes = {
    sm: "h-10 w-10 text-sm",
    md: "h-14 w-14 text-base",
    lg: "h-20 w-20 text-xl",
    xl: "h-28 w-28 text-2xl",
  };

  const initials = (name || alt || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[28px] border border-white/90 bg-secondary-200 shadow-sm",
        sizes[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt || name || "Avatar"} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="grid h-full w-full place-items-center bg-primary-500/10 font-semibold text-primary-600">
          {initials}
        </div>
      )}
    </div>
  );
};

export default Avatar;
