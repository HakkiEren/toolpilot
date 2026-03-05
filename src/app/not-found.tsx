import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-extrabold gradient-text mb-4">404</div>
      <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back on track.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/ai-tools"
          className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Browse AI Tools
        </Link>
        <Link
          href="/blog"
          className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Read Blog
        </Link>
      </div>
      <div className="mt-12 text-sm text-gray-400">
        <p>Looking for something specific? Try one of our popular pages:</p>
        <div className="flex flex-wrap gap-3 justify-center mt-3">
          <Link href="/ai-tools/chatgpt" className="text-blue-500 hover:underline">ChatGPT Review</Link>
          <span className="text-gray-300">·</span>
          <Link href="/ai-tools/compare/chatgpt-vs-claude" className="text-blue-500 hover:underline">ChatGPT vs Claude</Link>
          <span className="text-gray-300">·</span>
          <Link href="/best/ai-coding" className="text-blue-500 hover:underline">Best AI Coding Tools</Link>
        </div>
      </div>
    </div>
  );
}
