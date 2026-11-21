import { seoForPath, siteName, siteUrl, socialImage } from "./seo";

export function updateSeo(pathname: string) {
  const item = seoForPath(pathname);
  const url = `${siteUrl}${item.path}`;
  const image = item.image || socialImage;
  document.title = item.title;
  const meta = (
    attribute: "name" | "property",
    name: string,
    content: string,
  ) => {
    let element = document.head.querySelector<HTMLMetaElement>(
      `meta[${attribute}="${name}"]`,
    );
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attribute, name);
      document.head.append(element);
    }
    element.content = content;
  };
  meta("name", "description", item.description);
  meta("name", "robots", item.indexable ? "index, follow" : "noindex, follow");
  meta("name", "twitter:card", "summary_large_image");
  meta("name", "twitter:title", item.title);
  meta("name", "twitter:description", item.description);
  meta("name", "twitter:image", image);
  meta("property", "og:site_name", siteName);
  meta("property", "og:type", item.type || "website");
  meta("property", "og:title", item.title);
  meta("property", "og:description", item.description);
  meta("property", "og:url", url);
  meta("property", "og:image", image);
  let canonical = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.append(canonical);
  }
  canonical.href = url;
  const structured = document.head.querySelector<HTMLScriptElement>(
    'script[type="application/ld+json"]',
  );
  if (item.path !== "/") structured?.remove();
  else if (!structured) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
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
    });
    document.head.append(script);
  }
}
