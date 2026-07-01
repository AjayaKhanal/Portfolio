import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Toast from '../components/Toast'
import SocialLinks from '../components/SocialLinks'
import SectionHeading from '../components/SectionHeading'
import { SOCIAL_LINKS } from '../constants/socials'
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

const initialForm = { name: '', email: '', subject: '', message: '' };

// Web3Forms delivers submissions straight to the email you registered the key
// with — no backend needed. Get a free key at https://web3forms.com (enter your
// Gmail, they email you the access key). Prefer the env var (.env file:
// REACT_APP_WEB3FORMS_KEY=xxxx) so the key isn't hard-coded; the fallback below
// is only a placeholder for local testing.
const ACCESS_KEY =
  process.env.REACT_APP_WEB3FORMS_KEY || 'REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY';

const Contact = () => {
  usePageMeta('Contact', "Get in touch with Ajaya Khanal — let's work together on your next project.");
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  // status: { type: 'idle' | 'sending' | 'success' | 'error', message: string }
  const [status, setStatus] = useState({ type: 'idle', message: '' });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1) Validate first — bail out with field-level errors if anything's off.
    const next = validate();
    if (Object.keys(next).length) {
      setErrors(next);
      setStatus({ type: 'error', message: 'Please fix the highlighted fields and try again.' });
      return;
    }

    // Guard against a forgotten key so the user gets a clear message, not a silent fail.
    if (!ACCESS_KEY || ACCESS_KEY.startsWith('REPLACE_WITH_')) {
      setStatus({
        type: 'error',
        message: 'Email sending is not configured yet. Please try again later.',
      });
      return;
    }

    // 2) Send straight to the inbox via Web3Forms — no mail client involved.
    setStatus({ type: 'sending', message: 'Sending your message…' });
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name: form.name,
          email: form.email,
          subject: form.subject.trim() || `New portfolio message from ${form.name}`,
          message: form.message,
          from_name: 'Portfolio Contact Form',
        }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus({
          type: 'success',
          message: "Thanks for reaching out! Your message has been sent — I'll get back to you soon.",
        });
        setForm(initialForm);
        setErrors({});
      } else {
        setStatus({
          type: 'error',
          message: data.message || "Sorry, your message couldn't be sent. Please try again in a moment.",
        });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Network error — please check your connection and try again.',
      });
    }
  };

  return (
    <div className='contact-page'>
      <header className='contact-hero' data-reveal='up'>
        <span className='contact-eyebrow'>Get in Touch</span>
        <h1 className='contact-title'>Let's Work Together</h1>
        <p className='contact-lead'>
          Have a project in mind, a question, or just want to say hello? I'm always open
          to new ideas and opportunities. Fill out the form below or reach me through any
          of the channels — I'll get back to you soon.
        </p>
      </header>

      <div className='contact-grid'>
        <aside className='contact-info' data-reveal='left'>
          <SectionHeading>Contact Details</SectionHeading>
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

          <SectionHeading>Follow Me</SectionHeading>
          <SocialLinks
            as='div'
            variant='text'
            className='contact-socials'
            linkClassName='contact-social-link'
            items={SOCIAL_LINKS.filter((s) => s.label !== 'Email')}
          />
        </aside>

        <section className='contact-form-wrap' data-reveal='right'>
          <SectionHeading>Send a Message</SectionHeading>


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
              <button
                type='submit'
                className='contact-btn contact-btn--primary'
                disabled={status.type === 'sending'}
              >
                {status.type === 'sending' ? 'Sending…' : 'Send Message'}
              </button>
              <Link to='/projects' className='contact-btn contact-btn--ghost'>
                View Projects
              </Link>
            </div>
          </form>
        </section>
      </div>

      {status.type !== 'idle' && (
        <Toast
          type={status.type}
          message={status.message}
          onClose={() => setStatus({ type: 'idle', message: '' })}
        />
      )}
    </div>
  );
};

export default Contact
