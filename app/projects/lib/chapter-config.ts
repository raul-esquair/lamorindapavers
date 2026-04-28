// Visual config for the /projects gallery chapter transitions.
// Curtain direction and color cycle deterministically by chapter index so the
// rhythm feels intentional but never repeats too tightly.

export type CurtainDirection = "left" | "right" | "top" | "bottom";

export const revealDirections: CurtainDirection[] = [
  "left",
  "right",
  "bottom",
  "right",
];

// Cycles through the 3 logo colors. Matches the FeaturedProjects section on the homepage.
export const curtainColors = ["bg-brand-blue", "bg-brand-red", "bg-brand-gold"];

// Builds a clip-path inset string that sweeps across the element from `direction`.
// v=0 means the element is fully clipped (invisible); v=1 means fully revealed.
export function curtainClipPathFor(direction: CurtainDirection, v: number): string {
  const inset = (1 - v) * 100;
  switch (direction) {
    case "left":
      return `inset(0 ${inset}% 0 0)`; // reveals left -> right
    case "right":
      return `inset(0 0 0 ${inset}%)`; // reveals right -> left
    case "bottom":
      return `inset(${inset}% 0 0 0)`; // reveals bottom -> top
    case "top":
      return `inset(0 0 ${inset}% 0)`; // reveals top -> bottom
  }
}
