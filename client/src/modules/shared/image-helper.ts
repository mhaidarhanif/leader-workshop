const STATIC_IMAGE_EXTENSION = /\.(png|jpe?g|gif|webp|avif|svg|bmp|ico)$/i;

export function isStaticImageUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;

  // Accept data URLs that are images
  if (trimmed.startsWith("data:image/")) return true;
  // Accept blob URLs
  if (trimmed.startsWith("blob:")) return true;

  // Accept URLs that end with common image extensions
  const imageExtPattern = STATIC_IMAGE_EXTENSION;

  try {
    const testPath = new URL(trimmed, "http://dummy-base").pathname;
    if (imageExtPattern.test(testPath)) return true;
  } catch {
    // Fallback for non-URL strings (relative paths, etc.)
    if (imageExtPattern.test(trimmed)) return true;
    return false;
  }

  return false;
}
