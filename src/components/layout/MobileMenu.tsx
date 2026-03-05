'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const NAV_LINKS = [
  { href: '/ai-tools', label: 'AI Tools', emoji: '🤖' },
  { href: '/saas', label: 'SaaS', emoji: '☁️' },
  { href: '/ecommerce', label: 'E-commerce', emoji: '🛒' },
  { href: '/marketing', label: 'Marketing', emoji: '📢' },
  { href: '/hosting', label: 'Hosting', emoji: '🖥️' },
  { href: '/business', label: 'Business', emoji: '💼' },
  { href: '/best', label: 'Best Of', emoji: '🏆' },
  { href: '/blog', label: 'Blog', emoji: '📝' },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <div className="md:hidden flex items-center gap-2">
      {/* Search icon */}
      <Link
        href="/search"
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Search"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </Link>

      <ThemeToggle />

      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        <div className="w-5 h-5 relative">
          <span
            className={`absolute left-0 w-5 h-0.5 bg-current transition-all duration-300 ${
              isOpen ? 'top-2.5 rotate-45' : 'top-1'
            }`}
          />
          <span
            className={`absolute left-0 top-2.5 w-5 h-0.5 bg-current transition-all duration-300 ${
              isOpen ? 'opacity-0 translate-x-2' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute left-0 w-5 h-0.5 bg-current transition-all duration-300 ${
              isOpen ? 'top-2.5 -rotate-45' : 'top-4'
            }`}
          />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 dark:bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Slide-down menu */}
      <nav
        className={`fixed top-16 left-0 right-0 z-50 transition-all duration-300 ${
          isOpen
            ? 'translate-y-0 opacity-100'
            : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="glass border-b border-gray-200/50 dark:border-gray-800/50 shadow-xl mx-2 rounded-2xl overflow-hidden">
          <div className="p-4">
            <div className="flex flex-col gap-0.5">
              {NAV_LINKS.map((link, idx) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all"
                  style={{
                    transitionDelay: isOpen ? `${idx * 30}ms` : '0ms',
                  }}
                >
                  <span className="text-base">{link.emoji}</span>
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-200/50 dark:border-gray-700/50 mt-3 pt-3 flex gap-4 px-4">
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/privacy"
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
