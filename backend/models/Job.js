import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Job title is required"], trim: true },
    company: { type: String, required: [true, "Company name is required"], trim: true },
    description: { type: String, required: [true, "Description is required"], trim: true },
    location: { type: String, required: [true, "Location is required"], trim: true },
    salary: { type: String, required: [true, "Salary is required"], trim: true },
    jobType: { type: String, enum: ["Internship", "Full-time"], required: true },
    mode: { type: String, enum: ["Remote", "On-site", "Hybrid"], required: true },
    duration: { type: String, trim: true, default: "" },
    experience: { type: String, trim: true, default: "Fresher / 0-1 Year" },
    skills: [{ type: String, trim: true }],
    responsibilities: [{ type: String, trim: true }],
    eligibility: { type: String, trim: true, default: "" },
    deadline: { type: Date, required: [true, "Deadline is required"] },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

jobSchema.index({ title: "text", company: "text", skills: "text", location: "text" });

export default mongoose.model("Job", jobSchema);
