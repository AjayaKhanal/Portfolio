import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SectionHeading from './SectionHeading'
import ProjectCard from './ProjectCard'
import { getAllProjects } from '../utils/mdxutils'
import '../styles/featured-work.css'

/*
 * Home-page "Featured Work" strip — the fastest proof-of-skill for a visiting
 * recruiter/client. Shows up to 3 projects flagged `featured: true` in their
 * .mdx meta; falls back to the first few if none are flagged. Renders nothing
 * when there are no projects, so it never shows an empty section.
 */
const FeaturedWork = ({ limit = 3 }) => {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    let active = true
    getAllProjects()
      .then((all) => {
        if (!active) return
        const featured = all.filter((p) => p.featured)
        setProjects((featured.length ? featured : all).slice(0, limit))
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [limit])

  if (projects.length === 0) return null

  return (
    <section className="featured-work" aria-label="Featured work">
      <div className="featured-head" data-reveal="up">
        <div className="featured-head-text">
          <span className="featured-eyebrow">Selected Projects</span>
          <SectionHeading as="h2">Featured Work</SectionHeading>
        </div>
        <Link to="/projects" className="featured-all">
          View all projects
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      <div className="featured-grid">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            view="grid"
            data-reveal="up"
            style={{ '--reveal-delay': `${i * 90}ms` }}
          />
        ))}
      </div>
    </section>
  )
}

export default FeaturedWork
