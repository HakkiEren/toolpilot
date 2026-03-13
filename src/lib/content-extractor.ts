// ============================================================
// Content Extractor — Extract unique text from tool HTML fields
// Used by runtime generators to produce tool-specific content
// ============================================================

/**
 * Strip HTML tags and decode common entities.
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract pro items from prosConsContent HTML.
 * Returns clean text strings (no HTML tags).
 */
export function extractProsList(html: string | undefined | null): string[] {
  if (!html) return [];
  const m = html.match(/Pros[\s\S]*?<ul>([\s\S]*?)<\/ul>/i);
  if (!m) return [];
  return [...m[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map(x => stripHtml(x[1]))
    .filter(s => s.length > 5 && s.length < 150)
    .slice(0, 6);
}

/**
 * Extract con items from prosConsContent HTML.
 */
export function extractConsList(html: string | undefined | null): string[] {
  if (!html) return [];
  const m = html.match(/Cons[\s\S]*?<ul>([\s\S]*?)<\/ul>/i);
  if (!m) return [];
  return [...m[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map(x => stripHtml(x[1]))
    .filter(s => s.length > 5 && s.length < 150)
    .slice(0, 5);
}

/**
 * Extract use case titles from useCasesContent HTML.
 * Looks for <h3> headings.
 */
export function extractUseCaseTitles(html: string | undefined | null): string[] {
  if (!html) return [];
  return [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)]
    .map(x => stripHtml(x[1]))
    .filter(s => s.length > 3 && s.length < 100)
    .slice(0, 5);
}

/**
 * Extract persona descriptions from bestForContent HTML.
 * Looks for <li> items.
 */
export function extractBestForPersonas(html: string | undefined | null): string[] {
  if (!html) return [];
  return [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map(x => stripHtml(x[1]))
    .filter(s => s.length > 10 && s.length < 200)
    .slice(0, 5);
}

/**
 * Get the first 1-2 meaningful sentences from a description.
 */
export function getDescriptionHighlight(description: string | undefined | null): string {
  if (!description) return '';
  const sentences = description
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.length < 250);
  return sentences.slice(0, 2).join(' ');
}

/**
 * Get the first sentence only.
 */
export function getFirstSentence(text: string | undefined | null): string {
  if (!text) return '';
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 15);
  return sentences[0] || '';
}
