// Helper to get the correct asset URL for both dev and production
export function getAssetUrl(path) {
  if (!path) return '';
  // If it's already a data URL or external URL, return as-is
  if (path.startsWith('data:') || path.startsWith('http')) return path;
  // For public folder assets, ensure proper path
  if (path.startsWith('/assets/')) {
    return `${process.env.PUBLIC_URL}${path}`;
  }
  return path;
}
