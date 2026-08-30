import { ExternalLink } from 'lucide-react';
import type { TikTokVideo } from '@/lib/media';

type TikTokEmbedProps = {
  video: TikTokVideo;
};

export function TikTokEmbed({ video }: TikTokEmbedProps) {
  const playerUrl = `https://www.tiktok.com/player/v1/${video.id}?autoplay=0&loop=0&description=1&rel=0`;

  return (
    <article className="trust-tiktok-card">
      <div className="trust-tiktok-frame">
        <iframe
          src={playerUrl}
          title={`Video TikTok: ${video.title}`}
          loading="lazy"
          allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <div className="trust-tiktok-copy">
        <span>Dokumentasi video</span>
        <h3>{video.title}</h3>
        <p>{video.description}</p>
        <a href={video.href} target="_blank" rel="noreferrer">
          Buka di TikTok <ExternalLink size={14} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
