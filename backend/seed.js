import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { connectDatabase } from "./config/db.js";
import Job from "./models/Job.js";
import User from "./models/User.js";

const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(backendDirectory, ".env") });

const demoJobs = [
  { title: "MERN Stack Intern", company: "TechNova Solutions", location: "Bengaluru", mode: "Hybrid", jobType: "Internship", salary: "₹20,000 / month", duration: "6 Months", createdAt: new Date("2025-10-23"), deadline: new Date("2025-11-15"), logo: "TN", color: "blue", verified: true, skills: ["React", "Node.js", "Express", "MongoDB"], description: "TechNova Solutions is seeking enthusiastic final-year B.Tech / MCA students or fresh graduates passionate about full-stack web development.", responsibilities: ["Build reusable React.js components with clean, modern state management.", "Assist in developing backend REST APIs using Node.js and Express.js.", "Integrate MongoDB collections and schema models with reliable validation."] },
  { title: "React Developer Intern", company: "CloudScale Labs", location: "Pune", mode: "Remote", jobType: "Internship", salary: "₹18,000 / month", duration: "4 Months", createdAt: new Date("2025-10-24"), deadline: new Date("2025-11-28"), logo: "CS", color: "mint", verified: true, skills: ["React.js", "Tailwind", "Git"], description: "Join CloudScale Labs to create polished product experiences for a growing cloud platform.", responsibilities: ["Create accessible, responsive UI components in React.", "Collaborate with designers to implement product screens.", "Write clear, maintainable code and participate in team reviews."] },
  { title: "Junior Frontend Developer", company: "InnoByte Tech", location: "Hyderabad", mode: "On-site", jobType: "Full-time", salary: "₹6.5 LPA", duration: "Full-time", createdAt: new Date("2025-10-22"), deadline: new Date("2025-11-30"), logo: "IB", color: "orange", verified: true, skills: ["JavaScript", "React", "CSS"], description: "InnoByte Tech is hiring a curious junior frontend developer to help deliver dependable web experiences.", responsibilities: ["Develop and maintain user-facing features.", "Work with designers and backend engineers to deliver complete features.", "Improve performance, browser support, and accessibility."] },
  { title: "Data Analyst Intern", company: "BrightPath Analytics", location: "Mumbai", mode: "Hybrid", jobType: "Internship", salary: "₹15,000 / month", duration: "3 Months", createdAt: new Date("2025-10-21"), deadline: new Date("2025-12-05"), logo: "BP", color: "purple", verified: true, skills: ["Python", "SQL", "Power BI"], description: "BrightPath Analytics helps teams make better decisions through clear, reliable data.", responsibilities: ["Clean and explore datasets with Python and SQL.", "Create clear dashboards and reports for project teams.", "Document findings and present insights to your mentor."] },
  { title: "Software Developer Intern", company: "NextGen Systems", location: "Noida", mode: "On-site", jobType: "Internship", salary: "₹18,000 / month", duration: "6 Months", createdAt: new Date("2025-10-20"), deadline: new Date("2025-12-12"), logo: "NG", color: "rose", verified: true, skills: ["Java", "Spring Boot", "MySQL"], description: "NextGen Systems is looking for a motivated student to contribute to internal software projects.", responsibilities: ["Implement and test features for internal applications.", "Work with APIs and relational databases.", "Share progress and collaborate in weekly code reviews."] },
  { title: "UI/UX Design Intern", company: "PixelCraft Studio", location: "Remote", mode: "Remote", jobType: "Internship", salary: "₹16,000 / month", duration: "4 Months", createdAt: new Date("2025-10-18"), deadline: new Date("2025-12-20"), logo: "PC", color: "yellow", verified: true, skills: ["Figma", "Prototyping", "Design Systems"], description: "PixelCraft Studio is building friendly digital products and is looking for a design student eager to learn.", responsibilities: ["Create wireframes, prototypes, and polished interface designs.", "Help maintain reusable design patterns.", "Present concepts and iterate based on feedback."] }
];

await connectDatabase();
const password = await bcrypt.hash("Employer123", 12);
await User.findOneAndUpdate(
  { email: "employer@jobnest.com" },
  { name: "JobNest Employer", email: "employer@jobnest.com", password, role: "Employer" },
  { upsert: true, new: true, setDefaultsOnInsert: true }
).select("+password");
const employer = await User.findOne({ email: "employer@jobnest.com" });
await Job.deleteMany({ employer: employer._id });
await Job.insertMany(demoJobs.map((job) => ({ ...job, employer: employer._id })));
console.log("Seeded demo employer and 6 jobs.");
await mongoose.disconnect();
