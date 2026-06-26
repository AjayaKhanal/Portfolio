import React, { useState } from 'react'
import { GitHubCalendar } from 'react-github-calendar'
import { useTheme } from 'next-themes'
import { Github, ArrowUpRight } from 'lucide-react'
import '../styles/github-activity.css'

const YEARS = [2026, 2025, 2024, 2023]

const calendarTheme = {
  light: ['#ebedf0', '#bcd9ff', '#7cb4ff', '#3f8bff', '#1f6feb'],
  dark: ['#161b22', '#0d2f5e', '#15489c', '#1f6feb', '#4f9bff'],
}

const GitHubActivity = ({ username = 'ajayakhanal' }) => {
  const { resolvedTheme } = useTheme()
  const [year, setYear] = useState(YEARS[0])

  const profileUrl = `https://github.com/${username}`
  const stats = `https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&hide_border=true&bg_color=00000000&title_color=2f81f7&icon_color=2f81f7&text_color=8b949e&hide=issues`
  const topLangs = `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&hide_border=true&bg_color=00000000&title_color=2f81f7&text_color=8b949e`

  return (
    <section className="github-activity" data-reveal="up" aria-label="GitHub activity">
      <div className="gh-head">
        <h2 className="section-heading">GitHub Activity</h2>
        <a className="gh-profile-link" href={profileUrl} target="_blank" rel="noopener noreferrer">
          <Github size={16} aria-hidden="true" />
          @{username}
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>

      <div className="gh-panel">
        <div className="gh-years" role="group" aria-label="Select year">
          {YEARS.map((y) => (
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
            theme={calendarTheme}
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

export default GitHubActivity
