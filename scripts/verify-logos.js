const SUPABASE_URL = 'https://gqqgbfoniyfbpbognnks.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcWdiZm9uaXlmYnBib2dubmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2MTE5MiwiZXhwIjoyMDg4MTM3MTkyfQ.6oFu47JKMXsCIaD7vokhGc0AOlnqyn6Y-oExSy0pcDE';

async function verify() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/tools?select=name,logo_url,website_url&order=name`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  });
  const tools = await res.json();

  console.log(`${tools.length} aracin logosu kontrol ediliyor...\n`);

  const broken = [];
  const batch = 20; // concurrent requests

  for (let i = 0; i < tools.length; i += batch) {
    const chunk = tools.slice(i, i + batch);
    const results = await Promise.allSettled(
      chunk.map(async (t) => {
        try {
          const r = await fetch(t.logo_url, { method: 'HEAD', redirect: 'follow' });
          if (!r.ok) {
            return { name: t.name, url: t.logo_url, website: t.website_url, status: r.status };
          }
          return null;
        } catch (e) {
          return { name: t.name, url: t.logo_url, website: t.website_url, status: 'ERR' };
        }
      })
    );

    for (const r of results) {
      if (r.status === 'fulfilled' && r.value) {
        broken.push(r.value);
      }
    }

    process.stdout.write(`  ${Math.min(i + batch, tools.length)}/${tools.length}\r`);
  }

  console.log(`\n\nSonuc: ${tools.length - broken.length} calisiyor, ${broken.length} kirik`);

  if (broken.length > 0) {
    console.log('\nKirik logolar:');
    broken.forEach(b => console.log(`  - ${b.name} (${b.status}) | ${b.url}`));
  }
}

verify();
