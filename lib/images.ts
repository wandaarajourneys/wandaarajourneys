export function seededImage(seed: string, width = 1600, height = 1000): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}
