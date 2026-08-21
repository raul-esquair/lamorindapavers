import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { marked } from "marked";
import { generatePageMetadata } from "@/lib/metadata";
import { loadBlogConfig } from "@/lib/blog-config";
import { blurProps } from "@/lib/blur";
import { BLOG_POSTS, isPublished, getPublishedPosts, getRelatedPosts } from "@/lib/blog/data";
import SectionLabel from "@/components/ui/SectionLabel";
import { ArticleJsonLd, FAQJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import BlogCard from "@/components/blog/BlogCard";
import BlogCTA from "@/components/blog/BlogCTA";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post || !isPublished(post)) return {};

  return generatePageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    ogType: "article",
    publishedTime: post.date,
    ogImage: post.featuredImage,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const config = await loadBlogConfig();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post || !isPublished(post)) notFound();

  const relatedService = post.relatedService
    ? config.services.find((s) => s.slug === post.relatedService)
    : null;

  const postUrl = `${config.site.url}/blog/${post.slug}`;
  const renderedHtml = marked.parse(post.content, { gfm: true, async: false }) as string;
  const relatedPosts = getRelatedPosts(post.slug, post.relatedService, 3);

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        date={post.date}
        dateModified={post.dateModified}
        url={postUrl}
        image={post.featuredImage ? `${config.site.url}${post.featuredImage}` : undefined}
      />
      {post.faqs && post.faqs.length > 0 && <FAQJsonLd faqs={post.faqs} />}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: config.site.url },
          { name: "Blog", url: `${config.site.url}/blog` },
          { name: post.title, url: postUrl },
        ]}
      />

      {/* Hero */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm mb-6 font-sans">
            {relatedService && (
              <>
                <Link
                  href={`/services/${relatedService.slug}`}
                  className="text-brand-gold-dark font-medium hover:text-warm-gray-900 transition-colors"
                >
                  {relatedService.name}
                </Link>
                <span className="text-warm-gray-300">·</span>
              </>
            )}
            <Link
              href="/about"
              className="text-warm-gray-500 hover:text-warm-gray-900 transition-colors"
            >
              By Steve Barsanti, Owner
            </Link>
            <span className="text-warm-gray-300">·</span>
            <span className="text-warm-gray-500">CA Lic. #1092749</span>
            <span className="text-warm-gray-300">·</span>
            <time className="text-warm-gray-500" dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <span className="text-warm-gray-300">·</span>
            <span className="text-warm-gray-500">{post.readingTime}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl text-warm-gray-900 leading-[1.1]">
            {post.title}
          </h1>
        </div>

        {post.featuredImage && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 md:mt-14">
            <div className="relative aspect-[3/2] overflow-hidden rounded-xl">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
                className="object-cover"
                {...blurProps(post.featuredImage)}
              />
            </div>
          </div>
        )}
      </section>

      {/* Article body */}
      <section className="py-16 md:py-24 bg-warm-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <article
            className="
              text-warm-gray-700 font-sans leading-relaxed text-[17px]
              [&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:font-serif [&_h2]:text-warm-gray-900 [&_h2]:mt-12 [&_h2]:mb-5
              [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-serif [&_h3]:text-warm-gray-900 [&_h3]:mt-10 [&_h3]:mb-3
              [&_p]:mb-5
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:space-y-2
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol]:space-y-2
              [&_li]:text-warm-gray-700
              [&_strong]:text-warm-gray-900 [&_strong]:font-semibold
              [&_a]:text-brand-gold-dark [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-brand-gold/40 [&_a]:hover:text-warm-gray-900
              [&_table]:w-full [&_table]:border-collapse [&_table]:mb-8 [&_table]:text-base
              [&_th]:bg-cream [&_th]:border [&_th]:border-warm-gray-200 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-serif [&_th]:font-semibold [&_th]:text-warm-gray-900
              [&_td]:border [&_td]:border-warm-gray-200 [&_td]:px-4 [&_td]:py-3 [&_td]:text-warm-gray-700
              [&_blockquote]:border-l-4 [&_blockquote]:border-brand-gold [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-warm-gray-500 [&_blockquote]:my-6
              [&_code]:bg-cream [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:text-warm-gray-800
              [&_pre]:bg-warm-gray-900 [&_pre]:text-warm-white [&_pre]:p-5 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6
              [&_pre_code]:bg-transparent [&_pre_code]:text-warm-white
              [&_hr]:border-warm-gray-200 [&_hr]:my-10
            "
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />

          <div className="mt-16 pt-8 border-t border-warm-gray-200">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-gold-dark hover:gap-3 transition-all font-sans"
            >
              <ArrowLeft size={14} />
              Back to all articles
            </Link>
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="py-16 md:py-20 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <SectionLabel>Continue reading</SectionLabel>
              <h2 className="text-3xl md:text-4xl text-warm-gray-900 mt-3 mb-10">
                Related articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {relatedPosts.map((related) => (
                  <BlogCard key={related.slug} post={related} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <BlogCTA
        heading="Ready to start your project?"
        subtext="You've done the reading. Now let's walk your property together and talk specifics — free estimate, no obligation."
        buttonText="Request a free estimate"
        buttonHref="/contact"
      />
    </>
  );
}
