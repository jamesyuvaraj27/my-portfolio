import ratelimit from "../config/upstash.js";

const FALLBACK_WINDOW_MS = 60 * 1000;
const FALLBACK_LIMIT = 120;
const fallbackStore = new Map();

const useFallbackLimiter = (ipAddress) => {
  const now = Date.now();
  const key = ipAddress || "anonymous";
  const entry = fallbackStore.get(key);

  if (!entry || entry.resetAt <= now) {
    fallbackStore.set(key, {
      count: 1,
      resetAt: now + FALLBACK_WINDOW_MS,
    });
    return true;
  }

  if (entry.count >= FALLBACK_LIMIT) {
    return false;
  }

  entry.count += 1;
  return true;
};

const rateLimiter = async (req, res, next) => {
  try {
    if (!ratelimit) {
      const allowed = useFallbackLimiter(req.ip);

      if (!allowed) {
        return res.status(429).json({
          message: "Too many requests, please try again later.",
        });
      }

      return next();
    }

    const identifier = req.ip || "astradev-rate-limit";
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later.",
      });
    }

    next();
  } catch (error) {
    console.log("Rate limit error", error);
    next(error);
  }
};

export default rateLimiter;
