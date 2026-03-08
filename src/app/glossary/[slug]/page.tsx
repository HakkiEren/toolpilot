import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE_NAME, SITE_URL, SEO, CATEGORY_LIST } from '@/lib/constants';
import { generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { AdBanner, AdInArticle } from '@/components/ads/AdSlot';
import {
  GLOSSARY_TERMS,
  getGlossaryTermBySlug,
  getAllGlossaryTermSlugs,
  getRelatedGlossaryTerms,
  type GlossaryTerm,
} from '@/lib/glossary-data';

// ============================================================
// INDIVIDUAL GLOSSARY TERM PAGE
// Targets "what is [term]" long-tail search queries
// ============================================================

export const revalidate = 86400; // 24h — content rarely changes

export function generateStaticParams() {
  return getAllGlossaryTermSlugs().map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = getGlossaryTermBySlug(slug);
  if (!term) return {};

  const title = `What is ${term.term}? Definition & Guide | ${SITE_NAME}`;
  const description = `${term.definition} Learn how ${term.term.replace(/\([^)]*\)/g, '').trim()} works and why it matters for choosing the right ${term.category.toLowerCase()} tools.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/glossary/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/glossary/${slug}`,
      type: 'article',
      locale: SEO.locale,
      siteName: SITE_NAME,
      section: term.category,
      tags: [term.term, term.category, 'definition', 'glossary'],
    },
    twitter: {
      card: 'summary_large_image',
      site: SEO.twitterHandle,
      title,
      description,
    },
  };
}

// Get terms from the same category (excluding current)
function getSameCategoryTerms(current: GlossaryTerm): GlossaryTerm[] {
  return GLOSSARY_TERMS.filter(
    (t) => t.category === current.category && t.slug !== current.slug
  ).slice(0, 6);
}

export default async function GlossaryTermPage({ params }: PageProps) {
  const { slug } = await params;
  const term = getGlossaryTermBySlug(slug);
  if (!term) notFound();

  const relatedTerms = term.relatedTerms ? getRelatedGlossaryTerms(term.relatedTerms) : [];
  const sameCategoryTerms = getSameCategoryTerms(term);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Glossary', url: '/glossary' },
    { name: term.term, url: `/glossary/${term.slug}` },
  ]);

  // FAQ schema for the term
  const faqs = [
    {
      question: `What is ${term.term}?`,
      answer: term.extendedDefinition,
    },
    {
      question: `Why is ${term.term.replace(/\([^)]*\)/g, '').trim()} important?`,
      answer: `Understanding ${term.term.replace(/\([^)]*\)/g, '').trim()} is essential for evaluating ${term.category.toLowerCase()} tools and making informed technology decisions. It helps businesses choose the right solutions, optimize costs, and stay competitive in their industry.`,
    },
  ];
  const faqSchema = generateFAQSchema(faqs);

  // DefinedTerm schema
  const definedTermSchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.term,
    description: term.extendedDefinition,
    url: `${SITE_URL}/glossary/${term.slug}`,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: `${SITE_NAME} Glossary`,
      url: `${SITE_URL}/glossary`,
    },
  };

  // Find category info for the link
  const catInfo = CATEGORY_LIST.find((c) => c.slug === term.categorySlug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <div className="max-w-3xl mx-auto px-4 py-12">
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: 'Glossary', url: '/glossary' },
          { name: term.term, url: '' },
        ]} />

        {/* Hero */}
        <div className="mt-6 mb-10">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/40 dark:from-gray-900 dark:via-cyan-950/10 dark:to-blue-950/10 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 p-8 md:p-10">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-400/10 dark:bg-cyan-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Link
                  href="/glossary"
                  className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-100/80 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-200/80 transition-colors"
                >
                  Glossary
                </Link>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                  {term.category}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                What is {term.term}?
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed" data-speakable>
                {term.definition}
              </p>
            </div>
          </div>
        </div>

        {/* Extended Definition */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Understanding {term.term.replace(/\([^)]*\)/g, '').trim()}</h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[15px]">
              {term.extendedDefinition}
            </p>
          </div>
        </section>

        {/* Quick Fact Card */}
        <div className="mb-10 p-5 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">💡</span>
            <div>
              <h3 className="font-bold text-sm mb-1">Quick Summary</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>{term.term}</strong> falls under the <strong>{term.category}</strong> category.
                {term.relatedLink && (
                  <> Explore related tools in our <Link href={term.relatedLink} className="text-blue-600 hover:underline font-medium">{term.relatedLabel || `${term.category} section`}</Link>.</>
                )}
              </p>
            </div>
          </div>
        </div>

        <AdBanner />

        {/* FAQ Section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl group" open={i === 0}>
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-sm text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {faq.question}
                  <span className="text-gray-400 dark:text-gray-500 group-open:rotate-180 transition-transform ml-2">&#9660;</span>
                </summary>
                <div className="px-5 pb-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Related Terms */}
        {relatedTerms.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">Related Terms</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {relatedTerms.map((rt) => (
                <Link
                  key={rt.slug}
                  href={`/glossary/${rt.slug}`}
                  className="group p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all"
                >
                  <h3 className="font-semibold text-sm group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors mb-1">
                    {rt.term}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {rt.definition}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <AdInArticle />

        {/* More Terms in Same Category */}
        {sameCategoryTerms.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">More {term.category} Terms</h2>
            <div className="flex flex-wrap gap-2">
              {sameCategoryTerms.map((st) => (
                <Link
                  key={st.slug}
                  href={`/glossary/${st.slug}`}
                  className="px-3.5 py-1.5 bg-gray-50 dark:bg-gray-800/60 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors border border-gray-200/50 dark:border-gray-700/50"
                >
                  {st.term}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Explore Category CTA */}
        {catInfo && (
          <section className="mb-10">
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white">
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <h2 className="text-lg font-bold mb-2">Explore {catInfo.name}</h2>
                <p className="text-sm text-gray-300 mb-4">
                  Now that you understand {term.term.replace(/\([^)]*\)/g, '').trim()}, explore the best tools in this category.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/${catInfo.slug}`}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-sm font-bold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/20"
                  >
                    Browse {catInfo.name}
                  </Link>
                  <Link
                    href={`/${catInfo.slug}/compare`}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
                  >
                    Compare Tools
                  </Link>
                  <Link
                    href="/glossary"
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
                  >
                    Full Glossary
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Freshness Signal */}
        <div className="flex items-center gap-2 text-xs text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-800">
          <span>📅</span>
          <span>Last reviewed: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
          <span className="mx-1">·</span>
          <span>By {SITE_NAME} Editorial Team</span>
        </div>
      </div>
    </>
  );
}
