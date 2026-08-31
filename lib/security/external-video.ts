export type ExternalVideo = {
  provider: 'tiktok' | 'instagram';
  sourceUrl: string;
  embedUrl: string;
};

function parseHttpsUrl(value: string) {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:') return null;
    return url;
  } catch {
    return null;
  }
}

export function parseExternalVideoUrl(value: string): ExternalVideo | null {
  const url = parseHttpsUrl(value);
  if (!url) return null;
  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  const parts = url.pathname.split('/').filter(Boolean);

  if (host === 'tiktok.com' || host === 'vm.tiktok.com') {
    const idIndex = parts.findIndex((part) => part === 'video');
    const id = idIndex >= 0 ? parts[idIndex + 1] : '';
    if (!/^\d{8,30}$/.test(id || '')) return null;
    return {
      provider: 'tiktok',
      sourceUrl: `https://www.tiktok.com/${parts.slice(0, idIndex + 2).join('/')}`,
      embedUrl: `https://www.tiktok.com/player/v1/${id}?autoplay=0&loop=0&description=1&rel=0`,
    };
  }

  if (host === 'instagram.com') {
    const kindIndex = parts.findIndex((part) => ['reel', 'p', 'tv'].includes(part));
    const id = kindIndex >= 0 ? parts[kindIndex + 1] : '';
    if (!id || !/^[A-Za-z0-9_-]{3,100}$/.test(id)) return null;
    const kind = parts[kindIndex];
    return {
      provider: 'instagram',
      sourceUrl: `https://www.instagram.com/${kind}/${id}/`,
      embedUrl: `https://www.instagram.com/${kind}/${id}/embed`,
    };
  }

  return null;
}
