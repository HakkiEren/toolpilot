/**
 * UPGRADE LOGOS — Google Favicon → Clearbit
 *
 * Clearbit provides much higher quality logos (SVG/PNG, ~200px)
 * compared to Google Favicons (16-128px, often blurry).
 *
 * This script:
 * 1. Fetches all tools with Google Favicon logos
 * 2. Tries Clearbit API for each domain
 * 3. If Clearbit has a logo, updates the database
 * 4. If not, keeps the Google Favicon
 *
 * Usage: node scripts/upgrade-to-clearbit.js
 */

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gqqgbfoniyfbpbognnks.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcWdiZm9uaXlmYnBib2dubmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2MTE5MiwiZXhwIjoyMDg4MTM3MTkyfQ.6oFu47JKMXsCIaD7vokhGc0AOlnqyn6Y-oExSy0pcDE'
);

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
    // Clearbit returns 200 with actual image, or redirects to a placeholder
    if (!res.ok) return false;
    const contentType = res.headers.get('content-type') || '';
    return contentType.startsWith('image/');
  } catch {
    return false;
  }
}

// Process in batches to avoid rate limits
async function processBatch(tools, batchSize = 10) {
  let upgraded = 0;
  let kept = 0;
  let errors = 0;

  for (let i = 0; i < tools.length; i += batchSize) {
    const batch = tools.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map(async (tool) => {
        let domain;
        try {
          domain = new URL(tool.website_url).hostname.replace('www.', '');
        } catch {
          return { tool, status: 'skip', reason: 'invalid URL' };
        }

        const clearbitUrl = `https://logo.clearbit.com/${domain}`;
        const hasClearbit = await checkUrl(clearbitUrl);

        if (hasClearbit) {
          const { error } = await supabase
            .from('tools')
            .update({ logo_url: clearbitUrl })
            .eq('id', tool.id);

          if (!error) {
            return { tool, status: 'upgraded', url: clearbitUrl };
          }
          return { tool, status: 'error', reason: error.message };
        }
        return { tool, status: 'kept', reason: 'no Clearbit logo' };
      })
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const r = result.value;
        if (r.status === 'upgraded') {
          console.log(`  ✓ ${r.tool.name} → ${r.url}`);
          upgraded++;
        } else if (r.status === 'kept') {
          kept++;
        } else if (r.status === 'error') {
          console.log(`  ✗ ${r.tool.name}: ${r.reason}`);
          errors++;
        }
      }
    }

    // Progress indicator
    const progress = Math.min(i + batchSize, tools.length);
    process.stdout.write(`\r  Progress: ${progress}/${tools.length} (${upgraded} upgraded, ${kept} kept)`);
  }

  console.log(''); // newline after progress
  return { upgraded, kept, errors };
}

async function main() {
  console.log('🔄 Upgrading tool logos from Google Favicon to Clearbit...\n');

  // Fetch all tools with Google Favicon logos
  const { data: tools, error } = await supabase
    .from('tools')
    .select('id, name, website_url, logo_url')
    .eq('status', 'published')
    .like('logo_url', '%google.com/s2/favicons%');

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  console.log(`Found ${tools.length} tools with Google Favicon logos.\n`);

  if (tools.length === 0) {
    console.log('All logos already upgraded! Nothing to do.');
    return;
  }

  const { upgraded, kept, errors } = await processBatch(tools);

  console.log(`\n✅ Done!`);
  console.log(`   Upgraded to Clearbit: ${upgraded}`);
  console.log(`   Kept Google Favicon:  ${kept}`);
  console.log(`   Errors:               ${errors}`);
  console.log(`   Total processed:      ${tools.length}`);
}

main();
