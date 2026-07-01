// craco.config.js
// Wires @mdx-js/loader into CRA's webpack config so .mdx files compile to
// React components. The loader MUST be injected inside CRA's `oneOf` rule
// list, ahead of the catch-all file-loader — otherwise CRA treats .mdx as a
// static asset (emitting a URL) and the MDX never compiles.
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const mdxRule = {
        test: /\.mdx?$/,
        use: [
          {
            loader: require.resolve("@mdx-js/loader"),
            // providerImportSource lets <MDXProvider> supply custom components
            options: { providerImportSource: "@mdx-js/react" },
          },
        ],
      };

      // Allow importing any file's raw source as a string via `?raw`
      // (e.g. import src from './Button.jsx?raw'). Uses webpack 5's native
      // asset/source — no extra loader needed.
      const rawRule = {
        resourceQuery: /raw/,
        type: "asset/source",
      };

      const oneOfRule = webpackConfig.module.rules.find((rule) =>
        Array.isArray(rule.oneOf)
      );

      if (oneOfRule) {
        // Put our rules first so they win over the catch-all file-loader.
        // rawRule must precede the babel rule so `?raw` imports aren't transpiled.
        oneOfRule.oneOf.unshift(mdxRule);
        oneOfRule.oneOf.unshift(rawRule);
      } else {
        webpackConfig.module.rules.push(mdxRule, rawRule);
      }

      return webpackConfig;
    },
  },
};
