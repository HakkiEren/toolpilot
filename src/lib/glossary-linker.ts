// ============================================================
// GLOSSARY AUTO-LINKER — Enriches text with glossary term links
// Scans plain text or HTML content and injects <a> links to
// /glossary/[slug] for matched terms. SEO best practice for
// internal linking density and topical authority.
// ============================================================

import { GLOSSARY_TERMS } from './glossary-data';

/** Max glossary links to inject per content block (avoid over-optimization) */
const MAX_LINKS_PER_BLOCK = 5;

interface TermMatch {
  term: string;
  slug: string;
  /** The search pattern text (without parenthetical) */
  searchText: string;
}

/**
 * Build a sorted list of term matches. Sorted by length descending
 * so longer terms match first (e.g., "Large Language Model" before "Language").
 * Also includes abbreviations from parenthetical: "SaaS (Software as a Service)"
 * produces both "Software as a Service" and "SaaS".
 */
function buildTermMatches(): TermMatch[] {
  const matches: TermMatch[] = [];

  for (const t of GLOSSARY_TERMS) {
    // Primary: full term without parenthetical
    const cleaned = t.term.replace(/\s*\([^)]*\)\s*/g, '').trim();
    if (cleaned.length >= 3) {
      matches.push({ term: t.term, slug: t.slug, searchText: cleaned });
    }

    // Secondary: abbreviation from parenthetical (e.g., "AI", "SaaS", "CRM")
    const parenMatch = t.term.match(/\(([^)]+)\)/);
    if (parenMatch) {
      const abbr = parenMatch[1].trim();
      // Only use abbreviations that are 2+ chars and all-uppercase or known acronyms
      if (abbr.length >= 2 && /^[A-Z0-9][A-Za-z0-9-]*$/.test(abbr)) {
        matches.push({ term: t.term, slug: t.slug, searchText: abbr });
      }
    }
  }

  // Sort by searchText length descending (longest first for greedy matching)
  return matches.sort((a, b) => b.searchText.length - a.searchText.length);
}

// Pre-compute at module level (runs once at build time for SSG)
const TERM_MATCHES = buildTermMatches();

/**
 * Escape special regex characters in a string
 */
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Enriches plain text with glossary links.
 * Returns HTML string with <a> tags linking to glossary pages.
 *
 * Rules:
 * - Only links the FIRST occurrence of each term
 * - Case-insensitive matching
 * - Word-boundary matching to avoid partial word matches
 * - Max MAX_LINKS_PER_BLOCK links per block
 * - Skips very short abbreviations (< 3 chars) to avoid false positives
 *   unless they appear as whole words with proper context
 */
export function enrichTextWithGlossaryLinks(text: string): string {
  if (!text || text.length < 20) return text;

  let result = text;
  let linkCount = 0;
  const linkedSlugs = new Set<string>();

  for (const match of TERM_MATCHES) {
    if (linkCount >= MAX_LINKS_PER_BLOCK) break;
    if (linkedSlugs.has(match.slug)) continue;

    // For short abbreviations (2-3 chars), require exact case match
    const isShortAbbr = match.searchText.length <= 3;
    const flags = isShortAbbr ? 'g' : 'gi';

    // Build word-boundary regex
    const pattern = new RegExp(`\\b(${escapeRegex(match.searchText)})\\b`, flags);

    if (pattern.test(result)) {
      // Reset lastIndex after test
      pattern.lastIndex = 0;

      // Replace only the first occurrence
      let replaced = false;
      result = result.replace(pattern, (fullMatch) => {
        if (replaced) return fullMatch;
        replaced = true;
        linkCount++;
        linkedSlugs.add(match.slug);
        return `<a href="/glossary/${match.slug}" class="glossary-link" title="${match.term}">${fullMatch}</a>`;
      });
    }
  }

  return result;
}

/**
 * Enriches HTML content with glossary links.
 * Carefully avoids:
 * - Linking inside existing <a> tags
 * - Linking inside HTML tag attributes
 * - Breaking HTML structure
 *
 * Strategy: Split content into segments (inside <a> tags vs outside),
 * only process segments outside of links.
 */
export function enrichHtmlWithGlossaryLinks(html: string): string {
  if (!html || html.length < 20) return html;

  // Split HTML into segments: [text, <a...>linked text</a>, text, ...]
  // We process only the non-link segments
  const linkPattern = /<a\s[^>]*>[\s\S]*?<\/a>/gi;
  const tagPattern = /<[^>]+>/g;

  // Find all <a> tag positions to exclude
  const excludeRanges: Array<{ start: number; end: number }> = [];
  let linkMatch: RegExpExecArray | null;
  while ((linkMatch = linkPattern.exec(html)) !== null) {
    excludeRanges.push({ start: linkMatch.index, end: linkMatch.index + linkMatch[0].length });
  }

  // Find all HTML tag positions to exclude (don't match inside attributes)
  while ((linkMatch = tagPattern.exec(html)) !== null) {
    // Check if this tag range overlaps with an existing exclude range
    const start = linkMatch.index;
    const end = start + linkMatch[0].length;
    const alreadyExcluded = excludeRanges.some(r => start >= r.start && end <= r.end);
    if (!alreadyExcluded) {
      excludeRanges.push({ start, end });
    }
  }

  // Sort ranges by start position
  excludeRanges.sort((a, b) => a.start - b.start);

  // Merge overlapping ranges
  const merged: Array<{ start: number; end: number }> = [];
  for (const range of excludeRanges) {
    if (merged.length > 0 && range.start <= merged[merged.length - 1].end) {
      merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, range.end);
    } else {
      merged.push({ ...range });
    }
  }

  // Build processable text segments (gaps between excluded ranges)
  const segments: Array<{ start: number; end: number; isText: boolean }> = [];
  let cursor = 0;
  for (const range of merged) {
    if (cursor < range.start) {
      segments.push({ start: cursor, end: range.start, isText: true });
    }
    segments.push({ start: range.start, end: range.end, isText: false });
    cursor = range.end;
  }
  if (cursor < html.length) {
    segments.push({ start: cursor, end: html.length, isText: true });
  }

  // Process only text segments with glossary linking
  let linkCount = 0;
  const linkedSlugs = new Set<string>();
  const parts: string[] = [];

  for (const seg of segments) {
    const content = html.substring(seg.start, seg.end);

    if (!seg.isText || linkCount >= MAX_LINKS_PER_BLOCK) {
      parts.push(content);
      continue;
    }

    let enriched = content;
    for (const match of TERM_MATCHES) {
      if (linkCount >= MAX_LINKS_PER_BLOCK) break;
      if (linkedSlugs.has(match.slug)) continue;

      const isShortAbbr = match.searchText.length <= 3;
      const flags = isShortAbbr ? 'g' : 'gi';
      const pattern = new RegExp(`\\b(${escapeRegex(match.searchText)})\\b`, flags);

      if (pattern.test(enriched)) {
        pattern.lastIndex = 0;
        let replaced = false;
        enriched = enriched.replace(pattern, (fullMatch) => {
          if (replaced) return fullMatch;
          replaced = true;
          linkCount++;
          linkedSlugs.add(match.slug);
          return `<a href="/glossary/${match.slug}" class="glossary-link" title="${match.term}">${fullMatch}</a>`;
        });
      }
    }

    parts.push(enriched);
  }

  return parts.join('');
}
