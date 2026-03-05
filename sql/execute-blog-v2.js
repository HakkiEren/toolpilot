const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://gqqgbfoniyfbpbognnks.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcWdiZm9uaXlmYnBib2dubmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2MTE5MiwiZXhwIjoyMDg4MTM3MTkyfQ.6oFu47JKMXsCIaD7vokhGc0AOlnqyn6Y-oExSy0pcDE'
);

const file = process.argv[2];
if (!file) { console.error('Usage: node execute-blog-v2.js <file.sql>'); process.exit(1); }

function parseInserts(sql) {
  const results = [];
  const parts = sql.split(/(?=INSERT INTO )/g).filter(p => p.trim().startsWith('INSERT'));

  for (const part of parts) {
    const colMatch = part.match(/INSERT INTO \w+ \(([^)]+)\)/);
    if (!colMatch) continue;
    const columns = colMatch[1].split(',').map(c => c.trim());

    const valStart = part.indexOf('VALUES');
    if (valStart === -1) continue;
    const afterValues = part.substring(valStart + 6).trimStart();
    if (afterValues[0] !== '(') continue;

    let valuesStr = '';
    let depth = 0;
    for (let vi = 0; vi < afterValues.length; vi++) {
      if (afterValues[vi] === '(' && depth === 0) { depth++; continue; }
      if (afterValues[vi] === "'") {
        valuesStr += afterValues[vi]; vi++;
        while (vi < afterValues.length) {
          if (afterValues[vi] === "'" && afterValues[vi+1] === "'") { valuesStr += "''"; vi += 2; continue; }
          if (afterValues[vi] === "'") { valuesStr += "'"; break; }
          valuesStr += afterValues[vi]; vi++;
        }
        continue;
      }
      if (afterValues[vi] === '(') depth++;
      if (afterValues[vi] === ')') {
        depth--;
        if (depth <= 0) break;
      }
      valuesStr += afterValues[vi];
    }
    if (!valuesStr.trim()) continue;

    const values = parseValues(valuesStr);
    if (columns.length === values.length) {
      const row = {};
      columns.forEach((col, idx) => { row[col] = values[idx]; });
      results.push(row);
    } else {
      console.log(`Warning: ${columns.length} cols != ${values.length} vals`);
    }
  }
  return results;
}

function parseValues(str) {
  const values = [];
  let i = 0;
  while (i < str.length) {
    while (i < str.length && /[\s]/.test(str[i])) i++;
    if (i >= str.length) break;

    if (str[i] === "'") {
      i++; let val = '';
      while (i < str.length) {
        if (str[i] === "'" && str[i+1] === "'") { val += "'"; i += 2; }
        else if (str[i] === "'") { i++; break; }
        else { val += str[i]; i++; }
      }
      const trimmed = val.trim();
      if ((trimmed.startsWith('{') || trimmed.startsWith('[')) && (trimmed.endsWith('}') || trimmed.endsWith(']'))) {
        try { values.push(JSON.parse(trimmed)); } catch { values.push(val); }
      } else { values.push(val); }
    } else if (str.substring(i).match(/^null/i)) { values.push(null); i += 4; }
    else if (str.substring(i).match(/^true/i)) { values.push(true); i += 4; }
    else if (str.substring(i).match(/^false/i)) { values.push(false); i += 5; }
    else if (/[\d.\-]/.test(str[i])) {
      let num = '';
      if (str[i] === '-') { num += '-'; i++; }
      while (i < str.length && /[\d.]/.test(str[i])) { num += str[i]; i++; }
      values.push(num.includes('.') ? parseFloat(num) : parseInt(num));
    } else if (str[i] === ',') { i++; continue; }
    else { i++; continue; }

    while (i < str.length && /[\s]/.test(str[i])) i++;
    if (i < str.length && str[i] === ',') i++;
  }
  return values;
}

// Map agent-generated columns to actual blog_posts schema
function mapToSchema(row) {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || '',
    content: row.content || '',
    category_slug: row.category_slug || row.category || 'guides',
    author: row.author || 'ToolPilot Team',
    status: row.status || 'published',
    meta_title: row.meta_title || row.title,
    meta_description: row.meta_description || row.excerpt || '',
    published_at: row.published_at || new Date().toISOString().split('T')[0],
    // tags column doesn't exist, so we skip it
    // related_tool_slugs and related_comparison_slugs are optional
  };
}

async function run() {
  const sql = fs.readFileSync(file, 'utf8');
  const rows = parseInserts(sql);
  console.log(`Parsed ${rows.length} rows from ${file}`);
  if (rows.length === 0) { console.log('No rows parsed.'); return; }

  let success = 0, errors = 0, dupes = 0;
  for (let i = 0; i < rows.length; i++) {
    const mapped = mapToSchema(rows[i]);
    const { error } = await supabase.from('blog_posts').insert(mapped);
    if (error) {
      if (error.message.includes('duplicate') || error.code === '23505') {
        dupes++; process.stdout.write('D');
      } else {
        errors++;
        console.log(`\n[${i+1}] ${rows[i].slug}: ${error.message.substring(0, 150)}`);
      }
    } else {
      success++; process.stdout.write('.');
    }
  }

  console.log(`\n\nDone. Success: ${success}, Duplicates: ${dupes}, Errors: ${errors}`);
  const { count } = await supabase.from('blog_posts').select('id', { count: 'exact', head: true });
  console.log('Total blog posts:', count);
}

run();
