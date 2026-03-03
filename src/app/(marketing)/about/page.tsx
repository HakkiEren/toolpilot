import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: `About Us | ${SITE_NAME}`,
  description: `Learn about ${SITE_NAME} — our mission to help businesses find the right digital tools through unbiased comparisons and honest reviews.`,
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">About {SITE_NAME}</h1>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
        <p>
          <strong>{SITE_NAME}</strong> is an independent tool comparison platform that helps businesses
          and professionals find the right digital tools for their needs. We cover AI tools, SaaS platforms,
          e-commerce solutions, marketing software, web hosting, and business tools.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Our Mission</h2>
        <p>
          The software market is overwhelming. With thousands of tools available, choosing the right one
          can take days of research. We built {SITE_NAME} to simplify that process — providing side-by-side
          comparisons with real pricing, genuine feature analysis, and honest recommendations.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">How We Review Tools</h2>
        <p>Every tool on {SITE_NAME} is evaluated across five key dimensions:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Features</strong> — What does the tool actually do? We map every feature against competitors.</li>
          <li><strong>Pricing</strong> — Real pricing from official sources, updated weekly. No hidden costs.</li>
          <li><strong>Ease of Use</strong> — How quickly can a new user get started? We consider onboarding, UI design, and documentation.</li>
          <li><strong>Customer Support</strong> — Response times, support channels, and community resources.</li>
          <li><strong>Value for Money</strong> — Does the price match the value delivered? We compare against alternatives in the same category.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Our Independence</h2>
        <p>
          {SITE_NAME} is not sponsored by any software company. Our ratings are based on objective criteria
          and real-world usage data. When we recommend a tool, it is because we genuinely believe it is the
          best option for the specified use case — not because we were paid to say so.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">How We Make Money</h2>
        <p>
          We are transparent about our business model. {SITE_NAME} earns revenue through:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Display advertising (Google AdSense)</li>
          <li>Affiliate partnerships with some of the tools we review</li>
        </ul>
        <p>
          These partnerships never influence our ratings or recommendations. A tool with an affiliate
          program receives the same honest evaluation as one without.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Data Accuracy</h2>
        <p>
          We update our tool database weekly to ensure pricing and feature information stays accurate.
          If you notice any outdated information, please <a href="/contact" className="text-blue-600 hover:underline">contact us</a> and
          we will update it promptly.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Get in Touch</h2>
        <p>
          Have questions, feedback, or a tool you would like us to review? Visit our{' '}
          <a href="/contact" className="text-blue-600 hover:underline">Contact page</a>.
        </p>
      </div>
    </article>
  );
}
