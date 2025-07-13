import type { LinguiConfig } from "@lingui/conf";

const config: LinguiConfig = {
  locales: ["en", "fr", "de", "es", "it", "nl"],
  sourceLocale: "en",
  catalogs: [
    {
      path: "src/locales/{locale}/messages",
      include: ["src"],
      exclude: ["**/node_modules/**"],
    },
  ],
  format: "po",
  formatOptions: {
    origins: false,
    lineNumbers: false,
  },
  compileNamespace: "es",
  extractors: ["babel"],
};

export default config;
