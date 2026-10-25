import express from "express";
import { createJob, deleteJob, getJob, listJobs, updateJob } from "../controllers/jobController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();
router.get("/", listJobs);
router.get("/:id", getJob);
router.post("/", protect, authorize("Employer"), createJob);
router.put("/:id", protect, authorize("Employer"), updateJob);
router.delete("/:id", protect, authorize("Employer"), deleteJob);

export default router;
