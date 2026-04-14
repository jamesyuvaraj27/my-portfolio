export const cn = (...classes) => classes.filter(Boolean).join(" ");

export const splitCsv = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const joinList = (value) => (Array.isArray(value) ? value.join(", ") : "");

export function mediaUrl(value) {
  if (!value) {
    return "";
  }

  if (/^(https?:|mailto:|data:|blob:)/i.test(value)) {
    return value;
  }

  if (!value.startsWith("/uploads/")) {
    return value;
  }

  const apiBase =
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api");

  if (!apiBase.startsWith("http")) {
    return value;
  }

  return `${new URL(apiBase).origin}${value}`;
}

export function apiUrl(path) {
  const apiBase =
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${apiBase.replace(/\/$/, "")}${normalizedPath}`;
}

export function formatDate(dateValue) {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatMonthYear(dateValue) {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}
