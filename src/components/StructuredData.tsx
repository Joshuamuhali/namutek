import {
  designerPersonJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/site-metadata";

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Site-wide structured data for search engines (Organization, WebSite, designer). */
export function SiteStructuredData() {
  return (
    <>
      <JsonLdScript data={organizationJsonLd()} />
      <JsonLdScript data={websiteJsonLd()} />
      <JsonLdScript data={designerPersonJsonLd()} />
    </>
  );
}
