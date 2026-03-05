const SUPABASE_URL = 'https://gqqgbfoniyfbpbognnks.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcWdiZm9uaXlmYnBib2dubmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2MTE5MiwiZXhwIjoyMDg4MTM3MTkyfQ.6oFu47JKMXsCIaD7vokhGc0AOlnqyn6Y-oExSy0pcDE';

// Manual fixes for tools where Google Favicon also fails
const manualFixes = [
  {
    name: 'Closte',
    logo_url: 'https://www.google.com/s2/favicons?domain=www.closte.com&sz=128',
  },
  {
    name: 'Height',
    logo_url: 'https://www.google.com/s2/favicons?domain=www.height.app&sz=128',
  },
  {
    name: 'Platform.sh',
    // Platform.sh was acquired by Upsun
    logo_url: 'https://www.google.com/s2/favicons?domain=upsun.com&sz=128',
  },
];

async function fix() {
  for (const tool of manualFixes) {
    // Try the URL
    let logoUrl = tool.logo_url;
    try {
      const r = await fetch(logoUrl, { method: 'HEAD', redirect: 'follow' });
      if (!r.ok) {
        console.log(`  ${tool.name}: ${logoUrl} basarisiz (${r.status}), alternatif deneniyor...`);
        // Try without www
        const altUrl = logoUrl.replace('www.', '');
        const r2 = await fetch(altUrl, { method: 'HEAD', redirect: 'follow' });
        if (r2.ok) {
          logoUrl = altUrl;
        } else {
          console.log(`  ${tool.name}: Hicbir logo calismadi, bos birakiliyor`);
          continue;
        }
      }
    } catch (e) {
      console.log(`  ${tool.name}: Erisim hatasi, bos birakiliyor`);
      continue;
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/tools?name=eq.${encodeURIComponent(tool.name)}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ logo_url: logoUrl }),
      }
    );

    if (res.ok) {
      console.log(`  OK: ${tool.name} -> ${logoUrl}`);
    } else {
      console.log(`  DB HATA: ${tool.name} - ${res.status}`);
    }
  }
}

fix();
