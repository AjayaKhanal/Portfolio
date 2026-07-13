import React from 'react'
import { Link } from 'react-router-dom'
import IDCard from '../components/IDCard'
import GitHubActivity from '../components/GitHubActivity'
import SectionHeading from '../components/SectionHeading'
import { ABOUT_SKILLS, ABOUT_INTRO, EXPERIENCE, EDUCATION } from '../constants/about'
import { useDeveloperMode } from '../context/DeveloperModeContext'
import usePageMeta from '../utils/usePageMeta'
import '../styles/about.css'

const About = () => {
  usePageMeta('About', 'About Ajaya Khanal — Software Engineer with experience in React, .NET, and SQL. Skills, experience, and background.');
  const { devMode } = useDeveloperMode();
  const currentCompany = EXPERIENCE.find((c) => c.current);
  return (
    <div className='about-page'>
      <header className='about-hero' data-reveal='up'>
        <span className='about-eyebrow'>About</span>
        <h1 className='about-title'>Ajaya Khanal</h1>
        <p className='about-role'>Software Engineer</p>
        <p className='about-lead'>
          Engineer focused on building scalable, maintainable software with React,
          .NET, and SQL. Here’s a look at my skills, experience, and the work I care about.
        </p>
      </header>

      <section className='about-idcard' data-reveal='scale' aria-label='Credential card'>
        <IDCard
          name='Ajaya Khanal'
          role='Software Engineer'
          company={currentCompany ? currentCompany.name : undefined}
          location={null}
          skills={ABOUT_SKILLS}
          kicker='About · Credential'
          description={ABOUT_INTRO}
          link='https://github.com/'
        />
        <div className='about-actions'>
          <Link to='/projects' className='about-btn about-btn--primary'>View Projects</Link>
          <Link to='/contact' className='about-btn about-btn--ghost'>Get in Touch</Link>
        </div>
      </section>

      <section className='about-section' data-reveal='up'>
        <SectionHeading>Skills &amp; Technologies</SectionHeading>
        <ul className='skills-list'>
          {ABOUT_SKILLS.map((skill) => (
            <li key={skill} className='skill-item'>{skill}</li>
          ))}
        </ul>
      </section>

      <section className='about-section' data-reveal='up'>
        <SectionHeading>Professional Experience</SectionHeading>
        <div className='timeline'>
          {EXPERIENCE.map((company) => (
            <div
              key={company.name}
              className={`timeline-item${company.current ? ' timeline-item--current' : ''}`}
            >
              <div className='timeline-content'>
                <div className='timeline-head'>
                  <h3 className='timeline-role'>{company.role}</h3>
                  {company.current && <span className='badge-current'>Current</span>}
                </div>
                <p className='timeline-company'>{company.name}</p>
                <span className='timeline-duration'>{company.duration}</span>
                <p className='timeline-desc'>{company.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className='about-section' data-reveal='up'>
        <SectionHeading>Education</SectionHeading>
        <div className='timeline'>
          {EDUCATION.map((edu) => (
            <div key={edu.school} className='timeline-item'>
              <div className='timeline-content'>
                <h3 className='timeline-role'>{edu.degree}</h3>
                <p className='timeline-company'>{edu.school}</p>
                <span className='timeline-duration'>{edu.duration}</span>
                <p className='timeline-desc'>{edu.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {devMode && <GitHubActivity username='ajayakhanal' />}
    </div>
  );
};

export default About
