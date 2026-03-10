import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, CATEGORY_LIST } from '@/lib/constants';
import { generateBreadcrumbSchema, generateProfilePageSchema } from '@/lib/schema';
import { getTeamMembers } from '@/lib/authors';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

// ============================================================
// TEAM / AUTHORS PAGE — E-E-A-T signals for Google
// Uses centralized author data from @/lib/authors
// ProfilePage schema for 2026 SEO best practices
// ============================================================

export const metadata: Metadata = {
  title: `Our Team — The Experts Behind ${SITE_NAME}`,
  description: `Meet the ${SITE_NAME} editorial team. Our software analysts, tech writers, and industry experts review and compare 400+ digital tools across AI, SaaS, marketing, hosting, and more.`,
  alternates: { canonical: `${SITE_URL}/about/team` },
  openGraph: {
    title: `Our Team — The Experts Behind ${SITE_NAME}`,
    description: `Meet the ${SITE_NAME} editorial team. Our software analysts, tech writers, and industry experts review and compare 400+ digital tools across AI, SaaS, marketing, hosting, and more.`,
    url: `${SITE_URL}/about/team`,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Our Team — The Experts Behind ${SITE_NAME}`,
    description: `Meet the ${SITE_NAME} editorial team — software analysts, tech writers, and industry experts behind 400+ tool reviews.`,
  },
};

export default function TeamPage() {
  const teamMembers = getTeamMembers();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
    { name: 'Our Team', url: '/about/team' },
  ]);

  const profilePageSchema = generateProfilePageSchema(
    teamMembers.map((m) => ({
      name: m.name,
      role: m.role,
      bio: m.bio,
      sameAs: m.sameAs,
      knowsAbout: m.knowsAbout,
      slug: m.slug,
    }))
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }} />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' },
          { name: 'Our Team', url: '' },
        ]} />

        {/* Hero — Premium glassmorphism */}
        <div className="mt-6 mb-12">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-purple-50/40 dark:from-gray-900 dark:via-blue-950/10 dark:to-purple-950/10 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 p-8 md:p-12 text-center">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border border-gray-200/50 dark:border-gray-700/50 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-4">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {teamMembers.length} Expert Analysts
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
                Meet Our <span className="gradient-text">Expert Team</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Our editorial team combines decades of industry experience to deliver honest,
                data-driven reviews. Every tool gets the same rigorous evaluation process.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                {[
                  { value: '400+', label: 'Tools Reviewed', color: 'from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-950/10' },
                  { value: '50+', label: 'Years Combined Exp.', color: 'from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-950/10' },
                  { value: '140+', label: 'Articles Published', color: 'from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-950/10' },
                  { value: '327+', label: 'Comparisons Written', color: 'from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-950/10' },
                ].map((stat) => (
                  <div key={stat.label} className={`bg-gradient-to-r ${stat.color} backdrop-blur-sm rounded-xl px-5 py-3 shadow-sm border border-white/50 dark:border-gray-700/50`}>
                    <div className="text-xl font-black">{stat.value}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="space-y-8 mb-16">
          {teamMembers.map((member, idx) => (
            <div
              key={member.name}
              id={member.slug}
              className="hover-lift bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden card-animate"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex flex-col md:flex-row">
                {/* Avatar + Info */}
                <div className="md:w-72 flex-shrink-0 p-6 md:p-8 flex flex-col items-center text-center bg-gray-50/50 dark:bg-gray-800/30">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4`}>
                    {member.initials}
                  </div>
                  <Link href={`/about/team/${member.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <h2 className="text-lg font-bold">{member.name}</h2>
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{member.role}</p>
                  <div className="flex gap-4 text-center mb-4">
                    <div>
                      <div className="text-lg font-black text-blue-600">{member.articles}</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider">Articles</div>
                    </div>
                    <div className="w-px bg-gray-200 dark:bg-gray-700" />
                    <div>
                      <div className="text-lg font-black text-purple-600">{member.reviews}</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider">Reviews</div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-2">
                    {member.social.twitter && (
                      <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors" aria-label={`${member.name} on Twitter`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      </a>
                    )}
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors" aria-label={`${member.name} on LinkedIn`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
                      </a>
                    )}
                    {member.social.github && (
                      <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label={`${member.name} on GitHub`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                      </a>
                    )}
                  </div>
                </div>

                {/* Bio + Expertise */}
                <div className="flex-1 p-6 md:p-8">
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
                    {member.bio}
                  </p>
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Areas of Expertise</div>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((exp) => {
                        const cat = CATEGORY_LIST.find(c => c.name === exp);
                        return (
                          <Link
                            key={exp}
                            href={cat ? `/${cat.slug}` : '/search'}
                            className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                          >
                            {exp}
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Knowledge Areas — SEO signal */}
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Specializations</div>
                    <div className="flex flex-wrap gap-1.5">
                      {member.knowsAbout.map((topic) => (
                        <span
                          key={topic}
                          className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md text-[11px] font-medium"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Editorial Process */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Review Process</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Research', desc: 'Deep dive into each tool\'s features, pricing, and market position', icon: '🔍', color: 'from-blue-500 to-blue-600' },
              { step: '02', title: 'Hands-On Testing', desc: 'Every tool is tested firsthand by our analysts over multiple sessions', icon: '🧪', color: 'from-purple-500 to-purple-600' },
              { step: '03', title: 'Data Analysis', desc: 'We aggregate user reviews, performance benchmarks, and pricing data', icon: '📊', color: 'from-green-500 to-green-600' },
              { step: '04', title: 'Peer Review', desc: 'Each review is cross-checked by another team member for accuracy', icon: '✅', color: 'from-orange-500 to-orange-600' },
            ].map((item) => (
              <div key={item.step} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-xl mx-auto mb-3 shadow-md`}>
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-gray-400 mb-1">STEP {item.step}</div>
                <h3 className="font-semibold text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA — Join or Contact */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 rounded-2xl p-8 text-center text-white shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="text-xl font-extrabold mb-2">Want to Work With Us?</h2>
            <p className="text-sm text-gray-300 mb-6 max-w-md mx-auto">
              We are always looking for experienced tech writers and software analysts to join our editorial team.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm font-bold hover:from-blue-600 hover:to-purple-600 shadow-lg shadow-blue-500/25 transition-all">
                Get in Touch
              </Link>
              <Link href="/about" className="px-6 py-2.5 bg-white/10 backdrop-blur-sm text-white border border-white/10 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors">
                About {SITE_NAME}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
