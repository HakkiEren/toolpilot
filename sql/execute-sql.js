const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://gqqgbfoniyfbpbognnks.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcWdiZm9uaXlmYnBib2dubmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2MTE5MiwiZXhwIjoyMDg4MTM3MTkyfQ.6oFu47JKMXsCIaD7vokhGc0AOlnqyn6Y-oExSy0pcDE'
);

const file = process.argv[2];
const table = process.argv[3] || 'tools';
if (!file) { console.error('Usage: node execute-sql.js <file.sql> [table]'); process.exit(1); }

function parseInserts(sql) {
  const results = [];
  // Split by "INSERT INTO" to get individual statements
  const parts = sql.split(/(?=INSERT INTO )/g).filter(p => p.trim().startsWith('INSERT'));

  for (const part of parts) {
    // Extract columns from INSERT INTO table (col1, col2, ...)
    const colMatch = part.match(/INSERT INTO \w+ \(([^)]+)\)/);
    if (!colMatch) continue;
    const columns = colMatch[1].split(',').map(c => c.trim());

    // Extract everything between VALUES ( and the final );
    // Use greedy match and find the last ); in the statement
    const valStart = part.indexOf('VALUES');
    if (valStart === -1) continue;
    const afterValues = part.substring(valStart + 6).trimStart();
    // Skip opening paren
    if (afterValues[0] !== '(') continue;
    // Find the matching closing );
    let valuesStr = '';
    let depth = 0;
    let vi = 0;
    for (vi = 0; vi < afterValues.length; vi++) {
      if (afterValues[vi] === '(' && depth === 0) { depth++; continue; } // skip outer opening (
      if (afterValues[vi] === "'" ) {
        // Skip entire quoted string
        valuesStr += afterValues[vi]; vi++;
        while (vi < afterValues.length) {
          if (afterValues[vi] === "'" && afterValues[vi+1] === "'") {
            valuesStr += "''"; vi += 2; continue;
          }
          if (afterValues[vi] === "'") { valuesStr += "'"; break; }
          valuesStr += afterValues[vi]; vi++;
        }
        continue;
      }
      if (afterValues[vi] === '(') depth++;
      if (afterValues[vi] === ')') {
        depth--;
        if (depth <= 0) break; // found the closing )
      }
      valuesStr += afterValues[vi];
    }
    if (!valuesStr.trim()) continue;

    // Parse the values
    const values = parseValues(valuesStr);

    if (columns.length === values.length) {
      const row = {};
      columns.forEach((col, idx) => { row[col] = values[idx]; });
      results.push(row);
    } else {
      console.log(`\nWarning: ${columns.length} columns != ${values.length} values`);
      // Show which tool it was
      if (values.length > 0) console.log('  First value:', String(values[0]).substring(0, 30));
    }
  }
  return results;
}

function parseValues(str) {
  const values = [];
  let i = 0;

  while (i < str.length) {
    // Skip whitespace
    while (i < str.length && /[\s]/.test(str[i])) i++;
    if (i >= str.length) break;

    // Handle subqueries like (SELECT id FROM tools WHERE slug='xxx' LIMIT 1)
    if (str[i] === '(' && str.substring(i).match(/^\(\s*SELECT/i)) {
      let depth = 1;
      let subquery = '(';
      i++;
      while (i < str.length && depth > 0) {
        if (str[i] === '(') depth++;
        if (str[i] === ')') depth--;
        subquery += str[i];
        i++;
      }
      // Mark as subquery to resolve later
      values.push({ __subquery: subquery });
    } else if (str[i] === "'") {
      // Quoted string
      i++;
      let val = '';
      while (i < str.length) {
        if (str[i] === "'" && str[i+1] === "'") {
          val += "'";
          i += 2;
        } else if (str[i] === "'") {
          i++;
          break;
        } else {
          val += str[i];
          i++;
        }
      }
      // Try to parse as JSON if it looks like it
      const trimmed = val.trim();
      if ((trimmed.startsWith('{') || trimmed.startsWith('[')) && (trimmed.endsWith('}') || trimmed.endsWith(']'))) {
        try { values.push(JSON.parse(trimmed)); } catch { values.push(val); }
      } else {
        values.push(val);
      }
    } else if (str.substring(i).match(/^null/i)) {
      values.push(null);
      i += 4;
    } else if (str.substring(i).match(/^true/i)) {
      values.push(true);
      i += 4;
    } else if (str.substring(i).match(/^false/i)) {
      values.push(false);
      i += 5;
    } else if (/[\d.\-]/.test(str[i])) {
      let num = '';
      if (str[i] === '-') { num += '-'; i++; }
      while (i < str.length && /[\d.]/.test(str[i])) { num += str[i]; i++; }
      values.push(num.includes('.') ? parseFloat(num) : parseInt(num));
    } else if (str[i] === ',') {
      i++;
      continue;
    } else {
      i++;
      continue;
    }

    // Skip whitespace after value
    while (i < str.length && /[\s]/.test(str[i])) i++;
    // Skip comma separator
    if (i < str.length && str[i] === ',') i++;
  }

  return values;
}

// Cache for tool slug -> UUID lookups
const toolIdCache = {};

async function resolveToolId(slug) {
  if (toolIdCache[slug]) return toolIdCache[slug];
  const { data } = await supabase.from('tools').select('id').eq('slug', slug).limit(1).single();
  if (data) {
    toolIdCache[slug] = data.id;
    return data.id;
  }
  return null;
}

async function resolveSubqueries(row) {
  const resolved = { ...row };
  for (const [key, val] of Object.entries(resolved)) {
    if (val && typeof val === 'object' && val.__subquery) {
      // Extract slug from: (SELECT id FROM tools WHERE slug='xxx' LIMIT 1)
      const slugMatch = val.__subquery.match(/slug\s*=\s*'([^']+)'/);
      if (slugMatch) {
        const id = await resolveToolId(slugMatch[1]);
        if (id) {
          resolved[key] = id;
        } else {
          console.log(`\n  Warning: tool '${slugMatch[1]}' not found in database`);
          resolved[key] = null;
        }
      }
    }
  }
  return resolved;
}

async function run() {
  const sql = fs.readFileSync(file, 'utf8');
  const rows = parseInserts(sql);

  console.log(`Parsed ${rows.length} rows from ${file} -> inserting into "${table}"`);

  if (rows.length === 0) {
    console.log('No rows parsed.');
    return;
  }

  console.log('Columns:', Object.keys(rows[0]).join(', '));
  console.log('');

  let success = 0, errors = 0, dupes = 0;
  for (let i = 0; i < rows.length; i++) {
    const row = await resolveSubqueries(rows[i]);
    const { data, error } = await supabase.from(table).insert(row).select('id');
    if (error) {
      if (error.message.includes('duplicate') || error.code === '23505') {
        dupes++;
        process.stdout.write('D');
      } else {
        errors++;
        console.log(`\n[${i+1}] ${rows[i].slug || rows[i].name || '?'}: ${error.message.substring(0, 150)}`);
      }
    } else {
      success++;
      process.stdout.write('.');
    }
  }

  console.log(`\n\nDone. Success: ${success}, Duplicates: ${dupes}, Errors: ${errors}`);

  // Show final counts
  if (table === 'tools') {
    const { data } = await supabase.from('tools').select('category_slug').eq('status', 'published');
    if (data) {
      const counts = {};
      data.forEach(t => { counts[t.category_slug] = (counts[t.category_slug] || 0) + 1; });
      console.log('\nFinal tool counts:', JSON.stringify(counts));
      console.log('Total:', data.length);
    }
  }
}

run();
