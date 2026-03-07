import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, SEO } from '@/lib/constants';
import { AdBanner, AdInArticle } from '@/components/ads/AdSlot';
import { generateBreadcrumbSchema, generateGlossarySchema } from '@/lib/schema';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

// ============================================================
// GLOSSARY PAGE — SEO-rich definitions page
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

interface Term {
  term: string;
  definition: string;
  category: string;
  relatedLink?: string;
  relatedLabel?: string;
}

const GLOSSARY_TERMS: Term[] = [
  // AI Terms
  { term: 'Artificial Intelligence (AI)', definition: 'Computer systems designed to perform tasks that normally require human intelligence, such as visual perception, speech recognition, decision-making, and language translation.', category: 'AI', relatedLink: '/ai-tools', relatedLabel: 'Browse AI Tools' },
  { term: 'Large Language Model (LLM)', definition: 'A type of AI model trained on vast amounts of text data, capable of understanding and generating human-like text. Examples include GPT-4, Claude, and Gemini.', category: 'AI', relatedLink: '/ai-tools/compare/chatgpt-vs-claude', relatedLabel: 'ChatGPT vs Claude' },
  { term: 'Natural Language Processing (NLP)', definition: 'A branch of AI that deals with the interaction between computers and human language, enabling machines to read, understand, and derive meaning from text.', category: 'AI' },
  { term: 'Generative AI', definition: 'AI systems that can create new content — including text, images, music, and code — based on patterns learned from training data.', category: 'AI' },
  { term: 'Prompt Engineering', definition: 'The practice of crafting effective inputs (prompts) to get desired outputs from AI models. A critical skill for maximizing AI tool productivity.', category: 'AI' },
  { term: 'Fine-tuning', definition: 'The process of further training a pre-trained AI model on a specific dataset to improve its performance for particular tasks or domains.', category: 'AI' },
  { term: 'RAG (Retrieval-Augmented Generation)', definition: 'An AI technique that combines information retrieval with text generation, allowing models to access external knowledge bases for more accurate responses.', category: 'AI' },
  { term: 'Token', definition: 'The basic unit of text processed by language models. A token can be a word, part of a word, or punctuation. API pricing is often based on token usage.', category: 'AI' },
  { term: 'AI Agent', definition: 'An autonomous AI system that can plan, execute tasks, use tools, and make decisions independently to achieve specified goals.', category: 'AI', relatedLink: '/best/ai-agents', relatedLabel: 'Best AI Agents' },

  // SaaS Terms
  { term: 'SaaS (Software as a Service)', definition: 'A software distribution model where applications are hosted in the cloud and accessed via the internet on a subscription basis, eliminating the need for local installation.', category: 'SaaS', relatedLink: '/saas', relatedLabel: 'Browse SaaS Tools' },
  { term: 'CRM (Customer Relationship Management)', definition: 'Software that helps businesses manage interactions with current and potential customers, tracking sales, communications, and support activities.', category: 'SaaS', relatedLink: '/best/crm', relatedLabel: 'Best CRM Software' },
  { term: 'ARR (Annual Recurring Revenue)', definition: 'The annualized value of recurring subscription revenue. A key metric for SaaS businesses measuring predictable income streams.', category: 'SaaS' },
  { term: 'Churn Rate', definition: 'The percentage of customers who stop using a service during a given time period. Lower churn indicates better customer retention.', category: 'SaaS' },
  { term: 'Multi-tenancy', definition: 'A software architecture where a single instance serves multiple customers (tenants), each with isolated data but sharing the same infrastructure.', category: 'SaaS' },
  { term: 'API (Application Programming Interface)', definition: 'A set of protocols and tools that allows different software applications to communicate with each other, enabling integrations and data exchange.', category: 'SaaS' },
  { term: 'Webhook', definition: 'An automated message sent from one application to another when a specific event occurs, enabling real-time data synchronization between tools.', category: 'SaaS' },
  { term: 'Single Sign-On (SSO)', definition: 'An authentication method that allows users to log in to multiple applications with a single set of credentials, improving security and user experience.', category: 'SaaS' },

  // E-commerce Terms
  { term: 'E-commerce Platform', definition: 'Software that enables businesses to build, manage, and operate online stores, handling product catalogs, shopping carts, checkout, and order management.', category: 'E-commerce', relatedLink: '/ecommerce', relatedLabel: 'Browse E-commerce Tools' },
  { term: 'Payment Gateway', definition: 'A service that processes credit card payments for online and traditional retail stores, securely transmitting transaction data between merchants and banks.', category: 'E-commerce', relatedLink: '/best/payment-processing', relatedLabel: 'Best Payment Processing' },
  { term: 'Cart Abandonment', definition: 'When a customer adds items to their online shopping cart but leaves the site without completing the purchase. Average abandonment rates are around 70%.', category: 'E-commerce' },
  { term: 'Dropshipping', definition: 'A retail fulfillment method where stores sell products without holding inventory. Orders are forwarded to suppliers who ship directly to customers.', category: 'E-commerce' },
  { term: 'AOV (Average Order Value)', definition: 'The average amount spent per order. Calculated by dividing total revenue by the number of orders. A key metric for e-commerce optimization.', category: 'E-commerce' },
  { term: 'SKU (Stock Keeping Unit)', definition: 'A unique identifier assigned to each product variant for inventory tracking purposes. Helps manage stock levels and fulfillment accuracy.', category: 'E-commerce' },
  { term: 'Headless Commerce', definition: 'An e-commerce architecture that separates the frontend presentation layer from the backend commerce functionality, enabling greater design flexibility.', category: 'E-commerce' },

  // Marketing Terms
  { term: 'SEO (Search Engine Optimization)', definition: 'The practice of optimizing websites and content to rank higher in search engine results, increasing organic (non-paid) traffic.', category: 'Marketing', relatedLink: '/best/seo-tools', relatedLabel: 'Best SEO Tools' },
  { term: 'Email Marketing', definition: 'A digital marketing strategy that uses email to promote products, build relationships, and drive conversions through targeted, personalized communications.', category: 'Marketing', relatedLink: '/best/email-marketing', relatedLabel: 'Best Email Marketing' },
  { term: 'CTR (Click-Through Rate)', definition: 'The percentage of people who click on a link or ad out of the total who see it. A key metric for measuring engagement effectiveness.', category: 'Marketing' },
  { term: 'Conversion Rate', definition: 'The percentage of visitors who complete a desired action (purchase, sign-up, download). Critical for measuring marketing and website effectiveness.', category: 'Marketing' },
  { term: 'Marketing Automation', definition: 'Software that automates repetitive marketing tasks like email sequences, social media posting, and lead nurturing, improving efficiency and personalization.', category: 'Marketing', relatedLink: '/best/marketing-automation', relatedLabel: 'Best Marketing Automation' },
  { term: 'A/B Testing', definition: 'A method of comparing two versions of a webpage, email, or ad to determine which performs better, using statistical analysis of user behavior.', category: 'Marketing' },
  { term: 'Lead Scoring', definition: 'A methodology for ranking prospects based on their perceived value to the organization, helping sales teams prioritize outreach efforts.', category: 'Marketing' },
  { term: 'Content Marketing', definition: 'A strategy focused on creating and distributing valuable, relevant content to attract and retain a clearly defined audience and drive profitable actions.', category: 'Marketing', relatedLink: '/best/content-marketing', relatedLabel: 'Best Content Marketing' },

  // Hosting Terms
  { term: 'Web Hosting', definition: 'A service that provides the technologies and infrastructure needed for a website to be accessible on the internet, storing files on servers.', category: 'Hosting', relatedLink: '/hosting', relatedLabel: 'Browse Hosting Providers' },
  { term: 'VPS (Virtual Private Server)', definition: 'A hosting solution that uses virtualization to provide dedicated server resources on a shared physical server, offering more control than shared hosting.', category: 'Hosting', relatedLink: '/best/vps-hosting', relatedLabel: 'Best VPS Hosting' },
  { term: 'CDN (Content Delivery Network)', definition: 'A geographically distributed network of servers that delivers web content to users from the nearest server location, reducing latency and load times.', category: 'Hosting', relatedLink: '/best/cdn', relatedLabel: 'Best CDN Services' },
  { term: 'SSL Certificate', definition: 'A digital certificate that authenticates a website identity and enables an encrypted connection (HTTPS), essential for security and SEO ranking.', category: 'Hosting' },
  { term: 'Uptime', definition: 'The percentage of time a server or website is operational and accessible. Industry standard targets 99.9% uptime (8.76 hours of downtime per year).', category: 'Hosting' },
  { term: 'Managed Hosting', definition: 'A hosting service where the provider handles server management tasks including updates, security, backups, and performance optimization.', category: 'Hosting', relatedLink: '/best/wordpress-hosting', relatedLabel: 'Best WordPress Hosting' },
  { term: 'Serverless Computing', definition: 'A cloud execution model where the provider dynamically manages server allocation. Users only pay for actual compute time, not idle capacity.', category: 'Hosting' },

  // Business Terms
  { term: 'ERP (Enterprise Resource Planning)', definition: 'Integrated software that manages core business processes including finance, HR, manufacturing, supply chain, and procurement in a single system.', category: 'Business', relatedLink: '/business', relatedLabel: 'Browse Business Tools' },
  { term: 'No-Code Platform', definition: 'Software development tools that allow users to create applications through visual interfaces and drag-and-drop builders without writing traditional code.', category: 'Business', relatedLink: '/best/no-code', relatedLabel: 'Best No-Code Platforms' },
  { term: 'Business Intelligence (BI)', definition: 'Technologies and practices for collecting, integrating, analyzing, and presenting business data to support better decision-making.', category: 'Business' },
  { term: 'ROI (Return on Investment)', definition: 'A financial metric measuring the profitability of an investment. Calculated as (Net Profit / Cost of Investment) x 100. Essential for tool evaluation.', category: 'Business', relatedLink: '/calculators/roi', relatedLabel: 'ROI Calculator' },
  { term: 'Workflow Automation', definition: 'The use of technology to automate sequences of tasks that make up business processes, reducing manual effort and human error.', category: 'Business' },
  { term: 'Digital Transformation', definition: 'The process of integrating digital technology into all areas of a business, fundamentally changing how operations are conducted and value is delivered.', category: 'Business' },
];

// Group terms by first letter
function groupByLetter(terms: Term[]) {
  const groups: Record<string, Term[]> = {};
  terms.forEach((t) => {
    const letter = t.term[0].toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(t);
  });
  return groups;
}

// Group terms by category
function groupByCategory(terms: Term[]) {
  const groups: Record<string, Term[]> = {};
  terms.forEach((t) => {
    if (!groups[t.category]) groups[t.category] = [];
    groups[t.category].push(t);
  });
  return groups;
}

export default function GlossaryPage() {
  const byCategory = groupByCategory(GLOSSARY_TERMS);
  const categories = Object.keys(byCategory).sort();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Glossary', url: '/glossary' },
  ]);
  const glossarySchema = generateGlossarySchema(GLOSSARY_TERMS);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(glossarySchema) }} />

    <div className="max-w-4xl mx-auto px-4 py-12">
      <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'Glossary', url: '' }]} />

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

      {/* Terms by category */}
      <div className="space-y-12">
        {categories.map((cat) => (
          <section key={cat} id={cat.toLowerCase().replace(/\s+/g, '-')}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
              {cat}
            </h2>
            <div className="space-y-4">
              {byCategory[cat].map((term) => (
                <div
                  key={term.term}
                  className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-200 transition-colors"
                >
                  <h3 className="font-bold text-lg mb-2">{term.term}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {term.definition}
                  </p>
                  {term.relatedLink && (
                    <Link
                      href={term.relatedLink}
                      className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      {term.relatedLabel || 'Learn more'} →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

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
