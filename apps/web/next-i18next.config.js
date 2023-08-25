// next-i18next.config.js
const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr", "es", "de"], // Add your supported locales here
  },
  react: {
    useSuspense: false,
  },
};