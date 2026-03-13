// Insert all blog posts in batch
const { insertPost } = require('./insert-blog-post');
const fs = require('fs');
const path = require('path');

async function main() {
  const postsDir = path.join(__dirname, 'posts');
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.js')).sort();

  console.log(`Found ${files.length} post files to insert...\n`);

  let success = 0;
  let failed = 0;

  for (const file of files) {
    const post = require(path.join(postsDir, file));
    const result = await insertPost(post);
    if (result) success++;
    else failed++;
  }

  console.log(`\nDone! ✅ ${success} inserted, ❌ ${failed} failed`);
  process.exit(0);
}

main().catch(console.error);
