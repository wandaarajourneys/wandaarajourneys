export function seededImage(seed: string, width = 1600, height = 1000): string {
  if (seed.includes("beach")) return "/images/beach_hero.png";
  if (seed.includes("mountain") || seed.includes("trek")) return "/images/mountain_hero.png";
  return "/images/safari_hero.png";
}
