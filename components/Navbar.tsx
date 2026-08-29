"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Heart, Menu, Search, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { navItems } from '@/lib/navigation';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (!isOpen) return () => { document.body.style.overflow = ''; };
    const panel = mobilePanelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    focusables?.[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setIsOpen(false); menuButtonRef.current?.focus(); return; }
      if (event.key !== 'Tab' || !focusables?.length) return;
      const first = focusables[0]; const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKeyDown); };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className={`nav-shell ${scrolled ? 'scrolled' : ''}`}>
      <div className="shell nav-inner">
        <BrandLogo compact priority />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
          {navItems.map((item) => item.children ? (
            <details key={item.name} className="nav-details group relative">
              <summary className={`nav-link list-none ${isActive(item.href) ? 'nav-link-active' : ''}`}>{item.name}<ChevronDown size={14} aria-hidden="true" /></summary>
              <div className="nav-popover">{item.children.map((child) => <Link key={child.href} href={child.href}>{child.name}</Link>)}</div>
            </details>
          ) : <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? 'page' : undefined} className={`nav-link ${isActive(item.href) ? 'nav-link-active' : ''}`}>{item.name}</Link>)}
        </nav>
        <div className="hidden items-center lg:flex">
          <Link href="/donasi" className="cta-red"><Heart size={16} fill="currentColor"/> Donasi</Link>
        </div>
        <button ref={menuButtonRef} type="button" className="icon-button lg:hidden" onClick={() => setIsOpen(v => !v)} aria-expanded={isOpen} aria-controls="mobile-navigation" aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}>{isOpen ? <X size={22}/> : <Menu size={22}/>}</button>
      </div>
      {isOpen ? <div ref={mobilePanelRef} id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Menu navigasi" className="mobile-panel lg:hidden"><nav className="shell py-6" aria-label="Navigasi seluler">
        {navItems.map((item) => <div key={item.name}><Link onClick={closeMenu} href={item.href} className="mobile-nav-link">{item.name}</Link>{item.children ? <div>{item.children.map((child) => <Link onClick={closeMenu} key={child.href} href={child.href} className="mobile-subnav-link">{child.name}</Link>)}</div> : null}</div>)}
        <div className="mt-6 grid gap-3 border-t border-white/10 pt-6"><Link onClick={closeMenu} href="/cari" className="cta-ghost"><Search size={18}/> Cari Informasi</Link><Link onClick={closeMenu} href="/donasi" className="cta-red"><Heart size={18}/> Donasi Sekarang</Link></div>
      </nav></div> : null}
    </header>
  );
}
