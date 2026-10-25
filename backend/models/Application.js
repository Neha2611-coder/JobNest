import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["Applied", "Under Review", "Shortlisted", "Rejected", "Accepted"], default: "Applied" },
    phone: { type: String, trim: true, default: "" },
    education: { type: String, trim: true, default: "" },
    skills: [{ type: String, trim: true }],
    resume: { type: String, trim: true, default: "" },
  },
  { timestamps: { createdAt: "appliedAt", updatedAt: true }, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
