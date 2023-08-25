/** @type {import('next').NextConfig} */

const { i18n } = require("./next-i18next.config");
require("./src/env.js");

module.exports = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: ["cdn.discordapp.com"],
  }
};
