import Link from 'next/link';
import { SITE_NAME, CATEGORY_LIST } from '@/lib/constants';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Find the <span className="text-blue-600">Right Tool</span> for Your Business
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
            Compare {`500+`} digital tools across AI, SaaS, E-commerce, Marketing & more.
            Unbiased reviews, real pricing, honest comparisons.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ai-tools"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              Explore AI Tools
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-gray-600 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Read Our Guides
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
          Browse by Category
        </h2>
        <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
          Whether you need an AI assistant, CRM, website builder, or marketing platform — we have got you covered.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORY_LIST.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group relative p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ backgroundColor: `${cat.color}15` }}
              >
                <CategoryIcon icon={cat.icon} color={cat.color} />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {cat.description}
              </p>
              <div className="mt-4 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Explore {cat.name} →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            How {SITE_NAME} Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose a Category',
                desc: 'Browse AI tools, SaaS, e-commerce platforms, marketing tools, hosting providers and more.',
              },
              {
                step: '02',
                title: 'Compare Side by Side',
                desc: 'See features, pricing, pros & cons in detailed comparison tables. No sponsored rankings.',
              },
              {
                step: '03',
                title: 'Make the Right Choice',
                desc: 'Get personalized recommendations based on your team size, budget, and use case.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl font-bold text-blue-600/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section — Important for AdSense approval */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Why Trust {SITE_NAME}?</h2>
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          {[
            { metric: '500+', label: 'Tools Compared' },
            { metric: '50+', label: 'Categories' },
            { metric: '100%', label: 'Unbiased Reviews' },
            { metric: 'Weekly', label: 'Data Updates' },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-3xl font-bold text-blue-600">{item.metric}</div>
              <div className="text-sm text-gray-500 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function CategoryIcon({ icon, color }: { icon: string; color: string }) {
  const icons: Record<string, string> = {
    brain: '🧠',
    cloud: '☁️',
    'shopping-cart': '🛒',
    megaphone: '📢',
    server: '🖥️',
    briefcase: '💼',
  };
  return <span style={{ color }}>{icons[icon] || '📦'}</span>;
}
