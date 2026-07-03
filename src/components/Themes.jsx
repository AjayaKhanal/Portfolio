'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import { useTheme } from 'next-themes';
import { THEME_OPTIONS } from '../constants/themes';
import '../styles/themeSwitcher.css';

export const ThemeSwitcher = React.forwardRef(({ className, ...rest }, ref) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Position the sliding highlight under the active option.
  const activeIndex = Math.max(0, THEME_OPTIONS.findIndex((t) => t.key === theme));

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label="Theme Switcher"
      className={cn('theme-switch', className)}
      {...rest}
    >
      {/* Sliding highlight that animates to the active option */}
      <span
        className="theme-switch-thumb"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
        aria-hidden="true"
      />

      {THEME_OPTIONS.map(({ key, icon: Icon, label }) => {
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
});

ThemeSwitcher.displayName = 'ThemeSwitcher';
