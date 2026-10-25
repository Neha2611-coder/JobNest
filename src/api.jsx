import { createContext, useContext, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function normalizeJob(job) {
  if (!job) return null;
  const postedDate = new Date(job.createdAt || Date.now());
  const elapsedDays = Math.max(0, Math.floor((Date.now() - postedDate) / 86400000));
  const posted = elapsedDays === 0 ? "today" : elapsedDays === 1 ? "1 day ago" : `${elapsedDays} days ago`;
  const deadlineDate = job.deadline ? new Date(job.deadline) : null;

  return {
    ...job,
    id: job._id || job.id,
    type: job.jobType || job.type,
    posted,
    deadline: deadlineDate
      ? deadlineDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
      : job.deadline,
    logo: job.logo || job.company?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "JN",
    color: job.color || "blue",
    verified: job.verified !== false,
  };
}

export function normalizeApplication(application) {
  const job = application.job || {};
  return {
    ...application,
    id: application._id || application.id,
    jobId: job._id || application.jobId,
    title: job.title,
    company: job.company,
    type: job.jobType,
    salary: job.salary,
  };
}

export async function api(path, options = {}) {
  const token = localStorage.getItem("jobnest-token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({ message: "The server returned an invalid response" }));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("jobnest-token")) {
      setLoading(false);
      return;
    }
    api("/auth/me")
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => localStorage.removeItem("jobnest-token"))
      .finally(() => setLoading(false));
  }, []);

  function saveSession(data) {
    localStorage.setItem("jobnest-token", data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("jobnest-token");
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, saveSession, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
