"use client";

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Heart, Menu, Search, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { navItems, type NavItem } from '@/lib/navigation';

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
    const focusables = panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), summary');
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
  const isWithin = (href: string) => {
    const path = href.split('#')[0];
    return path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`);
  };
  const isCurrent = (href: string) => !href.includes('#') && pathname === href;
  const isItemActive = (item: NavItem) => isWithin(item.href) || Boolean(item.children?.some((child) => isWithin(child.href)));
  const closeDesktopPopover = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.closest('details')?.removeAttribute('open');
  };

  return (
    <header className={`nav-shell ${scrolled ? 'scrolled' : ''}`}>
      <div className="shell nav-inner">
        <BrandLogo compact priority />
        <nav className="desktop-navigation" aria-label="Navigasi utama">
          {navItems.map((item) => item.children ? (
            <details key={item.name} className="nav-details group relative">
              <summary className={`nav-link list-none ${isItemActive(item) ? 'nav-link-active' : ''}`}>{item.name}<ChevronDown size={14} aria-hidden="true" /></summary>
              <div className="nav-popover">{item.children.map((child) => <Link onClick={closeDesktopPopover} key={`${child.href}-${child.name}`} aria-current={isCurrent(child.href) ? 'page' : undefined} className={isCurrent(child.href) ? 'is-active' : undefined} href={child.href}>{child.name}</Link>)}</div>
            </details>
          ) : <Link key={item.href} href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined} className={`nav-link ${isWithin(item.href) ? 'nav-link-active' : ''}`}>{item.name}</Link>)}
        </nav>
        <div className="desktop-navigation-action">
          <Link href="/cari" aria-label="Cari informasi" aria-current={isCurrent('/cari') ? 'page' : undefined} className={`nav-search-link ${isCurrent('/cari') ? 'is-active' : ''}`}><Search size={18}/></Link>
          <Link href="/donasi" aria-current={isCurrent('/donasi') ? 'page' : undefined} className="cta-red"><Heart size={16} fill="currentColor"/> Cara Mendukung</Link>
        </div>
        <button ref={menuButtonRef} type="button" className="icon-button nav-menu-toggle" onClick={() => setIsOpen(v => !v)} aria-expanded={isOpen} aria-controls="mobile-navigation" aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}>{isOpen ? <X size={22}/> : <Menu size={22}/>}</button>
      </div>
      {isOpen ? <div ref={mobilePanelRef} id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Menu navigasi" className="mobile-panel"><nav className="shell py-6" aria-label="Navigasi seluler">
        {navItems.map((item) => item.children ? <details className="mobile-nav-group" key={item.name} open={isItemActive(item)}><summary className={isItemActive(item) ? 'is-active' : undefined}>{item.name}<ChevronDown size={17} aria-hidden="true" /></summary><div>{item.children.map((child) => <Link onClick={closeMenu} aria-current={isCurrent(child.href) ? 'page' : undefined} key={`${child.href}-${child.name}`} href={child.href} className={`mobile-subnav-link ${isCurrent(child.href) ? 'is-active' : ''}`}>{child.name}</Link>)}</div></details> : <Link onClick={closeMenu} aria-current={isCurrent(item.href) ? 'page' : undefined} key={item.name} href={item.href} className={`mobile-nav-link ${isWithin(item.href) ? 'is-active' : ''}`}>{item.name}</Link>)}
        <div className="mt-6 grid gap-3 border-t border-white/10 pt-6"><Link onClick={closeMenu} href="/cari" className="cta-ghost"><Search size={18}/> Cari Informasi</Link><Link onClick={closeMenu} href="/donasi" className="cta-red"><Heart size={18}/> Cara Mendukung</Link></div>
      </nav></div> : null}
    </header>
  );
}
