import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/blog/types";
import { blurProps } from "@/lib/blur";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-xl border border-warm-gray-200 overflow-hidden bg-warm-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="aspect-[16/9] bg-cream relative overflow-hidden">
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            {...blurProps(post.featuredImage)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <p className="text-sm text-warm-gray-400 font-sans text-center">
              {post.title.split(" ").slice(0, 4).join(" ")}
            </p>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-4 text-xs text-warm-gray-400 mb-3 font-sans">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {post.readingTime}
          </span>
        </div>

        <h2 className="text-xl md:text-2xl text-warm-gray-900 mb-2 group-hover:text-brand-gold transition-colors">
          {post.title}
        </h2>

        <p className="text-sm text-warm-gray-500 font-sans leading-relaxed line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-gold-dark group-hover:gap-2.5 transition-all font-sans">
          Read more
          <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
