import { useEffect } from 'react'

const SITE_NAME = 'Ajaya Khanal';
const BASE_TITLE = 'Ajaya Khanal — Software Engineer';

// Lightweight, dependency-free per-page <title> + meta description manager.
// Sets the document title (and optional description) on mount and restores
// the site defaults on unmount so each route gets its own SEO metadata.
const usePageMeta = (title, description) => {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : BASE_TITLE;
    document.title = fullTitle;

    let meta = null;
    let previousDescription = null;
    if (description) {
      meta = document.querySelector('meta[name="description"]');
      if (meta) {
        previousDescription = meta.getAttribute('content');
        meta.setAttribute('content', description);
      }
    }

    return () => {
      document.title = BASE_TITLE;
      if (meta && previousDescription !== null) {
        meta.setAttribute('content', previousDescription);
      }
    };
  }, [title, description]);
};

export default usePageMeta
