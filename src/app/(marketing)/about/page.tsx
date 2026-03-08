import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, CATEGORY_LIST, SEO } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { generateBreadcrumbSchema } from '@/lib/schema';

const aboutTitle = `About Us — Our Mission & Methodology | ${SITE_NAME}`;
const aboutDescription = `Learn about ${SITE_NAME} — our mission to help businesses find the right digital tools through unbiased, data-driven comparisons and honest reviews across 6 categories.`;

export const metadata: Metadata = {
  title: aboutTitle,
  description: aboutDescription,
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: aboutTitle,
    description: aboutDescription,
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    type: 'website',
    locale: SEO.locale,
  },
  twitter: {
    card: 'summary_large_image',
    site: SEO.twitterHandle,
    title: aboutTitle,
    description: aboutDescription,
  },
};

export const revalidate = 3600;

async function getStats() {
  const [
    { count: toolCount },
    { count: comparisonCount },
    { count: blogCount },
  ] = await Promise.all([
    supabase.from('tools').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('comparisons').select('id', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
  ]);
  return {
    tools: toolCount || 0,
    comparisons: comparisonCount || 0,
    blogs: blogCount || 0,
    categories: CATEGORY_LIST.length,
  };
}

const TEAM = [
  { name: 'Alex Chen', role: 'Founder & Editor-in-Chief', bio: 'Former software engineer at Google, passionate about helping teams find the right tools.' },
  { name: 'Sarah Mitchell', role: 'Head of Research', bio: '10+ years in SaaS industry analysis. Previously at Gartner and Forrester.' },
  { name: 'David Park', role: 'Technical Writer', bio: 'Full-stack developer turned tech writer. Specializes in AI and developer tools.' },
  { name: 'Maria Rodriguez', role: 'Marketing Analyst', bio: 'Digital marketing veteran. Expert in email, SEO, and marketing automation platforms.' },
];

const VALUES = [
  { icon: '🎯', title: 'Independence First', desc: 'We are not owned or sponsored by any software vendor. Our reviews are based on real usage and objective criteria.', gradient: 'from-blue-100/80 to-blue-50/80 dark:from-blue-900/30 dark:to-blue-800/20' },
  { icon: '📊', title: 'Data-Driven', desc: 'Every rating is backed by a structured methodology. We analyze features, pricing, support quality, and real user feedback.', gradient: 'from-purple-100/80 to-purple-50/80 dark:from-purple-900/30 dark:to-purple-800/20' },
  { icon: '🔄', title: 'Always Current', desc: 'Our database is updated weekly. Pricing changes, new features, and sunset tools are tracked in real-time.', gradient: 'from-green-100/80 to-green-50/80 dark:from-green-900/30 dark:to-green-800/20' },
  { icon: '🤝', title: 'Community Input', desc: 'We listen to our readers. Tool suggestions, error reports, and feedback directly shape our coverage priorities.', gradient: 'from-orange-100/80 to-orange-50/80 dark:from-orange-900/30 dark:to-orange-800/20' },
];

const METHODOLOGY_STEPS = [
  { step: '01', title: 'Research & Discovery', desc: 'We identify tools through market analysis, user requests, and industry trends. Every tool must meet our minimum quality threshold.', color: 'from-blue-500 to-cyan-500' },
  { step: '02', title: 'Hands-On Testing', desc: 'Our team signs up, tests core features, evaluates onboarding, and documents the user experience firsthand.', color: 'from-cyan-500 to-teal-500' },
  { step: '03', title: 'Feature Mapping', desc: 'We create structured feature matrices comparing each tool against competitors in the same category.', color: 'from-teal-500 to-green-500' },
  { step: '04', title: 'Pricing Verification', desc: 'Pricing is sourced directly from official websites and verified monthly. We flag hidden costs and gotchas.', color: 'from-green-500 to-emerald-500' },
  { step: '05', title: 'Rating & Scoring', desc: 'Tools are scored across 5 dimensions: Features, Ease of Use, Pricing, Support, and Value. Each dimension is weighted equally.', color: 'from-emerald-500 to-blue-500' },
  { step: '06', title: 'Peer Review', desc: 'Every review is cross-checked by at least one other team member before publication to ensure accuracy and fairness.', color: 'from-blue-500 to-purple-500' },
];

const RATING_DIMENSIONS = [
  { name: 'Features', desc: 'Core functionality, integrations, API access, customization options.', icon: '⚡', color: 'bg-blue-500' },
  { name: 'Ease of Use', desc: 'Onboarding experience, UI design, learning curve, documentation quality.', icon: '✨', color: 'bg-purple-500' },
  { name: 'Pricing', desc: 'Affordability, plan flexibility, free tier availability, price-to-feature ratio.', icon: '💰', color: 'bg-green-500' },
  { name: 'Customer Support', desc: 'Response times, support channels, community resources, SLA guarantees.', icon: '🛟', color: 'bg-orange-500' },
  { name: 'Value for Money', desc: 'Overall bang for buck compared to alternatives in the same category.', icon: '🏆', color: 'bg-red-500' },
];

export default async function AboutPage() {
  const stats = await getStats();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'About', url: `${SITE_URL}/about` },
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Hero — Premium glassmorphism */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/20 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 p-8 md:p-12 mb-16 text-center">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold mb-6 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Our Story
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            About <span className="gradient-text">{SITE_NAME}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We help businesses and professionals cut through the noise and find the perfect digital tools —
            with unbiased, data-driven comparisons you can trust.
          </p>
        </div>
      </div>

      {/* Stats Bar — Glassmorphism pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {[
          { label: 'Tools Reviewed', value: `${stats.tools}+`, color: 'text-blue-600 dark:text-blue-400', bg: 'from-blue-100/80 to-blue-50/80 dark:from-blue-900/30 dark:to-blue-800/20' },
          { label: 'Comparisons', value: `${stats.comparisons}+`, color: 'text-purple-600 dark:text-purple-400', bg: 'from-purple-100/80 to-purple-50/80 dark:from-purple-900/30 dark:to-purple-800/20' },
          { label: 'Blog Articles', value: `${stats.blogs}+`, color: 'text-green-600 dark:text-green-400', bg: 'from-green-100/80 to-green-50/80 dark:from-green-900/30 dark:to-green-800/20' },
          { label: 'Categories', value: stats.categories.toString(), color: 'text-orange-600 dark:text-orange-400', bg: 'from-orange-100/80 to-orange-50/80 dark:from-orange-900/30 dark:to-orange-800/20' },
        ].map((s, idx) => (
          <div key={s.label} className={`text-center p-6 bg-gradient-to-r ${s.bg} backdrop-blur-sm rounded-2xl border border-white/50 dark:border-gray-700/50 shadow-sm card-animate`} style={{ animationDelay: `${idx * 80}ms` }}>
            <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Our Mission — Premium glassmorphism card */}
      <section className="mb-16">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white shadow-xl">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-300/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              The software market is overwhelming. With tens of thousands of tools available across
              every category imaginable, choosing the right one can take days — sometimes weeks — of research.
              Marketing pages promise the world, but the reality often falls short.
            </p>
            <p className="text-white/80 leading-relaxed">
              We built {SITE_NAME} to solve this problem. Our platform provides structured, side-by-side
              comparisons with verified pricing, genuine feature analysis, and honest recommendations.
              Whether you are a solo entrepreneur picking your first CRM or a CTO evaluating enterprise
              hosting providers, we give you the data you need to make a confident decision.
            </p>
          </div>
        </div>
      </section>

      {/* Values — Gradient cards */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What We Stand For</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Core values that drive every review we publish</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {VALUES.map((v, idx) => (
            <div key={v.title} className={`p-6 bg-gradient-to-r ${v.gradient} backdrop-blur-sm rounded-2xl border border-white/50 dark:border-gray-700/50 shadow-sm hover-lift card-animate`} style={{ animationDelay: `${idx * 80}ms` }}>
              <div className="text-3xl mb-3">{v.icon}</div>
              <h3 className="text-lg font-bold mb-2">{v.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How We Review — Timeline-style */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Our Review Methodology</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
            Every tool on {SITE_NAME} goes through a rigorous 6-step evaluation process
            before earning its place in our database.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {METHODOLOGY_STEPS.map((m, idx) => (
            <div key={m.step} className="group relative p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all card-animate" style={{ animationDelay: `${idx * 60}ms` }}>
              {/* Gradient step number */}
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} text-white font-bold text-sm mb-4 shadow-md`}>
                {m.step}
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{m.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Rating Dimensions — Premium horizontal cards */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">5 Rating Dimensions</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Each dimension is weighted equally at 20%</p>
        </div>
        <div className="space-y-3">
          {RATING_DIMENSIONS.map((d, idx) => (
            <div key={d.name} className="flex items-start gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all card-animate" style={{ animationDelay: `${idx * 60}ms` }}>
              <div className={`w-12 h-12 rounded-xl ${d.color} flex items-center justify-center text-xl flex-shrink-0 shadow-md`}>
                {d.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">{d.name}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">20% weight</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{d.desc}</p>
                <div className="mt-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-full rounded-full ${d.color} score-bar-animated`} style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team — Premium cards with gradient avatars */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Meet the Team</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            The humans behind every review.{' '}
            <Link href="/about/team" className="text-blue-600 hover:underline font-medium">
              View full team &rarr;
            </Link>
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {TEAM.map((member, idx) => (
            <div key={member.name} className="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all card-animate" style={{ animationDelay: `${idx * 80}ms` }}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white font-bold text-lg">{member.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">{member.role}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How We Make Money — Transparency section */}
      <section className="mb-16">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-amber-50/30 to-yellow-50/40 dark:from-gray-900 dark:via-amber-950/10 dark:to-yellow-950/10 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 p-8 md:p-12">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-400/10 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-yellow-400/10 dark:bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-4">
              💡 Full Transparency
            </div>
            <h2 className="text-2xl font-bold mb-4">How We Make Money</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Transparency is core to our DNA. {SITE_NAME} earns revenue through two channels:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="p-5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-gray-700/50">
                <div className="text-2xl mb-2">📺</div>
                <h3 className="font-semibold mb-2">Display Advertising</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  We show non-intrusive ads via Google AdSense. These are contextual and
                  never interfere with your reading experience.
                </p>
              </div>
              <div className="p-5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-gray-700/50">
                <div className="text-2xl mb-2">🤝</div>
                <h3 className="font-semibold mb-2">Affiliate Partnerships</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Some links earn us a commission at no extra cost to you. This never influences
                  our ratings — tools with affiliate programs get the same honest evaluation.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">
              We clearly disclose affiliate relationships wherever they exist. Our editorial team
              operates independently from our business team. Read our full{' '}
              <Link href="/editorial-policy" className="text-blue-500 hover:underline">
                editorial policy &amp; review guidelines
              </Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Categories We Cover */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Categories We Cover</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{CATEGORY_LIST.length} verticals, thousands of tools</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORY_LIST.map((cat, idx) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all text-center card-animate"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div
                className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center text-xl shadow-md transition-transform group-hover:scale-110"
                style={{ backgroundColor: cat.color }}
              >
                <span className="text-white">
                  {cat.icon === 'brain' ? '🧠' : cat.icon === 'cloud' ? '☁️' : cat.icon === 'shopping-cart' ? '🛒' : cat.icon === 'megaphone' ? '📣' : cat.icon === 'server' ? '🖥️' : '💼'}
                </span>
              </div>
              <h3 className="font-semibold text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{cat.name}</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA — Dark premium */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 rounded-3xl p-10 text-center text-white shadow-xl">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="relative">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Find Your Perfect Tool?</h2>
          <p className="text-white/60 mb-8 max-w-lg mx-auto">
            Browse {stats.tools}+ tool reviews, {stats.comparisons}+ side-by-side comparisons, and expert guides.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/search" className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all hover:scale-105">
              Search Tools
            </Link>
            <Link href="/contact" className="px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all">
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
