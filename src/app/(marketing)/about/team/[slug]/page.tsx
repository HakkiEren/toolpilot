import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE_NAME, SITE_URL, SEO, CATEGORY_LIST } from '@/lib/constants';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { AUTHORS, getTeamMembers } from '@/lib/authors';
import { getBlogsByAuthor } from '@/lib/data';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

// ============================================================
// INDIVIDUAL AUTHOR PROFILE PAGE — E-E-A-T signal
// Google values individual author pages with structured data,
// published articles, and expertise signals.
// ============================================================

export const revalidate = 86400; // 24 hours

export async function generateStaticParams() {
  return getTeamMembers().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const author = Object.values(AUTHORS).find((a) => a.slug === slug);
  if (!author) return {};

  const title = `${author.name} — ${author.role} at ${SITE_NAME}`;
  const description = author.bio;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/about/team/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/about/team/${slug}`,
      siteName: SITE_NAME,
      type: 'profile',
      locale: SEO.locale,
    },
    twitter: {
      card: 'summary',
      site: SEO.twitterHandle,
      title: `${author.name} — ${author.role}`,
      description: author.shortBio,
    },
  };
}

export default async function AuthorProfilePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const author = Object.values(AUTHORS).find((a) => a.slug === slug);
  if (!author) notFound();

  // Fetch this author's blog posts
  const posts = await getBlogsByAuthor(author.name);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
    { name: 'Our Team', url: '/about/team' },
    { name: author.name, url: `/about/team/${slug}` },
  ];

  // Person schema — comprehensive E-E-A-T signal
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    dateModified: new Date().toISOString().split('T')[0],
    mainEntity: {
      '@type': 'Person',
      name: author.name,
      jobTitle: author.role,
      description: author.bio,
      url: `${SITE_URL}/about/team/${slug}`,
      sameAs: author.sameAs,
      knowsAbout: author.knowsAbout,
      worksFor: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' },
          { name: 'Our Team', url: '/about/team' },
          { name: author.name, url: '' },
        ]} />

        {/* Author Hero Card */}
        <div className="mt-6 mb-10 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className={`h-24 bg-gradient-to-r ${author.gradient}`} />
          <div className="px-6 md:px-8 pb-8 -mt-10">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${author.gradient} flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white dark:border-gray-900`}>
                {author.initials}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-extrabold">{author.name}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{author.role}</p>
              </div>
              {/* Social Links */}
              <div className="flex gap-2">
                {author.social.twitter && (
                  <a href={author.social.twitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors" aria-label={`${author.name} on Twitter`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                )}
                {author.social.linkedin && (
                  <a href={author.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors" aria-label={`${author.name} on LinkedIn`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
                  </a>
                )}
                {author.social.github && (
                  <a href={author.social.github} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label={`${author.name} on GitHub`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                )}
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              {author.bio}
            </p>

            {/* Stats */}
            <div className="flex gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-black text-blue-600">{author.articles}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Articles</div>
              </div>
              <div className="w-px bg-gray-200 dark:bg-gray-700" />
              <div className="text-center">
                <div className="text-2xl font-black text-purple-600">{author.reviews}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Reviews</div>
              </div>
            </div>

            {/* Expertise */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Areas of Expertise</div>
              <div className="flex flex-wrap gap-2">
                {author.expertise.map((exp) => {
                  const cat = CATEGORY_LIST.find((c) => c.name === exp);
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

            {/* Specializations */}
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Specializations</div>
              <div className="flex flex-wrap gap-1.5">
                {author.knowsAbout.map((topic) => (
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

        {/* Published Articles */}
        {posts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">
              Articles by {author.name}
              <span className="ml-2 text-sm font-normal text-gray-400">({posts.length})</span>
            </h2>
            <div className="space-y-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </time>
                    {post.categorySlug && (
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-500">
                        {post.categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Other Team Members */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Other Team Members</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {getTeamMembers()
              .filter((m) => m.slug !== slug)
              .map((member) => (
                <Link
                  key={member.slug}
                  href={`/about/team/${member.slug}`}
                  className="group flex items-center gap-3 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {member.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">{member.name}</div>
                    <div className="text-xs text-gray-400 truncate">{member.role}</div>
                  </div>
                </Link>
              ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Want to learn more about how we review tools?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/about" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              About {SITE_NAME}
            </Link>
            <Link href="/editorial-policy" className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Editorial Policy
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
