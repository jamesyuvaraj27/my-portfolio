import { Router } from "express";

import {
  createCertification,
  createExperience,
  createPhoto,
  createProject,
  createSkill,
  createTestimonial,
  deleteCertification,
  deleteExperience,
  deleteLogo,
  deleteMessage,
  deletePhoto,
  deleteProject,
  deleteResume,
  deleteSkill,
  deleteTestimonial,
  getDashboardData,
  getMessages,
  updateCertification,
  updateExperience,
  updatePhoto,
  updateProject,
  updateSkill,
  updateTestimonial,
  uploadLogo,
  uploadResume,
} from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";
import { certificateUpload, imageUpload, resumeUpload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.use(requireAdmin);

router.get("/dashboard", getDashboardData);

router.route("/resume").post(resumeUpload.single("resume"), uploadResume).delete(deleteResume);
router.route("/logo").post(imageUpload.single("logo"), uploadLogo).delete(deleteLogo);

router.route("/projects").post(imageUpload.single("imageFile"), createProject);
router.route("/projects/:id").put(imageUpload.single("imageFile"), updateProject).delete(deleteProject);

router.route("/photos").post(imageUpload.single("imageFile"), createPhoto);
router.route("/photos/:id").put(imageUpload.single("imageFile"), updatePhoto).delete(deletePhoto);

router.route("/skills").post(createSkill);
router.route("/skills/:id").put(updateSkill).delete(deleteSkill);

router.route("/experience").post(createExperience);
router.route("/experience/:id").put(updateExperience).delete(deleteExperience);

router.route("/certifications").post(certificateUpload.single("previewFile"), createCertification);
router
  .route("/certifications/:id")
  .put(certificateUpload.single("previewFile"), updateCertification)
  .delete(deleteCertification);

router.route("/testimonials").post(createTestimonial);
router.route("/testimonials/:id").put(updateTestimonial).delete(deleteTestimonial);

router.route("/messages").get(getMessages);
router.route("/messages/:id").delete(deleteMessage);

export default router;
