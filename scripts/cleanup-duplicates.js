/**
 * Duplicate Tool Cleanup Script
 * Finds tools with identical names, keeps the highest-rated one,
 * and safely removes duplicates after checking comparison references.
 */

const SUPABASE_URL = 'https://gqqgbfoniyfbpbognnks.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcWdiZm9uaXlmYnBib2dubmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2MTE5MiwiZXhwIjoyMDg4MTM3MTkyfQ.6oFu47JKMXsCIaD7vokhGc0AOlnqyn6Y-oExSy0pcDE';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal',
};

async function fetchAll(table, select = '*', extraParams = '') {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=${encodeURIComponent(select)}${extraParams}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to fetch ${table}: ${res.status} ${res.statusText} — ${body}`);
  }
  return res.json();
}

async function deleteRow(table, id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error(`Failed to delete ${table} id=${id}: ${res.statusText}`);
  return true;
}

async function main() {
  console.log('=== Duplicate Tool Cleanup ===\n');

  // 1. Fetch all tools
  const tools = await fetchAll('tools', 'id,name,slug,category_slug,ratings_overall');
  console.log(`Total tools: ${tools.length}`);

  // 2. Group by name
  const groups = {};
  for (const t of tools) {
    if (!groups[t.name]) groups[t.name] = [];
    groups[t.name].push(t);
  }

  const dupes = Object.entries(groups).filter(([, arr]) => arr.length > 1);
  console.log(`Duplicate groups: ${dupes.length}\n`);

  if (dupes.length === 0) {
    console.log('No duplicates found!');
    return;
  }

  // 3. Fetch all comparisons to check references
  const comparisons = await fetchAll('comparisons', 'id,slug,tool_a_id,tool_b_id');
  console.log(`Total comparisons: ${comparisons.length}\n`);

  const toDelete = [];
  const toKeep = [];

  for (const [name, entries] of dupes) {
    // Sort by overall rating descending, keep the best one
    entries.sort((a, b) => {
      const rA = a.ratings_overall || 0;
      const rB = b.ratings_overall || 0;
      return rB - rA;
    });

    const keep = entries[0];
    const remove = entries.slice(1);

    console.log(`📦 ${name} (${entries.length} entries)`);
    console.log(`   ✅ KEEP: id=${keep.id}, slug=${keep.slug}, cat=${keep.category_slug}, rating=${keep.ratings_overall || 'N/A'}`);

    for (const r of remove) {
      // Check if this tool is referenced in any comparison
      const refs = comparisons.filter(c => c.tool_a_id === r.id || c.tool_b_id === r.id);
      if (refs.length > 0) {
        console.log(`   ⚠️  SKIP: id=${r.id}, slug=${r.slug} — referenced in ${refs.length} comparison(s): ${refs.map(c => c.slug).join(', ')}`);
        // We'll update comparison references instead of skipping
        toDelete.push({ ...r, compRefs: refs, keepId: keep.id });
      } else {
        console.log(`   🗑️  DELETE: id=${r.id}, slug=${r.slug}, cat=${r.category_slug}, rating=${r.ratings_overall || 'N/A'}`);
        toDelete.push({ ...r, compRefs: [], keepId: keep.id });
      }
    }
    toKeep.push(keep);
    console.log('');
  }

  console.log(`\n=== Summary ===`);
  console.log(`Keep: ${toKeep.length} tools`);
  console.log(`Delete: ${toDelete.length} tools`);
  console.log(`With comparison refs: ${toDelete.filter(d => d.compRefs.length > 0).length}\n`);

  // 4. DRY RUN mode — pass --execute to actually delete
  const execute = process.argv.includes('--execute');

  if (!execute) {
    console.log('🔍 DRY RUN — pass --execute to actually delete');
    return;
  }

  console.log('🚀 EXECUTING DELETIONS...\n');

  // 5. First, update comparison references
  for (const d of toDelete) {
    for (const comp of d.compRefs) {
      const updates = {};
      if (comp.tool_a_id === d.id) updates.tool_a_id = d.keepId;
      if (comp.tool_b_id === d.id) updates.tool_b_id = d.keepId;

      console.log(`   Updating comparison ${comp.slug}: ${JSON.stringify(updates)}`);
      const res = await fetch(`${SUPABASE_URL}/rest/v1/comparisons?id=eq.${comp.id}`, {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        console.log(`   ❌ Failed to update comparison ${comp.id}: ${res.statusText}`);
      }
    }
  }

  // 6. Delete duplicate tools
  let deleted = 0;
  for (const d of toDelete) {
    try {
      await deleteRow('tools', d.id);
      console.log(`   ✅ Deleted: ${d.name} (id=${d.id}, slug=${d.slug})`);
      deleted++;
    } catch (err) {
      console.log(`   ❌ Failed to delete ${d.name} (id=${d.id}): ${err.message}`);
    }
  }

  console.log(`\n✅ Done! Deleted ${deleted}/${toDelete.length} duplicate tools.`);

  // 7. Verify final count
  const remaining = await fetchAll('tools', 'id');
  console.log(`Final tool count: ${remaining.length}`);
}

main().catch(console.error);
