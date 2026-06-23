/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      background: 'var(--background)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        secondary: 'var(--secondary)',
        primary: 'var(--primary)',
        foreground: 'var(--text-foreground)',
        'muted-foreground': 'var(--text-muted-foreground)',
        border: 'var(--ring-border)',
    },
  },
  plugins: [],
}

