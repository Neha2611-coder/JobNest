import Job from "../models/Job.js";

export async function listJobs(req, res, next) {
  try {
    const { search, q, location, type, mode, experience, sort, mine } = req.query;
    const filter = {};
    if (q || search) filter.$text = { $search: q || search };
    if (location) filter.location = new RegExp(location, "i");
    if (type) filter.jobType = { $in: type.split(",") };
    if (mode) filter.mode = { $in: mode.split(",") };
    if (experience) filter.experience = new RegExp(experience, "i");
    if (mine === "true" && req.user) filter.employer = req.user._id;

    const sortOrder = sort === "Salary: high to low" ? { salary: -1 } : { createdAt: -1 };
    const jobs = await Job.find(filter).populate("employer", "name company").sort(sortOrder);
    res.json({ jobs, count: jobs.length });
  } catch (error) {
    next(error);
  }
}

export async function getJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.id).populate("employer", "name");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ job });
  } catch (error) {
    next(error);
  }
}

export async function createJob(req, res, next) {
  try {
    const job = await Job.create({ ...req.body, employer: req.user._id });
    res.status(201).json({ job });
  } catch (error) {
    next(error);
  }
}

export async function updateJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (!job.employer.equals(req.user._id)) return res.status(403).json({ message: "Only the employer who posted this job can update it" });

    Object.assign(job, req.body);
    await job.save();
    res.json({ job });
  } catch (error) {
    next(error);
  }
}

export async function deleteJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (!job.employer.equals(req.user._id)) return res.status(403).json({ message: "Only the employer who posted this job can delete it" });

    await job.deleteOne();
    res.json({ message: "Job deleted" });
  } catch (error) {
    next(error);
  }
}
