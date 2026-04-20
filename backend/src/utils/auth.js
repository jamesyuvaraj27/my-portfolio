import "../config/env.js";

import crypto from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(crypto.scrypt);
const TOKEN_SECRET =
  process.env.JWT_SECRET || process.env.SESSION_SECRET || "astradev-local-dev-secret";
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export const AUTH_COOKIE_NAME = "astradev_admin";

export const sanitizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const toBase64Url = (value) => Buffer.from(value).toString("base64url");

const fromBase64Url = (value) => Buffer.from(value, "base64url").toString("utf8");

const signTokenValue = (value) =>
  crypto.createHmac("sha256", TOKEN_SECRET).update(value).digest("base64url");

export const createPasswordHash = async (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scryptAsync(password, salt, 64);
  return `${salt}:${Buffer.from(derivedKey).toString("hex")}`;
};

export const verifyPassword = async (password, storedHash) => {
  const [salt, hash] = storedHash.split(":");

  if (!salt || !hash) {
    return false;
  }

  const derivedKey = await scryptAsync(password, salt, 64);
  const storedBuffer = Buffer.from(hash, "hex");
  const derivedBuffer = Buffer.from(derivedKey);

  if (storedBuffer.length !== derivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(storedBuffer, derivedBuffer);
};

export const signAuthToken = (payload) => {
  const header = toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = toBase64Url(
    JSON.stringify({
      ...payload,
      exp: Date.now() + TOKEN_TTL_MS,
    })
  );
  const unsignedToken = `${header}.${body}`;
  const signature = signTokenValue(unsignedToken);

  return `${unsignedToken}.${signature}`;
};

export const verifyAuthToken = (token) => {
  const [header, body, signature] = token.split(".");

  if (!header || !body || !signature) {
    const error = new Error("Invalid authentication token.");
    error.statusCode = 401;
    throw error;
  }

  const unsignedToken = `${header}.${body}`;
  const expectedSignature = signTokenValue(unsignedToken);

  if (signature !== expectedSignature) {
    const error = new Error("Invalid authentication token.");
    error.statusCode = 401;
    throw error;
  }

  const payload = JSON.parse(fromBase64Url(body));

  if (!payload.exp || payload.exp < Date.now()) {
    const error = new Error("Session expired. Please log in again.");
    error.statusCode = 401;
    throw error;
  }

  return payload;
};

export const parseCookieHeader = (cookieHeader) =>
  cookieHeader
    .split(";")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .reduce((cookies, pair) => {
      const separatorIndex = pair.indexOf("=");

      if (separatorIndex === -1) {
        return cookies;
      }

      const key = pair.slice(0, separatorIndex);
      const value = pair.slice(separatorIndex + 1);
      cookies[key] = decodeURIComponent(value);
      return cookies;
    }, {});

export const buildAuthCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: TOKEN_TTL_MS,
  path: "/",
});
