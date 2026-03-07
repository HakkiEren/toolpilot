import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { generateBreadcrumbSchema } from '@/lib/schema';
import ContactForm from './contact-form';

export const metadata: Metadata = {
  title: `Contact Us — Get in Touch | ${SITE_NAME}`,
  description: `Contact the ${SITE_NAME} team. Submit tool suggestions, report inaccuracies, partnership inquiries, or ask questions. We typically respond within 24-48 hours.`,
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: `Contact Us — Get in Touch | ${SITE_NAME}`,
    description: `Contact the ${SITE_NAME} team. Submit tool suggestions, report inaccuracies, partnership inquiries, or ask questions.`,
    url: `${SITE_URL}/contact`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

const CONTACT_REASONS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    title: 'Report an Error',
    desc: 'Found outdated pricing or incorrect feature info? We fix reported errors within 24 hours.',
    color: 'text-red-500',
    gradient: 'from-red-100/80 to-red-50/80 dark:from-red-900/30 dark:to-red-800/20',
    iconBg: 'bg-red-500',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
    title: 'Suggest a Tool',
    desc: 'Know a tool that deserves to be on ProPicked? We are always expanding our database.',
    color: 'text-green-500',
    gradient: 'from-green-100/80 to-green-50/80 dark:from-green-900/30 dark:to-green-800/20',
    iconBg: 'bg-green-500',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
    title: 'Business & Partnerships',
    desc: 'Interested in advertising, sponsorship, or media partnerships? Let\'s talk.',
    color: 'text-blue-500',
    gradient: 'from-blue-100/80 to-blue-50/80 dark:from-blue-900/30 dark:to-blue-800/20',
    iconBg: 'bg-blue-500',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
    title: 'General Questions',
    desc: 'Anything else on your mind? We respond to all inquiries within 48 hours.',
    color: 'text-purple-500',
    gradient: 'from-purple-100/80 to-purple-50/80 dark:from-purple-900/30 dark:to-purple-800/20',
    iconBg: 'bg-purple-500',
  },
];

const FAQ_ITEMS = [
  { q: 'How quickly do you respond?', a: 'We aim to respond within 24-48 hours during business days. Error reports are prioritized and typically resolved within 24 hours.' },
  { q: 'Can I request a specific tool to be reviewed?', a: 'Absolutely! Use the "Suggest a Tool" option in the form. We prioritize tools based on community demand and market relevance.' },
  { q: 'Do you offer sponsored reviews?', a: 'No. All our reviews are independent and based on our evaluation methodology. We do not accept payment for favorable ratings.' },
  { q: 'How can I report outdated pricing?', a: 'Select "Report an Error" from the dropdown and include the tool name and correct pricing. We verify and update within 24 hours.' },
];

export default function ContactPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Contact', url: '/contact' },
  ]);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {/* Hero — Premium glassmorphism */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/40 dark:from-gray-900 dark:via-emerald-950/10 dark:to-cyan-950/10 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 p-8 md:p-12 mb-12 text-center">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-400/10 dark:bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-cyan-400/10 dark:bg-cyan-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-6 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-800/50">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            We&apos;d Love to Hear From You
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            <span className="gradient-text">Get in Touch</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Have a question, found an error, or want to suggest a tool?
            We would love to hear from you.
          </p>
        </div>
      </div>

      {/* Contact Reasons — Glassmorphism cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-12">
        {CONTACT_REASONS.map((reason, idx) => (
          <div key={reason.title} className={`p-6 bg-gradient-to-r ${reason.gradient} backdrop-blur-sm rounded-2xl border border-white/50 dark:border-gray-700/50 shadow-sm hover-lift transition-all card-animate`} style={{ animationDelay: `${idx * 80}ms` }}>
            <div className={`w-10 h-10 rounded-xl ${reason.iconBg} text-white flex items-center justify-center mb-3 shadow-md`}>{reason.icon}</div>
            <h2 className="text-lg font-semibold mb-1">{reason.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{reason.desc}</p>
          </div>
        ))}
      </div>

      {/* Form Section */}
      <div className="grid lg:grid-cols-5 gap-8 mb-16">
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Info — Premium card */}
          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">Quick Info</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-sm text-gray-500">hello@propicked.com</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4.5 h-4.5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium">Response Time</div>
                  <div className="text-sm text-gray-500">24-48 hours</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium">Coverage</div>
                  <div className="text-sm text-gray-500">Global, English-language</div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links — Premium card */}
          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">Follow Us</h3>
            <div className="space-y-2">
              <a href="https://twitter.com/propicked" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2.5 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 transition-all -mx-2.5">
                <div className="w-9 h-9 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white dark:text-gray-900" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </div>
                <span className="font-medium">@propicked on X</span>
              </a>
              <a href="https://linkedin.com/company/propicked" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2.5 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600 dark:hover:text-blue-400 transition-all -mx-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </div>
                <span className="font-medium">LinkedIn</span>
              </a>
              <a href="https://youtube.com/@propicked" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2.5 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 transition-all -mx-2.5">
                <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </div>
                <span className="font-medium">YouTube</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ — Premium accordion */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Quick answers to common inquiries</p>
        </div>
        <div className="space-y-3 max-w-3xl mx-auto">
          {FAQ_ITEMS.map((faq, idx) => (
            <details key={faq.q} className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-blue-300 dark:hover:border-blue-700 transition-all card-animate" style={{ animationDelay: `${idx * 60}ms` }}>
              <summary className="flex items-center justify-between p-5 cursor-pointer font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <span className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold flex-shrink-0">Q</span>
                  {faq.q}
                </span>
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 pl-16 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA — Dark premium */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-emerald-950 rounded-3xl p-8 text-center text-white shadow-xl">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="relative">
          <h2 className="text-xl font-bold mb-2">Prefer Browsing?</h2>
          <p className="text-sm text-white/60 mb-6 max-w-lg mx-auto">
            Explore our tools and comparisons to find exactly what you need.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/search" className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all hover:scale-105">
              Search Tools
            </Link>
            <Link href="/blog" className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all">
              Read Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
