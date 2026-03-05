const SUPABASE_URL = 'https://gqqgbfoniyfbpbognnks.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcWdiZm9uaXlmYnBib2dubmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2MTE5MiwiZXhwIjoyMDg4MTM3MTkyfQ.6oFu47JKMXsCIaD7vokhGc0AOlnqyn6Y-oExSy0pcDE';

async function fixAll() {
  // 1. Fetch all tools
  const res = await fetch(`${SUPABASE_URL}/rest/v1/tools?select=id,name,slug,logo_url,website_url&order=name`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  });
  const tools = await res.json();
  console.log(`${tools.length} arac kontrol ediliyor...\n`);

  // 2. Check each logo
  const broken = [];
  const batch = 20;

  for (let i = 0; i < tools.length; i += batch) {
    const chunk = tools.slice(i, i + batch);
    const results = await Promise.allSettled(
      chunk.map(async (t) => {
        if (!t.logo_url) return t;
        try {
          const r = await fetch(t.logo_url, { method: 'HEAD', redirect: 'follow' });
          if (!r.ok) return t;
          return null; // OK
        } catch (e) {
          return t; // broken
        }
      })
    );

    for (const r of results) {
      if (r.status === 'fulfilled' && r.value) {
        broken.push(r.value);
      }
    }
    process.stdout.write(`  Kontrol: ${Math.min(i + batch, tools.length)}/${tools.length}\r`);
  }

  console.log(`\n${broken.length} kirik logo bulundu. Tamir ediliyor...\n`);

  // 3. Fix broken logos — use Google Favicon as primary, with domain extraction from website_url
  let fixed = 0;
  let failed = 0;

  for (const tool of broken) {
    let domain = null;

    // Try to extract domain from website_url
    if (tool.website_url) {
      try {
        domain = new URL(tool.website_url).hostname;
      } catch (e) {
        // try adding https
        try {
          domain = new URL('https://' + tool.website_url).hostname;
        } catch (e2) {}
      }
    }

    // Try to extract domain from current logo_url
    if (!domain && tool.logo_url) {
      if (tool.logo_url.includes('clearbit.com/')) {
        domain = tool.logo_url.split('clearbit.com/')[1];
      } else if (tool.logo_url.includes('domain=')) {
        domain = tool.logo_url.split('domain=')[1].split('&')[0];
      }
    }

    if (!domain) {
      console.log(`  ATLA: ${tool.name} - domain bulunamadi`);
      failed++;
      continue;
    }

    // Use Google Favicon API with size 128
    const newLogoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

    // Verify it works
    try {
      const checkRes = await fetch(newLogoUrl, { method: 'HEAD', redirect: 'follow' });
      if (!checkRes.ok) {
        console.log(`  HATA: ${tool.name} - Google Favicon da calismadi (${checkRes.status})`);
        failed++;
        continue;
      }
    } catch (e) {
      console.log(`  HATA: ${tool.name} - Google Favicon erisim hatasi`);
      failed++;
      continue;
    }

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
      fixed++;
      console.log(`  OK: ${tool.name} -> ${newLogoUrl}`);
    } else {
      failed++;
      console.log(`  DB HATA: ${tool.name} - ${updateRes.status}`);
    }
  }

  console.log(`\nSonuc: ${fixed} tamir edildi, ${failed} basarisiz`);
}

fixAll();
