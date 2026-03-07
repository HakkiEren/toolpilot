#!/usr/bin/env npx tsx
/**
 * SEO Validation Script — Quick health check for ProPicked
 * Run: npx tsx scripts/validate-seo.ts
 *
 * Checks:
 * 1. All JSON-LD schemas are valid JSON
 * 2. Required schema types exist on key pages
 * 3. Sitemap is accessible
 * 4. robots.txt is accessible
 * 5. RSS feed is accessible
 * 6. OG images exist for key routes
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://propicked.com';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  detail: string;
}

const results: CheckResult[] = [];

async function checkUrl(url: string, name: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    if (res.ok) {
      results.push({ name, status: 'pass', detail: `${res.status} OK` });
      return true;
    }
    results.push({ name, status: 'fail', detail: `${res.status} ${res.statusText}` });
    return false;
  } catch (err) {
    results.push({ name, status: 'fail', detail: `Network error: ${(err as Error).message}` });
    return false;
  }
}

async function checkJsonLd(url: string, expectedTypes: string[]): Promise<void> {
  try {
    const res = await fetch(url);
    const html = await res.text();

    // Extract JSON-LD scripts
    const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    const schemas: unknown[] = [];
    let match;

    while ((match = jsonLdRegex.exec(html)) !== null) {
      try {
        schemas.push(JSON.parse(match[1]));
      } catch {
        results.push({
          name: `JSON-LD Parse: ${url}`,
          status: 'fail',
          detail: `Invalid JSON in LD+JSON script`,
        });
      }
    }

    if (schemas.length === 0) {
      results.push({
        name: `JSON-LD Count: ${url}`,
        status: 'warn',
        detail: `No JSON-LD scripts found`,
      });
      return;
    }

    results.push({
      name: `JSON-LD Count: ${url}`,
      status: 'pass',
      detail: `${schemas.length} schema(s) found`,
    });

    // Check for expected types
    for (const expectedType of expectedTypes) {
      const found = schemas.some((schema: any) => {
        const type = schema?.['@type'];
        if (Array.isArray(type)) return type.includes(expectedType);
        return type === expectedType;
      });

      results.push({
        name: `Schema Type "${expectedType}": ${url}`,
        status: found ? 'pass' : 'warn',
        detail: found ? 'Found' : 'Missing',
      });
    }
  } catch (err) {
    results.push({
      name: `Fetch: ${url}`,
      status: 'fail',
      detail: `Error: ${(err as Error).message}`,
    });
  }
}

async function checkMeta(url: string, requiredMeta: string[]): Promise<void> {
  try {
    const res = await fetch(url);
    const html = await res.text();

    for (const meta of requiredMeta) {
      const found = html.includes(meta);
      results.push({
        name: `Meta "${meta}": ${url}`,
        status: found ? 'pass' : 'warn',
        detail: found ? 'Found' : 'Missing',
      });
    }
  } catch (err) {
    results.push({
      name: `Meta Check: ${url}`,
      status: 'fail',
      detail: `Error: ${(err as Error).message}`,
    });
  }
}

async function main() {
  console.log(`\n🔍 ProPicked SEO Health Check\n${'='.repeat(50)}`);
  console.log(`Site: ${SITE_URL}\n`);

  // 1. Core files
  console.log('📋 Core SEO Files...');
  await checkUrl(`${SITE_URL}/sitemap.xml`, 'Sitemap XML');
  await checkUrl(`${SITE_URL}/robots.txt`, 'Robots.txt');
  await checkUrl(`${SITE_URL}/feed.xml`, 'RSS Feed');
  await checkUrl(`${SITE_URL}/manifest.webmanifest`, 'Web App Manifest');

  // 2. Homepage schema
  console.log('\n🏠 Homepage...');
  await checkJsonLd(SITE_URL, ['Organization', 'WebSite', 'SiteNavigationElement', 'HowTo', 'FAQPage']);

  // 3. Homepage meta
  await checkMeta(SITE_URL, ['og:title', 'og:description', 'twitter:card', 'canonical']);

  // 4. Sample pages (if accessible)
  console.log('\n📄 Sample Pages...');
  await checkUrl(`${SITE_URL}/ai-tools`, 'Category Page');
  await checkUrl(`${SITE_URL}/best`, 'Best-of Index');
  await checkUrl(`${SITE_URL}/blog`, 'Blog Index');
  await checkUrl(`${SITE_URL}/glossary`, 'Glossary');
  await checkUrl(`${SITE_URL}/about`, 'About');

  // 5. OG images
  console.log('\n🖼️  OG Images...');
  await checkUrl(`${SITE_URL}/opengraph-image`, 'Homepage OG Image');

  // Print results
  console.log(`\n${'='.repeat(50)}`);
  console.log('📊 Results Summary\n');

  const passes = results.filter(r => r.status === 'pass');
  const fails = results.filter(r => r.status === 'fail');
  const warns = results.filter(r => r.status === 'warn');

  if (fails.length > 0) {
    console.log(`❌ FAILS (${fails.length}):`);
    fails.forEach(r => console.log(`   • ${r.name}: ${r.detail}`));
  }

  if (warns.length > 0) {
    console.log(`⚠️  WARNINGS (${warns.length}):`);
    warns.forEach(r => console.log(`   • ${r.name}: ${r.detail}`));
  }

  console.log(`\n✅ ${passes.length} passed  ⚠️ ${warns.length} warnings  ❌ ${fails.length} failed`);
  console.log(`Total checks: ${results.length}\n`);

  process.exit(fails.length > 0 ? 1 : 0);
}

main().catch(console.error);
