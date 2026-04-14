import Message from "../models/Message.js";
import Photo from "../models/Photo.js";
import Project from "../models/Project.js";
import Skill from "../models/Skill.js";
import Experience from "../models/Experience.js";
import Certification from "../models/Certification.js";
import SiteAsset from "../models/SiteAsset.js";
import Testimonial from "../models/Testimonial.js";
import { resolveUploadPath } from "../middleware/uploadMiddleware.js";
import { sanitizeEmail } from "../utils/auth.js";

const getTechFilters = (projects) => [
  "All",
  ...new Set(projects.flatMap((project) => project.techStack)),
];

const getSkillCategories = (skills) => [
  "All",
  ...new Set(skills.map((skill) => skill.category)),
];

export const getPortfolioContent = async (req, res, next) => {
  try {
    const [projects, skills, experience, certifications, testimonials, resume, photos, logo] = await Promise.all([
      Project.find().sort({ featured: -1, createdAt: -1 }).lean(),
      Skill.find().sort({ category: 1, level: -1 }).lean(),
      Experience.find().sort({ createdAt: -1 }).lean(),
      Certification.find().sort({ completionDate: -1, createdAt: -1 }).lean(),
      Testimonial.find().sort({ createdAt: -1 }).lean(),
      SiteAsset.findOne({ key: "resume" }).lean(),
      Photo.find().sort({ featured: -1, createdAt: -1 }).lean(),
      SiteAsset.findOne({ key: "logo" }).lean(),
    ]);

    const featuredProjects = projects.filter((project) => project.featured);

    res.json({
      projects,
      featuredProjects,
      skills,
      experience,
      certifications,
      testimonials,
      photos,
      resume: resume?.file || null,
      logo: logo?.file || null,
      filters: {
        tech: getTechFilters(projects),
        skillCategories: getSkillCategories(skills),
      },
      stats: {
        projectCount: projects.length,
        featuredCount: featuredProjects.length,
        skillCount: skills.length,
        experienceCount: experience.length,
        certificationCount: certifications.length,
        testimonialCount: testimonials.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const submitMessage = async (req, res, next) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email = sanitizeEmail(req.body.email);
    const message = typeof req.body.message === "string" ? req.body.message.trim() : "";
    const rating = Number(req.body.rating);

    if (!name || !email || message.length < 10) {
      return res.status(400).json({
        message: "Name, valid email, and a message with at least 10 characters are required.",
      });
    }

    const normalizedRating = Number.isFinite(rating) && rating >= 1 && rating <= 5 ? Math.round(rating) : null;

    const savedMessage = await Message.create({
      name,
      email,
      message,
      rating: normalizedRating,
    });

    res.status(201).json({
      message: "Message received. I will get back to you soon.",
      savedMessage,
    });
  } catch (error) {
    next(error);
  }
};

export const downloadResume = async (req, res, next) => {
  try {
    const resume = await SiteAsset.findOne({ key: "resume" }).lean();
    const filePath = resolveUploadPath(resume?.file?.url);

    if (!filePath) {
      return res.status(404).json({ message: "Resume has not been uploaded yet." });
    }

    res.download(filePath, resume.file.originalName || "resume.pdf");
  } catch (error) {
    next(error);
  }
};
