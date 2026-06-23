// src/utils/mdxutils.js
// Reads project metadata straight from the compiled .mdx modules.
// Each project .mdx exports `meta` (title, description, etc.) plus the
// default export (the rendered content), so the same file powers both the
// preview cards and the full detail page.
const context = require.context("../data/projects", false, /\.mdx$/);

// Synchronously check whether a project file exists for the given slug.
export const projectExists = (slug) =>
  context.keys().some((key) => key.replace("./", "").replace(".mdx", "") === slug);

export const getAllProjects = async () => {
  return context
    .keys()
    .map((key) => {
      const module = context(key);
      if (!module.meta || !module.meta.title) return null;
      const slug = key.replace("./", "").replace(".mdx", "");
      return { ...module.meta, slug };
    })
    .filter(Boolean);
};
