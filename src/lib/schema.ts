import type { Tool, Comparison, BlogPost, FAQ } from '@/types';
import { SITE_NAME, SITE_URL } from './constants';
import { getAuthor, getAuthorUrl } from './authors';

// ============================================================
// JSON-LD SCHEMA GENERATORS — Advanced SEO
// Rich Snippets: Review stars, ranking carousels, FAQ accordions
// ============================================================

// --- TOOL REVIEW SCHEMA (enables star ratings in Google SERPs) ---
export function generateToolReviewSchema(tool: Tool, categoryName: string) {
  const editorialTeam = getAuthor(`${SITE_NAME} Editorial Team`);

  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name: `${tool.name} Review ${new Date().getFullYear()}`,
    reviewBody: tool.description,
    datePublished: tool.createdAt,
    dateModified: tool.lastUpdated,
    url: `${SITE_URL}/${tool.categorySlug}/${tool.slug}`,
    inLanguage: 'en-US',
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      sameAs: editorialTeam.sameAs,
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

// --- PRODUCT SCHEMA (enables pricing rich snippets in Google SERPs) ---
export function generateProductSchema(tool: Tool, categoryName: string) {
  // Build individual offers from pricing plans
  const offers: Record<string, unknown>[] = [];

  // Add free plan offer if available
  if (tool.pricing.hasFreeplan) {
    offers.push({
      '@type': 'Offer',
      name: 'Free Plan',
      price: 0,
      priceCurrency: tool.pricing.currency || 'USD',
      availability: 'https://schema.org/InStock',
      url: tool.websiteUrl,
      description: 'Free plan with limited features',
    });
  }

  // Add individual plan offers
  if (tool.pricing.plans && tool.pricing.plans.length > 0) {
    for (const plan of tool.pricing.plans) {
      if (plan.price != null) {
        offers.push({
          '@type': 'Offer',
          name: plan.name,
          price: plan.price,
          priceCurrency: tool.pricing.currency || 'USD',
          availability: 'https://schema.org/InStock',
          url: tool.websiteUrl,
          ...(plan.billingCycle === 'monthly' && {
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: plan.price,
              priceCurrency: tool.pricing.currency || 'USD',
              unitText: 'MONTH',
              referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
            },
          }),
          ...(plan.billingCycle === 'yearly' && {
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: plan.price,
              priceCurrency: tool.pricing.currency || 'USD',
              unitText: 'YEAR',
              referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'ANN' },
            },
          }),
        });
      }
    }
  } else if (tool.pricing.startingPrice != null) {
    // Fallback: use startingPrice when no detailed plans exist
    offers.push({
      '@type': 'Offer',
      name: 'Paid Plan',
      price: tool.pricing.startingPrice,
      priceCurrency: tool.pricing.currency || 'USD',
      availability: 'https://schema.org/InStock',
      url: tool.websiteUrl,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: tool.pricing.startingPrice,
        priceCurrency: tool.pricing.currency || 'USD',
        unitText: 'MONTH',
        referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
      },
    });
  }

  // Free trial offer
  if (tool.pricing.freeTrialDays) {
    offers.push({
      '@type': 'Offer',
      name: `${tool.pricing.freeTrialDays}-Day Free Trial`,
      price: 0,
      priceCurrency: tool.pricing.currency || 'USD',
      availability: 'https://schema.org/InStock',
      url: tool.websiteUrl,
      description: `${tool.pricing.freeTrialDays}-day free trial available`,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: tool.name,
    description: tool.tagline,
    url: `${SITE_URL}/${tool.categorySlug}/${tool.slug}`,
    ...(tool.logoUrl && { image: tool.logoUrl }),
    brand: {
      '@type': 'Brand',
      name: tool.name,
    },
    category: categoryName,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tool.ratings.overall,
      bestRating: 10,
      worstRating: 0,
      ratingCount: tool.ratings.reviewCount || 1,
    },
    ...(offers.length === 1 && { offers: offers[0] }),
    ...(offers.length > 1 && {
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: Math.min(...offers.map((o) => Number(o.price) || 0)),
        highPrice: Math.max(...offers.map((o) => Number(o.price) || 0)),
        priceCurrency: tool.pricing.currency || 'USD',
        offerCount: offers.length,
        offers,
      },
    }),
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

// --- COMPARISON SCHEMA (Article with datePublished + E-E-A-T author signals) ---
export function generateComparisonSchema(comparison: Comparison) {
  const editorialTeam = getAuthor(`${SITE_NAME} Editorial Team`);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: comparison.metaTitle,
    description: comparison.metaDescription,
    url: `${SITE_URL}/${comparison.categorySlug}/compare/${comparison.slug}`,
    datePublished: comparison.lastUpdated,
    dateModified: comparison.lastUpdated,
    inLanguage: 'en-US',
    author: {
      '@type': 'Organization',
      name: editorialTeam.name,
      url: `${SITE_URL}/about/team`,
      sameAs: editorialTeam.sameAs,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/opengraph-image`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${comparison.categorySlug}/compare/${comparison.slug}`,
    },
    about: [
      {
        '@type': 'SoftwareApplication',
        name: comparison.toolA.name,
        url: comparison.toolA.websiteUrl,
        ...(comparison.toolA.logoUrl && { image: comparison.toolA.logoUrl }),
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: comparison.toolA.ratings.overall,
          bestRating: 10,
          worstRating: 0,
          ratingCount: comparison.toolA.ratings.reviewCount || 1,
        },
      },
      {
        '@type': 'SoftwareApplication',
        name: comparison.toolB.name,
        url: comparison.toolB.websiteUrl,
        ...(comparison.toolB.logoUrl && { image: comparison.toolB.logoUrl }),
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: comparison.toolB.ratings.overall,
          bestRating: 10,
          worstRating: 0,
          ratingCount: comparison.toolB.ratings.reviewCount || 1,
        },
      },
    ],
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '[data-speakable]'],
    },
  };
}

// --- COMPARISON ITEM LIST SCHEMA (enables ranking carousel for compared tools) ---
export function generateComparisonItemListSchema(comparison: Comparison) {
  const aScore = comparison.toolA.ratings.overall;
  const bScore = comparison.toolB.ratings.overall;
  const tools = aScore >= bScore
    ? [comparison.toolA, comparison.toolB]
    : [comparison.toolB, comparison.toolA];

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${comparison.toolA.name} vs ${comparison.toolB.name} — Ranked by Score`,
    url: `${SITE_URL}/${comparison.categorySlug}/compare/${comparison.slug}`,
    numberOfItems: 2,
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
          ratingCount: tool.ratings.reviewCount || 1,
        },
      },
    })),
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

// --- BLOG SCHEMA (Person author with E-E-A-T signals — sameAs, knowsAbout, jobTitle) ---
export function generateBlogSchema(post: BlogPost) {
  const authorData = getAuthor(post.author);

  // Calculate word count for schema
  const wordCount = (post.content || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    wordCount,
    inLanguage: 'en-US',
    author: {
      '@type': authorData.slug === 'editorial-team' ? 'Organization' : 'Person',
      name: authorData.name,
      url: getAuthorUrl(post.author),
      ...(authorData.slug !== 'editorial-team' && {
        jobTitle: authorData.role,
        knowsAbout: authorData.knowsAbout,
        sameAs: authorData.sameAs,
        worksFor: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
        },
      }),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/opengraph-image`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '[data-speakable]'],
    },
    // Article categorization
    ...(post.categorySlug && {
      articleSection: post.categorySlug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c: string) => c.toUpperCase()),
    }),
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

// --- COMPARISON HUB SCHEMA (ItemList of comparisons for a category) ---
export function generateComparisonHubSchema(
  categoryName: string,
  categorySlug: string,
  comparisons: { slug: string; toolA: { name: string }; toolB: { name: string } }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} Comparisons — Side-by-Side Tool Reviews`,
    url: `${SITE_URL}/${categorySlug}/compare`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: comparisons.length,
      itemListElement: comparisons.slice(0, 20).map((comp, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: `${comp.toolA.name} vs ${comp.toolB.name}`,
        url: `${SITE_URL}/${categorySlug}/compare/${comp.slug}`,
      })),
    },
  };
}

// --- PRICING PAGE SCHEMA (SoftwareApplication with detailed Offers) ---
export function generatePricingSchema(
  tool: { name: string; tagline: string; categorySlug: string; slug: string; logoUrl?: string; websiteUrl?: string; ratings: { overall: number; reviewCount?: number }; pricing: { hasFreeplan: boolean; startingPrice: number | null; currency?: string; plans?: { name: string; price: number | null; billingCycle?: string }[] } },
  categoryName: string,
) {
  const plans = tool.pricing.plans || [];
  const paidPlans = plans.filter((p) => p.price != null && p.price > 0);

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.tagline,
    url: `${SITE_URL}/${tool.categorySlug}/${tool.slug}/pricing`,
    applicationCategory: categoryName,
    operatingSystem: 'Web, iOS, Android',
    ...(tool.logoUrl && { image: tool.logoUrl }),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tool.ratings.overall,
      bestRating: 10,
      worstRating: 0,
      ratingCount: tool.ratings.reviewCount || 1,
    },
    ...(paidPlans.length > 0 && {
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: tool.pricing.hasFreeplan ? 0 : Math.min(...paidPlans.map((p) => p.price!)),
        highPrice: Math.max(...paidPlans.map((p) => p.price!)),
        priceCurrency: tool.pricing.currency || 'USD',
        offerCount: plans.length,
        offers: plans.map((plan) => ({
          '@type': 'Offer',
          name: plan.name,
          price: plan.price ?? 0,
          priceCurrency: tool.pricing.currency || 'USD',
          availability: 'https://schema.org/InStock',
          url: tool.websiteUrl || `${SITE_URL}/${tool.categorySlug}/${tool.slug}/pricing`,
        })),
      },
    }),
  };
}

// --- BUYER'S GUIDE SCHEMA (HowTo for category pages) ---
export function generateBuyersGuideSchema(
  categoryName: string,
  categorySlug: string,
  steps: { title: string; text: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Choose the Best ${categoryName} (${new Date().getFullYear()})`,
    description: `Step-by-step guide to selecting the right ${categoryName.toLowerCase()} for your needs.`,
    url: `${SITE_URL}/${categorySlug}`,
    totalTime: 'PT5M',
    step: steps.map((s, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: s.title,
      text: s.text,
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
    foundingDate: '2026',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: 5,
    },
    sameAs: [
      'https://twitter.com/propicked',
      'https://linkedin.com/company/propicked',
      'https://youtube.com/@propicked',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: `${SITE_URL}/contact`,
      availableLanguage: 'English',
    },
    knowsAbout: [
      'Software Reviews',
      'SaaS Tools',
      'AI Tools',
      'E-commerce Platforms',
      'Digital Marketing Tools',
      'Web Hosting',
      'Business Software',
    ],
  };
}

// --- HOW-TO SCHEMA (Calculator pages — rich snippet in Google) ---
export function generateCalculatorHowToSchema(
  title: string,
  description: string,
  calculatorType: string,
  steps: { name: string; text: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description,
    url: `${SITE_URL}/calculators/${calculatorType}`,
    totalTime: 'PT2M',
    tool: {
      '@type': 'HowToTool',
      name: `${SITE_NAME} ${title}`,
    },
    step: steps.map((step, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: step.name,
      text: step.text,
      url: `${SITE_URL}/calculators/${calculatorType}#step-${idx + 1}`,
    })),
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

// --- WEB APPLICATION SCHEMA (for calculator/interactive tool pages — rich snippets) ---
export function generateWebApplicationSchema(
  title: string,
  description: string,
  calculatorType: string,
  categoryName: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title,
    description,
    url: `${SITE_URL}/calculators/${calculatorType}`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: `Free ${categoryName} calculator, instant results, no signup required`,
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

// --- GLOSSARY SCHEMA (DefinedTermSet for glossary pages) ---
export function generateGlossarySchema(
  terms: { term: string; definition: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: `${SITE_NAME} Glossary — Digital Tools & Technology Terms`,
    url: `${SITE_URL}/glossary`,
    description: `Comprehensive glossary of ${terms.length} digital tools, SaaS, AI, and technology terms explained simply.`,
    hasDefinedTerm: terms.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.term,
      description: t.definition,
    })),
  };
}

// --- PROFILE PAGE SCHEMA (for author/team pages — E-E-A-T) ---
export function generateProfilePageSchema(
  authors: { name: string; role: string; bio: string; sameAs: string[]; knowsAbout: string[]; slug: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: `${SITE_NAME} Editorial Team`,
    url: `${SITE_URL}/about/team`,
    mainEntity: authors.map((author) => ({
      '@type': 'Person',
      name: author.name,
      jobTitle: author.role,
      description: author.bio,
      url: `${SITE_URL}/about/team#${author.slug}`,
      sameAs: author.sameAs,
      knowsAbout: author.knowsAbout,
      worksFor: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
    })),
  };
}

// --- WEBSITE SCHEMA (with SearchAction for sitelinks search box) ---
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Compare the best digital tools across AI, SaaS, E-commerce, Marketing, Hosting & Business.',
    inLanguage: 'en-US',
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

// --- HOW-TO SCHEMA for Category Evaluation (rich snippet — "How to choose the best X") ---
export function generateEvaluationHowToSchema(categoryName: string, categorySlug: string) {
  const year = new Date().getFullYear();
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Choose the Best ${categoryName} in ${year}`,
    description: `A step-by-step guide to evaluating and selecting the right ${categoryName.toLowerCase()} for your needs, based on ${SITE_NAME}'s expert methodology.`,
    url: `${SITE_URL}/${categorySlug}`,
    totalTime: 'PT10M',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Define your requirements',
        text: `Start by listing your must-have features and budget constraints. Consider team size, use case complexity, and integration needs with your existing ${categoryName.toLowerCase()} stack.`,
        url: `${SITE_URL}/${categorySlug}#requirements`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Compare features and ratings',
        text: `Use our feature comparison tables and expert ratings across four dimensions: ease of use, feature completeness, value for money, and customer support quality. Each tool is scored on a 0-10 scale.`,
        url: `${SITE_URL}/${categorySlug}#features`,
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Evaluate pricing and free plans',
        text: 'Compare pricing tiers across tools. Many offer free plans or trials — take advantage of these to test before committing. Consider total cost of ownership including add-ons and scaling costs.',
        url: `${SITE_URL}/${categorySlug}#pricing`,
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Read head-to-head comparisons',
        text: `Browse our detailed side-by-side comparisons to see exactly how your top picks stack up against each other on features, pricing, ease of use, and support.`,
        url: `${SITE_URL}/${categorySlug}/compare`,
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Start a free trial or free plan',
        text: 'Once you\'ve narrowed your options, sign up for a free trial or free plan. Test the tool with your actual workflow before making a purchase decision.',
        url: `${SITE_URL}/${categorySlug}`,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

// --- SITE NAVIGATION SCHEMA (helps Google understand site structure) ---
export function generateSiteNavigationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: 'Main Navigation',
    hasPart: [
      { '@type': 'SiteNavigationElement', name: 'AI Tools', url: `${SITE_URL}/ai-tools` },
      { '@type': 'SiteNavigationElement', name: 'SaaS', url: `${SITE_URL}/saas` },
      { '@type': 'SiteNavigationElement', name: 'E-commerce', url: `${SITE_URL}/ecommerce` },
      { '@type': 'SiteNavigationElement', name: 'Marketing', url: `${SITE_URL}/marketing` },
      { '@type': 'SiteNavigationElement', name: 'Hosting', url: `${SITE_URL}/hosting` },
      { '@type': 'SiteNavigationElement', name: 'Business', url: `${SITE_URL}/business` },
      { '@type': 'SiteNavigationElement', name: 'Blog', url: `${SITE_URL}/blog` },
      { '@type': 'SiteNavigationElement', name: 'Best Of', url: `${SITE_URL}/best` },
      { '@type': 'SiteNavigationElement', name: 'Search', url: `${SITE_URL}/search` },
    ],
  };
}
