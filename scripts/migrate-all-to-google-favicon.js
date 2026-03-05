const SUPABASE_URL = 'https://gqqgbfoniyfbpbognnks.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcWdiZm9uaXlmYnBib2dubmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2MTE5MiwiZXhwIjoyMDg4MTM3MTkyfQ.6oFu47JKMXsCIaD7vokhGc0AOlnqyn6Y-oExSy0pcDE';

async function migrateAll() {
  // 1. Fetch all tools
  const res = await fetch(`${SUPABASE_URL}/rest/v1/tools?select=id,name,logo_url,website_url&order=name`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  });
  const tools = await res.json();

  // Filter tools that still use Clearbit
  const clearbitTools = tools.filter(t => t.logo_url && t.logo_url.includes('clearbit.com'));
  console.log(`Toplam: ${tools.length} arac`);
  console.log(`Clearbit kullanan: ${clearbitTools.length}`);
  console.log(`Google Favicon kullanan: ${tools.length - clearbitTools.length}`);

  if (clearbitTools.length === 0) {
    console.log('\nHepsi zaten Google Favicon kullanıyor!');
    return;
  }

  console.log(`\n${clearbitTools.length} logoyu Google Favicon'a geciriyor...\n`);

  let updated = 0;
  let failed = 0;

  for (const tool of clearbitTools) {
    // Extract domain from clearbit URL: https://logo.clearbit.com/domain.com -> domain.com
    let domain = null;

    if (tool.logo_url.includes('clearbit.com/')) {
      domain = tool.logo_url.split('clearbit.com/')[1];
    }

    // Fallback: try to extract from website_url
    if (!domain && tool.website_url) {
      try {
        domain = new URL(tool.website_url).hostname;
      } catch (e) {
        try {
          domain = new URL('https://' + tool.website_url).hostname;
        } catch (e2) {}
      }
    }

    if (!domain) {
      console.log(`  ATLA: ${tool.name} - domain bulunamadi`);
      failed++;
      continue;
    }

    const newLogoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

    // Update in Supabase
    const updateRes = await fetch(
      `${SUPABASE_URL}/rest/v1/tools?id=eq.${tool.id}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ logo_url: newLogoUrl }),
      }
    );

    if (updateRes.ok) {
      updated++;
    } else {
      console.log(`  DB HATA: ${tool.name} - ${updateRes.status}`);
      failed++;
    }
  }

  console.log(`\nSonuc: ${updated} guncellendi, ${failed} basarisiz`);
}

migrateAll();
