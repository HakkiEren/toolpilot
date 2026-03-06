import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Terms of Service | ${SITE_NAME}`,
  description: `Terms of Service for ${SITE_NAME}. Read the terms and conditions that govern your use of our website.`,
  alternates: { canonical: `${SITE_URL}/terms` },
};

const SECTIONS = [
  {
    id: 'use',
    icon: '📋',
    title: '1. Use of Website',
    content: `${SITE_NAME} provides tool comparison information, reviews, and recommendations for informational purposes only. You may use the content for personal, non-commercial research and reference.`,
  },
  {
    id: 'accuracy',
    icon: '✅',
    title: '2. Accuracy of Information',
    content: `We strive to keep all tool information, pricing, and feature data accurate and up to date. However, we cannot guarantee that all information is complete, current, or error-free. Software companies may change their pricing, features, or availability at any time. Always verify information on the official website of the tool before making purchasing decisions.`,
  },
  {
    id: 'advice',
    icon: '⚖️',
    title: '3. Not Professional Advice',
    content: `The comparisons and recommendations on ${SITE_NAME} are not professional, financial, or legal advice. Our ratings reflect our editorial assessment and should be used as one of many factors in your decision-making process.`,
  },
  {
    id: 'affiliate',
    icon: '🔗',
    title: '4. Affiliate Links',
    content: `Some links on ${SITE_NAME} may be affiliate links. When you click on an affiliate link and make a purchase, we may receive a commission at no additional cost to you. This does not influence our reviews or ratings.`,
  },
  {
    id: 'ip',
    icon: '🛡️',
    title: '5. Intellectual Property',
    content: `All content on ${SITE_NAME}, including text, graphics, logos, and data compilations, is the property of ${SITE_NAME} and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.`,
  },
  {
    id: 'trademarks',
    icon: '™️',
    title: '6. Third-Party Trademarks',
    content: `Product names, logos, and brands mentioned on ${SITE_NAME} are the property of their respective owners. Their inclusion on our website does not imply endorsement or affiliation.`,
  },
  {
    id: 'liability',
    icon: '📄',
    title: '7. Limitation of Liability',
    content: `${SITE_NAME} shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of, or inability to use, our website or the information provided herein.`,
  },
  {
    id: 'changes',
    icon: '🔄',
    title: '8. Changes to These Terms',
    content: 'We reserve the right to modify these Terms of Service at any time. Changes become effective immediately upon posting. Continued use of the website constitutes acceptance of modified terms.',
  },
  {
    id: 'contact',
    icon: '✉️',
    title: '9. Contact',
    content: null, // Custom rendering below
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero — Premium glassmorphism */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/40 dark:from-gray-900 dark:via-purple-950/10 dark:to-pink-950/10 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 p-8 md:p-10 mb-12">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-pink-400/10 dark:bg-pink-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/80 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold mb-4 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Legal Agreement
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">Terms of Service</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Table of Contents */}
      <nav className="mb-12 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Table of Contents</h2>
        <div className="grid md:grid-cols-3 gap-2">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors py-1"
            >
              {section.title}
            </a>
          ))}
        </div>
      </nav>

      {/* Intro */}
      <div className="text-gray-600 dark:text-gray-300 leading-relaxed mb-10 text-base">
        Welcome to {SITE_NAME}. By accessing or using our website, you agree to be bound by these Terms of Service.
        If you do not agree to these terms, please do not use our website.
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {SECTIONS.map((section, idx) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-20 p-6 bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 card-animate"
            style={{ animationDelay: `${idx * 40}ms` }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{section.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{section.title}</h2>
                <div className="text-gray-600 dark:text-gray-300 leading-relaxed text-[15px]">
                  {section.content !== null ? (
                    <p>{section.content}</p>
                  ) : (
                    <p>
                      For questions about these terms, please <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">contact us</Link>.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Bottom nav */}
      <div className="mt-12 flex items-center justify-between text-sm text-gray-400">
        <Link href="/privacy" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Privacy Policy
        </Link>
        <Link href="/contact" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-1">
          Contact Us
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
