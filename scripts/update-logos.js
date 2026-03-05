const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gqqgbfoniyfbpbognnks.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcWdiZm9uaXlmYnBib2dubmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2MTE5MiwiZXhwIjoyMDg4MTM3MTkyfQ.6oFu47JKMXsCIaD7vokhGc0AOlnqyn6Y-oExSy0pcDE'
);

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
    return res.ok;
  } catch {
    return false;
  }
}

async function main() {
  const { data: tools, error } = await supabase
    .from('tools')
    .select('id, name, website_url, logo_url')
    .eq('status', 'published');

  if (error) { console.error('Error fetching tools:', error); return; }
  console.log(`Total tools: ${tools.length}`);

  let updated = 0;
  let alreadyHas = 0;
  let failed = 0;

  for (const tool of tools) {
    // Skip if already has a valid logo URL
    if (tool.logo_url && tool.logo_url.length > 10) {
      alreadyHas++;
      continue;
    }

    if (!tool.website_url) {
      console.log(`[SKIP] ${tool.name}: No website URL`);
      failed++;
      continue;
    }

    let domain;
    try {
      domain = new URL(tool.website_url).hostname.replace('www.', '');
    } catch {
      console.log(`[SKIP] ${tool.name}: Invalid URL "${tool.website_url}"`);
      failed++;
      continue;
    }

    // Try Clearbit first
    const clearbitUrl = `https://logo.clearbit.com/${domain}`;
    if (await checkUrl(clearbitUrl)) {
      const { error: updateError } = await supabase
        .from('tools')
        .update({ logo_url: clearbitUrl })
        .eq('id', tool.id);
      if (!updateError) {
        console.log(`[CLEARBIT] ${tool.name}: ${clearbitUrl}`);
        updated++;
        continue;
      }
    }

    // Fallback: Google favicon (128px, always works)
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    const { error: updateError } = await supabase
      .from('tools')
      .update({ logo_url: faviconUrl })
      .eq('id', tool.id);
    if (!updateError) {
      console.log(`[FAVICON] ${tool.name}: ${faviconUrl}`);
      updated++;
    } else {
      console.log(`[ERROR] ${tool.name}: ${updateError.message}`);
      failed++;
    }
  }

  console.log(`\nDone! Already had: ${alreadyHas} | Updated: ${updated} | Failed: ${failed} | Total: ${tools.length}`);
}

main();
