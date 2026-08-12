/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Minimal self-contained server bundle for the production Docker image
  // (see infra/docker/Dockerfile.client) — avoids shipping full node_modules.
  output: "standalone",
};

module.exports = nextConfig;
