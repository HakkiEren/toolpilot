import type { Tool, Comparison, BlogPost, FAQ } from '@/types';
import { SITE_NAME, SITE_URL } from './constants';

// ============================================================
// JSON-LD SCHEMA GENERATORS — Advanced SEO
// Rich Snippets: Review stars, ranking carousels, FAQ accordions
// ============================================================

// --- TOOL REVIEW SCHEMA (enables star ratings in Google SERPs) ---
export function generateToolReviewSchema(tool: Tool, categoryName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name: `${tool.name} Review ${new Date().getFullYear()}`,
    reviewBody: tool.description,
    datePublished: tool.createdAt,
    dateModified: tool.lastUpdated,
    url: `${SITE_URL}/${tool.categorySlug}/${tool.slug}`,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    itemReviewed: {
      '@type': 'SoftwareApplication',
      name: tool.name,
      description: tool.tagline,
      url: tool.websiteUrl,
      applicationCategory: categoryName,
      operatingSystem: 'Web, iOS, Android',
      ...(tool.logoUrl && { image: tool.logoUrl }),
      ...(tool.pricing.startingPrice != null && {
        offers: {
          '@type': 'AggregateOffer',
          lowPrice: tool.pricing.hasFreeplan ? 0 : tool.pricing.startingPrice,
          highPrice: tool.pricing.startingPrice * 10,
          priceCurrency: tool.pricing.currency || 'USD',
          offerCount: tool.pricing.plans?.length || 1,
        },
      }),
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: tool.ratings.overall,
        bestRating: 10,
        worstRating: 0,
        ratingCount: tool.ratings.reviewCount || 1,
      },
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: tool.ratings.overall,
      bestRating: 10,
      worstRating: 0,
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '[data-speakable]'],
    },
    // Pros/Cons — triggers rich results in Google SERPs
    positiveNotes: {
      '@type': 'ItemList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: `Strong overall rating of ${tool.ratings.overall.toFixed(1)}/10` },
        ...(tool.ratings.easeOfUse >= 7 ? [{ '@type': 'ListItem', position: 2, name: `Easy to use (${tool.ratings.easeOfUse.toFixed(1)}/10)` }] : []),
        ...(tool.ratings.features >= 7 ? [{ '@type': 'ListItem', position: 3, name: `Feature-rich platform (${tool.ratings.features.toFixed(1)}/10)` }] : []),
        ...(tool.pricing.hasFreeplan ? [{ '@type': 'ListItem', position: 4, name: 'Free plan available' }] : []),
        ...(tool.ratings.support >= 7 ? [{ '@type': 'ListItem', position: 5, name: `Good customer support (${tool.ratings.support.toFixed(1)}/10)` }] : []),
      ].map((item, i) => ({ ...item, position: i + 1 })),
    },
    negativeNotes: {
      '@type': 'ItemList',
      itemListElement: [
        ...(tool.ratings.valueForMoney < 7 ? [{ '@type': 'ListItem', position: 1, name: `Value for money could be better (${tool.ratings.valueForMoney.toFixed(1)}/10)` }] : []),
        ...(tool.ratings.support < 7 ? [{ '@type': 'ListItem', position: 2, name: `Customer support needs improvement (${tool.ratings.support.toFixed(1)}/10)` }] : []),
        ...(!tool.pricing.hasFreeplan ? [{ '@type': 'ListItem', position: 3, name: 'No free plan available' }] : []),
        ...(tool.ratings.easeOfUse < 7 ? [{ '@type': 'ListItem', position: 4, name: `Steeper learning curve (${tool.ratings.easeOfUse.toFixed(1)}/10)` }] : []),
      ].map((item, i) => ({ ...item, position: i + 1 })),
    },
  };
}

// --- Legacy tool schema (kept for category pages) ---
export function generateToolSchema(tool: Tool, categoryName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.tagline,
    url: `${SITE_URL}/${tool.categorySlug}/${tool.slug}`,
    applicationCategory: categoryName,
    operatingSystem: 'Web',
    ...(tool.logoUrl && { image: tool.logoUrl }),
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

// --- COMPARISON SCHEMA (Article with datePublished) ---
export function generateComparisonSchema(comparison: Comparison) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: comparison.metaTitle,
    description: comparison.metaDescription,
    url: `${SITE_URL}/${comparison.categorySlug}/compare/${comparison.slug}`,
    datePublished: comparison.lastUpdated,
    dateModified: comparison.lastUpdated,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${comparison.categorySlug}/compare/${comparison.slug}`,
    },
    about: [
      {
        '@type': 'SoftwareApplication',
        name: comparison.toolA.name,
        ...(comparison.toolA.logoUrl && { image: comparison.toolA.logoUrl }),
      },
      {
        '@type': 'SoftwareApplication',
        name: comparison.toolB.name,
        ...(comparison.toolB.logoUrl && { image: comparison.toolB.logoUrl }),
      },
    ],
  };
}

// --- FAQ SCHEMA ---
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

// --- BREADCRUMB SCHEMA ---
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

// --- BLOG SCHEMA (Person author for E-E-A-T) ---
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
      '@type': 'Person',
      name: post.author || 'ToolPilot Editorial Team',
      url: `${SITE_URL}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '[data-speakable]'],
    },
  };
}

// --- COLLECTION SCHEMA (Category pages) ---
export function generateCollectionSchema(
  categoryName: string,
  categorySlug: string,
  description: string,
  tools: { name: string; slug: string; ratings: { overall: number }; logoUrl?: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Best ${categoryName} (${new Date().getFullYear()})`,
    description,
    url: `${SITE_URL}/${categorySlug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: tools.length,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      itemListElement: tools.slice(0, 10).map((tool, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: tool.name,
        url: `${SITE_URL}/${categorySlug}/${tool.slug}`,
        ...(tool.logoUrl && { image: tool.logoUrl }),
      })),
    },
  };
}

// --- BEST-OF ITEM LIST SCHEMA (enables ranking carousels in Google) ---
export function generateBestOfItemListSchema(
  title: string,
  url: string,
  tools: { name: string; slug: string; categorySlug: string; ratings: { overall: number }; logoUrl?: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    url: url.startsWith('http') ? url : `${SITE_URL}${url}`,
    numberOfItems: tools.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: tools.map((tool, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: tool.name,
      url: `${SITE_URL}/${tool.categorySlug}/${tool.slug}`,
      item: {
        '@type': 'SoftwareApplication',
        name: tool.name,
        url: `${SITE_URL}/${tool.categorySlug}/${tool.slug}`,
        ...(tool.logoUrl && { image: tool.logoUrl }),
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: tool.ratings.overall,
          bestRating: 10,
          worstRating: 0,
        },
      },
    })),
  };
}

// --- ORGANIZATION SCHEMA (enhanced) ---
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'Compare the best digital tools across AI, SaaS, E-commerce, Marketing, Hosting & Business.',
    logo: `${SITE_URL}/opengraph-image`,
    sameAs: [
      'https://twitter.com/toolpilot',
      'https://linkedin.com/company/toolpilot',
      'https://youtube.com/@toolpilot',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: `${SITE_URL}/contact`,
    },
  };
}

// --- WEBSITE SCHEMA (with SearchAction for sitelinks search box) ---
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
