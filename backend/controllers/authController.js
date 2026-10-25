import User from "../models/User.js";
import { createToken } from "../utils/token.js";

function publicUser(user) {
  return user.toObject({ transform: (doc, result) => {
    delete result.password;
    delete result.__v;
    return result;
  } });
}

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Name, email, password, and role are required" });
    }

    const normalizedRole = role === "Student" ? "Job Seeker" : role === "Recruiter" ? "Employer" : role;
    const user = await User.create({ name, email, password, role: normalizedRole });
    const token = createToken(user._id);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ token: createToken(user._id), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  res.json({ user: publicUser(req.user) });
}
