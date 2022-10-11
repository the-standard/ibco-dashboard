/* eslint-disable @typescript-eslint/no-var-requires */
const withBunyan = require("next-bunyan");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
}

module.exports = withBunyan({nextConfig})
