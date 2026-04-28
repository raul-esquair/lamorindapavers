"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { getCategorySlug } from "@/lib/data/projects";

interface Props {
  categories: string[];
  filteredCount: number;
  totalCount: number;
  onFilterChange?: () => void;
}

export default function FilterBar({
  categories,
  filteredCount,
  totalCount,
  onFilterChange,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get("service");

  const setFilter = (slug: string | null) => {
    const url = slug ? `/projects?service=${slug}` : "/projects";
    // scroll: false → don't snap to top of document; we control the scroll target manually below.
    router.replace(url, { scroll: false });
    onFilterChange?.();
  };

  const baseClass =
    "px-4 py-2 rounded-full text-sm font-sans font-medium transition-all duration-300";
  const activeClass = "bg-brand-blue text-white";
  const idleClass = "bg-cream text-warm-gray-600 hover:bg-warm-gray-100";

  return (
    <section
      aria-label="Filter projects by service"
      className="border-y border-warm-gray-200 bg-warm-white/85 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter(null)}
            aria-pressed={activeSlug === null}
            className={`${baseClass} ${activeSlug === null ? activeClass : idleClass}`}
          >
            All
          </button>
          {categories.map((cat) => {
            const slug = getCategorySlug(cat);
            const active = slug === activeSlug;
            return (
              <button
                key={cat}
                onClick={() => setFilter(slug)}
                aria-pressed={active}
                className={`${baseClass} ${active ? activeClass : idleClass}`}
              >
                {cat}
              </button>
            );
          })}
          <span className="ml-auto self-center label-text text-warm-gray-400 tabular-nums">
            {filteredCount === totalCount
              ? `${totalCount} projects`
              : `${filteredCount} of ${totalCount}`}
          </span>
        </div>
      </div>
    </section>
  );
}
