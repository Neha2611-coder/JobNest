import Application from "../models/Application.js";
import Job from "../models/Job.js";

export async function applyForJob(req, res, next) {
  try {
    const job = await Job.findById(req.body.job);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const application = await Application.create({
      job: job._id,
      applicant: req.user._id,
      phone: req.body.phone,
      education: req.body.education,
      skills: req.body.skills,
      resume: req.body.resume,
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
    const job = await Job.findById(req.params.jobId);
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

    const application = await Application.findById(req.params.id).populate("job", "employer");
    if (!application) return res.status(404).json({ message: "Application not found" });
    if (!application.job.employer.equals(req.user._id)) {
      return res.status(403).json({ message: "Only the employer who posted this job can update its applications" });
    }

    application.status = req.body.status;
    await application.save();
    res.json({ application });
  } catch (error) {
    next(error);
  }
}
