import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadRoot = path.resolve(__dirname, "../../uploads");

const ensureDirectory = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const safeBaseName = (name) =>
  name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "upload";

const createStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const directory = path.join(uploadRoot, folder);
      ensureDirectory(directory);
      cb(null, directory);
    },
    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${safeBaseName(file.originalname)}${extension}`);
    },
  });

const buildFileFilter = (allowedMimeTypes) => (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  const error = new Error("Unsupported file type.");
  error.statusCode = 400;
  cb(error);
};

const createUploader = ({ allowedMimeTypes, folder, maxSizeMb }) =>
  multer({
    storage: createStorage(folder),
    fileFilter: buildFileFilter(allowedMimeTypes),
    limits: {
      fileSize: maxSizeMb * 1024 * 1024,
      files: 1,
    },
  });

export const imageUpload = createUploader({
  folder: "images",
  maxSizeMb: 4,
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"],
});

export const certificateUpload = createUploader({
  folder: "certificates",
  maxSizeMb: 6,
  allowedMimeTypes: ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/avif"],
});

export const resumeUpload = createUploader({
  folder: "resumes",
  maxSizeMb: 8,
  allowedMimeTypes: ["application/pdf"],
});

export const toPublicUploadUrl = (file) => {
  if (!file) {
    return "";
  }

  const relativePath = path.relative(uploadRoot, file.path).split(path.sep).join("/");
  return `/uploads/${relativePath}`;
};

export const removeUploadedFile = (publicUrl) => {
  if (!publicUrl || !publicUrl.startsWith("/uploads/")) {
    return;
  }

  const relativePath = publicUrl.replace(/^\/uploads\//, "");
  const targetPath = path.resolve(uploadRoot, relativePath);
  const relativeToRoot = path.relative(uploadRoot, targetPath);

  if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
    return;
  }

  fs.promises.unlink(targetPath).catch(() => {});
};

export const resolveUploadPath = (publicUrl) => {
  if (!publicUrl || !publicUrl.startsWith("/uploads/")) {
    return "";
  }

  const relativePath = publicUrl.replace(/^\/uploads\//, "");
  const targetPath = path.resolve(uploadRoot, relativePath);
  const relativeToRoot = path.relative(uploadRoot, targetPath);

  if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
    return "";
  }

  return targetPath;
};
