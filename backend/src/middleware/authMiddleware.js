import User from "../models/User.js";
import {
  AUTH_COOKIE_NAME,
  parseCookieHeader,
  verifyAuthToken,
} from "../utils/auth.js";

const getTokenFromRequest = (req) => {
  const authorizationHeader = req.headers.authorization || "";

  if (authorizationHeader.startsWith("Bearer ")) {
    return authorizationHeader.slice("Bearer ".length);
  }

  const cookies = parseCookieHeader(req.headers.cookie || "");
  return cookies[AUTH_COOKIE_NAME] || null;
};

export const requireAdmin = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub).select("_id name email");

    if (!user) {
      return res.status(401).json({ message: "Admin session is invalid." });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
    req.signedAuthToken = token;

    next();
  } catch (error) {
    next(error);
  }
};
