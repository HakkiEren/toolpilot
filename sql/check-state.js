const { createClient } = require('@supabase/supabase-js');
const s = createClient(
  'https://gqqgbfoniyfbpbognnks.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcWdiZm9uaXlmYnBib2dubmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2MTE5MiwiZXhwIjoyMDg4MTM3MTkyfQ.6oFu47JKMXsCIaD7vokhGc0AOlnqyn6Y-oExSy0pcDE'
);

async function check() {
  const {count:tc} = await s.from('tools').select('id',{count:'exact',head:true});
  const {count:cc} = await s.from('comparisons').select('id',{count:'exact',head:true});
  const {count:bc} = await s.from('blog_posts').select('id',{count:'exact',head:true});
  const {data:cats} = await s.from('tools').select('category_slug');
  const dist = {};
  cats.forEach(t => { dist[t.category_slug] = (dist[t.category_slug]||0)+1; });
  console.log('Tools:', tc, 'Comparisons:', cc, 'Blog Posts:', bc);
  console.log('Distribution:', JSON.stringify(dist));

  const {data:toolSlugs} = await s.from('tools').select('slug,category_slug').order('category_slug');
  const byCat = {};
  toolSlugs.forEach(t => {
    if (!byCat[t.category_slug]) byCat[t.category_slug] = [];
    byCat[t.category_slug].push(t.slug);
  });
  Object.keys(byCat).sort().forEach(cat => {
    console.log('\n' + cat + ' (' + byCat[cat].length + '):');
    console.log(byCat[cat].join(', '));
  });

  // Also show existing comparison slugs
  const {data:compSlugs} = await s.from('comparisons').select('slug,category_slug').order('category_slug');
  console.log('\n\n=== EXISTING COMPARISONS ===');
  const compByCat = {};
  compSlugs.forEach(c => {
    if (!compByCat[c.category_slug]) compByCat[c.category_slug] = [];
    compByCat[c.category_slug].push(c.slug);
  });
  Object.keys(compByCat).sort().forEach(cat => {
    console.log('\n' + cat + ' (' + compByCat[cat].length + '):');
    console.log(compByCat[cat].join(', '));
  });
}
check();
