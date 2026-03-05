import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, CATEGORY_LIST } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

export const metadata: Metadata = {
  title: `About Us — Our Mission & Methodology | ${SITE_NAME}`,
  description: `Learn about ${SITE_NAME} — our mission to help businesses find the right digital tools through unbiased, data-driven comparisons and honest reviews across 6 categories.`,
  alternates: { canonical: `${SITE_URL}/about` },
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
  { icon: '🎯', title: 'Independence First', desc: 'We are not owned or sponsored by any software vendor. Our reviews are based on real usage and objective criteria.' },
  { icon: '📊', title: 'Data-Driven', desc: 'Every rating is backed by a structured methodology. We analyze features, pricing, support quality, and real user feedback.' },
  { icon: '🔄', title: 'Always Current', desc: 'Our database is updated weekly. Pricing changes, new features, and sunset tools are tracked in real-time.' },
  { icon: '🤝', title: 'Community Input', desc: 'We listen to our readers. Tool suggestions, error reports, and feedback directly shape our coverage priorities.' },
];

const METHODOLOGY_STEPS = [
  { step: '01', title: 'Research & Discovery', desc: 'We identify tools through market analysis, user requests, and industry trends. Every tool must meet our minimum quality threshold.' },
  { step: '02', title: 'Hands-On Testing', desc: 'Our team signs up, tests core features, evaluates onboarding, and documents the user experience firsthand.' },
  { step: '03', title: 'Feature Mapping', desc: 'We create structured feature matrices comparing each tool against competitors in the same category.' },
  { step: '04', title: 'Pricing Verification', desc: 'Pricing is sourced directly from official websites and verified monthly. We flag hidden costs and gotchas.' },
  { step: '05', title: 'Rating & Scoring', desc: 'Tools are scored across 5 dimensions: Features, Ease of Use, Pricing, Support, and Value. Each dimension is weighted equally.' },
  { step: '06', title: 'Peer Review', desc: 'Every review is cross-checked by at least one other team member before publication to ensure accuracy and fairness.' },
];

export default async function AboutPage() {
  const stats = await getStats();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          <span className="gradient-text">About {SITE_NAME}</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          We help businesses and professionals cut through the noise and find the perfect digital tools —
          with unbiased, data-driven comparisons you can trust.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {[
          { label: 'Tools Reviewed', value: `${stats.tools}+` },
          { label: 'Comparisons', value: `${stats.comparisons}+` },
          { label: 'Blog Articles', value: `${stats.blogs}+` },
          { label: 'Categories', value: stats.categories.toString() },
        ].map((s) => (
          <div key={s.label} className="text-center p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover-lift">
            <div className="text-3xl font-extrabold gradient-text">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Our Mission */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 md:p-12 border border-blue-100 dark:border-gray-700">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            The software market is overwhelming. With tens of thousands of tools available across
            every category imaginable, choosing the right one can take days — sometimes weeks — of research.
            Marketing pages promise the world, but the reality often falls short.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            We built {SITE_NAME} to solve this problem. Our platform provides structured, side-by-side
            comparisons with verified pricing, genuine feature analysis, and honest recommendations.
            Whether you are a solo entrepreneur picking your first CRM or a CTO evaluating enterprise
            hosting providers, we give you the data you need to make a confident decision.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">What We Stand For</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {VALUES.map((v) => (
            <div key={v.title} className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover-lift">
              <div className="text-3xl mb-3">{v.icon}</div>
              <h3 className="text-lg font-bold mb-2">{v.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How We Review */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Our Review Methodology</h2>
        <p className="text-center text-gray-500 max-w-2xl mx-auto mb-10">
          Every tool on {SITE_NAME} goes through a rigorous 6-step evaluation process
          before earning its place in our database.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {METHODOLOGY_STEPS.map((m) => (
            <div key={m.step} className="relative p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="text-4xl font-extrabold text-blue-100 dark:text-blue-900/30 absolute top-4 right-4">{m.step}</div>
              <h3 className="text-lg font-bold mb-2">{m.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Rating Dimensions */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">5 Rating Dimensions</h2>
        <div className="space-y-4">
          {[
            { name: 'Features', pct: 100, desc: 'Core functionality, integrations, API access, customization options.' },
            { name: 'Ease of Use', pct: 100, desc: 'Onboarding experience, UI design, learning curve, documentation quality.' },
            { name: 'Pricing', pct: 100, desc: 'Affordability, plan flexibility, free tier availability, price-to-feature ratio.' },
            { name: 'Customer Support', pct: 100, desc: 'Response times, support channels, community resources, SLA guarantees.' },
            { name: 'Value for Money', pct: 100, desc: 'Overall bang for buck compared to alternatives in the same category.' },
          ].map((d) => (
            <div key={d.name} className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">{d.name}</span>
                <span className="text-sm text-gray-400">20% weight</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mb-2">
                <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" style={{ width: `${d.pct}%` }} />
              </div>
              <p className="text-xs text-gray-500">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Meet the Team</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {TEAM.map((member) => (
            <div key={member.name} className="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover-lift">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">{member.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">{member.role}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How We Make Money */}
      <section className="mb-16">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-4">How We Make Money</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            Transparency is core to our DNA. {SITE_NAME} earns revenue through two channels:
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <h3 className="font-semibold mb-2">Display Advertising</h3>
              <p className="text-sm text-gray-500">
                We show non-intrusive ads via Google AdSense. These are contextual and
                never interfere with your reading experience.
              </p>
            </div>
            <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <h3 className="font-semibold mb-2">Affiliate Partnerships</h3>
              <p className="text-sm text-gray-500">
                Some links earn us a commission at no extra cost to you. This never influences
                our ratings — tools with affiliate programs get the same honest evaluation.
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-400 italic">
            We clearly disclose affiliate relationships wherever they exist. Our editorial team
            operates independently from our business team.
          </p>
        </div>
      </section>

      {/* Categories We Cover */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Categories We Cover</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORY_LIST.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover-lift text-center"
            >
              <div className="w-10 h-10 rounded-lg mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${cat.color}15` }}>
                <span className="text-lg" style={{ color: cat.color }}>
                  {cat.icon === 'brain' ? '🧠' : cat.icon === 'cloud' ? '☁️' : cat.icon === 'shopping-cart' ? '🛒' : cat.icon === 'megaphone' ? '📣' : cat.icon === 'server' ? '🖥️' : '💼'}
                </span>
              </div>
              <h3 className="font-semibold text-sm">{cat.name}</h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-10">
        <h2 className="text-2xl font-bold text-white mb-3">Ready to Find Your Perfect Tool?</h2>
        <p className="text-blue-100 mb-6 max-w-lg mx-auto">
          Browse {stats.tools}+ tool reviews, {stats.comparisons}+ side-by-side comparisons, and expert guides.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/search" className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
            Search Tools
          </Link>
          <Link href="/contact" className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-colors">
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
