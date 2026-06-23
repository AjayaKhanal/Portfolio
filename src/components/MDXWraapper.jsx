// src/components/MDXWrapper.jsx
import { MDXProvider } from "@mdx-js/react";

export const MDXWrapper = ({ children }) => {
  return (
    <section className="mt-4 prose max-w-4xl mx-auto">
      <MDXProvider>{children}</MDXProvider>
    </section>
  );
};
