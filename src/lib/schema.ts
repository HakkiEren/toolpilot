import type { Tool, Comparison, BlogPost, FAQ } from '@/types';
import { SITE_NAME, SITE_URL } from './constants';

// ============================================================
// JSON-LD SCHEMA GENERATORS
// Automated schema markup for every page type
// ============================================================

export function generateToolSchema(tool: Tool, categoryName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.tagline,
    url: `${SITE_URL}/${tool.categorySlug}/${tool.slug}`,
    applicationCategory: categoryName,
    operatingSystem: 'Web',
    ...(tool.pricing.startingPrice && {
      offers: {
        '@type': 'Offer',
        price: tool.pricing.startingPrice,
        priceCurrency: tool.pricing.currency,
        ...(tool.pricing.hasFreeplan && {
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: 0,
            priceCurrency: tool.pricing.currency,
            description: 'Free Plan',
          },
        }),
      },
    }),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tool.ratings.overall,
      bestRating: 10,
      worstRating: 0,
      ratingCount: tool.ratings.reviewCount || 1,
    },
  };
}

export function generateComparisonSchema(comparison: Comparison) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: comparison.metaTitle,
    description: comparison.metaDescription,
    url: `${SITE_URL}/${comparison.categorySlug}/compare/${comparison.slug}`,
    dateModified: comparison.lastUpdated,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    about: [
      {
        '@type': 'SoftwareApplication',
        name: comparison.toolA.name,
      },
      {
        '@type': 'SoftwareApplication',
        name: comparison.toolB.name,
      },
    ],
  };
}

export function generateFAQSchema(faqs: FAQ[]) {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateBlogSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'Compare the best digital tools across AI, SaaS, E-commerce, Marketing, Hosting & Business.',
    sameAs: [],
  };
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
