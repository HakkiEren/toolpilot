import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Terms of Service | ${SITE_NAME}`,
  description: `Terms of Service for ${SITE_NAME}. Read the terms and conditions that govern your use of our website.`,
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
        <p>
          Welcome to {SITE_NAME}. By accessing or using our website, you agree to be bound by these Terms of Service.
          If you do not agree to these terms, please do not use our website.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">1. Use of Website</h2>
        <p>
          {SITE_NAME} provides tool comparison information, reviews, and recommendations for informational
          purposes only. You may use the content for personal, non-commercial research and reference.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">2. Accuracy of Information</h2>
        <p>
          We strive to keep all tool information, pricing, and feature data accurate and up to date.
          However, we cannot guarantee that all information is complete, current, or error-free.
          Software companies may change their pricing, features, or availability at any time. Always
          verify information on the official website of the tool before making purchasing decisions.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">3. Not Professional Advice</h2>
        <p>
          The comparisons and recommendations on {SITE_NAME} are not professional, financial, or legal advice.
          Our ratings reflect our editorial assessment and should be used as one of many factors in your
          decision-making process.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">4. Affiliate Links</h2>
        <p>
          Some links on {SITE_NAME} may be affiliate links. When you click on an affiliate link and make a
          purchase, we may receive a commission at no additional cost to you. This does not influence our
          reviews or ratings.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">5. Intellectual Property</h2>
        <p>
          All content on {SITE_NAME}, including text, graphics, logos, and data compilations, is the property
          of {SITE_NAME} and is protected by applicable intellectual property laws. You may not reproduce,
          distribute, or create derivative works without our written permission.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">6. Third-Party Trademarks</h2>
        <p>
          Product names, logos, and brands mentioned on {SITE_NAME} are the property of their respective
          owners. Their inclusion on our website does not imply endorsement or affiliation.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">7. Limitation of Liability</h2>
        <p>
          {SITE_NAME} shall not be liable for any direct, indirect, incidental, consequential, or punitive
          damages arising from your use of, or inability to use, our website or the information provided herein.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">8. Changes to These Terms</h2>
        <p>
          We reserve the right to modify these Terms of Service at any time. Changes become effective
          immediately upon posting. Continued use of the website constitutes acceptance of modified terms.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">9. Contact</h2>
        <p>
          For questions about these terms, please <a href="/contact" className="text-blue-600 hover:underline">contact us</a>.
        </p>
      </div>
    </article>
  );
}
