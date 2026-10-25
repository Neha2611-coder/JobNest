import { Link } from "react-router-dom";

export function Button({
  children,
  to,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  const classes = `button button-${variant} ${className}`.trim();
  if (to) {
    return (
      <Link className={classes} to={to} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}

export function Input({ label, hint, className = "", ...props }) {
  return (
    <label className={`field ${className}`.trim()}>
      {label && <span className="field-label">{label}</span>}
      <input className="text-input" {...props} />
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export function StatusBadge({ status }) {
  const tone = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`status-badge status-${tone}`}>{status}</span>;
}

export function PageHeading({ eyebrow, title, description, action }) {
  return (
    <section className="page-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="heading-action">{action}</div>}
    </section>
  );
}
