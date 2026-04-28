import blurMap from "./blur-map.json";

const map = blurMap as Record<string, string>;

/**
 * Returns the pre-generated blur data URL for a public image path, or undefined
 * if no blur was generated (small icons, missing entries, external URLs, etc.).
 *
 * The map is built at `npm run blur:gen` (auto-runs before `npm run build`).
 */
export function getBlurFor(src: string): string | undefined {
  return map[src];
}

/**
 * Convenience: spreads onto a `<Image>` to apply the blur placeholder when one
 * exists for the given path.
 *
 *   <Image src={path} {...blurProps(path)} ... />
 *
 * If no blur is available, returns {} so next/image falls back to its default
 * (no placeholder).
 */
export function blurProps(
  src: string,
): { placeholder?: "blur"; blurDataURL?: string } {
  const blur = getBlurFor(src);
  if (!blur) return {};
  return { placeholder: "blur", blurDataURL: blur };
}
