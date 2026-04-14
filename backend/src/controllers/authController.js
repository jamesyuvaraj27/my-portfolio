import User from "../models/User.js";
import {
  AUTH_COOKIE_NAME,
  buildAuthCookieOptions,
  createPasswordHash,
  parseCookieHeader,
  sanitizeEmail,
  signAuthToken,
  verifyAuthToken,
  verifyPassword,
} from "../utils/auth.js";

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

const issueSession = (res, user, statusCode = 200) => {
  const token = signAuthToken({
    sub: user._id.toString(),
    email: user.email,
    name: user.name,
  });

  res.cookie(AUTH_COOKIE_NAME, token, buildAuthCookieOptions());
  res.status(statusCode).json({ user: serializeUser(user) });
};

export const getAuthStatus = async (req, res, next) => {
  try {
    const adminCount = await User.countDocuments();
    res.json({ initialized: adminCount > 0 });
  } catch (error) {
    next(error);
  }
};

export const bootstrapAdmin = async (req, res, next) => {
  try {
    const existingAdminCount = await User.countDocuments();

    if (existingAdminCount > 0) {
      return res.status(409).json({
        message: "Admin has already been initialized. Please log in instead.",
      });
    }

    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email = sanitizeEmail(req.body.email);
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!name || !email || password.length < 8) {
      return res.status(400).json({
        message: "Name, valid email, and a password with at least 8 characters are required.",
      });
    }

    const passwordHash = await createPasswordHash(password);

    const user = await User.create({
      name,
      email,
      password: passwordHash,
    });

    issueSession(res, user, 201);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "That email is already in use." });
    }

    next(error);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const email = sanitizeEmail(req.body.email);
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatches = await verifyPassword(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    issueSession(res, user);
  } catch (error) {
    next(error);
  }
};

export const logoutAdmin = (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, buildAuthCookieOptions());
  res.status(204).send();
};

export const getCurrentAdmin = async (req, res, next) => {
  try {
    const token =
      req.signedAuthToken ||
      parseCookieHeader(req.headers.cookie || "")[AUTH_COOKIE_NAME] ||
      null;

    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: "Session no longer valid." });
    }

    res.json({ user: serializeUser(user) });
  } catch (error) {
    next(error);
  }
};
