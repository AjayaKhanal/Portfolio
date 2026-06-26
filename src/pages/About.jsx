import React from 'react'
import { Link } from 'react-router-dom'
import IDCard from '../components/IDCard'
import GitHubActivity from '../components/GitHubActivity'
import usePageMeta from '../utils/usePageMeta'
import '../styles/about.css'

const skills = [
  'C#', 'Dotnet', 'SQL', 'React', 'JavaScript', 'CSS', 'GitHub', 'HTML', 'Git'
];

const intro =
  'I am a Software Engineer with professional experience building and maintaining web applications. I work with both front-end and back-end technologies to write clean, reliable, and easy-to-maintain code. I focus on solving problems clearly and always look for ways to improve my skills.';

const companies = [
  {
    name: 'Grow By Data',
    role: 'Software Engineer',
    duration: 'May 2025 – Present',
    current: true,
    description:
      'I work on both React and .NET projects. I use SQL and stored procedures to improve database performance, manage code with Git, and write clean, good quality code.',
  },
  {
    name: 'Global Tech Pvt. Ltd.',
    role: 'Software Developer',
    duration: 'Feb 2025 – May 2025',
    description:
      'I worked in a team to build responsive web apps. I connected APIs and handled deployments using Git.',
  },
  {
    name: 'Uranus Tech Nepal Pvt. Ltd.',
    role: 'Dotnet Intern',
    duration: 'June 2022 – Sep 2022',
    description:
      'I worked on large business applications using C#, .NET, and SQL.',
  },
];

const education = [
  {
    school: 'Tribhuvan University',
    degree: 'Bachelor in Computer Application (BCA)',
    duration: '2019 – 2023',
    description:
      'Studied software development, databases, data structures, and web technologies.',
  },
  {
    school: 'Higher Secondary School',
    degree: 'Higher Secondary Education (+2), Science',
    duration: '2017 – 2019',
    description:
      'Completed higher secondary education with a focus on science and mathematics.',
  },
];

const About = () => {
  usePageMeta('About', 'About Ajaya Khanal — Software Engineer with experience in React, .NET, and SQL. Skills, experience, and background.');
  const currentCompany = companies.find((c) => c.current);
  return (
    <div className='about-page'>
      <header className='about-hero' data-reveal='up'>
        <h1 className='sr-only'>About Ajaya Khanal</h1>
      </header>

      <section className='about-idcard' data-reveal='scale' aria-label='Credential card'>
        <IDCard
          name='Ajaya Khanal'
          role='Software Engineer'
          company={currentCompany ? currentCompany.name : undefined}
          location={null}
          skills={skills}
          kicker='About · Credential'
          description={intro}
          link='https://github.com/'
        />
        <div className='about-actions'>
          <Link to='/projects' className='about-btn about-btn--primary'>View Projects</Link>
          <Link to='/contact' className='about-btn about-btn--ghost'>Get in Touch</Link>
        </div>
      </section>

      <section className='about-section' data-reveal='up'>
        <h2 className='section-heading'>Skills &amp; Technologies</h2>
        <ul className='skills-list'>
          {skills.map((skill) => (
            <li key={skill} className='skill-item'>{skill}</li>
          ))}
        </ul>
      </section>

      <section className='about-section' data-reveal='up'>
        <h2 className='section-heading'>Professional Experience</h2>
        <div className='timeline'>
          {companies.map((company) => (
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
        <h2 className='section-heading'>Education</h2>
        <div className='timeline'>
          {education.map((edu) => (
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

      <GitHubActivity username='ajayakhanal' />
    </div>
  );
};

export default About
