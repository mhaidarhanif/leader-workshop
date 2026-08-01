const STATIC_IMAGE_EXTENSION = /\.(png|jpe?g|gif|webp|avif|svg|bmp|ico)$/i;

export function isStaticImageUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('data:image/')) return true;
  if (trimmed.startsWith('blob:')) return true;

  try {
    const { pathname } = new URL(trimmed);
    return STATIC_IMAGE_EXTENSION.test(pathname);
  } catch {
    return false;
  }
}
