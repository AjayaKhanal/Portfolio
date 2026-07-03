// Static content for the Contact page — contact channels and the blank form.
export const CONTACT_DETAILS = [
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

export const CONTACT_INITIAL_FORM = { name: '', email: '', subject: '', message: '' };
