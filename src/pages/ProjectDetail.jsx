// src/pages/ProjectDetail.jsx
import React, { Suspense, lazy, useMemo, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { MDXWrapper } from "../components/MDXWraapper";
import TechBadge from "../components/TechBadge";
import { projectExists } from "../utils/mdxutils";
import usePageMeta from "../utils/usePageMeta";
import NotFound from "./NotFound";
import "../styles/projectDetail.css";

const NoImage = () => (
  <div className="project-detail-noimage" role="img" aria-label="No image available">
    <svg viewBox="0 0 24 24" width="56" height="56" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
      <line x1="3" y1="3" x2="21" y2="21" />
    </svg>
    <span>No image available</span>
  </div>
);

const ProjectDetail = () => {
  const { slug } = useParams();
  const [meta, setMeta] = useState(null);
  const [imgError, setImgError] = useState(false);

  // Unknown slug → show the 404 page instead of crashing on a failed import.
  const exists = projectExists(slug);

  usePageMeta(meta?.title || 'Project', meta?.description);

  // Memoise so the lazy component is created once per slug, not on every render.
  const ProjectContent = useMemo(
    () => lazy(() => import(`../data/projects/${slug}.mdx`)),
    [slug]
  );

  // Load the project's meta (title, image, links, etc.) for the detail header.
  useEffect(() => {
    let active = true;
    setImgError(false);
    import(`../data/projects/${slug}.mdx`)
      .then((mod) => active && setMeta(mod.meta || null))
      .catch(() => active && setMeta(null));
    return () => {
      active = false;
    };
  }, [slug]);

  if (!exists) return <NotFound />;

  return (
    <div className="project-detail-container">
      <Link to="/projects" className="project-back-link">
        <span className="project-back-arrow" aria-hidden="true">←</span>
        Back to Projects
      </Link>

      <article className="project-detail-content">
        {meta?.image && !imgError ? (
          <img
            src={meta.image}
            alt={meta.title || "Project preview"}
            className="project-detail-image"
            data-reveal="scale"
            onError={() => setImgError(true)}
          />
        ) : (
          <NoImage />
        )}

        {meta && (
          <header className="project-detail-header" data-reveal="up">
            {meta.title && <h1 className="project-detail-title">{meta.title}</h1>}
            {meta.description && (
              <p className="project-detail-tagline">{meta.description}</p>
            )}

            {meta.techStack?.length > 0 && (
              <div className="project-detail-tech">
                {meta.techStack.map((tech) => (
                  <TechBadge key={tech} tech={tech} />
                ))}
              </div>
            )}

            {(meta.githubLink?.trim() || meta.liveDemo?.trim()) && (
              <div className="project-detail-links">
                {meta.githubLink?.trim() && (
                  <a
                    href={meta.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-detail-btn project-detail-btn--ghost"
                  >
                    View on GitHub
                  </a>
                )}
                {meta.liveDemo?.trim() && (
                  <a
                    href={meta.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-detail-btn project-detail-btn--primary"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            )}
          </header>
        )}

        <div className="project-detail-body" data-reveal="up">
          <Suspense fallback={<p>Loading project...</p>}>
            <MDXWrapper>
              <ProjectContent />
            </MDXWrapper>
          </Suspense>
        </div>
      </article>
    </div>
  );
};

export default ProjectDetail;
