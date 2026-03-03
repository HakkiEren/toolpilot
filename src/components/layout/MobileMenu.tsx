'use client';

import { useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '/ai-tools', label: 'AI Tools' },
  { href: '/saas', label: 'SaaS' },
  { href: '/ecommerce', label: 'E-commerce' },
  { href: '/marketing', label: 'Marketing' },
  { href: '/hosting', label: 'Hosting' },
  { href: '/business', label: 'Business' },
  { href: '/blog', label: 'Blog' },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
            onClick={() => setIsOpen(false)}
          />
          <nav className="fixed top-16 left-0 right-0 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 mt-3 pt-3 flex gap-2">
                <Link
                  href="/about"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 text-xs text-gray-500 hover:text-blue-600"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 text-xs text-gray-500 hover:text-blue-600"
                >
                  Contact
                </Link>
              </div>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
