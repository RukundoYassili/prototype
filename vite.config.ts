import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  seoPages,
  siteName,
  siteUrl,
  socialImage,
  type SeoPage,
} from "./src/seo";

const escape = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function searchMetadata() {
  return {
    name: "search-metadata",
    apply: "build" as const,
    closeBundle() {
      const output = join(process.cwd(), "dist");
      const template = readFileSync(join(output, "index.html"), "utf8");
      const render = (item: SeoPage) => {
        const url = `${siteUrl}${item.path}`;
        const image = item.image || socialImage;
        const tags = [
          `<title>${escape(item.title)}</title>`,
          `<meta name="description" content="${escape(item.description)}" />`,
          `<meta name="robots" content="${item.indexable ? "index, follow" : "noindex, follow"}" />`,
          `<link rel="canonical" href="${escape(url)}" />`,
          `<meta property="og:site_name" content="${siteName}" />`,
          `<meta property="og:type" content="${item.type || "website"}" />`,
          `<meta property="og:title" content="${escape(item.title)}" />`,
          `<meta property="og:description" content="${escape(item.description)}" />`,
          `<meta property="og:url" content="${escape(url)}" />`,
          `<meta property="og:image" content="${escape(image)}" />`,
          `<meta name="twitter:card" content="summary_large_image" />`,
          `<meta name="twitter:title" content="${escape(item.title)}" />`,
          `<meta name="twitter:description" content="${escape(item.description)}" />`,
          `<meta name="twitter:image" content="${escape(image)}" />`,
        ];
        if (item.path === "/") {
          tags.push(
            `<script type="application/ld+json">${JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${siteUrl}/#organization`,
                  name: "Vuga Ndakumva",
                  url: `${siteUrl}/`,
                  logo: `${siteUrl}/vugandakumva-icon-512.png`,
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}/#website`,
                  name: "Vuga Ndakumva",
                  url: `${siteUrl}/`,
                  publisher: { "@id": `${siteUrl}/#organization` },
                  inLanguage: "en",
                },
              ],
            }).replace(/</g, "\\u003c")}</script>`,
          );
        }
        return template
          .replace(/\s*<meta\s+name="description"[\s\S]*?\/?>/, "")
          .replace(/<title>[\s\S]*?<\/title>/, tags.join("\n    "));
      };
      for (const item of seoPages) {
        const directory =
          item.path === "/" ? output : join(output, item.path.slice(1));
        mkdirSync(directory, { recursive: true });
        writeFileSync(join(directory, "index.html"), render(item));
      }
      const urls = seoPages
        .filter((item) => item.indexable)
        .map(
          (item) =>
            `  <url><loc>${escape(`${siteUrl}${item.path}`)}</loc></url>`,
        )
        .join("\n");
      writeFileSync(
        join(output, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      );
      writeFileSync(
        join(output, "robots.txt"),
        `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      );
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), searchMetadata()],
  server: process.env.MEDIA_PROXY ? { proxy: { "/api/media": process.env.MEDIA_PROXY } } : undefined,
  preview: process.env.MEDIA_PROXY ? { proxy: { "/api/media": process.env.MEDIA_PROXY } } : undefined,
});
