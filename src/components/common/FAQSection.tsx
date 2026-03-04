'use client';

import { useState, useRef, useEffect } from 'react';
import type { FAQ } from '@/types';

interface Props {
  faqs: FAQ[];
}

export function FAQSection({ faqs }: Props) {
  return (
    <div className="space-y-3">
      {faqs.map((faq, idx) => (
        <FAQItem key={idx} faq={faq} defaultOpen={idx === 0} />
      ))}
    </div>
  );
}

function FAQItem({ faq, defaultOpen }: { faq: FAQ; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen || false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(defaultOpen ? undefined : 0);

  useEffect(() => {
    if (isOpen) {
      const contentEl = contentRef.current;
      if (contentEl) {
        setHeight(contentEl.scrollHeight);
        // After transition, set to auto for dynamic content
        const timer = setTimeout(() => setHeight(undefined), 300);
        return () => clearTimeout(timer);
      }
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${
      isOpen
        ? 'border-blue-200 dark:border-blue-800/40 bg-blue-50/30 dark:bg-blue-900/5'
        : 'border-gray-200 dark:border-gray-700'
    }`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 md:p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-medium pr-4">{faq.question}</span>
        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
          isOpen
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 rotate-180'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
        }`}>
          &#9660;
        </span>
      </button>
      <div
        ref={contentRef}
        style={{ height: height !== undefined ? `${height}px` : 'auto' }}
        className="transition-[height] duration-300 ease-in-out overflow-hidden"
      >
        <div className="px-4 md:px-5 pb-4 md:pb-5 text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
          {faq.answer}
        </div>
      </div>
    </div>
  );
}
