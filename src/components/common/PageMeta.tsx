import { HelmetProvider, Helmet } from "react-helmet-async";
import { SITE, absoluteUrl } from "../../config/site";

type JsonLd = Record<string, unknown>;

type PageMetaProps = {
  title: string;
  description: string;
  /**
   * Site path of a public page, e.g. "/pricing". Setting it marks the page as
   * indexable and adds the canonical URL and social-preview tags.
   */
  path?: string;
  /** Social preview image: a site path or absolute URL. Defaults to the site image. */
  image?: string;
  /** Keep this page out of search results. */
  noindex?: boolean;
  /** Structured data (schema.org JSON-LD). */
  jsonLd?: JsonLd | JsonLd[];
};

/** JSON for a <script> body: escape "<" so the content can't close the tag. */
const serialize = (data: JsonLd | JsonLd[]) => JSON.stringify(data).replace(/</g, "\\u003c");

const PageMeta = ({ title, description, path, image, noindex, jsonLd }: PageMetaProps) => {
  const url = path ? absoluteUrl(path) : undefined;
  const imageUrl = absoluteUrl(image ?? SITE.ogImage);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex" />}

      {url && <link rel="canonical" href={url} />}
      {url && <meta property="og:type" content="website" />}
      {url && <meta property="og:site_name" content={SITE.name} />}
      {url && <meta property="og:url" content={url} />}
      {url && <meta property="og:title" content={title} />}
      {url && <meta property="og:description" content={description} />}
      {url && <meta property="og:image" content={imageUrl} />}
      {url && <meta property="og:image:width" content="1200" />}
      {url && <meta property="og:image:height" content="630" />}
      {url && <meta property="og:image:alt" content={`${SITE.name}: gym management software`} />}
      {url && <meta name="twitter:card" content="summary_large_image" />}
      {url && <meta name="twitter:title" content={title} />}
      {url && <meta name="twitter:description" content={description} />}
      {url && <meta name="twitter:image" content={imageUrl} />}

      {jsonLd && <script type="application/ld+json">{serialize(jsonLd)}</script>}
    </Helmet>
  );
};

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;
