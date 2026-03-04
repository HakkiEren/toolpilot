const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://gqqgbfoniyfbpbognnks.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcWdiZm9uaXlmYnBib2dubmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2MTE5MiwiZXhwIjoyMDg4MTM3MTkyfQ.6oFu47JKMXsCIaD7vokhGc0AOlnqyn6Y-oExSy0pcDE'
);

const file = process.argv[2];
if (!file) { console.error('Usage: node execute-comparisons-v2.js <file.sql>'); process.exit(1); }

// Cache for tool slug -> UUID lookups
const toolIdCache = {};
async function resolveToolId(slug) {
  if (toolIdCache[slug]) return toolIdCache[slug];
  const { data } = await supabase.from('tools').select('id').eq('slug', slug).limit(1).single();
  if (data) { toolIdCache[slug] = data.id; return data.id; }
  return null;
}

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
      // Handle subqueries
      if (afterValues[vi] === '(' && afterValues.substring(vi).match(/^\(\s*SELECT/i)) {
        valuesStr += afterValues[vi];
        depth++;
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
      console.log(`Warning: ${columns.length} cols != ${values.length} vals for entry around line`);
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

    // Handle subqueries
    if (str[i] === '(' && str.substring(i).match(/^\(\s*SELECT/i)) {
      let depth = 1; let subquery = '('; i++;
      while (i < str.length && depth > 0) {
        if (str[i] === '(') depth++;
        if (str[i] === ')') depth--;
        subquery += str[i]; i++;
      }
      values.push({ __subquery: subquery });
    } else if (str[i] === "'") {
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

function listToHtml(arr) {
  if (!arr || !Array.isArray(arr)) return '';
  return '<ul>' + arr.map(item => `<li>${item}</li>`).join('') + '</ul>';
}

function mapToSchema(row) {
  // Build intro_content from summary, pros, cons, scores
  let introContent = '';
  if (row.summary) introContent += `<p>${row.summary}</p>`;

  // Build scores section
  if (row.scores_a && row.scores_b) {
    const sa = typeof row.scores_a === 'object' ? row.scores_a : {};
    const sb = typeof row.scores_b === 'object' ? row.scores_b : {};
    introContent += `<div class="scores-data" data-scores-a='${JSON.stringify(sa)}' data-scores-b='${JSON.stringify(sb)}'></div>`;
  }

  // Pros/cons in intro
  if (row.pros_a && Array.isArray(row.pros_a)) introContent += `<h3>Tool A Strengths</h3>${listToHtml(row.pros_a)}`;
  if (row.cons_a && Array.isArray(row.cons_a)) introContent += `<h3>Tool A Weaknesses</h3>${listToHtml(row.cons_a)}`;
  if (row.pros_b && Array.isArray(row.pros_b)) introContent += `<h3>Tool B Strengths</h3>${listToHtml(row.pros_b)}`;
  if (row.cons_b && Array.isArray(row.cons_b)) introContent += `<h3>Tool B Weaknesses</h3>${listToHtml(row.cons_b)}`;

  // Build verdict content
  let verdictContent = '';
  if (row.verdict) verdictContent = `<p>${row.verdict}</p>`;

  // Build scenario content from best_for
  let scenarioContent = '';
  if (row.best_for_a && Array.isArray(row.best_for_a)) {
    scenarioContent += `<h3>Choose Tool A if you are:</h3>${listToHtml(row.best_for_a)}`;
  }
  if (row.best_for_b && Array.isArray(row.best_for_b)) {
    scenarioContent += `<h3>Choose Tool B if you are:</h3>${listToHtml(row.best_for_b)}`;
  }

  // Feature matrix
  let featureMatrix = [];
  if (row.features && Array.isArray(row.features)) {
    featureMatrix = row.features;
  }

  // Generate meta from slug
  const toolNames = (row.slug || '').split('-vs-').map(s =>
    s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  );
  const metaTitle = row.title || `${toolNames[0]} vs ${toolNames[1]}: Detailed Comparison [2025]`;
  const metaDesc = row.summary ? row.summary.substring(0, 155) : `Compare ${toolNames[0]} vs ${toolNames[1]} features, pricing, and ratings side by side.`;

  return {
    slug: row.slug,
    category_slug: row.category_slug,
    tool_a_id: row.tool_a_id, // will be resolved
    tool_b_id: row.tool_b_id,
    intro_content: introContent,
    verdict_content: verdictContent,
    migration_content: '',
    scenario_content: scenarioContent,
    feature_matrix: featureMatrix,
    faqs: row.faqs || [],
    meta_title: metaTitle,
    meta_description: metaDesc,
  };
}

async function run() {
  const sql = fs.readFileSync(file, 'utf8');
  const rows = parseInserts(sql);
  console.log(`Parsed ${rows.length} rows from ${file}`);
  if (rows.length === 0) { console.log('No rows parsed.'); return; }

  let success = 0, errors = 0, dupes = 0;
  for (let i = 0; i < rows.length; i++) {
    // Resolve subqueries for tool IDs
    const resolved = { ...rows[i] };
    for (const key of ['tool_a_id', 'tool_b_id']) {
      if (resolved[key] && typeof resolved[key] === 'object' && resolved[key].__subquery) {
        const slugMatch = resolved[key].__subquery.match(/slug\s*=\s*'([^']+)'/);
        if (slugMatch) {
          const id = await resolveToolId(slugMatch[1]);
          if (id) { resolved[key] = id; }
          else { console.log(`\n  Warning: tool '${slugMatch[1]}' not found`); resolved[key] = null; }
        }
      }
    }

    if (!resolved.tool_a_id || !resolved.tool_b_id) {
      console.log(`\n[${i+1}] ${resolved.slug}: Skipping - missing tool ID`);
      errors++;
      continue;
    }

    const mapped = mapToSchema(resolved);
    const { error } = await supabase.from('comparisons').insert(mapped);
    if (error) {
      if (error.message.includes('duplicate') || error.code === '23505') {
        dupes++; process.stdout.write('D');
      } else {
        errors++;
        console.log(`\n[${i+1}] ${resolved.slug}: ${error.message.substring(0, 150)}`);
      }
    } else {
      success++; process.stdout.write('.');
    }
  }

  console.log(`\n\nDone. Success: ${success}, Duplicates: ${dupes}, Errors: ${errors}`);

  const { count } = await supabase.from('comparisons').select('id', { count: 'exact', head: true });
  console.log('Total comparisons:', count);
}

run();
