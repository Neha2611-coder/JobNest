import { ArrowUpRight, Bookmark, Clock3, MapPin, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./UI.jsx";

export default function JobCard({ job, compact = false }) {
  return (
    <article className={`job-card ${compact ? "job-card-compact" : ""}`}>
      <div className={`company-mark mark-${job.color}`}>{job.logo}</div>
      <div className="job-card-body">
        <div className="job-title-row">
          <Link className="job-title" to={`/jobs/${job.id}`}>{job.title}</Link>
          <span className={`job-type type-${job.type.toLowerCase().replace(" ", "-")}`}>{job.type}</span>
          {job.mode === "Remote" && <span className="job-type type-remote">Remote</span>}
        </div>
        <p className="company-name">{job.company}{job.verified && <span className="verified-dot" title="Verified employer">✓</span>}</p>
        <div className="job-meta">
          <span><MapPin size={13} /> {job.location}</span>
          <span><Wallet size={13} /> {job.salary}</span>
          {!compact && <span><Clock3 size={13} /> Posted {job.posted}</span>}
        </div>
        <div className="skill-list">
          {job.skills.slice(0, 4).map((skill) => <span className="skill-chip" key={skill}>{skill}</span>)}
        </div>
        {!compact && (
          <div className="job-card-actions">
            <Link className="icon-button save-button" to={`/jobs/${job.id}`} aria-label={`View ${job.title}`}>
              <Bookmark size={16} />
            </Link>
            <Button to={`/jobs/${job.id}`} variant="secondary" className="button-small">View Details <ArrowUpRight size={14} /></Button>
            <Button to={`/apply/${job.id}`} className="button-small">Apply Now <ArrowUpRight size={14} /></Button>
          </div>
        )}
        {compact && <Button to={`/jobs/${job.id}`} variant="text" className="compact-link">Explore role <ArrowUpRight size={14} /></Button>}
      </div>
    </article>
  );
}
