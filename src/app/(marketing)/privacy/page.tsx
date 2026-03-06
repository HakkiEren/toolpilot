import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description: `Privacy Policy for ${SITE_NAME}. Learn how we collect, use, and protect your personal information.`,
  alternates: { canonical: `${SITE_URL}/privacy` },
};

const SECTIONS = [
  {
    id: 'info-collect',
    title: '1. Information We Collect',
    content: (
      <>
        <p>We may collect the following types of information:</p>
        <ul className="list-none space-y-3 mt-4">
          {[
            { icon: '📊', label: 'Usage Data', desc: 'Pages visited, time spent, referral sources, device type, and browser information collected automatically via Google Analytics.' },
            { icon: '✉️', label: 'Contact Information', desc: 'Name and email address if you voluntarily submit them through our contact form.' },
            { icon: '🍪', label: 'Cookies', desc: 'Small text files stored on your device for analytics and advertising purposes.' },
          ].map((item) => (
            <li key={item.label} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div>
                <strong className="text-gray-900 dark:text-gray-100">{item.label}</strong>
                <span className="text-gray-600 dark:text-gray-400"> — {item.desc}</span>
              </div>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 'how-use',
    title: '2. How We Use Your Information',
    content: (
      <ul className="list-none space-y-2 mt-2">
        {[
          'To analyze website traffic and improve user experience',
          'To display relevant advertisements via Google AdSense',
          'To respond to inquiries submitted through our contact form',
          'To maintain the security and performance of our website',
        ].map((item) => (
          <li key={item} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'third-party',
    title: '3. Third-Party Services',
    content: (
      <>
        <p>We use the following third-party services:</p>
        <div className="grid md:grid-cols-3 gap-3 mt-4">
          {[
            { name: 'Google Analytics', desc: 'Website traffic analysis', link: 'https://policies.google.com/privacy' },
            { name: 'Google AdSense', desc: 'Contextual advertising', link: 'https://policies.google.com/privacy' },
            { name: 'Vercel', desc: 'Website hosting & delivery', link: 'https://vercel.com/legal/privacy-policy' },
          ].map((service) => (
            <div key={service.name} className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <h4 className="font-semibold text-sm mb-1">{service.name}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{service.desc}</p>
              <a href={service.link} className="text-xs text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                Privacy Policy ↗
              </a>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'cookies',
    title: '4. Cookies',
    content: (
      <p>
        Our website uses cookies for analytics and advertising. You can control cookie preferences
        through your browser settings. Disabling cookies may affect certain website functionality.
      </p>
    ),
  },
  {
    id: 'your-rights',
    title: '5. Your Rights',
    content: (
      <>
        <p>Depending on your location, you may have the right to:</p>
        <ul className="list-none space-y-2 mt-4">
          {[
            'Access the personal data we hold about you',
            'Request correction or deletion of your personal data',
            'Object to or restrict processing of your personal data',
            'Withdraw consent for data collection',
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <span className="w-5 h-5 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4">
          To exercise any of these rights, please <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">contact us</Link>.
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    title: '6. Data Retention',
    content: (
      <p>
        We retain personal data only for as long as necessary to fulfill the purposes outlined in this
        policy, unless a longer retention period is required by law.
      </p>
    ),
  },
  {
    id: 'children',
    title: '7. Children&apos;s Privacy',
    content: (
      <p>
        Our website is not intended for children under 13. We do not knowingly collect personal data from children.
      </p>
    ),
  },
  {
    id: 'changes',
    title: '8. Changes to This Policy',
    content: (
      <p>
        We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date.
      </p>
    ),
  },
  {
    id: 'contact',
    title: '9. Contact',
    content: (
      <p>
        If you have questions about this privacy policy, please <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">contact us</Link>.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero — Premium glassmorphism */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-900 dark:via-blue-950/10 dark:to-indigo-950/10 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 p-8 md:p-10 mb-12">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-indigo-400/10 dark:bg-indigo-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold mb-4 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Your Data, Protected
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">Privacy Policy</h1>
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
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1"
            >
              {section.title}
            </a>
          ))}
        </div>
      </nav>

      {/* Intro */}
      <div className="text-gray-600 dark:text-gray-300 leading-relaxed mb-10 text-base">
        {SITE_NAME} (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy and is committed
        to protecting your personal data. This privacy policy explains how we collect, use, and safeguard
        your information when you visit our website.
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {SECTIONS.map((section, idx) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-20 p-6 bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 card-animate"
            style={{ animationDelay: `${idx * 40}ms` }}
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{section.title}</h2>
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed text-[15px]">
              {section.content}
            </div>
          </section>
        ))}
      </div>

      {/* Bottom nav */}
      <div className="mt-12 flex items-center justify-between text-sm text-gray-400">
        <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Terms of Service
        </Link>
        <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
          Contact Us
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
