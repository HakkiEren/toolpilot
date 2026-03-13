// ============================================================
// BLOG SEO UTILITIES — Extract structured data from blog HTML
// FAQPage & HowTo schema extraction for Google Rich Results
// ============================================================

import type { FAQ } from '@/types';

/**
 * Extract FAQ Q&A pairs from blog post HTML content.
 * Looks for <div class="faq-section"> containing <div class="faq-item">
 * with <h3> (question) and <p> (answer) elements.
 *
 * Returns FAQ[] for use with generateFAQSchema() → FAQPage rich results.
 */
export function extractFAQsFromContent(html: string): FAQ[] {
  if (!html) return [];

  const faqs: FAQ[] = [];

  // Match the FAQ section
  const faqSectionMatch = html.match(
    /<div\s+class="faq-section">([\s\S]*?)(?=<div\s+class="final-verdict"|$)/
  );

  if (!faqSectionMatch) return [];

  const faqHtml = faqSectionMatch[1];

  // Extract individual FAQ items
  const itemRegex = /<div\s+class="faq-item">\s*<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>\s*<\/div>/g;
  let match;

  while ((match = itemRegex.exec(faqHtml)) !== null) {
    const question = stripHtml(match[1]).trim();
    const answer = stripHtml(match[2]).trim();

    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  return faqs;
}

/**
 * Extract step-by-step sections from how-to/guide blog posts.
 * Looks for H2 headings followed by paragraph content.
 * Returns steps for HowTo schema → Google Rich Results.
 */
export function extractHowToSteps(html: string): { name: string; text: string }[] {
  if (!html) return [];

  const steps: { name: string; text: string }[] = [];

  // Match H2 headings and capture the text following them until the next H2 or end
  const sectionRegex = /<h2[^>]*>([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2[^>]*>|<div\s+class="(?:faq-section|final-verdict|key-takeaways)"|$)/g;
  let match;

  while ((match = sectionRegex.exec(html)) !== null) {
    const heading = stripHtml(match[1]).trim();
    const bodyHtml = match[2];

    // Skip non-step headings (TOC, FAQ, Final Verdict, Key Takeaways)
    if (
      /^(table of contents|in this article|faq|frequently asked|final verdict|key takeaways)/i.test(heading) ||
      /^[\u{1F4D1}\u{2753}\u{1F3C6}\u{1F3AF}]/u.test(heading)
    ) {
      continue;
    }

    // Extract first 2-3 paragraphs as step text
    const paragraphs: string[] = [];
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/g;
    let pMatch;
    let count = 0;

    while ((pMatch = pRegex.exec(bodyHtml)) !== null && count < 2) {
      const text = stripHtml(pMatch[1]).trim();
      if (text.length > 20) {
        paragraphs.push(text);
        count++;
      }
    }

    if (heading && paragraphs.length > 0) {
      steps.push({
        name: heading,
        text: paragraphs.join(' '),
      });
    }
  }

  return steps;
}

/**
 * Detect if a blog post is a how-to/guide type based on slug and title.
 */
export function isHowToPost(slug: string, title: string): boolean {
  const slugMatch = /how-to|guide|tutorial|step-by-step|getting-started/.test(slug);
  const titleMatch = /how to|guide|tutorial|step.by.step|getting started/i.test(title);
  return slugMatch || titleMatch;
}

/**
 * Strip HTML tags from a string, decode common entities.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
