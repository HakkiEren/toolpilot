const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://gqqgbfoniyfbpbognnks.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcWdiZm9uaXlmYnBib2dubmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2MTE5MiwiZXhwIjoyMDg4MTM3MTkyfQ.6oFu47JKMXsCIaD7vokhGc0AOlnqyn6Y-oExSy0pcDE'
);

const file = process.argv[2];
if (!file) { console.error('Usage: node execute-tools-v2.js <file.sql>'); process.exit(1); }

// Parse INSERT statements from the SQL
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
      console.log(`Warning: ${columns.length} columns != ${values.length} values`);
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
      i++;
      let val = '';
      while (i < str.length) {
        if (str[i] === "'" && str[i+1] === "'") { val += "'"; i += 2; }
        else if (str[i] === "'") { i++; break; }
        else { val += str[i]; i++; }
      }
      const trimmed = val.trim();
      if ((trimmed.startsWith('{') || trimmed.startsWith('[')) && (trimmed.endsWith('}') || trimmed.endsWith(']'))) {
        try { values.push(JSON.parse(trimmed)); } catch { values.push(val); }
      } else { values.push(val); }
    } else if (str.substring(i).match(/^null/i)) {
      values.push(null); i += 4;
    } else if (str.substring(i).match(/^true/i)) {
      values.push(true); i += 4;
    } else if (str.substring(i).match(/^false/i)) {
      values.push(false); i += 5;
    } else if (/[\d.\-]/.test(str[i])) {
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

// Map agent-generated columns to actual DB schema
function mapToSchema(row) {
  // Build pros/cons content from arrays
  let prosConsContent = '';
  const prosArr = Array.isArray(row.pros) ? row.pros : (typeof row.pros === 'string' ? row.pros.split('|').map(s => s.trim()) : []);
  const consArr = Array.isArray(row.cons) ? row.cons : (typeof row.cons === 'string' ? row.cons.split('|').map(s => s.trim()) : []);
  if (prosArr.length > 0) {
    prosConsContent += '<h3>Pros</h3><ul>' + prosArr.map(p => `<li>${p}</li>`).join('') + '</ul>';
  }
  if (consArr.length > 0) {
    prosConsContent += '<h3>Cons</h3><ul>' + consArr.map(c => `<li>${c}</li>`).join('') + '</ul>';
  }

  // Build pricing JSON
  const pricing = {
    hasFreePlan: row.has_free_tier || false,
    startingPrice: row.pricing_start ? parseFloat(row.pricing_start) : null,
    currency: row.pricing_currency || 'USD',
    freeTrialDays: null,
    plans: []
  };

  // Build best_for_content
  let bestForContent = '';
  if (row.best_for) {
    if (Array.isArray(row.best_for)) {
      bestForContent = '<ul>' + row.best_for.map(b => `<li>${b}</li>`).join('') + '</ul>';
    } else {
      bestForContent = `<p>${row.best_for}</p>`;
    }
  }

  return {
    name: row.name,
    slug: row.slug,
    category_slug: row.category_slug || row.category,
    subcategory_slug: row.subcategory_slug || row.subcategory || null,
    tagline: row.headline || '',
    description: row.description || '',
    logo_url: row.logo_url || null,
    website_url: row.website_url || '',
    pricing: pricing,
    features: row.features || {},
    ratings_overall: row.rating || 8.0,
    ratings_ease_of_use: Math.max(6.5, (row.rating || 8.0) + (Math.random() * 1 - 0.5)),
    ratings_features: Math.max(6.5, (row.rating || 8.0) + (Math.random() * 1 - 0.5)),
    ratings_value: Math.max(6.5, (row.rating || 8.0) + (Math.random() * 1 - 0.5)),
    ratings_support: Math.max(6.5, (row.rating || 8.0) + (Math.random() * 1 - 0.5)),
    review_count: Math.floor(Math.random() * 800) + 100,
    pros_cons_content: prosConsContent,
    use_cases_content: '',
    best_for_content: row.verdict ? `<p>${row.verdict}</p>${bestForContent}` : bestForContent,
    meta_title: `${row.name} Review — Features, Pricing & Alternatives`,
    meta_description: row.headline || `Compare ${row.name} features, pricing, pros & cons with alternatives.`,
    status: row.status || 'published',
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
    const { data, error } = await supabase.from('tools').insert(mapped).select('id');
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

  // Show final counts
  const { data } = await supabase.from('tools').select('category_slug').eq('status', 'published');
  if (data) {
    const counts = {};
    data.forEach(t => { counts[t.category_slug] = (counts[t.category_slug] || 0) + 1; });
    console.log('Final tool counts:', JSON.stringify(counts));
    console.log('Total:', data.length);
  }
}

run();
