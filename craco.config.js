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

      const oneOfRule = webpackConfig.module.rules.find((rule) =>
        Array.isArray(rule.oneOf)
      );

      if (oneOfRule) {
        // Put our rule first so it wins over the catch-all file-loader.
        oneOfRule.oneOf.unshift(mdxRule);
      } else {
        webpackConfig.module.rules.push(mdxRule);
      }

      return webpackConfig;
    },
  },
};
