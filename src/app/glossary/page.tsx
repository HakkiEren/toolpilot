import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, SEO } from '@/lib/constants';
import { AdBanner, AdInArticle } from '@/components/ads/AdSlot';
import { generateBreadcrumbSchema, generateGlossarySchema, generateFAQSchema } from '@/lib/schema';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { EditorialBadge } from '@/components/common/EditorialBadge';
import { GLOSSARY_TERMS, groupTermsByCategory, groupTermsByLetter } from '@/lib/glossary-data';

// ============================================================
// GLOSSARY INDEX PAGE — Links to individual term pages
// Generates unique indexable content with internal links
// ============================================================

const glossaryTitle = `Software & Tech Glossary — Key Terms Explained | ${SITE_NAME}`;
const glossaryDescription = 'Comprehensive glossary of software, SaaS, AI, e-commerce, hosting, and marketing terms. Clear definitions for business and technology concepts.';

export const metadata: Metadata = {
  title: glossaryTitle,
  description: glossaryDescription,
  alternates: { canonical: `${SITE_URL}/glossary` },
  openGraph: {
    title: glossaryTitle,
    description: glossaryDescription,
    url: `${SITE_URL}/glossary`,
    siteName: SITE_NAME,
    type: 'article',
    locale: SEO.locale,
  },
  twitter: {
    card: 'summary_large_image',
    site: SEO.twitterHandle,
    title: glossaryTitle,
    description: glossaryDescription,
  },
};

export default function GlossaryPage() {
  const byCategory = groupTermsByCategory(GLOSSARY_TERMS);
  const byLetter = groupTermsByLetter(GLOSSARY_TERMS);
  const letters = Object.keys(byLetter).sort();
  const categories = Object.keys(byCategory).sort();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Glossary', url: '/glossary' },
  ]);
  const glossarySchema = generateGlossarySchema(GLOSSARY_TERMS);

  const glossaryFAQs = [
    { question: 'What is the ProPicked glossary?', answer: `Our glossary contains ${GLOSSARY_TERMS.length} definitions covering software, SaaS, AI, e-commerce, hosting, and marketing terminology. Each term is explained in plain language to help you understand the tools and technologies we review.` },
    { question: 'Who writes the glossary definitions?', answer: 'All definitions are written and reviewed by the ProPicked editorial team with expertise in software evaluation and digital technology. Definitions are updated regularly to reflect evolving industry terminology.' },
    { question: 'Can I suggest a term to add?', answer: 'Yes! If there\'s a term you\'d like us to define, reach out via our contact page. We regularly expand our glossary based on reader feedback and emerging technologies.' },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(glossarySchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(glossaryFAQs)) }} />

    <div className="max-w-4xl mx-auto px-4 py-12">
      <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'Glossary', url: '' }]} />
      <EditorialBadge lastUpdated={new Date().toISOString().split('T')[0]} />

      {/* Hero — Premium glassmorphism */}
      <div className="mt-6 mb-10">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/40 dark:from-gray-900 dark:via-cyan-950/10 dark:to-blue-950/10 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 p-8 md:p-10">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-400/10 dark:bg-cyan-400/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

          <div className="relative text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border border-gray-200/50 dark:border-gray-700/50 text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-4">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              {GLOSSARY_TERMS.length} Terms Defined
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
              <span className="gradient-text">Software & Tech Glossary</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Essential terms and definitions for understanding software tools,
              SaaS platforms, AI technology, and digital business.
            </p>
          </div>
        </div>
      </div>

      {/* A-Z Quick Navigation */}
      <div className="flex flex-wrap justify-center gap-1 mb-6">
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => {
          const hasTerms = byLetter[letter];
          return (
            <a
              key={letter}
              href={hasTerms ? `#letter-${letter}` : undefined}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                hasTerms
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer'
                  : 'bg-gray-50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600 cursor-default'
              }`}
            >
              {letter}
            </a>
          );
        })}
      </div>

      {/* Category quick links */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <a
            key={cat}
            href={`#${cat.toLowerCase().replace(/\s+/g, '-')}`}
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full text-sm font-medium hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm"
          >
            {cat} ({byCategory[cat].length})
          </a>
        ))}
      </div>

      {/* Ad: After category links */}
      <AdBanner />

      {/* Terms by category — now linking to individual pages */}
      <div className="space-y-12">
        {categories.map((cat) => (
          <section key={cat} id={cat.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
              {cat}
            </h2>
            <div className="space-y-4">
              {byCategory[cat].map((term) => (
                <Link
                  key={term.slug}
                  href={`/glossary/${term.slug}`}
                  className="group block p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-cyan-300 dark:hover:border-cyan-700 hover:shadow-sm transition-all scroll-mt-24"
                  id={`letter-${term.term[0].toUpperCase()}`}
                >
                  <h3 className="font-bold text-lg mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {term.term}
                    <span className="ml-2 text-xs font-normal text-gray-400 group-hover:text-cyan-500 transition-colors">
                      Read definition &#8594;
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                    {term.definition}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Alphabetical Index — A-Z */}
      <div className="mt-16 mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <span className="w-2 h-8 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full" />
          A-Z Index
        </h2>
        <div className="space-y-6">
          {letters.map((letter) => (
            <div key={letter} id={`letter-${letter}`} className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white font-black text-lg shadow-md">
                  {letter}
                </span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                {byLetter[letter].sort((a, b) => a.term.localeCompare(b.term)).map((term) => (
                  <Link
                    key={term.slug}
                    href={`/glossary/${term.slug}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors group"
                  >
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">{term.category}</span>
                    <span className="text-sm font-medium group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{term.term}</span>
                    <span className="ml-auto text-cyan-600 dark:text-cyan-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">&#8594;</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <section className="mt-12 mb-12">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {glossaryFAQs.map((faq, i) => (
            <details key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl group" open={i === 0}>
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-semibold text-gray-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                {faq.question}
                <span className="text-gray-400 dark:text-gray-500 group-open:rotate-180 transition-transform">&#9660;</span>
              </summary>
              <div className="px-6 pb-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Ad: Before CTA */}
      <AdInArticle />

      {/* Bottom CTA — Premium dark card */}
      <div className="mt-16 relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 rounded-2xl p-8 text-center text-white shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <h2 className="text-xl font-extrabold mb-2">Ready to Find the Right Tools?</h2>
          <p className="text-sm text-gray-300 mb-6">
            Now that you know the terminology, explore our tool comparisons and reviews.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/search"
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl text-sm font-bold hover:from-cyan-600 hover:to-blue-600 shadow-lg shadow-cyan-500/25 transition-all"
            >
              Search Tools
            </Link>
            <Link
              href="/ai-tools"
              className="px-6 py-2.5 bg-white/10 backdrop-blur-sm text-white border border-white/10 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors"
            >
              Browse AI Tools
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
