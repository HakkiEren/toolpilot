import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description: `Privacy Policy for ${SITE_NAME}. Learn how we collect, use, and protect your personal information.`,
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
        <p>
          {SITE_NAME} (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy and is committed
          to protecting your personal data. This privacy policy explains how we collect, use, and safeguard
          your information when you visit our website.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">1. Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Usage Data</strong> — Pages visited, time spent, referral sources, device type, and browser information collected automatically via Google Analytics.</li>
          <li><strong>Contact Information</strong> — Name and email address if you voluntarily submit them through our contact form.</li>
          <li><strong>Cookies</strong> — Small text files stored on your device for analytics and advertising purposes.</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To analyze website traffic and improve user experience</li>
          <li>To display relevant advertisements via Google AdSense</li>
          <li>To respond to inquiries submitted through our contact form</li>
          <li>To maintain the security and performance of our website</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">3. Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Google Analytics</strong> — For website traffic analysis. <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
          <li><strong>Google AdSense</strong> — For displaying advertisements. Google may use cookies to serve ads based on your prior visits to this and other websites.</li>
          <li><strong>Vercel</strong> — For website hosting and delivery.</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">4. Cookies</h2>
        <p>
          Our website uses cookies for analytics and advertising. You can control cookie preferences
          through your browser settings. Disabling cookies may affect certain website functionality.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">5. Your Rights</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access the personal data we hold about you</li>
          <li>Request correction or deletion of your personal data</li>
          <li>Object to or restrict processing of your personal data</li>
          <li>Withdraw consent for data collection</li>
        </ul>
        <p>To exercise any of these rights, please <a href="/contact" className="text-blue-600 hover:underline">contact us</a>.</p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">6. Data Retention</h2>
        <p>
          We retain personal data only for as long as necessary to fulfill the purposes outlined in this
          policy, unless a longer retention period is required by law.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">7. Children&apos;s Privacy</h2>
        <p>
          Our website is not intended for children under 13. We do not knowingly collect personal data from children.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">8. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">9. Contact</h2>
        <p>
          If you have questions about this privacy policy, please <a href="/contact" className="text-blue-600 hover:underline">contact us</a>.
        </p>
      </div>
    </article>
  );
}
