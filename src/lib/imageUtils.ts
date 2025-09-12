/**
 * Normalizes image URL to ensure HTTPS protocol for better security and Next.js Image compatibility
 */
export function normalizeImageUrl(url: string): string {
  if (!url) return url;
  
  // Convert HTTP to HTTPS for nutva.uz domain
  if (url.startsWith('http://nutva.uz')) {
    return url.replace('http://', 'https://');
  }
  
  // Keep other URLs as is
  return url;
}

/**
 * Safely get the first image from an array and normalize it
 */
export function getFirstNormalizedImage(images?: string[], fallback?: string): string {
  const firstImage = images?.[0];
  if (!firstImage) return fallback || '';
  return normalizeImageUrl(firstImage);
}
