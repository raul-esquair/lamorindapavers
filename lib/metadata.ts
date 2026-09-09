import type { Metadata } from "next";
import { loadBlogConfig } from "./blog-config";

interface PageMetadataOptions {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  noindex?: boolean;
  /**
   * Bypass the root layout's `%s | <brand>` template so the whole ~60-char
   * SERP budget belongs to `title`. Set for blog posts, whose titles are
   * already written to stand alone.
   */
  titleAbsolute?: boolean;
}

export async function generatePageMetadata({
  title,
  description,
  path = "",
  ogImage,
  ogType = "website",
  publishedTime,
  noindex = false,
  titleAbsolute = false,
}: PageMetadataOptions): Promise<Metadata> {
  const config = await loadBlogConfig();
  const url = `${config.site.url}${path}`;
  const finalOgImage = ogImage ?? `${config.site.url}/opengraph-image`;

  return {
    // Only the <title> needs the {absolute} wrapper; the layout's title
    // template does not apply to OG/Twitter, so those take the plain string.
    title: titleAbsolute ? { absolute: title } : title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: config.site.name,
      images: [
        {
          url: finalOgImage,
          width: 1200,
          height: 630,
          alt: `${config.site.brand.short}`,
        },
      ],
      locale: config.site.locale,
      type: ogType,
      ...(publishedTime && { publishedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
    ...(noindex && {
      robots: {
        index: false,
        follow: true,
      },
    }),
  };
}
