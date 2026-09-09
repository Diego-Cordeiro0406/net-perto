import { BASE_URL } from "@/lib/constants";
import type { PageSEOProps } from "@/types/types";
import { Helmet } from "react-helmet-async";

const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export function PageSEO({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
  jsonLd,
}: PageSEOProps) {
  const canonicalUrl = canonical
    ? `${BASE_URL}${canonical}`
    : typeof window !== "undefined"
      ? `${BASE_URL}${window.location.pathname}`
      : BASE_URL;

  const fullTitle = title.includes("NetPerto") ? title : `${title} | NetPerto`;

  const jsonLdItems = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>

      <meta name="description" content={description} />

      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="pt-BR" href={canonicalUrl} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="NetPerto" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD */}
      {jsonLdItems.map((item, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
}
