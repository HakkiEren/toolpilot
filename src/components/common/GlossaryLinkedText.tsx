// ============================================================
// GLOSSARY LINKED TEXT — Server component that auto-links
// glossary terms within plain text content.
// Used in tool descriptions and other plain-text sections.
// ============================================================

import { enrichTextWithGlossaryLinks } from '@/lib/glossary-linker';

interface GlossaryLinkedTextProps {
  text: string;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

export function GlossaryLinkedText({ text, className, as: Tag = 'p' }: GlossaryLinkedTextProps) {
  if (!text) return null;

  const enriched = enrichTextWithGlossaryLinks(text);

  // If no links were added, render as plain text (no dangerouslySetInnerHTML)
  if (enriched === text) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: enriched }}
    />
  );
}
