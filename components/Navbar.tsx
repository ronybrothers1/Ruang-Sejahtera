"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Heart, Menu, Search, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { navItems } from '@/lib/navigation';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition ${scrolled ? 'border-neutral-200 bg-white/95 shadow-[0_6px_30px_rgba(0,0,0,.05)] backdrop-blur' : 'border-neutral-200/80 bg-white'}`}>
      <div className="shell flex h-20 items-center justify-between gap-6">
        <BrandLogo compact />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
          {navItems.map((item) => item.children ? (
            <details key={item.name} className="nav-details group relative">
              <summary className={`nav-link list-none ${isActive(item.href) ? 'nav-link-active' : ''}`}>
                {item.name}<ChevronDown size={14} aria-hidden="true" />
              </summary>
              <div className="absolute left-0 top-[calc(100%+10px)] min-w-56 rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl">
                {item.children.map((child) => (
                  <Link key={child.href} href={child.href} className="block rounded-xl px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-brand-red">
                    {child.name}
                  </Link>
                ))}
              </div>
            </details>
          ) : (
            <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? 'page' : undefined} className={`nav-link ${isActive(item.href) ? 'nav-link-active' : ''}`}>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/cari" className="icon-button" aria-label="Cari di website"><Search size={19} /></Link>
          <Link href="/donasi" className="button-primary"><Heart size={17} aria-hidden="true" />Donasi</Link>
        </div>

        <button
          type="button"
          className="icon-button lg:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen ? (
        <div id="mobile-navigation" className="fixed inset-x-0 top-20 bottom-0 overflow-y-auto border-t border-neutral-200 bg-white lg:hidden">
          <nav className="shell py-6" aria-label="Navigasi seluler">
            <div className="space-y-2">
              {navItems.map((item) => (
                <div key={item.name}>
                  <Link href={item.href} aria-current={isActive(item.href) ? 'page' : undefined} className={`mobile-nav-link ${isActive(item.href) ? 'bg-red-50 text-brand-red' : ''}`}>
                    {item.name}
                  </Link>
                  {item.children ? (
                    <div className="ml-4 border-l border-neutral-200 pl-3">
                      {item.children.map((child) => <Link key={child.href} href={child.href} className="mobile-subnav-link">{child.name}</Link>)}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-3 border-t border-neutral-200 pt-6 sm:grid-cols-2">
              <Link href="/cari" className="button-secondary"><Search size={18} />Cari Informasi</Link>
              <Link href="/donasi" className="button-primary"><Heart size={18} />Donasi</Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
