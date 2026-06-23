'use client';

import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from 'next-themes';
import '../styles/themeSwitcher.css';

const themes = [
  {
    key: 'system',
    icon: Monitor,
    label: 'System theme',
  },
  {
    key: 'light',
    icon: Sun,
    label: 'Light theme',
  },
  {
    key: 'dark',
    icon: Moon,
    label: 'Dark theme',
  },
];

export const ThemeSwitcher = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Position the sliding highlight under the active option.
  const activeIndex = Math.max(0, themes.findIndex((t) => t.key === theme));

  return (
    <div
      role="radiogroup"
      aria-label="Theme Switcher"
      className={cn('theme-switch', className)}
    >
      {/* Sliding highlight that animates to the active option */}
      <span
        className="theme-switch-thumb"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
        aria-hidden="true"
      />

      {themes.map(({ key, icon: Icon, label }) => {
        const isActive = theme === key;
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={label}
            title={label}
            className={cn('theme-switch-btn', isActive && 'is-active')}
            onClick={() => setTheme(key)}
          >
            <Icon className="theme-switch-icon" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
};
