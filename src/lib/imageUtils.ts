/**
 * Normalizes image URL to ensure HTTPS protocol for better security and Next.js Image compatibility
 */
export function normalizeImageUrl(url: string): string {
  if (!url) return url;
  
  // Convert HTTP to HTTPS for known Nutva domains to avoid mixed-content blocks
  const upgradeHosts = [
    'nutva.uz',
    'api.nutvahealth.uz',
    'www.api.nutvahealth.uz',
  ];
  try {
    const u = new URL(url, 'https://nutva.uz');
    if (u.protocol === 'http:' && upgradeHosts.includes(u.hostname)) {
      u.protocol = 'https:';
      return u.toString();
    }
  } catch {
    // if URL constructor fails (e.g., relative path), return as-is
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
