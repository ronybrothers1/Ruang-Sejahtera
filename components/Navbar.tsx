"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Heart, Menu, MessageCircle, Search, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { navItems, type NavItem } from '@/lib/navigation';

function menuId(name: string) {
  return `nav-menu-${name.toLocaleLowerCase('id-ID').replace(/[^a-z0-9]+/g, '-')}`;
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  const [mobileMenuPathname, setMobileMenuPathname] = useState('');
  const [desktopMenuPathname, setDesktopMenuPathname] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const desktopTriggerRefs = useRef(new Map<string, HTMLButtonElement>());
  const pathname = usePathname();
  const mobileMenuOpen = isOpen && mobileMenuPathname === pathname;
  const activeDesktopMenu = desktopMenuPathname === pathname ? openDesktopMenu : null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const updateHash = () => setActiveHash(window.location.hash);
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, [pathname]);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1121px)');
    const closeDrawerOnDesktop = () => {
      if (desktopQuery.matches) setIsOpen(false);
    };
    closeDrawerOnDesktop();
    desktopQuery.addEventListener('change', closeDrawerOnDesktop);
    return () => desktopQuery.removeEventListener('change', closeDrawerOnDesktop);
  }, []);

  useEffect(() => {
    if (!activeDesktopMenu) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const trigger = desktopTriggerRefs.current.get(activeDesktopMenu);
      const popover = document.getElementById(menuId(activeDesktopMenu));
      if (!trigger?.contains(target) && !popover?.contains(target)) setOpenDesktopMenu(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const trigger = desktopTriggerRefs.current.get(activeDesktopMenu);
      setOpenDesktopMenu(null);
      requestAnimationFrame(() => trigger?.focus());
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [activeDesktopMenu]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const root = document.documentElement;
    const previousRootOverflow = root.style.overflow;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    root.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    const panel = mobilePanelRef.current;
    const getFocusable = () => Array.from(panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), summary') ?? [])
      .filter((element) => element.getClientRects().length > 0);
    getFocusable()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }
      if (event.key !== 'Tab') return;
      const focusables = getFocusable();
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      root.style.overflow = previousRootOverflow;
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileMenuOpen]);

  const closeMenu = () => setIsOpen(false);
  const isWithin = (href: string) => {
    const path = href.split('#')[0];
    return path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`);
  };
  const isCurrent = (href: string) => {
    const [path, hash] = href.split('#');
    if (pathname !== path) return false;
    if (hash) return activeHash === `#${hash}`;
    const hasHashAlternative = navItems.some((item) => item.children?.some((child) => child.href.startsWith(`${path}#`)));
    return !hasHashAlternative || !activeHash;
  };
  const isItemActive = (item: NavItem) => isWithin(item.href) || Boolean(item.children?.some((child) => isWithin(child.href)));

  const openDesktopDropdown = (item: NavItem, focusFirst = false) => {
    setDesktopMenuPathname(pathname);
    setOpenDesktopMenu(item.name);
    if (focusFirst) {
      requestAnimationFrame(() => document.querySelector<HTMLAnchorElement>(`#${menuId(item.name)} a`)?.focus());
    }
  };

  const handleDesktopTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, item: NavItem) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openDesktopDropdown(item, true);
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpenDesktopMenu(null);
    }
  };

  const handlePopoverKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const links = Array.from(event.currentTarget.querySelectorAll<HTMLAnchorElement>('a'));
    if (!links.length) return;
    event.preventDefault();
    const currentIndex = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (event.key === 'Home') links[0].focus();
    else if (event.key === 'End') links[links.length - 1].focus();
    else if (event.key === 'ArrowDown') links[(currentIndex + 1 + links.length) % links.length].focus();
    else links[(currentIndex - 1 + links.length) % links.length].focus();
  };

  const mobileNavigation = mobileMenuOpen ? createPortal(
    <div ref={mobilePanelRef} id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Menu navigasi" className="mobile-panel">
      <nav className="shell py-6" aria-label="Navigasi seluler">
        {navItems.map((item) => item.children ? (
          <details name="mobile-primary-navigation" className="mobile-nav-group" key={item.name} open={openMobileGroup === item.name}>
            <summary
              className={isItemActive(item) ? 'is-active' : undefined}
              onClick={(event) => {
                event.preventDefault();
                setOpenMobileGroup((current) => current === item.name ? null : item.name);
              }}
            >
              {item.name}<ChevronDown size={17} aria-hidden="true" />
            </summary>
            <div>{item.children.map((child) => <Link onClick={closeMenu} aria-current={isCurrent(child.href) ? 'page' : undefined} key={`${child.href}-${child.name}`} href={child.href} className={`mobile-subnav-link ${isCurrent(child.href) ? 'is-active' : ''}`}>{child.name}</Link>)}</div>
          </details>
        ) : (
          <Link onClick={closeMenu} aria-current={isCurrent(item.href) ? 'page' : undefined} key={item.name} href={item.href} className={`mobile-nav-link ${isWithin(item.href) ? 'is-active' : ''}`}>{item.name}</Link>
        ))}
        <div className="mobile-nav-utilities">
          <Link onClick={closeMenu} href="/cari" aria-current={isCurrent('/cari') ? 'page' : undefined} className={`cta-ghost ${isCurrent('/cari') ? 'is-current' : ''}`}><Search size={18} aria-hidden="true" /> Cari Informasi</Link>
          <Link onClick={closeMenu} href="/kontak" aria-current={isCurrent('/kontak') ? 'page' : undefined} className={`cta-ghost ${isCurrent('/kontak') ? 'is-current' : ''}`}><MessageCircle size={18} aria-hidden="true" /> Kontak Yayasan</Link>
          <Link onClick={closeMenu} href="/donasi" aria-current={isCurrent('/donasi') ? 'page' : undefined} className={`cta-red ${isCurrent('/donasi') ? 'is-current' : ''}`}><Heart size={18} aria-hidden="true" /> Cara Mendukung</Link>
        </div>
      </nav>
    </div>,
    document.body,
  ) : null;

  return (
    <>
      <header className={`nav-shell ${scrolled ? 'scrolled' : ''}`}>
        <div className="shell nav-inner">
        <BrandLogo compact priority />
        <nav className="desktop-navigation" aria-label="Navigasi utama">
          {navItems.map((item) => item.children ? (
            <div key={item.name} className="nav-dropdown">
              <button
                ref={(node) => {
                  if (node) desktopTriggerRefs.current.set(item.name, node);
                  else desktopTriggerRefs.current.delete(item.name);
                }}
                type="button"
                aria-expanded={activeDesktopMenu === item.name}
                aria-controls={menuId(item.name)}
                className={`nav-link ${isItemActive(item) ? 'nav-link-active' : ''}`}
                onClick={() => {
                  setDesktopMenuPathname(pathname);
                  setOpenDesktopMenu((current) => current === item.name ? null : item.name);
                }}
                onKeyDown={(event) => handleDesktopTriggerKeyDown(event, item)}
              >
                {item.name}<ChevronDown size={14} aria-hidden="true" />
              </button>
              {activeDesktopMenu === item.name ? (
                <div id={menuId(item.name)} className="nav-popover" onKeyDown={handlePopoverKeyDown}>
                  {item.children.map((child) => (
                    <Link
                      onClick={() => setOpenDesktopMenu(null)}
                      key={`${child.href}-${child.name}`}
                      aria-current={isCurrent(child.href) ? 'page' : undefined}
                      className={isCurrent(child.href) ? 'is-active' : undefined}
                      href={child.href}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <Link key={item.href} href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined} className={`nav-link ${isWithin(item.href) ? 'nav-link-active' : ''}`}>{item.name}</Link>
          ))}
        </nav>
        <div className="desktop-navigation-action">
          <Link href="/cari" aria-label="Cari informasi" aria-current={isCurrent('/cari') ? 'page' : undefined} className={`nav-search-link ${isCurrent('/cari') ? 'is-active' : ''}`}><Search size={18} aria-hidden="true" /></Link>
          <Link href="/donasi" aria-current={isCurrent('/donasi') ? 'page' : undefined} className={`cta-red ${isCurrent('/donasi') ? 'is-current' : ''}`}><Heart size={16} fill="currentColor" aria-hidden="true" /> Cara Mendukung</Link>
        </div>
        <button
          ref={menuButtonRef}
          type="button"
          className="icon-button nav-menu-toggle"
          onClick={() => {
            setOpenDesktopMenu(null);
            if (mobileMenuOpen) {
              setIsOpen(false);
            } else {
              setMobileMenuPathname(pathname);
              setOpenMobileGroup(navItems.find((item) => item.children && isItemActive(item))?.name ?? null);
              setIsOpen(true);
            }
          }}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
        >
          {mobileMenuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
        </div>
      </header>
      {mobileNavigation}
    </>
  );
}
