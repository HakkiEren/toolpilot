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

/**
 * Lightweight line-by-line markdown-to-HTML converter for DB content.
 * Handles headings, bullet lists, numbered lists, bold, italic, and
 * mixed blocks (e.g. heading immediately followed by a list).
 */
function markdownToHtml(md: string): string {
  // First pass: inline formatting
  const escaped = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const inlined = escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/(?<!\w)\*([^*]+?)\*(?!\w)/g, '<em>$1</em>');

  const lines = inlined.split('\n');
  const output: string[] = [];
  let i = 0;

  // Flush a collected list of items as <ul> or <ol>
  function flushList(items: string[], ordered: boolean) {
    const tag = ordered ? 'ol' : 'ul';
    output.push(`<${tag}>${items.map(t => `<li>${t}</li>`).join('')}</${tag}>`);
  }

  while (i < lines.length) {
    const line = lines[i].trim();

    // Empty line — skip
    if (!line) { i++; continue; }

    // Horizontal rule
    if (/^---+$/.test(line)) {
      output.push('<hr>');
      i++;
      continue;
    }

    // Headings
    if (/^####\s+/.test(line)) {
      output.push(line.replace(/^####\s+(.+)$/, '<h5>$1</h5>'));
      i++;
      continue;
    }
    if (/^###\s+/.test(line)) {
      output.push(line.replace(/^###\s+(.+)$/, '<h4>$1</h4>'));
      i++;
      continue;
    }
    if (/^##\s+/.test(line)) {
      output.push(line.replace(/^##\s+(.+)$/, '<h3>$1</h3>'));
      i++;
      continue;
    }

    // Unordered list (collect consecutive - lines)
    if (/^- /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^- /.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^- /, ''));
        i++;
      }
      flushList(items, false);
      continue;
    }

    // Ordered list (collect consecutive numbered lines)
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ''));
        i++;
      }
      flushList(items, true);
      continue;
    }

    // Regular text — collect consecutive non-special lines into a paragraph
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^#{2,}\s/.test(lines[i].trim()) &&
      !/^- /.test(lines[i].trim()) &&
      !/^\d+\.\s/.test(lines[i].trim()) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    if (paraLines.length > 0) {
      output.push(`<p>${paraLines.join(' ')}</p>`);
    }
  }

  return output.join('\n');
}

/** Check if a string contains markdown syntax (##, - bullets, 1. lists, **bold**) */
function hasMarkdown(text: string): boolean {
  return /^#{2,}\s/m.test(text) || /^- /m.test(text) || /^\d+\.\s/m.test(text) || /\*\*.+?\*\*/.test(text);
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
  const isMd = !hasHtml && hasMarkdown(html);

  if (!hasHtml && !isMd && !glossaryLinks) {
    // Pure plain text, no enrichment needed — render as-is
    return <Tag className={className}>{html}</Tag>;
  }

  let processed: string;
  if (hasHtml) {
    processed = sanitizeHtml(html);
  } else if (isMd) {
    processed = markdownToHtml(html);
  } else {
    processed = html;
  }

  // Enrich with glossary links if requested
  if (glossaryLinks) {
    processed = (hasHtml || isMd)
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
