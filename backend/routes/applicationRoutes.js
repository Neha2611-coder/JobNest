import express from "express";
import { applicationsForJob, applyForJob, myApplications, updateApplicationStatus } from "../controllers/applicationController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);
router.post("/", authorize("Job Seeker"), applyForJob);
router.get("/", authorize("Job Seeker"), myApplications);
router.get("/job/:jobId", authorize("Employer"), applicationsForJob);
router.put("/:id", authorize("Employer"), updateApplicationStatus);

export default router;
