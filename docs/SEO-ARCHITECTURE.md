# SEO Architecture V2

- Metadata is rendered through Next.js Metadata API.
- Canonical base, sitemap, robots, and structured organization data remain non-indexable until `NEXT_PUBLIC_SITE_URL` is configured with the official production domain.
- Organization JSON-LD is emitted only when an official URL exists.
- Program detail pages include semantic breadcrumbs and BreadcrumbList JSON-LD when the domain is configured.
- Article schema will be generated from CMS article records only after the article model is connected to a production data source.
- URLs use human-readable slugs.
- Images require meaningful alt text and original documentation metadata.
- No fake review, rating, event, donation, or financial structured data is generated.
