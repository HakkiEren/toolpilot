const SUPABASE_URL = 'https://gqqgbfoniyfbpbognnks.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcWdiZm9uaXlmYnBib2dubmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2MTE5MiwiZXhwIjoyMDg4MTM3MTkyfQ.6oFu47JKMXsCIaD7vokhGc0AOlnqyn6Y-oExSy0pcDE';

const fixes = [
  {
    name: 'Notion Calendar',
    website_url: 'https://www.notion.so/product/calendar',
    logo_url: 'https://logo.clearbit.com/notion.so',
  },
  {
    name: 'v0 by Vercel',
    website_url: 'https://v0.dev',
    logo_url: 'https://logo.clearbit.com/vercel.com',
  },
];

async function fix() {
  for (const tool of fixes) {
    // First verify the logo URL actually works
    try {
      const logoRes = await fetch(tool.logo_url, { method: 'HEAD', redirect: 'follow' });
      if (!logoRes.ok) {
        // Fallback to Google Favicon
        const domain = new URL(tool.website_url).hostname;
        tool.logo_url = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        console.log(`${tool.name}: Clearbit basarisiz, Google Favicon kullaniliyor`);
      } else {
        console.log(`${tool.name}: Clearbit logo OK`);
      }
    } catch (e) {
      const domain = new URL(tool.website_url).hostname;
      tool.logo_url = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      console.log(`${tool.name}: Clearbit hata, Google Favicon kullaniliyor`);
    }

    // Update in Supabase
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
        body: JSON.stringify({
          logo_url: tool.logo_url,
          website_url: tool.website_url,
        }),
      }
    );

    if (res.ok) {
      console.log(`${tool.name}: Guncellendi - ${tool.logo_url}`);
    } else {
      console.log(`${tool.name}: HATA - ${res.status} ${await res.text()}`);
    }
  }
}

fix();
