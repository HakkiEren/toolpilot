// Blog post insertion utility for ProPicked
// Usage: node scripts/insert-blog-post.js

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gqqgbfoniyfbpbognnks.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcWdiZm9uaXlmYnBib2dubmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2MTE5MiwiZXhwIjoyMDg4MTM3MTkyfQ.6oFu47JKMXsCIaD7vokhGc0AOlnqyn6Y-oExSy0pcDE'
);

async function insertPost(post) {
  const { data, error } = await supabase
    .from('blog_posts')
    .upsert({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category_slug: post.categorySlug,
      author: post.author || 'ProPicked Team',
      status: 'published',
      published_at: post.publishedAt || new Date().toISOString(),
      meta_title: post.metaTitle || `${post.title} | ProPicked`,
      meta_description: post.metaDescription || post.excerpt,
      related_tool_slugs: post.relatedToolSlugs || [],
      related_comparison_slugs: post.relatedComparisonSlugs || [],
    }, { onConflict: 'slug' });

  if (error) {
    console.error(`❌ Failed: ${post.slug}`, error.message);
    return false;
  }
  console.log(`✅ Inserted: ${post.slug}`);
  return true;
}

module.exports = { insertPost, supabase };
