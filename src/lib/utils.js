// Merge class names, dropping falsy values (like clsx, minimal version).
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Tiny class-variance helper (a cva-like API) built on top of cn().
 *
 *   const button = cva('button', {
 *     variants: {
 *       variant: { primary: '', ghost: 'button--ghost' },
 *       size:    { sm: 'button--sm', md: '', lg: 'button--lg' },
 *     },
 *     defaultVariants: { variant: 'primary', size: 'md' },
 *   })
 *
 *   button()                              // "button"
 *   button({ variant: 'ghost' })          // "button button--ghost"
 *   button({ size: 'lg', className: 'x' }) // "button button--lg x"
 *
 * Variant values map to CSS modifier classes (this project uses plain CSS,
 * not Tailwind utilities), so an empty string means "no extra class".
 */
export function cva(base, config = {}) {
  const { variants = {}, defaultVariants = {} } = config;
  return ({ className, ...props } = {}) => {
    const applied = Object.keys(variants).map((key) => {
      const value = props[key] != null ? props[key] : defaultVariants[key];
      return value != null ? variants[key][value] : null;
    });
    return cn(base, ...applied, className);
  };
}
