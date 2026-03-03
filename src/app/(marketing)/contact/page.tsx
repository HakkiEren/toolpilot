import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import ContactForm from './contact-form';

export const metadata: Metadata = {
  title: `Contact Us | ${SITE_NAME}`,
  description: `Get in touch with the ${SITE_NAME} team. Submit tool suggestions, report inaccuracies, or ask questions.`,
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
        Have a question, found an error, or want to suggest a tool? We would love to hear from you.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-2">Report an Error</h2>
          <p className="text-sm text-gray-500">
            Found outdated pricing or incorrect feature info? Let us know and we will fix it within 24 hours.
          </p>
        </div>
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-2">Suggest a Tool</h2>
          <p className="text-sm text-gray-500">
            Know a tool that should be listed on {SITE_NAME}? We are always expanding our database.
          </p>
        </div>
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-2">Business Inquiries</h2>
          <p className="text-sm text-gray-500">
            For partnerships, advertising, or press inquiries.
          </p>
        </div>
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-2">General Questions</h2>
          <p className="text-sm text-gray-500">
            Anything else — we typically respond within 48 hours.
          </p>
        </div>
      </div>

      <ContactForm />
    </article>
  );
}
