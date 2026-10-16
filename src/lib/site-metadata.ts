/** Canonical public site origin (used in sitemap, JSON-LD, and Open Graph). */
export const SITE_ORIGIN = "https://www.namuteklogistics.com";

export const SITE_NAME = "Namutek Logistics Limited";

export const DESIGNER = {
  name: "Joshua Muhali",
  jobTitle: "Web Designer & Developer",
  creditsPath: "/credits" as const,
  creditsUrl: `${SITE_ORIGIN}/credits`,
} as const;

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
    inLanguage: "en",
    creator: {
      "@type": "Person",
      name: DESIGNER.name,
      jobTitle: DESIGNER.jobTitle,
      url: DESIGNER.creditsUrl,
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
    logo: `${SITE_ORIGIN}/favicon.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plot No. 3074M off Zambezi Road, Foxdale",
      addressLocality: "Lusaka",
      addressCountry: "ZM",
    },
  };
}

export function designerPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: DESIGNER.name,
    jobTitle: DESIGNER.jobTitle,
    url: DESIGNER.creditsUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": DESIGNER.creditsUrl,
      name: `Website design — ${DESIGNER.name}`,
      description: `${DESIGNER.name} designed and built the official website for ${SITE_NAME}.`,
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: `${SITE_ORIGIN}/`,
      },
    },
  };
}
