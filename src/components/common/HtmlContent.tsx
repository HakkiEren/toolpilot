// ============================================================
// SAFE HTML CONTENT RENDERER
// Strips dangerous tags (script, iframe, etc.) while preserving
// safe formatting tags (p, h3, ul, li, strong, em, a, br)
// ============================================================

import { enrichHtmlWithGlossaryLinks, enrichTextWithGlossaryLinks } from '@/lib/glossary-linker';

const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'a',
  'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'h5', 'h6',
  'span', 'div', 'blockquote', 'code', 'pre', 'hr',
]);

const DANGEROUS_TAGS_RE = /<\s*\/?\s*(script|iframe|object|embed|form|input|button|style|link|meta|base)[^>]*>/gi;
const EVENT_ATTRS_RE = /\s+on\w+="[^"]*"/gi;

/**
 * Sanitize HTML by removing dangerous tags and event handlers
 * while preserving safe formatting tags.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  let safe = html
    // Remove dangerous tags entirely
    .replace(DANGEROUS_TAGS_RE, '')
    // Remove event handler attributes
    .replace(EVENT_ATTRS_RE, '')
    // Remove javascript: URLs
    .replace(/href\s*=\s*"javascript:[^"]*"/gi, 'href="#"')
    .replace(/href\s*=\s*'javascript:[^']*'/gi, "href='#'");

  return safe;
}

/**
 * Strip all HTML tags and return plain text.
 * Used for schema descriptions, meta content, etc.
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

interface HtmlContentProps {
  html: string;
  className?: string;
  as?: 'div' | 'p' | 'span';
  /** When true, automatically links glossary terms to /glossary/[slug] pages */
  glossaryLinks?: boolean;
}

/**
 * Renders HTML content safely. If the content doesn't contain HTML tags,
 * it renders as plain text. If it contains HTML, it sanitizes and renders.
 * Optionally enriches content with glossary term links.
 */
export function HtmlContent({ html, className = '', as: Tag = 'div', glossaryLinks = false }: HtmlContentProps) {
  if (!html) return null;

  // Check if content actually has HTML tags
  const hasHtml = /<[a-zA-Z][^>]*>/.test(html);

  if (!hasHtml && !glossaryLinks) {
    // No HTML, no glossary — render as plain text
    return <Tag className={className}>{html}</Tag>;
  }

  let processed = hasHtml ? sanitizeHtml(html) : html;

  // Enrich with glossary links if requested
  if (glossaryLinks) {
    processed = hasHtml
      ? enrichHtmlWithGlossaryLinks(processed)
      : enrichTextWithGlossaryLinks(processed);
  }

  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: processed }}
    />
  );
}
