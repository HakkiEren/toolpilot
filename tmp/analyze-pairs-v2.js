const fs = require('fs');
const path = require('path');

const tools = require('./all-tools.json');
const comparisons = require('./existing-comparisons.json');

// Build a set of existing comparison pairs (both directions)
const existingPairs = new Set();
comparisons.forEach(c => {
  existingPairs.add(`${c.tool_a_id}::${c.tool_b_id}`);
  existingPairs.add(`${c.tool_b_id}::${c.tool_a_id}`);
});

function pairExists(idA, idB) {
  return existingPairs.has(`${idA}::${idB}`);
}

// Count comparisons per tool
const comparisonCount = {};
tools.forEach(t => { comparisonCount[t.id] = 0; });
comparisons.forEach(c => {
  if (comparisonCount[c.tool_a_id] !== undefined) comparisonCount[c.tool_a_id]++;
  if (comparisonCount[c.tool_b_id] !== undefined) comparisonCount[c.tool_b_id]++;
});

// Track how many times a tool is used as partner in our new suggestions
const newPartnerUsage = {};
tools.forEach(t => { newPartnerUsage[t.id] = 0; });

// Group tools by category
const toolsByCategory = {};
tools.forEach(t => {
  if (!toolsByCategory[t.category_slug]) toolsByCategory[t.category_slug] = [];
  toolsByCategory[t.category_slug].push(t);
});

function getStartingPrice(tool) {
  if (!tool.pricing || typeof tool.pricing !== 'object') return null;
  return tool.pricing.startingPrice ?? null;
}

function hasFreePlan(tool) {
  if (!tool.pricing || typeof tool.pricing !== 'object') return false;
  return tool.pricing.hasFreePlan === true;
}

// IMPROVED scoring: diversify partners, don't just pile onto the top tool
function scorePartner(tool, partner) {
  let score = 0;

  // Rating of partner (higher = better match)
  if (partner.ratings_overall) {
    score += partner.ratings_overall * 1.5; // 0-15 points
  }

  // Existing comparison count of partner (popular tools are good anchors)
  const partnerComps = comparisonCount[partner.id] || 0;
  score += Math.min(partnerComps, 8) * 1.0; // 0-8 points

  // PENALTY: if this partner is already used too many times in our new suggestions
  // This forces diversity - spread across multiple anchor tools
  const usage = newPartnerUsage[partner.id] || 0;
  if (usage >= 3) score -= (usage - 2) * 4; // Increasing penalty after 3 uses
  if (usage >= 6) score -= (usage - 5) * 6; // Steeper penalty after 6

  // Pricing diversity bonus
  const toolFree = hasFreePlan(tool);
  const partnerFree = hasFreePlan(partner);
  if (toolFree !== partnerFree) score += 4;

  const toolPrice = getStartingPrice(tool);
  const partnerPrice = getStartingPrice(partner);
  if (toolPrice !== null && partnerPrice !== null && toolPrice !== partnerPrice) score += 2;

  // Tagline bonus (indicates quality data)
  if (partner.tagline) score += 1;

  return score;
}

function findBestPartner(tool, categoryTools, excludeIds = []) {
  let bestPartner = null;
  let bestScore = -Infinity;

  for (const candidate of categoryTools) {
    if (candidate.id === tool.id) continue;
    if (pairExists(tool.id, candidate.id)) continue;
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
// Sort by category for organized processing
zeroCompTools.sort((a, b) => {
  if (a.category_slug !== b.category_slug) return a.category_slug.localeCompare(b.category_slug);
  return a.name.localeCompare(b.name);
});

const newPairs = [];
const newPairSet = new Set();

for (const tool of zeroCompTools) {
  const categoryTools = toolsByCategory[tool.category_slug] || [];
  if (categoryTools.length < 2) continue;

  const partner = findBestPartner(tool, categoryTools);
  if (partner) {
    const pairKey = [tool.id, partner.id].sort().join('::');
    if (!newPairSet.has(pairKey)) {
      newPairSet.add(pairKey);
      newPartnerUsage[partner.id] = (newPartnerUsage[partner.id] || 0) + 1;
      // Also register the pair as existing to avoid duplicates in extra pairs
      existingPairs.add(`${tool.id}::${partner.id}`);
      existingPairs.add(`${partner.id}::${tool.id}`);
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

// ==========================================
// ANALYSIS B: Extra pairs for 1-comparison tools
// ==========================================
const oneCompTools = tools.filter(t => comparisonCount[t.id] === 1);
oneCompTools.sort((a, b) => {
  if (a.category_slug !== b.category_slug) return a.category_slug.localeCompare(b.category_slug);
  return a.name.localeCompare(b.name);
});

const extraPairs = [];
const extraPairSet = new Set();

for (const tool of oneCompTools) {
  const categoryTools = toolsByCategory[tool.category_slug] || [];
  if (categoryTools.length < 3) continue;

  const partner = findBestPartner(tool, categoryTools);
  if (partner) {
    const pairKey = [tool.id, partner.id].sort().join('::');
    if (!extraPairSet.has(pairKey) && !newPairSet.has(pairKey)) {
      extraPairSet.add(pairKey);
      newPartnerUsage[partner.id] = (newPartnerUsage[partner.id] || 0) + 1;
      existingPairs.add(`${tool.id}::${partner.id}`);
      existingPairs.add(`${partner.id}::${tool.id}`);
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

// ==========================================
// SAVE
// ==========================================
fs.writeFileSync(path.join(__dirname, 'new-pairs.json'), JSON.stringify(newPairs, null, 2));
fs.writeFileSync(path.join(__dirname, 'extra-pairs.json'), JSON.stringify(extraPairs, null, 2));

// ==========================================
// OUTPUT
// ==========================================
console.log('========================================');
console.log('  PROPICKED COMPARISON PAIR ANALYSIS');
console.log('========================================\n');
console.log(`Total tools: ${tools.length}`);
console.log(`Existing comparisons: ${comparisons.length}`);
console.log(`Tools with 0 comparisons: ${zeroCompTools.length}`);
console.log(`Tools with 1 comparison: ${oneCompTools.length}`);
console.log(`Tools with 2+ comparisons: ${tools.filter(t => comparisonCount[t.id] >= 2).length}\n`);

// Distribution
const distrib = {};
tools.forEach(t => {
  const cnt = comparisonCount[t.id];
  distrib[cnt] = (distrib[cnt] || 0) + 1;
});
console.log('Comparison count distribution:');
Object.entries(distrib).sort((a,b) => Number(a[0]) - Number(b[0])).forEach(([cnt, num]) => {
  const bar = '#'.repeat(Math.min(num, 60));
  console.log(`  ${cnt.padStart(2)} comparisons: ${String(num).padStart(3)} tools ${bar}`);
});

// Category coverage
console.log('\nCategory coverage:');
Object.entries(toolsByCategory).sort((a,b) => b[1].length - a[1].length).forEach(([cat, catTools]) => {
  const catComps = comparisons.filter(c => c.category_slug === cat).length;
  const maxPossible = catTools.length * (catTools.length - 1) / 2;
  const coverage = maxPossible > 0 ? ((catComps / maxPossible) * 100).toFixed(1) : 'N/A';
  const zeroInCat = catTools.filter(t => comparisonCount[t.id] === 0).length;
  console.log(`  ${cat.padEnd(12)}: ${String(catTools.length).padStart(2)} tools, ${String(catComps).padStart(2)} comparisons (${coverage}% of max ${maxPossible}), ${zeroInCat} uncovered`);
});

// New pairs by category
console.log(`\n========================================`);
console.log(`  NEW PAIRS (0-comparison tools): ${newPairs.length}`);
console.log(`========================================`);
const newByCat = {};
newPairs.forEach(p => {
  if (!newByCat[p.category_slug]) newByCat[p.category_slug] = [];
  newByCat[p.category_slug].push(p);
});
Object.entries(newByCat).sort((a,b) => a[0].localeCompare(b[0])).forEach(([cat, pairs]) => {
  console.log(`\n  --- ${cat} (${pairs.length} pairs) ---`);
  pairs.forEach(p => {
    console.log(`    ${p.tool_a_name} vs ${p.tool_b_name}`);
  });
});

// Partner usage distribution - how well did we diversify?
console.log(`\n========================================`);
console.log(`  PARTNER DIVERSITY CHECK (new pairs)`);
console.log(`========================================`);
const partnerUsageList = Object.entries(newPartnerUsage)
  .filter(([,count]) => count > 0)
  .map(([id, count]) => {
    const t = tools.find(t => t.id === id);
    return { name: t ? t.name : id, count, category: t ? t.category_slug : '?' };
  })
  .sort((a, b) => b.count - a.count);

console.log(`  Unique partners used: ${partnerUsageList.length}`);
partnerUsageList.slice(0, 25).forEach(p => {
  console.log(`    ${p.name.padEnd(30)} used ${p.count}x (${p.category})`);
});

// Extra pairs
console.log(`\n========================================`);
console.log(`  EXTRA PAIRS (1-comparison tools): ${extraPairs.length}`);
console.log(`========================================`);
const extraByCat = {};
extraPairs.forEach(p => {
  if (!extraByCat[p.category_slug]) extraByCat[p.category_slug] = [];
  extraByCat[p.category_slug].push(p);
});
Object.entries(extraByCat).sort((a,b) => a[0].localeCompare(b[0])).forEach(([cat, pairs]) => {
  console.log(`\n  --- ${cat} (${pairs.length} pairs) ---`);
  pairs.forEach(p => {
    console.log(`    ${p.tool_a_name} vs ${p.tool_b_name}`);
  });
});

console.log(`\n========================================`);
console.log(`  TOTAL NEW COMPARISONS: ${newPairs.length + extraPairs.length}`);
console.log(`  Saved to: new-pairs.json (${newPairs.length})`);
console.log(`  Saved to: extra-pairs.json (${extraPairs.length})`);
console.log(`========================================`);
