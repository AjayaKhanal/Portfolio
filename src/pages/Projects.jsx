import React, { useEffect, useState, useMemo } from 'react'
import { LayoutGrid, List } from 'lucide-react'
import {getAllProjects} from '../utils/mdxutils'
import ProjectCard from '../components/ProjectCard'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'
import { PROJECTS_PER_PAGE } from '../constants/projects'
import usePageMeta from '../utils/usePageMeta'
import '../styles/projects.css';

const Projects = () => {
  usePageMeta('Projects', 'Projects by Ajaya Khanal — web apps and software built with React, .NET, SQL, and more.');
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // 'grid' (multiple per row) or 'list' (one per row); remembered between visits.
  const [view, setView] = useState(() => localStorage.getItem('projectsView') || 'grid');

  useEffect(() => {
    localStorage.setItem('projectsView', view);
  }, [view]);

  useEffect(()=>{
    setIsLoading(true);
      getAllProjects()
      .then((data) => setProjects(data))
      .catch((err)=>setError('Failed to load Projects'))
      .finally(()=> setIsLoading(false));
  },[]);

  useEffect(()=>{
    setCurrentPage(1);
  }, [searchQuery, activeTag]);

  // Unique tech tags across all projects, for the filter chips.
  const tags = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => (p.techStack || []).forEach((t) => set.add(t)));
    return ['All', ...Array.from(set).sort()];
  }, [projects]);

  const filtered = useMemo(() =>
    projects.filter((p) => {
      const matchesSearch = p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = activeTag === 'All' || (p.techStack || []).includes(activeTag);
      return matchesSearch && matchesTag;
    }),
    [projects, searchQuery, activeTag]
  );

  const paginated = useMemo(()=>{
    const start = (currentPage -1)* PROJECTS_PER_PAGE;
    return filtered.slice(start, start+PROJECTS_PER_PAGE)
  }, [filtered, currentPage]);

  return (
    <div className='projects-page'>
      <div className='top-bar anim-down'>
        <SearchBar defaultValue={searchQuery} onSearch={setSearchQuery} placeholder="Search projects…" />
      </div>

      {!isLoading && !error && tags.length > 1 && (
        <div className='tag-filter anim-fade'>
          {tags.map((tag) => (
            <button
              key={tag}
              type='button'
              className={`tag-chip${activeTag === tag ? ' tag-chip--active' : ''}`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="projects-grid">
          {Array.from({ length: PROJECTS_PER_PAGE }).map((_, i) => (
            <div className="project-skeleton" key={i} aria-hidden="true">
              <div className="skeleton-line skeleton-title" />
              <div className="skeleton-line" />
              <div className="skeleton-line skeleton-short" />
              <div className="skeleton-badges">
                <span className="skeleton-badge" />
                <span className="skeleton-badge" />
                <span className="skeleton-badge" />
              </div>
            </div>
          ))}
        </div>
      )}
      {error && <p className="error anim-fade">{error}</p>}

      {!isLoading && !error && (
        <>
        {paginated.length > 0 && (
          <div className="projects-viewbar">
            <span className="projects-count">
              {filtered.length} project{filtered.length !== 1 ? 's' : ''}
            </span>
            <div className="view-toggle" role="group" aria-label="View mode">
              <button
                type="button"
                className={`view-btn${view === 'grid' ? ' is-active' : ''}`}
                onClick={() => setView('grid')}
                aria-pressed={view === 'grid'}
                aria-label="Grid view"
                title="Grid view"
              >
                <LayoutGrid size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                className={`view-btn${view === 'list' ? ' is-active' : ''}`}
                onClick={() => setView('list')}
                aria-pressed={view === 'list'}
                aria-label="List view"
                title="List view"
              >
                <List size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* `key` re-triggers the reveal whenever the page/filters/view change */}
        <div
          className={view === 'list' ? 'projects-list' : 'projects-grid'}
          data-reveal="up"
          key={`${view}-${searchQuery}-${activeTag}-${currentPage}`}
        >
        {paginated.length > 0 ? (
          paginated.map((project) => (
            <ProjectCard key={project.slug} project={project} view={view} />
          ))
        ) : (
          <p className="no-results anim-fade">No results found.</p>
        )}
        </div>

        <div data-reveal="up">
          <Pagination
            current={currentPage}
            total={Math.ceil(filtered.length / PROJECTS_PER_PAGE)}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
        </>
      )}
    </div>
  )
}

export default Projects;