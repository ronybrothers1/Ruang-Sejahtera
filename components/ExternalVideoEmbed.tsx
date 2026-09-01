import { ExternalLink } from 'lucide-react';

export function ExternalVideoEmbed({ provider, embedUrl, sourceUrl, title }: { provider: 'tiktok' | 'instagram'; embedUrl: string; sourceUrl: string; title: string }) {
  const label = provider === 'instagram' ? 'Instagram' : 'TikTok';
  return (
    <figure className="external-video-embed">
      <div className="external-video-frame">
        <iframe src={embedUrl} title={`${label}: ${title}`} loading="lazy" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
      </div>
      <figcaption><span>Dokumentasi {label}</span><a href={sourceUrl} target="_blank" rel="noreferrer">Buka di {label} <ExternalLink size={14} aria-hidden="true" /></a></figcaption>
    </figure>
  );
}
