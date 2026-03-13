const fs = require('fs');
const path = require('path');

const tools = require('./all-tools.json');
const comparisons = require('./existing-comparisons.json');

console.log(`Total tools: ${tools.length}`);
console.log(`Total existing comparisons: ${comparisons.length}`);
console.log('---');

// Build a set of existing comparison pairs (both directions)
const existingPairs = new Set();
comparisons.forEach(c => {
  existingPairs.add(`${c.tool_a_id}::${c.tool_b_id}`);
  existingPairs.add(`${c.tool_b_id}::${c.tool_a_id}`);
});

function pairExists(idA, idB) {
  return existingPairs.has(`${idA}::${idB}`) || existingPairs.has(`${idB}::${idA}`);
}

// Count comparisons per tool
const comparisonCount = {};
tools.forEach(t => { comparisonCount[t.id] = 0; });
comparisons.forEach(c => {
  if (comparisonCount[c.tool_a_id] !== undefined) comparisonCount[c.tool_a_id]++;
  if (comparisonCount[c.tool_b_id] !== undefined) comparisonCount[c.tool_b_id]++;
});

// Group tools by category
const toolsByCategory = {};
tools.forEach(t => {
  if (!toolsByCategory[t.category_slug]) toolsByCategory[t.category_slug] = [];
  toolsByCategory[t.category_slug].push(t);
});

// Parse pricing to get starting price
function getStartingPrice(tool) {
  if (!tool.pricing) return null;
  if (typeof tool.pricing === 'object') {
    return tool.pricing.startingPrice ?? null;
  }
  return null;
}

function hasFreePlan(tool) {
  if (!tool.pricing) return false;
  if (typeof tool.pricing === 'object') {
    return tool.pricing.hasFreePlan === true;
  }
  return false;
}

// Score a potential partner for a given tool
// Higher score = better partner
function scorePartner(tool, partner) {
  let score = 0;

  // Prefer higher rated partners
  if (partner.ratings_overall) {
    score += partner.ratings_overall * 2; // 0-20 points
  }

  // Prefer popular tools (many existing comparisons)
  const partnerComps = comparisonCount[partner.id] || 0;
  score += Math.min(partnerComps, 10) * 1.5; // 0-15 points

  // Prefer pricing diversity (free vs paid or different price points)
  const toolFree = hasFreePlan(tool);
  const partnerFree = hasFreePlan(partner);
  const toolPrice = getStartingPrice(tool);
  const partnerPrice = getStartingPrice(partner);

  if (toolFree !== partnerFree) {
    score += 5; // Different free/paid status
  }
  if (toolPrice !== null && partnerPrice !== null && toolPrice !== partnerPrice) {
    score += 3; // Different price points
  }

  // Small bonus for partner having a tagline (indicates quality data)
  if (partner.tagline) {
    score += 1;
  }

  return score;
}

// Find best partner for a tool within same category
function findBestPartner(tool, categoryTools, excludeIds = []) {
  let bestPartner = null;
  let bestScore = -1;

  for (const candidate of categoryTools) {
    // Skip self
    if (candidate.id === tool.id) continue;
    // Skip already paired
    if (pairExists(tool.id, candidate.id)) continue;
    // Skip excluded
    if (excludeIds.includes(candidate.id)) continue;

    const score = scorePartner(tool, candidate);
    if (score > bestScore) {
      bestScore = score;
      bestPartner = candidate;
    }
  }

  return bestPartner;
}

// ==========================================
// ANALYSIS A: Tools with 0 comparisons
// ==========================================
const zeroCompTools = tools.filter(t => comparisonCount[t.id] === 0);
console.log(`\n=== Tools with 0 comparisons: ${zeroCompTools.length} ===`);

const zeroCompList = zeroCompTools.map(t => ({
  id: t.id,
  name: t.name,
  slug: t.slug,
  category_slug: t.category_slug,
  ratings_overall: t.ratings_overall,
  pricing_starts_at: getStartingPrice(t)
}));

// Sort by category then name
zeroCompList.sort((a, b) => {
  if (a.category_slug !== b.category_slug) return a.category_slug.localeCompare(b.category_slug);
  return a.name.localeCompare(b.name);
});

// Print summary by category
const zeroByCat = {};
zeroCompList.forEach(t => {
  if (!zeroByCat[t.category_slug]) zeroByCat[t.category_slug] = [];
  zeroByCat[t.category_slug].push(t.name);
});
Object.entries(zeroByCat).sort((a,b) => b[1].length - a[1].length).forEach(([cat, names]) => {
  console.log(`  ${cat} (${names.length}): ${names.join(', ')}`);
});

// ==========================================
// ANALYSIS B: Optimal pairs for 0-comparison tools
// ==========================================
const newPairs = [];
const alreadyPairedInNewSet = new Set(); // Track new pairs to avoid duplicates

for (const tool of zeroCompTools) {
  const categoryTools = toolsByCategory[tool.category_slug] || [];
  if (categoryTools.length < 2) {
    console.log(`  SKIP: ${tool.name} - only tool in ${tool.category_slug}`);
    continue;
  }

  const partner = findBestPartner(tool, categoryTools);
  if (partner) {
    // Check we haven't already created this pair in the new set
    const pairKey = [tool.id, partner.id].sort().join('::');
    if (!alreadyPairedInNewSet.has(pairKey)) {
      alreadyPairedInNewSet.add(pairKey);
      newPairs.push({
        tool_a_id: tool.id,
        tool_a_name: tool.name,
        tool_a_slug: tool.slug,
        tool_b_id: partner.id,
        tool_b_name: partner.name,
        tool_b_slug: partner.slug,
        category_slug: tool.category_slug
      });
    }
  }
}

console.log(`\n=== New pairs for 0-comparison tools: ${newPairs.length} ===`);
newPairs.forEach(p => {
  console.log(`  ${p.tool_a_name} vs ${p.tool_b_name} (${p.category_slug})`);
});

// ==========================================
// ANALYSIS C: Extra pairs for 1-comparison tools
// ==========================================
const oneCompTools = tools.filter(t => comparisonCount[t.id] === 1);
console.log(`\n=== Tools with exactly 1 comparison: ${oneCompTools.length} ===`);

const extraPairs = [];
const alreadyPairedInExtraSet = new Set();

// Also need to account for new pairs we just created
for (const pair of newPairs) {
  existingPairs.add(`${pair.tool_a_id}::${pair.tool_b_id}`);
  existingPairs.add(`${pair.tool_b_id}::${pair.tool_a_id}`);
}

for (const tool of oneCompTools) {
  const categoryTools = toolsByCategory[tool.category_slug] || [];
  if (categoryTools.length < 3) continue; // Need at least 3 tools to have a second partner

  const partner = findBestPartner(tool, categoryTools);
  if (partner) {
    const pairKey = [tool.id, partner.id].sort().join('::');
    if (!alreadyPairedInExtraSet.has(pairKey) && !alreadyPairedInNewSet.has(pairKey)) {
      alreadyPairedInExtraSet.add(pairKey);
      extraPairs.push({
        tool_a_id: tool.id,
        tool_a_name: tool.name,
        tool_a_slug: tool.slug,
        tool_b_id: partner.id,
        tool_b_name: partner.name,
        tool_b_slug: partner.slug,
        category_slug: tool.category_slug
      });
    }
  }
}

console.log(`Extra pairs for 1-comparison tools: ${extraPairs.length}`);
extraPairs.forEach(p => {
  console.log(`  ${p.tool_a_name} vs ${p.tool_b_name} (${p.category_slug})`);
});

// ==========================================
// SAVE OUTPUTS
// ==========================================
fs.writeFileSync(path.join(__dirname, 'new-pairs.json'), JSON.stringify(newPairs, null, 2));
fs.writeFileSync(path.join(__dirname, 'extra-pairs.json'), JSON.stringify(extraPairs, null, 2));
fs.writeFileSync(path.join(__dirname, 'zero-comp-tools.json'), JSON.stringify(zeroCompList, null, 2));

// ==========================================
// SUMMARY STATS
// ==========================================
console.log('\n========== SUMMARY ==========');
console.log(`Total tools: ${tools.length}`);
console.log(`Total existing comparisons: ${comparisons.length}`);
console.log(`Tools with 0 comparisons: ${zeroCompTools.length}`);
console.log(`Tools with 1 comparison: ${oneCompTools.length}`);
console.log(`Tools with 2+ comparisons: ${tools.filter(t => comparisonCount[t.id] >= 2).length}`);
console.log(`New pairs to create (0-comp tools): ${newPairs.length}`);
console.log(`Extra pairs to create (1-comp tools): ${extraPairs.length}`);
console.log(`Total new comparisons suggested: ${newPairs.length + extraPairs.length}`);

// Distribution of comparison counts
const distrib = {};
tools.forEach(t => {
  const cnt = comparisonCount[t.id];
  distrib[cnt] = (distrib[cnt] || 0) + 1;
});
console.log('\nComparison count distribution:');
Object.entries(distrib).sort((a,b) => Number(a[0]) - Number(b[0])).forEach(([cnt, num]) => {
  console.log(`  ${cnt} comparisons: ${num} tools`);
});

// Category coverage
console.log('\nCategory coverage:');
Object.entries(toolsByCategory).sort((a,b) => b[1].length - a[1].length).forEach(([cat, catTools]) => {
  const catComps = comparisons.filter(c => c.category_slug === cat).length;
  const maxPossible = catTools.length * (catTools.length - 1) / 2;
  const coverage = maxPossible > 0 ? ((catComps / maxPossible) * 100).toFixed(1) : 'N/A';
  const zeroInCat = catTools.filter(t => comparisonCount[t.id] === 0).length;
  console.log(`  ${cat}: ${catTools.length} tools, ${catComps} comparisons (${coverage}% coverage), ${zeroInCat} uncovered`);
});
