import createMDX from '@next/mdx';

// ═══════════════════════════════════════════════════════════════════════════════
// Deployment configuration
//
// GitHub Pages (default github.io URL, no custom domain):
//   • Set GITHUB_PAGES=true AND CUSTOM_DOMAIN=false in the CI workflow.
//   • basePath is set to '/dkeramik' (your repository name) so that all
//     asset references resolve correctly under the sub-path.
//   • TODO: replace 'dkeramik' below with your actual repository name
//     if it ever changes.
//
// GitHub Pages with a custom domain:
//   • Set CUSTOM_DOMAIN=true in the CI workflow.
//   • basePath is left empty — the site lives at the root of the domain.
//   • Add your domain to public/CNAME (see that file for full instructions).
//
// Local development / Vercel / other hosts:
//   • Leave both env vars unset — no basePath is applied.
// ═══════════════════════════════════════════════════════════════════════════════

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const useCustomDomain = process.env.CUSTOM_DOMAIN === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  // basePath is only needed when serving under a sub-path (GitHub Pages without
  // a custom domain).  When using a custom domain or running locally, it stays
  // empty so relative links and assets work at the root.
  basePath: isGitHubPages && !useCustomDomain ? '/dkeramik' : '',

  images: {
    unoptimized: true,
  },

  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
