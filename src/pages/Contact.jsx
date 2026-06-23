import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import usePageMeta from '../utils/usePageMeta'
import '../styles/contact.css'

const contactDetails = [
  {
    label: 'Email',
    value: 'ajayakhanal@example.com',
    href: 'mailto:ajayakhanal@example.com',
    icon: '✉️',
  },
  {
    label: 'Phone',
    value: '+977 98XXXXXXXX',
    href: 'tel:+97798000000',
    icon: '📞',
  },
  {
    label: 'Location',
    value: 'Kathmandu, Nepal',
    href: null,
    icon: '📍',
  },
];

const socials = [
  { label: 'GitHub', href: 'https://github.com/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
];

const initialForm = { name: '', email: '', subject: '', message: '' };

const Contact = () => {
  usePageMeta('Contact', "Get in touch with Ajaya Khanal — let's work together on your next project.");
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!form.email.trim()) {
      next.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Please enter a valid email.';
    }
    if (!form.message.trim()) next.message = 'Please enter a message.';
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    const subject = form.subject.trim() || `New message from ${form.name}`;
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    window.location.href = `mailto:ajayakhanal@example.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
    setForm(initialForm);
  };

  return (
    <div className='contact-page'>
      <header className='contact-hero fade-up'>
        <span className='contact-eyebrow'>Get in Touch</span>
        <h1 className='contact-title'>Let's Work Together</h1>
        <p className='contact-lead'>
          Have a project in mind, a question, or just want to say hello? I'm always open
          to new ideas and opportunities. Fill out the form below or reach me through any
          of the channels — I'll get back to you soon.
        </p>
      </header>

      <div className='contact-grid'>
        <aside className='contact-info fade-up'>
          <h2 className='section-heading'>Contact Details</h2>
          <ul className='contact-info-list'>
            {contactDetails.map((item) => (
              <li key={item.label} className='contact-info-item'>
                <span className='contact-info-icon' aria-hidden='true'>{item.icon}</span>
                <div>
                  <span className='contact-info-label'>{item.label}</span>
                  {item.href ? (
                    <a className='contact-info-value' href={item.href}>{item.value}</a>
                  ) : (
                    <span className='contact-info-value'>{item.value}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <h2 className='section-heading'>Follow Me</h2>
          <div className='contact-socials'>
            {socials.map((social) => (
              <a
                key={social.label}
                className='contact-social-link'
                href={social.href}
                target='_blank'
                rel='noopener noreferrer'
              >
                {social.label}
              </a>
            ))}
          </div>
        </aside>

        <section className='contact-form-wrap fade-up'>
          <h2 className='section-heading'>Send a Message</h2>

          {sent && (
            <p className='contact-success' role='status'>
              Thanks! Your mail should open with the message ready to send.
            </p>
          )}

          <form className='contact-form' onSubmit={handleSubmit} noValidate>
            <div className='contact-field'>
              <label htmlFor='name'>Name</label>
              <input
                id='name'
                name='name'
                type='text'
                value={form.name}
                onChange={handleChange}
                placeholder='Your name'
                className={errors.name ? 'has-error' : ''}
              />
              {errors.name && <span className='contact-error'>{errors.name}</span>}
            </div>

            <div className='contact-field'>
              <label htmlFor='email'>Email</label>
              <input
                id='email'
                name='email'
                type='email'
                value={form.email}
                onChange={handleChange}
                placeholder='you@example.com'
                className={errors.email ? 'has-error' : ''}
              />
              {errors.email && <span className='contact-error'>{errors.email}</span>}
            </div>

            <div className='contact-field'>
              <label htmlFor='subject'>Subject</label>
              <input
                id='subject'
                name='subject'
                type='text'
                value={form.subject}
                onChange={handleChange}
                placeholder='What is this about?'
              />
            </div>

            <div className='contact-field'>
              <label htmlFor='message'>Message</label>
              <textarea
                id='message'
                name='message'
                rows='5'
                value={form.message}
                onChange={handleChange}
                placeholder='Tell me a little about your project or question...'
                className={errors.message ? 'has-error' : ''}
              />
              {errors.message && <span className='contact-error'>{errors.message}</span>}
            </div>

            <div className='contact-actions'>
              <button type='submit' className='contact-btn contact-btn--primary'>
                Send Message
              </button>
              <Link to='/projects' className='contact-btn contact-btn--ghost'>
                View Projects
              </Link>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Contact
