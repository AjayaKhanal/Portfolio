import React, { useState } from 'react'
import { GitHubCalendar } from 'react-github-calendar'
import { useTheme } from 'next-themes'
import { Github, ArrowUpRight } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { cn } from '../lib/utils'
import { GITHUB_YEARS, GITHUB_CALENDAR_THEME } from '../constants/githubActivity'
import '../styles/github-activity.css'

const GitHubActivity = React.forwardRef(
  ({ username = 'ajayakhanal', years = GITHUB_YEARS, className, ...rest }, ref) => {
  const { resolvedTheme } = useTheme()
  const [year, setYear] = useState(years[0])

  const profileUrl = `https://github.com/${username}`
  const stats = `https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&hide_border=true&bg_color=00000000&title_color=2f81f7&icon_color=2f81f7&text_color=8b949e&hide=issues`
  const topLangs = `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&hide_border=true&bg_color=00000000&title_color=2f81f7&text_color=8b949e`

  return (
    <section ref={ref} className={cn('github-activity', className)} data-reveal="up" aria-label="GitHub activity" {...rest}>
      <div className="gh-head">
        <SectionHeading>GitHub Activity</SectionHeading>
        <a className="gh-profile-link" href={profileUrl} target="_blank" rel="noopener noreferrer">
          <Github size={16} aria-hidden="true" />
          @{username}
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>

      <div className="gh-panel">
        <div className="gh-years" role="group" aria-label="Select year">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              className={`gh-year${year === y ? ' is-active' : ''}`}
              onClick={() => setYear(y)}
              aria-pressed={year === y}
            >
              {y}
            </button>
          ))}
        </div>

        <div className="gh-heatmap">
          <GitHubCalendar
            username={username}
            year={year}
            theme={GITHUB_CALENDAR_THEME}
            colorScheme={resolvedTheme === 'dark' ? 'dark' : 'light'}
            blockSize={13}
            blockMargin={4}
            fontSize={13}
          />
        </div>

        <div className="gh-cards">
          <img className="gh-card" src={stats} alt={`${username}'s GitHub statistics`} loading="lazy" />
          <img
            className="gh-card"
            src={topLangs}
            alt={`${username}'s most used languages`}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
  }
)

GitHubActivity.displayName = 'GitHubActivity'

export default GitHubActivity
