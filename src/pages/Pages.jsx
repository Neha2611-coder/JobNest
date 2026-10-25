import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api, normalizeApplication, normalizeJob, useAuth } from "../api.jsx";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, BookOpen, BriefcaseBusiness,
  Building2, Check, CheckCircle2, ChevronRight, CircleDollarSign, Clock3,
  GraduationCap, MapPin, Search, ShieldCheck, Sparkles, Users, Wallet,
} from "lucide-react";
import { jobs, getJobById } from "../data/jobs.js";
import JobCard from "../components/JobCard.jsx";
import { Button, Input, PageHeading, StatusBadge } from "../components/UI.jsx";

const applicationKey = "jobnest-applications";

function readApplications() {
  try {
    const stored = localStorage.getItem(applicationKey);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Could not read saved applications.", error);
    return [];
  }
}

function SearchBar({ initialQuery = "", onSearch, home = false }) {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState("");
  return (
    <form className={`search-bar ${home ? "home-search" : ""}`} onSubmit={(event) => {
      event.preventDefault();
      onSearch(query, location);
    }}>
      <label className="search-field">
        <Search size={17} />
        <input aria-label="Search by job title or skill" placeholder="Search by job title or skill (e.g. React, Node.js)" value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <label className="search-field location-field">
        <MapPin size={17} />
        <input aria-label="Location" placeholder="Location (e.g. Bengaluru, Remote)" value={location} onChange={(event) => setLocation(event.target.value)} />
      </label>
      <Button type="submit"><Search size={15} /> {home ? "Search Opportunities" : "Search Roles"}</Button>
    </form>
  );
}

function StatCard({ icon: Icon, value, label, tone }) {
  return (
    <div className="stat-card">
      <span className={`stat-icon stat-${tone}`}><Icon size={19} /></span>
      <div><strong>{value}</strong><span>{label}</span></div>
    </div>
  );
}

function JobCollection({ items, compact = false }) {
  return <div className={`job-collection ${compact ? "collection-compact" : ""}`}>{items.map((job) => <JobCard key={job.id} job={job} compact={compact} />)}</div>;
}

export function HomePage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api("/jobs")
      .then(({ jobs: serverJobs }) => setJobs(serverJobs.map(normalizeJob)))
      .catch(() => setJobs([]));
  }, []);

  return (
    <div className="page home-page">
      <div className="announcement"><span className="live-dot" /> <strong>CAMPUS DRIVE 2025</strong><span className="announcement-divider">•</span> Spring campus recruitments are live! 140+ verified technology companies currently accepting applications.<Link to="/jobs">Explore all <ArrowRight size={14} /></Link></div>
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow eyebrow-pill"><GraduationCap size={14} /> Dedicated portal for freshers & college students</span>
          <h1>Find Your Next Job <span>or Internship</span></h1>
          <p>Discover internships and entry-level jobs that match your skills and career goals.<br className="desktop-break" /> Connect directly with hiring teams building with modern tech stacks.</p>
          <SearchBar home onSearch={(query, location) => navigate(`/jobs?q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`)} />
          <div className="trending"><span>⌁ Trending:</span>{["React", "Node.js", "Web Developer", "Summer Intern", "Remote"].map((tag) => <Link to={`/jobs?q=${encodeURIComponent(tag)}`} key={tag}>{tag}</Link>)}</div>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-floating-card"><span className="hero-card-icon"><BriefcaseBusiness size={20} /></span><span><strong>Your next chapter</strong><small>starts right here</small></span><span className="hero-check"><Check size={14} /></span></div><div className="hero-student"><GraduationCap size={46} /></div><span className="hero-sparkle sparkle-one">✦</span><span className="hero-sparkle sparkle-two">✳</span></div>
      </section>
      <section className="stats-grid" aria-label="JobNest statistics">
        <StatCard icon={Building2} value="250+" label="Active Startups & MNCs" tone="blue" />
        <StatCard icon={BriefcaseBusiness} value="1,240+" label="Student Applications" tone="mint" />
        <StatCard icon={CircleDollarSign} value="₹4.8 LPA" label="Average CTC Offered" tone="orange" />
        <StatCard icon={ShieldCheck} value="100%" label="College Verified Roles" tone="blue" />
      </section>
      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">BROWSE PATHWAYS</span><h2>Explore Opportunities by Category</h2></div><Link className="section-link" to="/jobs">View all roles <ArrowRight size={14} /></Link></div>
        <div className="category-grid">
          {[
            ["⌘", "Web Development", "45+ Openings", "blue"],
            ["▣", "Software Development", "38+ Openings", "purple"],
            ["⌁", "Data Science", "20+ Openings", "orange"],
            ["⚙", "AI & Machine Learning", "15+ Openings", "blue"],
            ["◈", "UI/UX Design", "18+ Openings", "mint"],
          ].map(([icon, name, count, tone]) => <Link className="category-card" to={`/jobs?q=${encodeURIComponent(name)}`} key={name}><span className={`category-icon stat-${tone}`}>{icon}</span><ArrowUpRight className="category-arrow" size={15} /><strong>{name}</strong><small><span className="live-dot" /> {count}</small></Link>)}
        </div>
      </section>
      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">VERIFIED FEEDS</span><h2>Latest Jobs & Internships</h2></div><Link className="section-link" to="/jobs">Browse all opportunities <ArrowRight size={14} /></Link></div>
        <JobCollection items={jobs.slice(0, 3)} compact />
      </section>
      <section className="cta-panel"><span className="cta-icon"><GraduationCap size={23} /></span><div><h2>Your next opportunity is closer than you think.</h2><p>Explore verified roles designed for students and fresh graduates.</p></div><Button to="/jobs">Find your next role <ArrowRight size={15} /></Button></section>
    </div>
  );
}

function FilterGroup({ title, options, selected, onChange, counts = {} }) {
  return (
    <fieldset className="filter-group">
      <legend>{title}</legend>
      {options.map((option) => <label className="filter-option" key={option}><input type="checkbox" checked={selected.includes(option)} onChange={() => onChange(option)} /><span>{option}</span>{counts[option] && <small>{counts[option]}</small>}</label>)}
    </fieldset>
  );
}

export function JobsPage() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [types, setTypes] = useState(() => searchParams.get("type") ? [searchParams.get("type")] : []);
  const [modes, setModes] = useState([]);
  const [sort, setSort] = useState("Latest");
  const [error, setError] = useState("");

  useEffect(() => {
    api("/jobs")
      .then(({ jobs: serverJobs }) => setJobs(serverJobs.map(normalizeJob)))
      .catch((requestError) => setError(requestError.message));
  }, []);

  const toggle = (values, setter, value) => setter(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  const filteredJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      const searchMatch = !query || `${job.title} ${job.company} ${job.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase());
      const locationMatch = !location || `${job.location} ${job.mode}`.toLowerCase().includes(location.toLowerCase());
      return searchMatch && locationMatch && (!types.length || types.includes(job.type)) && (!modes.length || modes.includes(job.mode));
    });
    if (sort === "Salary: high to low") result = [...result].sort((a, b) => parseInt(b.salary.replace(/\D/g, ""), 10) - parseInt(a.salary.replace(/\D/g, ""), 10));
    return result;
  }, [query, location, types, modes, sort]);
  return (
    <div className="page">
      <section className="listing-hero"><span className="eyebrow eyebrow-pill"><ShieldCheck size={13} /> Campus placement verified drive 2025</span><h1>Find Jobs & Internships</h1><p>Browse verified entry-level roles and student internships from verified campus hiring<br className="desktop-break" /> partners.</p><SearchBar initialQuery={query} onSearch={(nextQuery, nextLocation) => { setQuery(nextQuery); setLocation(nextLocation); }} /></section>
      <div className="listing-layout">
        <aside className="filter-panel"><div className="filter-heading"><h2>☷ &nbsp;Filter By</h2><button type="button" onClick={() => { setTypes([]); setModes([]); setQuery(""); setLocation(""); }}>Clear All</button></div><FilterGroup title="JOB TYPE" options={["Internship", "Full-time"]} selected={types} onChange={(value) => toggle(types, setTypes, value)} counts={{ Internship: "68", "Full-time": "52" }} /><FilterGroup title="WORK MODE" options={["Remote", "On-site", "Hybrid"]} selected={modes} onChange={(value) => toggle(modes, setModes, value)} /><div className="filter-group"><legend>EXPERIENCE LEVEL</legend><label className="filter-option"><input type="checkbox" /><span>Fresher / 0-1 Year</span></label><label className="filter-option"><input type="checkbox" /><span>Final Year Student</span></label></div><fieldset className="filter-group"><legend>SALARY / STIPEND RANGE</legend>{["Any Range", "₹10k - ₹20k / month", "₹20k - ₹35k / month", "₹4.0 LPA+"].map((item, index) => <label className="filter-option" key={item}><input type="radio" name="salary" defaultChecked={index === 0} /><span>{item}</span></label>)}</fieldset></aside>
        <section className="results-section"><div className="results-toolbar"><strong>Showing {filteredJobs.length} Available Opportunities <span className="live-dot" /></strong><label className="sort-control">Sort by: <select value={sort} onChange={(event) => setSort(event.target.value)}><option>Latest</option><option>Salary: high to low</option></select></label></div>{filteredJobs.length ? <JobCollection items={filteredJobs} /> : <div className="empty-state"><Search size={28} /><h2>No matching opportunities yet</h2><p>Try a different job title, location, or filter.</p><Button variant="secondary" onClick={() => { setQuery(""); setLocation(""); setTypes([]); setModes([]); }}>Clear filters</Button></div>}</section>
      </div>
    </div>
  );
}

export function JobDetailsPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api(`/jobs/${jobId}`)
      .then(({ job: serverJob }) => setJob(normalizeJob(serverJob)))
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading) return <div className="page"><p>Loading opportunity...</p></div>;
  if (!job) return <NotFoundPage />;
  return (
    <div className="page">
      <div className="breadcrumbs"><Link to="/">Home</Link><ChevronRight size={14} /><Link to="/jobs">Jobs</Link><ChevronRight size={14} /><span>{job.title}</span><Link className="breadcrumb-back" to="/jobs"><ArrowLeft size={14} /> Back to Jobs</Link></div>
      <section className="detail-title-card"><div className={`company-mark mark-${job.color} detail-mark`}>{job.logo}</div><div className="detail-title-copy"><span className="eyebrow">EARLY CAREER DRIVE <span className="live-dot" /> ACTIVELY RECRUITING</span><h1>{job.title}</h1><p>{job.company} <BadgeCheck size={15} className="verified-check" /></p><div className="detail-meta"><span><MapPin size={14} /> {job.location}, India ({job.mode})</span><span><Clock3 size={14} /> {job.type} ({job.duration})</span><span><Wallet size={14} /> {job.salary}</span><span>Posted {job.posted}</span></div></div><div className="detail-actions"><Button to={`/apply/${job.id}`}><ArrowUpRight size={15} /> Apply Now</Button><Button variant="secondary"><span aria-hidden="true">♡</span> Save Job</Button></div></section>
      <div className="detail-grid"><div className="detail-main">
        <section className="content-card"><h2><BookOpen size={17} /> About the {job.type}</h2><p>{job.description}</p><p>You will gain hands-on experience in a supportive team environment, with regular mentorship and opportunities to build your portfolio.</p><div className="highlight-strip"><GraduationCap size={20} /><div><strong>Capstone project friendly</strong><small>Eligible for academic semester credit & project certification sign-off.</small></div><span className="highlight-badge">Academic validated</span></div></section>
        <section className="content-card"><h2><CheckCircle2 size={17} /> Key Responsibilities</h2><ul className="responsibilities-list">{job.responsibilities.map((item) => <li key={item}><CheckCircle2 size={15} />{item}</li>)}</ul></section>
        <section className="content-card"><h2><Sparkles size={17} /> Skills & Requirements</h2><p>We welcome motivated students and recent graduates who enjoy learning and working together.</p><div className="skill-list">{job.skills.map((skill) => <span className="skill-chip" key={skill}>{skill}</span>)}</div></section>
      </div><aside className="detail-side"><section className="content-card overview-card"><h2><BadgeCheck size={17} /> Opportunity Overview</h2><div className="overview-item"><CircleDollarSign size={16} /><div><strong>Compensation</strong><span>{job.salary}</span></div></div><div className="overview-item"><Clock3 size={16} /><div><strong>Working hours</strong><span>Monday – Friday · 9:30 AM – 6:00 PM</span></div></div><div className="overview-item"><GraduationCap size={16} /><div><strong>Mentorship</strong><span>Dedicated guidance and regular check-ins</span></div></div><Button to={`/apply/${job.id}`} className="full-button">Apply for this role <ArrowRight size={15} /></Button><small className="deadline-note">Application deadline: {job.deadline}</small></section><section className="content-card"><h2><Building2 size={17} /> Company Details</h2><strong>{job.company}</strong><p>Technology & digital products</p><div className="company-detail-row"><span>Company size</span><strong>50–100 employees</strong></div><div className="company-detail-row"><span>Industry</span><strong>Software & IT</strong></div></section></aside></div>
    </div>
  );
}

export function ApplyPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api(`/jobs/${jobId}`)
      .then(({ job: serverJob }) => setJob(normalizeJob(serverJob)))
      .catch(() => setJob(null))
      .finally(() => setLoadingJob(false));
  }, [jobId]);

  if (loadingJob) return <div className="page"><p>Loading application form...</p></div>;
  if (!job) return <NotFoundPage />;
  async function submitApplication(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);

    try {
      await api("/applications", {
        method: "POST",
        body: JSON.stringify({
          job: job.id,
          phone: form.get("phone"),
          education: form.get("education"),
          skills: form.get("skills").split(",").map((skill) => skill.trim()).filter(Boolean),
          resume: form.get("resume")?.name || "",
        }),
      });
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }
  if (submitted) return <div className="page success-page"><div className="success-icon"><Check size={28} /></div><span className="eyebrow">APPLICATION SENT</span><h1>You’re on your way!</h1><p>Your application for <strong>{job.title}</strong> at {job.company} has been saved.</p><div className="success-actions"><Button to="/applications">View My Applications</Button><Button to="/jobs" variant="secondary">Explore more roles</Button></div></div>;
  return (
    <div className="page apply-page">
      <Link className="back-link" to={`/jobs/${job.id}`}><ArrowLeft size={15} /> Back to Job Details</Link>
      <section className="apply-banner"><div className={`company-mark mark-${job.color}`}>{job.logo}</div><div><span className="verified-label"><BadgeCheck size={13} /> Verified hiring</span><h1>Apply for {job.title}</h1><p>{job.company} · <MapPin size={13} /> {job.location} ({job.mode}) · <Wallet size={13} /> {job.salary}</p></div><span className="deadline-chip">Deadline in {job.deadline}</span></section>
      <div className="apply-grid"><form className="apply-form content-card" onSubmit={submitApplication}><section className="form-section"><h2><span className="step-number">1</span> Personal Information <small>✦ Synced from profile</small></h2><Input label="Full Name *" name="name" defaultValue="Rahul Sharma" required /><div className="two-fields"><Input label="College / Primary Email *" name="email" type="email" defaultValue="rahul.sharma@college.edu" required /><Input label="Phone Number *" name="phone" type="tel" placeholder="+91 98765 43210" required /></div><p className="helper-text">Application updates will be sent to your email.</p></section><section className="form-section"><h2><span className="step-number">2</span> Academic Background & Tech Stack</h2><Input label="Education & Qualification *" name="education" defaultValue="B.Tech Computer Science & Engineering - Batch 2025" required /><label className="field"><span className="field-label">Relevant Skills & Frameworks *</span><input className="text-input" name="skills" defaultValue={job.skills.join(", ")} required /></label></section><section className="form-section"><h2><span className="step-number">3</span> Resume / Curriculum Vitae <span className="required-text">* Required</span></h2><label className="upload-box"><input type="file" accept=".pdf,.doc,.docx" required /><span className="upload-symbol">↑</span><strong>Click to upload your resume</strong><small>PDF or DOCX · Up to 5MB</small></label></section><label className="consent-check"><input type="checkbox" required /> I confirm that the information provided is accurate and agree to share my application with {job.company}.</label><Button type="submit" className="full-button">Submit Application <ArrowRight size={16} /></Button></form><aside className="apply-sidebar"><section className="content-card"><span className="eyebrow">YOUR APPLICATION</span><h2>{job.title}</h2><p>{job.company}</p><div className="sidebar-divider" /><p><MapPin size={14} /> {job.location} ({job.mode})</p><p><Wallet size={14} /> {job.salary}</p><p><Clock3 size={14} /> {job.duration}</p></section><section className="content-card"><h2><ShieldCheck size={17} /> Application tips</h2><ul className="tips-list"><li>Use an up-to-date resume tailored to this role.</li><li>Double-check your contact details before submitting.</li><li>Recruiters typically respond within 3–5 working days.</li></ul></section></aside></div>
    </div>
  );
}

export function AuthPage({ mode }) {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const { saveSession } = useAuth();
  const [role, setRole] = useState("Student");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);

    if (!isLogin && form.get("password") !== form.get("confirmation")) {
      setError("Passwords do not match.");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        email: form.get("email"),
        password: form.get("password"),
        ...(!isLogin && { name: form.get("name"), role }),
      };
      const session = await api(isLogin ? "/auth/login" : "/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      saveSession(session);
      navigate(session.user.role === "Employer" ? "/post-job" : "/profile");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="auth-page"><form className="auth-card" onSubmit={handleSubmit}><Link className="brand auth-brand" to="/"><span className="brand-icon"><GraduationCap size={18} /></span><span>Job<span>Nest</span></span></Link><span className="auth-kicker">CAMPUS PORTAL V2.4</span><h1>{isLogin ? "Welcome Back" : "Create Your Account"}</h1><p>{isLogin ? "Log in to your JobNest account to apply for opportunities." : "Join JobNest to discover student internships or hire campus talent."}</p>{isLogin && <div className="role-switch">{["Student", "Recruiter"].map((item) => <button type="button" className={role === item ? "selected" : ""} key={item} onClick={() => setRole(item)}>{item === "Student" ? <GraduationCap size={14} /> : <BriefcaseBusiness size={14} />}{item}</button>)}</div>}{!isLogin && <div className="role-choice"><span className="field-label">Select Account Type</span><div className="role-switch">{["Student", "Recruiter"].map((item) => <button type="button" className={role === item ? "selected" : ""} key={item} onClick={() => setRole(item)}>{item === "Student" ? <GraduationCap size={14} /> : <BriefcaseBusiness size={14} />}{item}</button>)}</div></div>}{!isLogin && <Input label="Full Name" name="name" placeholder="Rahul Sharma" required />}<Input label={isLogin ? "Email Address" : "College / Personal Email"} name="email" type="email" placeholder={role === "Student" ? "rahul@college.edu" : "you@company.com"} required />{!isLogin && <span className="field-hint auth-hint">Recommended: Use official .edu or institutional ID for faster verification.</span>}<Input label="Password" name="password" type="password" placeholder={isLogin ? "Enter your password" : "Min. 8 characters"} minLength={8} required />{!isLogin && <Input label="Confirm Password" name="confirmation" type="password" placeholder="Confirm password" minLength={8} required />}{error && <p className="auth-error" role="alert">{error}</p>}{isLogin ? <div className="remember-row"><label><input type="checkbox" /> Remember me</label><button type="button" className="link-button">Forgot Password?</button></div> : <label className="consent-check"><input type="checkbox" required /> I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.</label>}<Button type="submit" className="full-button">{isLogin ? "Log In" : "Create Account"} <ArrowRight size={15} /></Button>{isLogin && <><div className="auth-divider"><span>OR LOGIN WITH COLLEGE EMAIL (SSO)</span></div><Button variant="secondary" className="full-button"><Building2 size={15} /> Continue with Campus Single Sign-On</Button></>}<p className="auth-bottom">{isLogin ? "Don't have an account?" : "Already have an account?"} <Link to={isLogin ? "/register" : "/login"}>{isLogin ? "Register" : "Login"}</Link></p></form></div>
  );
}

export function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api("/applications")
      .then(({ applications: records }) => setApplications(records.map(normalizeApplication)))
      .catch((requestError) => setError(requestError.message));
  }, []);
  const statusCounts = { Applied: applications.filter((item) => item.status === "Applied").length, Shortlisted: applications.filter((item) => item.status === "Shortlisted").length, Rejected: applications.filter((item) => item.status === "Rejected").length };
  return (
    <div className="page"><PageHeading eyebrow="STUDENT PORTAL  •  SUMMER 2025 PLACEMENT CYCLE" title="My Applications" description="Track and monitor the status of your submitted job and internship applications in real time." action={<Button to="/jobs"><Search size={15} /> Explore Open Roles</Button>} /><div className="application-stats"><StatCard icon={BriefcaseBusiness} value={applications.length} label="Total Applied" tone="blue" /><StatCard icon={Clock3} value={statusCounts.Applied} label="Under Review" tone="purple" /><StatCard icon={CheckCircle2} value={statusCounts.Shortlisted} label="Shortlisted" tone="mint" /><StatCard icon={ShieldCheck} value={statusCounts.Rejected} label="Rejected" tone="orange" /></div>{applications.length ? <section className="applications-table-wrap"><div className="table-heading"><h2>Application History</h2><span>{applications.length} records</span></div><div className="applications-table"><div className="table-row table-header"><span>Job Title & Role Type</span><span>Company</span><span>Applied Date</span><span>Status</span><span>Next Steps</span></div>{applications.map((application) => <div className="table-row" key={application.id}><span><strong>{application.title}</strong><small>{application.type} · {application.salary}</small></span><span>{application.company}</span><span>{new Date(application.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span><span><StatusBadge status={application.status} /></span><span>{application.status === "Applied" ? "Application under recruiter review" : application.status}</span></div>)}</div></section> : <div className="empty-state applications-empty"><span className="empty-icon"><BriefcaseBusiness size={24} /></span><h2>Your next opportunity starts here</h2><p>You haven’t applied to any roles yet. Explore open opportunities and keep track of your applications here.</p><Button to="/jobs">Explore Open Roles <ArrowRight size={15} /></Button></div>}<section className="tip-panel"><Sparkles size={18} /><div><strong>Need more opportunities?</strong><p>Complete your profile and explore new roles to stand out to campus recruiters.</p></div><Button to="/profile" variant="secondary" className="button-small">View Profile</Button></section></div>
  );
}

export function ProfilePage() {
  const { user, saveSession } = useAuth();
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api("/auth/me")
      .then(({ user: profile }) => saveSession({ token: localStorage.getItem("jobnest-token"), user: profile }))
      .catch((requestError) => setError(requestError.message));
  }, []);

  if (!user) return <div className="page"><p>Loading profile...</p></div>;

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      const { user: updated } = await api("/users/profile/update", {
        method: "PUT",
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          education: form.get("education"),
          skills: form.get("skills").split(",").map((skill) => skill.trim()).filter(Boolean),
          experience: form.get("experience"),
          resume: form.get("resume"),
        }),
      });
      saveSession({ token: localStorage.getItem("jobnest-token"), user: updated });
      setEditing(false);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page"><PageHeading eyebrow="DASHBOARD  ›  PROFILE OVERVIEW" title="Student Profile" description="Manage your personal details, academic background, skills, and resume for recruiters." action={<><span className="seeking-badge"><span className="live-dot" /> Actively Seeking Roles</span><Button variant="secondary" onClick={() => setEditing((open) => !open)}>✎ {editing ? "Close Editor" : "Edit Profile"}</Button></>} />{error && <p className="auth-error" role="alert">{error}</p>}{editing && <form className="content-card post-form" onSubmit={saveProfile}><div className="two-fields"><Input label="Full Name" name="name" defaultValue={user.name} required /><Input label="Email" name="email" type="email" defaultValue={user.email} required /></div><div className="two-fields"><Input label="Phone" name="phone" defaultValue={user.phone} /><Input label="Resume URL" name="resume" defaultValue={user.resume} /></div><Input label="Education" name="education" defaultValue={user.education} /><Input label="Skills" name="skills" defaultValue={user.skills?.join(", ")} /><Input label="Experience" name="experience" defaultValue={user.experience} /><Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Profile"}</Button></form>}<section className="profile-summary"><div className="profile-avatar">{user.name?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div><div className="profile-summary-copy"><h2>{user.name} <span className="profile-tag">Final Year B.Tech</span> <span className="profile-tag">2021 – 2025</span></h2><p>Final Year B.Tech CSE Student • Aspiring Full Stack / MERN Developer</p><span><GraduationCap size={14} /> Apex Institute of Technology, Bengaluru (VTU Affiliated)</span><div className="contact-chips"><span>✉ {user.email}</span><span>☎ {user.phone || "Add phone"}</span><span><MapPin size={12} /> Bengaluru, India</span></div></div><div className="placement-ready"><span>PLACEMENT READINESS</span><strong><CheckCircle2 size={14} /> Pre-Placement Cleared</strong><Button className="button-small">Edit Summary</Button></div></section>
      <div className="profile-grid"><div className="profile-main"><section className="content-card"><div className="card-title-row"><h2><GraduationCap size={17} /> Academic History</h2><span className="profile-tag">2 Records</span></div><p>Formal degree qualifications & academic metrics</p><div className="education-card"><span className="education-icon"><GraduationCap size={16} /></span><div><strong>Bachelor of Technology (B.Tech)</strong><p>Computer Science & Engineering</p><small>Apex Institute of Technology, VTU Affiliated</small><div className="grade-line"><span>Current CGPA <strong>8.4</strong> / 10.0</span><span>Class: First Class with Distinction</span></div></div></div><div className="education-card"><span className="education-icon">▣</span><div><strong>Higher Secondary Education (12th Grade)</strong><p>Science Stream (Physics, Chemistry, Mathematics & CS)</p><small>St. Joseph College, Pre-University Board · Completed 2021</small><div className="grade-line"><span>Aggregate score <strong>91.2%</strong></span></div></div></div></section><section className="content-card"><div className="card-title-row"><h2><Sparkles size={17} /> Technical Competencies</h2><button className="link-button">+ Add Skill</button></div><p>Validated stack & tool proficiency</p>{[["Frontend Engineering", ["React.js", "JavaScript (ES6+)", "Tailwind CSS", "Redux Toolkit", "HTML5", "CSS3"]], ["Backend Development", ["Node.js", "Express.js", "MongoDB", "REST APIs"]]].map(([title, skills]) => <div className="competency-card" key={title}><strong>{title}</strong><small>{skills.length} competencies</small><div className="skill-list">{skills.map((skill) => <span className="skill-chip" key={skill}>{skill}</span>)}</div></div>)}</section></div><aside className="profile-side"><section className="content-card"><div className="card-title-row"><h2><BadgeCheck size={17} /> Profile Strength</h2><strong className="strength-number">90%</strong></div><p>A full profile increases campus recruiter visibility by 3.5x.</p><div className="strength-track"><span /></div><div className="profile-tip">💡 Add your verified GitHub profile link below to complete your profile.</div></section><section className="content-card"><div className="card-title-row"><h2><BookOpen size={17} /> Placement Resume</h2><StatusBadge status="Active" /></div><p>Active version sent with job applications</p><div className="resume-card"><span>PDF</span><div><strong>Rahul_Sharma_MERN_Resume.pdf</strong><small>248 KB · Updated 3 days ago</small></div><CheckCircle2 size={16} /></div><div className="resume-actions"><Button variant="secondary">↓ Download</Button><Button>↑ Upload New</Button></div></section><section className="content-card"><h2><ArrowUpRight size={17} /> Online Presence</h2><p>Verified links visible to tech interviewers</p><div className="presence-link"><span>◉</span><div><small>GitHub Repository</small><strong>github.com/rahulsharma-dev</strong></div><ArrowUpRight size={14} /></div></section></aside></div></div>
  );
}

export function PostJobPage() {
  const [posted, setPosted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);

    try {
      await api("/jobs", {
        method: "POST",
        body: JSON.stringify({
          title: form.get("title"),
          company: form.get("company"),
          location: form.get("location"),
          jobType: form.get("type"),
          mode: form.get("mode"),
          salary: form.get("salary"),
          duration: form.get("duration"),
          deadline: form.get("deadline"),
          skills: form.get("skills").split(",").map((item) => item.trim()).filter(Boolean),
          eligibility: form.get("eligibility"),
          description: form.get("description"),
          responsibilities: form.get("description").split("\n").map((item) => item.trim()).filter(Boolean),
        }),
      });
      setPosted(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }
  return <div className="page"><PageHeading eyebrow="RECRUITER DESK  •  CAMPUS DRIVE 2025" title="Post a Job / Internship" description="Reach thousands of verified college students, final years, and freshers looking for opportunities." /><div className="post-layout"><form className="content-card post-form" onSubmit={handleSubmit}><div className="post-step-title"><span className="step-number">1</span><h2>Basic Information</h2><small>Step 1 of 4</small></div><Input label="Job Title *" name="title" placeholder="e.g., MERN Stack Intern, Junior Frontend Developer" required /><div className="two-fields"><Input label="Company Name *" name="company" placeholder="e.g., TechNova Solutions Pvt Ltd" required /><Input label="Location *" name="location" placeholder="e.g., Bengaluru, Karnataka or Remote" required /></div><div className="two-fields"><label className="field"><span className="field-label">Job Type *</span><select className="text-input" name="type"><option>Internship</option><option>Full-time</option></select></label><fieldset className="field"><legend className="field-label">Work Arrangement *</legend><div className="radio-row">{["On-site", "Hybrid", "Remote"].map((mode) => <label key={mode}><input type="radio" name="mode" value={mode} required /> {mode}</label>)}</div></fieldset></div><div className="post-step-title"><span className="step-number">2</span><h2>Compensation & Timeline</h2><small>Step 2 of 4</small></div><div className="three-fields"><Input label="Salary / Stipend *" name="salary" placeholder="e.g., ₹20,000 / month or ₹4.5 LPA" required /><Input label="Duration *" name="duration" placeholder="e.g., 6 Months or Permanent" required /><Input label="Application Deadline *" name="deadline" type="date" required /></div><div className="post-step-title"><span className="step-number">3</span><h2>Requirements & Description</h2><small>Step 3 of 4</small></div><Input label="Required Skills *" name="skills" placeholder="React, Node.js, MongoDB, Express, Git" required /><Input label="Eligibility Criteria *" name="eligibility" placeholder="e.g., B.Tech / MCA 2024 or 2025 Batch, 60%+ CGPA" required /><label className="field"><span className="field-label">Job Description & Responsibilities *</span><textarea className="text-input textarea-input" name="description" rows="5" placeholder="Tell students about this opportunity, the team, and what they'll learn..." required /></label><div className="post-step-title"><span className="step-number">4</span><h2>Recruiter Contact & Review</h2><small>Step 4 of 4</small></div><Input label="Recruiter Contact Email *" name="recruiterEmail" type="email" placeholder="hiring@company.com" required /><label className="consent-check"><input type="checkbox" required /> I confirm this opportunity follows the campus placement guidelines.</label><Button type="submit" className="full-button">Publish Opportunity <ArrowRight size={15} /></Button>{posted && <p className="success-message"><CheckCircle2 size={16} /> Your opportunity has been published in this demo.</p>}</form><aside className="content-card post-preview"><span className="eyebrow">STUDENT FEED PREVIEW</span><article className="preview-role"><span className="company-mark mark-blue">T</span><div><strong>MERN Stack Intern</strong><p>TechNova Solutions Pvt Ltd</p><span><MapPin size={13} /> Bengaluru, India　 <Wallet size={13} /> ₹20,000 / month</span><small>Internship · 6 Months</small></div></article><section className="criteria-card"><h3><GraduationCap size={15} /> Campus Placement Criteria</h3><p><CheckCircle2 size={14} /> Zero placement fee policy adherence</p><p><CheckCircle2 size={14} /> Minimum 45-day offer window</p><p><CheckCircle2 size={14} /> Internship completion certificate guarantee</p></section><p className="preview-tip"><Sparkles size={15} /> Tip: Clear job eligibility helps students find the right opportunity.</p></aside></div></div>;
}

export function NotFoundPage() {
  return <div className="page not-found"><span className="empty-icon"><Search size={23} /></span><h1>We couldn't find that page.</h1><p>The link may be outdated, or the opportunity may no longer be available.</p><Button to="/jobs">Browse opportunities <ArrowRight size={15} /></Button></div>;
}
