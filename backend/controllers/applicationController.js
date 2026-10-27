import mongoose from "mongoose";
import Application from "../models/Application.js";
import Job from "../models/Job.js";

function normalizeSkills(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
}

function normalizeText(value, fallback = "") {
  const text = typeof value === "string" ? value.trim() : fallback;
  return text || fallback;
}

export async function applyForJob(req, res, next) {
  try {
    const jobId = req.body.job || req.body.jobId;
    if (!jobId) return res.status(400).json({ message: "Job ID is required" });
    if (!mongoose.isValidObjectId(jobId)) return res.status(400).json({ message: "Invalid job ID" });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.employer.equals(req.user._id)) {
      return res.status(400).json({ message: "You cannot apply to your own job listing" });
    }

    const application = await Application.create({
      job: job._id,
      applicant: req.user._id,
      phone: normalizeText(req.body.phone, req.user.phone),
      education: normalizeText(req.body.education, req.user.education),
      skills: normalizeSkills(req.body.skills).length ? normalizeSkills(req.body.skills) : req.user.skills || [],
      resume: normalizeText(req.body.resume, req.user.resume),
    });

    res.status(201).json({ application });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "You have already applied for this job" });
    next(error);
  }
}

export async function myApplications(req, res, next) {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job", "title company jobType mode salary location")
      .sort({ appliedAt: -1 });
    res.json({ applications, count: applications.length });
  } catch (error) {
    next(error);
  }
}

export async function applicationsForJob(req, res, next) {
  try {
    const { jobId } = req.params;
    if (!mongoose.isValidObjectId(jobId)) return res.status(400).json({ message: "Invalid job ID" });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (!job.employer.equals(req.user._id)) return res.status(403).json({ message: "Only the employer who posted this job can view applicants" });

    const applications = await Application.find({ job: job._id })
      .populate("applicant", "name email phone skills education experience resume")
      .sort({ appliedAt: -1 });
    res.json({ applications, count: applications.length });
  } catch (error) {
    next(error);
  }
}

export async function updateApplicationStatus(req, res, next) {
  try {
    const allowedStatuses = ["Applied", "Under Review", "Shortlisted", "Rejected", "Accepted"];
    if (!allowedStatuses.includes(req.body.status)) return res.status(400).json({ message: "Invalid application status" });
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid application ID" });

    const application = await Application.findById(req.params.id).populate("job", "employer");
    if (!application) return res.status(404).json({ message: "Application not found" });
    if (!application.job || !application.job.employer || !application.job.employer.equals(req.user._id)) {
      return res.status(403).json({ message: "Only the employer who posted this job can update its applications" });
    }

    application.status = req.body.status;
    await application.save();
    res.json({ application });
  } catch (error) {
    next(error);
  }
}
