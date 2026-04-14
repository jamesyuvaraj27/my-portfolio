import mongoose from "mongoose";

import Certification from "../models/Certification.js";
import Experience from "../models/Experience.js";
import Message from "../models/Message.js";
import Photo from "../models/Photo.js";
import Project from "../models/Project.js";
import SiteAsset from "../models/SiteAsset.js";
import Skill from "../models/Skill.js";
import Testimonial from "../models/Testimonial.js";
import { removeUploadedFile, toPublicUploadUrl } from "../middleware/uploadMiddleware.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const sanitizeString = (value) => (typeof value === "string" ? value.trim() : "");

const sanitizeUrl = (value) => {
  const url = sanitizeString(value);

  if (!url) {
    return "";
  }

  if (url.startsWith("/uploads/")) {
    return url;
  }

  if (url.startsWith("/") && !url.startsWith("//")) {
    return url;
  }

  try {
    const parsedUrl = new URL(url);
    return ["http:", "https:"].includes(parsedUrl.protocol) ? parsedUrl.toString() : "";
  } catch {
    return "";
  }
};

const normalizeList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeString(item)).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeDate = (value, label) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    const error = new Error(`${label} must be a valid date.`);
    error.statusCode = 400;
    throw error;
  }

  return date;
};

const fileDetailsFromUpload = (file) => ({
  url: toPublicUploadUrl(file),
  originalName: file.originalname,
  mimeType: file.mimetype,
  size: file.size,
  uploadedAt: new Date(),
});

const parseBoolean = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return false;
};

const buildProjectPayload = (body, userId, file) => {
  const title = sanitizeString(body.title);
  const description = sanitizeString(body.description);
  const techStack = normalizeList(body.techStack);
  const features = normalizeList(body.features);

  if (!title || !description || techStack.length === 0) {
    const error = new Error("Project title, description, and tech stack are required.");
    error.statusCode = 400;
    throw error;
  }

  return {
    title,
    description,
    techStack,
    features,
    image: file ? toPublicUploadUrl(file) : sanitizeUrl(body.image),
    githubLink: sanitizeUrl(body.githubLink),
    liveLink: sanitizeUrl(body.liveLink),
    featured: parseBoolean(body.featured),
    createdBy: userId || null,
  };
};

const buildSkillPayload = (body) => {
  const name = sanitizeString(body.name);
  const category = sanitizeString(body.category);
  const level = Number(body.level);

  if (!name || !category || Number.isNaN(level)) {
    const error = new Error("Skill name, category, and level are required.");
    error.statusCode = 400;
    throw error;
  }

  return {
    name,
    category,
    level: Math.max(1, Math.min(100, level)),
  };
};

const buildExperiencePayload = (body) => {
  const title = sanitizeString(body.title);
  const company = sanitizeString(body.company);
  const duration = sanitizeString(body.duration);
  const description = sanitizeString(body.description);
  const achievements = normalizeList(body.achievements);

  if (!title || !company || !duration || !description) {
    const error = new Error("All experience fields are required.");
    error.statusCode = 400;
    throw error;
  }

  return { title, company, duration, description, achievements };
};

const buildCertificationPayload = (body, file) => {
  const title = sanitizeString(body.title);
  const issuer = sanitizeString(body.issuer);
  const completionDate = normalizeDate(body.completionDate, "Completion date");

  if (!title || !issuer) {
    const error = new Error("Certificate title, issuer, and completion date are required.");
    error.statusCode = 400;
    throw error;
  }

  return {
    title,
    issuer,
    completionDate,
    previewFile: file ? toPublicUploadUrl(file) : sanitizeUrl(body.previewFile),
    credentialLink: sanitizeUrl(body.credentialLink),
  };
};

const buildTestimonialPayload = (body) => {
  const name = sanitizeString(body.name);
  const role = sanitizeString(body.role);
  const message = sanitizeString(body.message);
  const rating = Number(body.rating);

  if (!name || !role || !message || Number.isNaN(rating)) {
    const error = new Error("Testimonial name, role, message, and rating are required.");
    error.statusCode = 400;
    throw error;
  }

  return {
    name,
    role,
    message,
    rating: Math.max(1, Math.min(5, Math.round(rating))),
  };
};

const getDocumentById = async (Model, id, label) => {
  if (!isValidObjectId(id)) {
    const error = new Error(`Invalid ${label} id.`);
    error.statusCode = 400;
    throw error;
  }

  const document = await Model.findById(id);

  if (!document) {
    const error = new Error(`${label} not found.`);
    error.statusCode = 404;
    throw error;
  }

  return document;
};

export const getDashboardData = async (req, res, next) => {
  try {
    const [projects, skills, experience, testimonials, certifications, messages, resume, photos, logo] = await Promise.all([
      Project.find().sort({ featured: -1, createdAt: -1 }).lean(),
      Skill.find().sort({ category: 1, level: -1 }).lean(),
      Experience.find().sort({ createdAt: -1 }).lean(),
      Testimonial.find().sort({ createdAt: -1 }).lean(),
      Certification.find().sort({ completionDate: -1, createdAt: -1 }).lean(),
      Message.find().sort({ createdAt: -1 }).lean(),
      SiteAsset.findOne({ key: "resume" }).lean(),
      Photo.find().sort({ featured: -1, createdAt: -1 }).lean(),
      SiteAsset.findOne({ key: "logo" }).lean(),
    ]);

    res.json({
      projects,
      skills,
      experience,
      testimonials,
      certifications,
      messages,
      resume: resume?.file || null,
      photos,
      logo: logo?.file || null,
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(buildProjectPayload(req.body, req.user?.id, req.file));
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await getDocumentById(Project, req.params.id, "Project");
    const previousImage = project.image;
    Object.assign(project, buildProjectPayload(req.body, project.createdBy || req.user?.id, req.file));
    await project.save();
    if (req.file && previousImage !== project.image) {
      removeUploadedFile(previousImage);
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await getDocumentById(Project, req.params.id, "Project");
    removeUploadedFile(project.image);
    await project.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const createSkill = async (req, res, next) => {
  try {
    const skill = await Skill.create(buildSkillPayload(req.body));
    res.status(201).json(skill);
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req, res, next) => {
  try {
    const skill = await getDocumentById(Skill, req.params.id, "Skill");
    Object.assign(skill, buildSkillPayload(req.body));
    await skill.save();
    res.json(skill);
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await getDocumentById(Skill, req.params.id, "Skill");
    await skill.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const createExperience = async (req, res, next) => {
  try {
    const experience = await Experience.create(buildExperiencePayload(req.body));
    res.status(201).json(experience);
  } catch (error) {
    next(error);
  }
};

export const updateExperience = async (req, res, next) => {
  try {
    const experience = await getDocumentById(Experience, req.params.id, "Experience");
    Object.assign(experience, buildExperiencePayload(req.body));
    await experience.save();
    res.json(experience);
  } catch (error) {
    next(error);
  }
};

export const deleteExperience = async (req, res, next) => {
  try {
    const experience = await getDocumentById(Experience, req.params.id, "Experience");
    await experience.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const createCertification = async (req, res, next) => {
  try {
    const certification = await Certification.create(buildCertificationPayload(req.body, req.file));
    res.status(201).json(certification);
  } catch (error) {
    next(error);
  }
};

export const updateCertification = async (req, res, next) => {
  try {
    const certification = await getDocumentById(Certification, req.params.id, "Certification");
    const previousPreview = certification.previewFile;
    Object.assign(certification, buildCertificationPayload(req.body, req.file));
    await certification.save();
    if (req.file && previousPreview !== certification.previewFile) {
      removeUploadedFile(previousPreview);
    }
    res.json(certification);
  } catch (error) {
    next(error);
  }
};

export const deleteCertification = async (req, res, next) => {
  try {
    const certification = await getDocumentById(Certification, req.params.id, "Certification");
    removeUploadedFile(certification.previewFile);
    await certification.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(buildTestimonialPayload(req.body));
    res.status(201).json(testimonial);
  } catch (error) {
    next(error);
  }
};

export const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await getDocumentById(Testimonial, req.params.id, "Testimonial");
    Object.assign(testimonial, buildTestimonialPayload(req.body));
    await testimonial.save();
    res.json(testimonial);
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await getDocumentById(Testimonial, req.params.id, "Testimonial");
    await testimonial.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "A PDF resume file is required." });
    }

    const existingResume = await SiteAsset.findOne({ key: "resume" });
    const resume = await SiteAsset.findOneAndUpdate(
      { key: "resume" },
      { key: "resume", file: fileDetailsFromUpload(req.file) },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    if (existingResume?.file?.url && existingResume.file.url !== resume.file.url) {
      removeUploadedFile(existingResume.file.url);
    }

    res.status(201).json(resume.file);
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    const existingResume = await SiteAsset.findOne({ key: "resume" });
    if (existingResume?.file?.url) {
      removeUploadedFile(existingResume.file.url);
    }
    await SiteAsset.deleteOne({ key: "resume" });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "A logo file is required." });
    }

    const existingLogo = await SiteAsset.findOne({ key: "logo" });
    const logo = await SiteAsset.findOneAndUpdate(
      { key: "logo" },
      { key: "logo", file: fileDetailsFromUpload(req.file) },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    if (existingLogo?.file?.url && existingLogo.file.url !== logo.file.url) {
      removeUploadedFile(existingLogo.file.url);
    }

    res.status(201).json(logo.file);
  } catch (error) {
    next(error);
  }
};

export const deleteLogo = async (req, res, next) => {
  try {
    const existingLogo = await SiteAsset.findOne({ key: "logo" });
    if (existingLogo?.file?.url) {
      removeUploadedFile(existingLogo.file.url);
    }
    await SiteAsset.deleteOne({ key: "logo" });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const buildPhotoPayload = (body, userId, file) => {
  const title = sanitizeString(body.title);
  const description = sanitizeString(body.description);
  const alt = sanitizeString(body.alt);

  if (!title) {
    const error = new Error("Photo title is required.");
    error.statusCode = 400;
    throw error;
  }

  return {
    title,
    description,
    alt,
    image: file ? toPublicUploadUrl(file) : sanitizeUrl(body.image),
    featured: parseBoolean(body.featured),
    createdBy: userId || null,
  };
};

export const createPhoto = async (req, res, next) => {
  try {
    const photo = await Photo.create(buildPhotoPayload(req.body, req.user?.id, req.file));
    res.status(201).json(photo);
  } catch (error) {
    next(error);
  }
};

export const updatePhoto = async (req, res, next) => {
  try {
    const photo = await getDocumentById(Photo, req.params.id, "Photo");
    const previousImage = photo.image;
    Object.assign(photo, buildPhotoPayload(req.body, photo.createdBy || req.user?.id, req.file));
    await photo.save();
    if (req.file && previousImage !== photo.image) {
      removeUploadedFile(previousImage);
    }
    res.json(photo);
  } catch (error) {
    next(error);
  }
};

export const deletePhoto = async (req, res, next) => {
  try {
    const photo = await getDocumentById(Photo, req.params.id, "Photo");
    const imageUrl = photo.image;
    await photo.deleteOne();
    removeUploadedFile(imageUrl);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).lean();
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const message = await getDocumentById(Message, req.params.id, "Message");
    await message.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
