'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

export type HeroGallerySlide = {
  id: string;
  image: string;
  imageAlt: string;
  imageLabel: string;
  eyebrow: string;
  title: string;
  meta?: string;
};

type HeroGalleryCarouselProps = {
  slides: HeroGallerySlide[];
};

const SWIPE_THRESHOLD = 44;

export function HeroGalleryCarousel({ slides }: HeroGalleryCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const activeSlide = slides[activeIndex] ?? slides[0];
  const hasMultipleSlides = slides.length > 1;

  if (!activeSlide) return null;

  function showPrevious() {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % slides.length);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse') return;
    pointerStart.current = { x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start || !hasMultipleSlides) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    if (deltaX < 0) showNext();
    else showPrevious();
  }

  function handleKeyboard(event: KeyboardEvent<HTMLElement>) {
    if (!hasMultipleSlides) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPrevious();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showNext();
    }
  }

  return (
    <section
      className="trust-hero-media trust-hero-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Dokumentasi terbaru Ruang Sejahtera"
      onKeyDown={handleKeyboard}
    >
      <div
        className="trust-hero-main-image trust-hero-carousel-stage"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { pointerStart.current = null; }}
      >
        <div
          className="trust-hero-carousel-visual"
          role="group"
          aria-roledescription="slide"
          aria-label={`${activeIndex + 1} dari ${slides.length}: ${activeSlide.title}`}
          key={activeSlide.id}
        >
          <Image
            src={activeSlide.image}
            alt={activeSlide.imageAlt}
            fill
            priority={activeIndex === 0}
            sizes="(max-width: 680px) calc(100vw - 44px), (max-width: 900px) calc(100vw - 64px), 42vw"
            draggable={false}
          />
          <span className="preview-chip">{activeSlide.imageLabel}</span>
          <div className="trust-hero-image-caption" aria-live="polite" aria-atomic="true">
            <small>{activeSlide.eyebrow}</small>
            <strong>{activeSlide.title}</strong>
            {activeSlide.meta ? <span>{activeSlide.meta}</span> : null}
          </div>
        </div>
      </div>

      {hasMultipleSlides ? (
        <div className="trust-hero-carousel-toolbar">
          <span className="trust-hero-carousel-counter" aria-hidden="true">
            {String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>

          <div className="trust-hero-carousel-progress" aria-hidden="true">
            {slides.map((slide, index) => (
              <span className={index === activeIndex ? 'is-active' : undefined} key={slide.id} />
            ))}
          </div>

          <ul className="trust-hero-carousel-thumbnails" aria-label="Pilih dokumentasi">
            {slides.map((slide, index) => (
              <li key={slide.id}>
                <button
                  type="button"
                  aria-label={`Tampilkan dokumentasi ${index + 1}: ${slide.title}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                  onClick={() => setActiveIndex(index)}
                >
                  <Image src={slide.image} alt="" fill sizes="64px" draggable={false} />
                </button>
              </li>
            ))}
          </ul>

          <div className="trust-hero-carousel-controls">
            <button type="button" onClick={showPrevious} aria-label="Tampilkan dokumentasi sebelumnya">
              <ArrowLeft size={17} aria-hidden="true" />
            </button>
            <button type="button" onClick={showNext} aria-label="Tampilkan dokumentasi berikutnya">
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}

      <Link href="/galeri" className="trust-hero-gallery-link">
        Lihat galeri preview <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </section>
  );
}
