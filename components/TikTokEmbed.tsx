'use client';

import { ExternalLink } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { TikTokVideo } from '@/lib/media';

type TikTokEmbedProps = {
  video: TikTokVideo;
};

export function TikTokEmbed({ video }: TikTokEmbedProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [shouldLoadPlayer, setShouldLoadPlayer] = useState(false);
  const playerUrl = `https://www.tiktok.com/player/v1/${video.id}?autoplay=0&loop=0&description=1&rel=0`;
  const titleId = `tiktok-title-${video.id}`;
  const descriptionId = `tiktok-description-${video.id}`;

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || shouldLoadPlayer) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setShouldLoadPlayer(true);
      observer.disconnect();
    }, { rootMargin: '600px 0px' });

    observer.observe(frame);
    return () => observer.disconnect();
  }, [shouldLoadPlayer]);

  return (
    <article className="trust-tiktok-card" aria-labelledby={titleId}>
      <div ref={frameRef} className="trust-tiktok-frame" aria-busy={!shouldLoadPlayer}>
        {shouldLoadPlayer ? (
          <iframe
            src={playerUrl}
            title={`Video TikTok: ${video.title}`}
            aria-describedby={descriptionId}
            loading="lazy"
            allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div className="trust-tiktok-placeholder" role="status">
            <span className="sr-only">Player TikTok akan dimuat saat mendekati area layar.</span>
          </div>
        )}
      </div>
      <div className="trust-tiktok-copy">
        <span>Dokumentasi video</span>
        <h3 id={titleId}>{video.title}</h3>
        <p id={descriptionId}>{video.description}</p>
        <a href={video.href} target="_blank" rel="noreferrer" aria-label={`Buka video ${video.title} di TikTok, dibuka di tab baru`}>
          Buka di TikTok <ExternalLink size={14} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
