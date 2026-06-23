import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/projectCard.css";

const ProjectCard = ({ project }) => {
    const { slug, title, description, techStack, githubLink, liveDemo } = project;
    const navigate = useNavigate();

    const openDetail = () => navigate(`/projects/${slug}`);

    // Stop card navigation when an external link inside the card is clicked.
    const stop = (e) => e.stopPropagation();

    return (
        <article
            className="project-card"
            role="link"
            tabIndex={0}
            onClick={openDetail}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openDetail()}
        >
            <h3 className="project-title">{title}</h3>
            {description && (
                <p className="project-description">{description}</p>
            )}

            {techStack && (
                <div className="tech-stack">
                    {techStack.map((tech, index) => (
                        <span key={index} className="tech-badge">{tech}</span>
                    ))}
                </div>
            )}

            <div className="project-links">
                {githubLink?.trim() && (
                    <a href={githubLink} target="_blank" rel="noopener noreferrer" onClick={stop}>
                        GitHub
                    </a>
                )}
                {liveDemo?.trim() && (
                    <a href={liveDemo} target="_blank" rel="noopener noreferrer" onClick={stop}>
                        Live Demo
                    </a>
                )}
                <span className="detail-link">View Details →</span>
            </div>
        </article>
    );
};

export default ProjectCard;
