import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Github, ExternalLink, ArrowRight } from "lucide-react";
import TechBadge from "./TechBadge";
import { cn } from "../lib/utils";
import "../styles/projectCard.css";

// Stable gradient per project, so the placeholder thumbnail is distinct but
// never changes between renders.
const GRADIENTS = [
  "linear-gradient(135deg, #6366f1, #8b5cf6)",
  "linear-gradient(135deg, #0ea5e9, #2563eb)",
  "linear-gradient(135deg, #f59e0b, #ef4444)",
  "linear-gradient(135deg, #10b981, #059669)",
  "linear-gradient(135deg, #ec4899, #8b5cf6)",
  "linear-gradient(135deg, #14b8a6, #0ea5e9)",
];

const pickGradient = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return GRADIENTS[hash % GRADIENTS.length];
};

const ProjectCard = React.forwardRef(({ project, view = "grid", className, ...rest }, ref) => {
  const { slug, title, description, techStack, githubLink, liveDemo, image } = project;
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const openDetail = () => navigate(`/projects/${slug}`);
  // Stop card navigation when an external link inside the card is clicked.
  const stop = (e) => e.stopPropagation();

  const showImage = image && !imgError;
  const monogram = (title || "?").trim().charAt(0).toUpperCase();

  return (
    <article
      ref={ref}
      className={cn("project-card", `project-card--${view}`, className)}
      role="link"
      tabIndex={0}
      onClick={openDetail}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openDetail()}
      {...rest}
    >
      <div className="project-card__media">
        {showImage ? (
          <img
            src={image}
            alt={`${title} preview`}
            className="project-card__img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="project-card__placeholder"
            style={{ background: pickGradient(title) }}
            aria-hidden="true"
          >
            <span className="project-card__monogram">{monogram}</span>
          </div>
        )}
        {techStack?.[0] && <span className="project-card__pill">{techStack[0]}</span>}
      </div>

      <div className="project-card__body">
        <h3 className="project-title">{title}</h3>
        {description && <p className="project-description">{description}</p>}

        {techStack && (
          <div className="tech-stack">
            {techStack.slice(0, 4).map((tech, index) => (
              <TechBadge key={index}>{tech}</TechBadge>
            ))}
            {techStack.length > 4 && (
              <TechBadge variant="more">{`+${techStack.length - 4}`}</TechBadge>
            )}
          </div>
        )}

        <div className="project-card__footer">
          <div className="project-links">
            {githubLink?.trim() && (
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={stop}
                aria-label={`${title} on GitHub`}
                title="GitHub repository"
              >
                <Github size={17} aria-hidden="true" />
              </a>
            )}
            {liveDemo?.trim() && (
              <a
                href={liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={stop}
                aria-label={`${title} live demo`}
                title="Live demo"
              >
                <ExternalLink size={17} aria-hidden="true" />
              </a>
            )}
          </div>
          <span className="detail-link">
            View Details <ArrowRight size={15} aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  );
});

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
