/**
 * Logo Upgrade Script
 * Upgrades tool logos from Google Favicon API to Clearbit Logo API
 * Clearbit provides higher quality, professionally designed logos
 * Falls back to Google Favicon if Clearbit doesn't have the logo
 */

const SUPABASE_URL = 'https://gqqgbfoniyfbpbognnks.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcWdiZm9uaXlmYnBib2dubmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2MTE5MiwiZXhwIjoyMDg4MTM3MTkyfQ.6oFu47JKMXsCIaD7vokhGc0AOlnqyn6Y-oExSy0pcDE';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

function extractDomain(url) {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    // Clearbit returns 200 with actual image, or redirects
    return res.ok && res.headers.get('content-type')?.startsWith('image/');
  } catch {
    return false;
  }
}

async function main() {
  console.log('=== Logo Upgrade: Google Favicon → Clearbit ===\n');

  // Fetch all tools
  const res = await fetch(`${SUPABASE_URL}/rest/v1/tools?select=id,name,logo_url,website_url&order=name`, { headers });
  const tools = await res.json();
  console.log(`Total tools: ${tools.length}`);

  // Filter tools currently using Google Favicon
  const faviconTools = tools.filter(t => t.logo_url && t.logo_url.includes('google.com/s2/favicons'));
  console.log(`Using Google Favicon: ${faviconTools.length}`);
  console.log(`Already using Clearbit: ${tools.filter(t => t.logo_url && t.logo_url.includes('clearbit')).length}\n`);

  const execute = process.argv.includes('--execute');
  let upgraded = 0;
  let failed = 0;
  let skipped = 0;

  for (const tool of faviconTools) {
    // Extract domain from website_url or from existing favicon URL
    let domain = null;
    if (tool.website_url) {
      domain = extractDomain(tool.website_url);
    } else {
      // Try to extract from favicon URL: ?domain=X&
      const match = tool.logo_url.match(/domain=([^&]+)/);
      if (match) domain = match[1];
    }

    if (!domain) {
      console.log(`   ⚠️ ${tool.name}: No domain found, skipping`);
      skipped++;
      continue;
    }

    const clearbitUrl = `https://logo.clearbit.com/${domain}`;

    // Check if Clearbit has this logo
    const exists = await checkUrl(clearbitUrl);

    if (exists) {
      if (execute) {
        const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/tools?id=eq.${tool.id}`, {
          method: 'PATCH',
          headers: { ...headers, 'Prefer': 'return=minimal' },
          body: JSON.stringify({ logo_url: clearbitUrl }),
        });
        if (patchRes.ok) {
          console.log(`   ✅ ${tool.name}: ${domain} → Clearbit`);
          upgraded++;
        } else {
          console.log(`   ❌ ${tool.name}: DB update failed`);
          failed++;
        }
      } else {
        console.log(`   ✅ ${tool.name}: ${domain} → would upgrade to Clearbit`);
        upgraded++;
      }
    } else {
      // Keep Google Favicon
      skipped++;
    }

    // Small delay to be nice to Clearbit API
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\n=== Summary ===`);
  console.log(`Upgraded: ${upgraded}`);
  console.log(`Failed: ${failed}`);
  console.log(`Skipped (no Clearbit): ${skipped}`);
  console.log(`Total: ${faviconTools.length}`);

  if (!execute) {
    console.log('\n🔍 DRY RUN — pass --execute to actually update logos');
  }
}

main().catch(console.error);
