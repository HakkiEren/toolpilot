'use client';

import { useState } from 'react';
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

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-medium pr-4">{faq.question}</span>
        <span className={`text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
          {faq.answer}
        </div>
      )}
    </div>
  );
}
