const SUPABASE_URL = 'https://gqqgbfoniyfbpbognnks.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcWdiZm9uaXlmYnBib2dubmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2MTE5MiwiZXhwIjoyMDg4MTM3MTkyfQ.6oFu47JKMXsCIaD7vokhGc0AOlnqyn6Y-oExSy0pcDE';

async function check() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/tools?select=name,logo_url,website_url&order=name`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  });
  const tools = await res.json();

  const noLogo = tools.filter(t => !t.logo_url || t.logo_url.trim() === '');
  const hasLogo = tools.filter(t => t.logo_url && t.logo_url.trim() !== '');

  console.log('Toplam:', tools.length);
  console.log('Logosu var:', hasLogo.length);
  console.log('Logosu yok:', noLogo.length);

  if (noLogo.length > 0) {
    console.log('\nLogosuz araclar:');
    noLogo.forEach(t => console.log(` - ${t.name} | ${t.website_url || 'URL yok'}`));
  }

  // Also check for broken logos (non-Clearbit, non-Google)
  const otherLogos = hasLogo.filter(t => {
    return !t.logo_url.includes('clearbit.com') && !t.logo_url.includes('google.com/s2');
  });
  if (otherLogos.length > 0) {
    console.log('\nClearbit/Google disindaki logolar:');
    otherLogos.forEach(t => console.log(` - ${t.name} | ${t.logo_url}`));
  }
}

check();
