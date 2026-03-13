#!/usr/bin/env node
/**
 * ProPicked Comparison Generator
 * Generates unique comparison pages for tools without comparisons.
 *
 * Usage:
 *   node scripts/generate-comparisons.js              # Generate + insert all new pairs
 *   node scripts/generate-comparisons.js --dry-run    # Generate to JSON file only
 *   node scripts/generate-comparisons.js --limit 10   # Process only first 10 pairs
 *   node scripts/generate-comparisons.js --extra       # Also include extra pairs (single-comp tools)
 */

const fs = require('fs');
const path = require('path');

// ── Config ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://gqqgbfoniyfbpbognnks.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcWdiZm9uaXlmYnBib2dubmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2MTE5MiwiZXhwIjoyMDg4MTM3MTkyfQ.6oFu47JKMXsCIaD7vokhGc0AOlnqyn6Y-oExSy0pcDE';
const YEAR = 2026;
const TMP_DIR = path.join(__dirname, '..', 'tmp');

// ── CLI args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const INCLUDE_EXTRA = args.includes('--extra');
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx >= 0 ? parseInt(args[limitIdx + 1]) : Infinity;

// ── Category metadata ───────────────────────────────────────────────────────
const CAT = {
  'ai-tools':   { name: 'AI Tools',          noun: 'AI tool',           plural: 'AI tools',           use: 'artificial intelligence tasks' },
  'marketing':  { name: 'Marketing Tools',    noun: 'marketing tool',    plural: 'marketing tools',    use: 'digital marketing' },
  'saas':       { name: 'SaaS Platforms',     noun: 'SaaS platform',     plural: 'SaaS tools',         use: 'business operations' },
  'hosting':    { name: 'Web Hosting',        noun: 'hosting provider',  plural: 'hosting services',   use: 'web hosting' },
  'ecommerce':  { name: 'Ecommerce Platforms',noun: 'ecommerce platform',plural: 'ecommerce platforms',use: 'online selling' },
  'business':   { name: 'Business Tools',     noun: 'business tool',     plural: 'business tools',     use: 'business management' },
};

// ── Helpers ─────────────────────────────────────────────────────────────────
function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; } return Math.abs(h); }
function pick(arr, seed) { return arr[seed % arr.length]; }
function pickN(arr, n, seed) { const shuffled = [...arr]; for (let i = shuffled.length - 1; i > 0; i--) { const j = (seed + i * 31) % (i + 1); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; } return shuffled.slice(0, n); }
function humanize(s) { return s.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }
function aAn(word) { return /^[aeiou]/i.test(word) ? 'an' : 'a'; }

function feats(tool) {
  if (!tool.features) return [];
  if (Array.isArray(tool.features)) return tool.features.filter(f => typeof f === 'string' && f.length > 2).slice(0, 12);
  if (typeof tool.features === 'object') return Object.entries(tool.features).filter(([, v]) => v === true).map(([k]) => k).slice(0, 12);
  return [];
}

function priceLbl(tool) {
  const p = tool.pricing;
  if (!p) return 'Contact for pricing';
  const free = p.hasFreePlan || p.hasFreeplan;
  if (free && p.startingPrice) return `Free plan available, paid from $${p.startingPrice}/mo`;
  if (free) return 'Free';
  if (p.startingPrice) return `From $${p.startingPrice}/mo`;
  if (p.freeTrialDays) return `${p.freeTrialDays}-day free trial`;
  return 'Contact for pricing';
}

function price(tool) { return tool.pricing?.startingPrice || null; }
function isFree(tool) { return !!(tool.pricing?.hasFreePlan || tool.pricing?.hasFreeplan); }
function r(tool, f) { return tool[f || 'ratings_overall'] || 7.0; }
function tag(tool) { return (tool.tagline || `A leading ${(CAT[tool.category_slug] || CAT.saas).noun}`).replace(/\.\s*$/, ''); }

function extractPros(html) {
  if (!html) return [];
  const m = html.match(/Pros[\s\S]*?<ul>([\s\S]*?)<\/ul>/i);
  if (!m) return [];
  return [...m[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map(x => x[1].replace(/<[^>]+>/g, '').trim())
    .filter(s => s.length > 5 && s.length < 120)
    .slice(0, 5);
}

function extractCons(html) {
  if (!html) return [];
  const m = html.match(/Cons[\s\S]*?<ul>([\s\S]*?)<\/ul>/i);
  if (!m) return [];
  return [...m[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map(x => x[1].replace(/<[^>]+>/g, '').trim())
    .filter(s => s.length > 5 && s.length < 120)
    .slice(0, 5);
}

// ── Content Generators ──────────────────────────────────────────────────────

function genIntro(a, b, cat, seed) {
  const c = CAT[cat] || CAT.saas;
  const rA = r(a), rB = r(b);
  const pA = priceLbl(a), pB = priceLbl(b);
  const tA = tag(a).toLowerCase(), tB = tag(b).toLowerCase();

  const openers = [
    `Choosing between ${a.name} and ${b.name} is a common dilemma for anyone evaluating ${c.plural} in ${YEAR}.`,
    `${a.name} and ${b.name} are two of the most discussed ${c.plural} on the market today, each with a loyal user base and distinct strengths.`,
    `If you're weighing ${a.name} against ${b.name}, you're looking at two fundamentally different approaches to ${c.use}.`,
    `The ${a.name} vs ${b.name} debate comes up frequently among professionals building their ${c.use} stack.`,
    `Both ${a.name} and ${b.name} have earned solid reputations in the ${c.name.toLowerCase()} landscape, but they serve different needs.`,
    `When it comes to ${c.use}, few matchups generate as much discussion as ${a.name} versus ${b.name}.`,
    `${a.name} and ${b.name} each bring unique value to the ${c.name.toLowerCase()} category, making the choice between them genuinely difficult.`,
    `Picking the right ${c.noun} often comes down to ${a.name} vs ${b.name} — two popular choices with surprisingly different philosophies.`,
    `In the competitive ${c.name.toLowerCase()} space, ${a.name} and ${b.name} consistently rank among the most compared options.`,
    `Whether you're a startup founder or an established team, the choice between ${a.name} and ${b.name} deserves careful evaluation.`,
    `${a.name}, known as "${tA}," goes head to head with ${b.name}, which positions itself as "${tB}," in this comprehensive ${YEAR} comparison.`,
    `Looking for the best ${c.noun} for your needs? The ${a.name} vs ${b.name} comparison is one of the most requested matchups we cover.`,
    `The ${c.name.toLowerCase()} market is crowded, but ${a.name} and ${b.name} stand out for distinctly different reasons.`,
    `Two ${c.plural} that frequently appear on decision-makers' shortlists are ${a.name} and ${b.name} — here's how they compare.`,
    `Understanding the real differences between ${a.name} and ${b.name} can save you weeks of evaluation time and thousands of dollars in the wrong subscription.`,
  ];

  const middles = [
    `${a.name} positions itself as "${tA}" while ${b.name} focuses on being "${tB}" — quite different value propositions for the same market.`,
    `With ${a.name} scoring ${rA}/10 and ${b.name} at ${rB}/10 in our editorial ratings, both have clear merit, but the devil is in the details.`,
    `On the pricing front, ${a.name} offers ${pA.toLowerCase()}, compared to ${b.name} at ${pB.toLowerCase()}, which can significantly impact your decision.`,
    `${a.name} rates ${rA}/10 overall versus ${b.name}'s ${rB}/10 — but ratings alone don't tell the whole story.`,
    `While ${a.name} emphasizes "${tA}," ${b.name} takes a distinctly different approach with "${tB}."`,
    `Price-wise, ${a.name} (${pA.toLowerCase()}) and ${b.name} (${pB.toLowerCase()}) target different budget segments.`,
    `Our editorial team rated ${a.name} at ${rA}/10 and ${b.name} at ${rB}/10 after extensive hands-on evaluation and user research.`,
    `${a.name} markets itself as "${tA}" and ${b.name} as "${tB}" — understanding these differences is key to making the right choice.`,
    `In terms of value, ${a.name} starts at ${pA.toLowerCase()} while ${b.name} is available at ${pB.toLowerCase()}, creating an interesting pricing dynamic.`,
    `With overall scores of ${rA} and ${rB} out of 10 respectively, both platforms have clearly earned their place in the market.`,
    `The feature sets diverge significantly: ${a.name} offers ${feats(a).length || 'several'} documented capabilities versus ${b.name}'s ${feats(b).length || 'own set of'} features.`,
    `Where ${a.name} leans toward "${tA}," ${b.name} counters with "${tB}" — the right choice depends entirely on your workflow.`,
  ];

  const closers = [
    `This comparison breaks down features, pricing, and real-world performance so you can decide with confidence.`,
    `We examine every angle — features, pricing, ease of use, and customer support — in our detailed analysis below.`,
    `Read on for our data-driven breakdown covering features, performance, pricing, and our expert verdict.`,
    `Below, we compare them across every dimension that matters for ${c.use} decisions.`,
    `Our side-by-side analysis covers everything you need to know before committing your budget and workflow to either platform.`,
    `Let's dive into the details and discover which ${c.noun} truly delivers more value for your specific requirements.`,
    `Here's our honest, data-backed breakdown of how these two ${c.plural} stack up against each other in ${YEAR}.`,
    `We've analyzed both platforms extensively — here's what we found across features, pricing, support, and overall value.`,
    `This head-to-head comparison reveals exactly where each tool excels and where it falls short.`,
    `Keep reading for our comprehensive breakdown, feature comparison, and expert verdict on this popular ${c.noun} matchup.`,
  ];

  return `${pick(openers, seed)} ${pick(middles, seed + 7)} ${pick(closers, seed + 13)}`;
}

function genVerdict(a, b, cat, seed) {
  const rA = r(a), rB = r(b);
  const easeA = r(a, 'ratings_ease_of_use'), easeB = r(b, 'ratings_ease_of_use');
  const valA = r(a, 'ratings_value'), valB = r(b, 'ratings_value');
  const featA = r(a, 'ratings_features'), featB = r(b, 'ratings_features');
  const supA = r(a, 'ratings_support'), supB = r(b, 'ratings_support');
  const c = CAT[cat] || CAT.saas;
  const diff = Math.abs(rA - rB);
  const winner = rA >= rB ? a : b;
  const loser = rA >= rB ? b : a;
  const wScore = Math.max(rA, rB), lScore = Math.min(rA, rB);

  let line;
  if (diff < 0.3)
    line = `${a.name} and ${b.name} are remarkably close in overall quality, scoring ${rA}/10 and ${rB}/10 respectively. The best choice depends entirely on your priorities, workflow, and budget.`;
  else if (diff > 1.5)
    line = `${winner.name} takes a clear lead over ${loser.name} with a ${wScore}/10 rating versus ${lScore}/10. While ${loser.name} still has its merits, ${winner.name} delivers a stronger overall package for most users seeking a reliable ${c.noun}.`;
  else
    line = `${winner.name} edges ahead with a ${wScore}/10 rating versus ${loser.name}'s ${lScore}/10. The margin is close enough that ${loser.name} could still be the better fit depending on what you prioritize most.`;

  function reasons(t, o) {
    const res = [];
    if (r(t) > r(o)) res.push(`You want the higher-rated ${c.noun} overall (${r(t)}/10 vs ${r(o)}/10)`);
    if (r(t, 'ratings_ease_of_use') > r(o, 'ratings_ease_of_use'))
      res.push(`A smooth learning curve and intuitive interface are top priorities (${r(t, 'ratings_ease_of_use')}/10 ease of use)`);
    if (r(t, 'ratings_value') > r(o, 'ratings_value'))
      res.push(`Getting the best value for money matters most to your team (${r(t, 'ratings_value')}/10 value rating)`);
    if (r(t, 'ratings_features') > r(o, 'ratings_features'))
      res.push(`You need the most comprehensive feature set available (${r(t, 'ratings_features')}/10 features)`);
    if (r(t, 'ratings_support') > r(o, 'ratings_support'))
      res.push(`Responsive, reliable customer support is essential for your workflow`);
    if (isFree(t) && !isFree(o))
      res.push(`You want to start with a free plan before making a financial commitment`);
    const pT = price(t), pO = price(o);
    if (pT && pO && pT < pO)
      res.push(`Budget is a concern — ${t.name} starts at $${pT}/mo vs $${pO}/mo`);
    const pros = extractPros(t.pros_cons_content);
    for (const p of pros.slice(0, 2)) {
      if (p.length < 90 && !res.some(r2 => r2.includes(p.substring(0, 15)))) res.push(p);
    }
    if (res.length < 2) res.push(`${t.name}'s approach to "${tag(t).toLowerCase()}" aligns with your workflow`);
    if (res.length < 2) res.push(`You prefer the specific capabilities that ${t.name} offers in the ${c.name.toLowerCase()} space`);
    return res.slice(0, 4);
  }

  const rA2 = reasons(a, b).map(x => `- ${x}`).join('\n');
  const rB2 = reasons(b, a).map(x => `- ${x}`).join('\n');

  return `## Our Verdict\n\n${line}\n\n### Choose ${a.name} if:\n${rA2}\n\n### Choose ${b.name} if:\n${rB2}`;
}

function genMigration(a, b, cat, seed) {
  const c = CAT[cat] || CAT.saas;

  function steps(from, to) {
    const s = [];
    s.push(`Review your current ${from.name} setup — document your key workflows, configurations, and integrations`);
    if (isFree(to))
      s.push(`Sign up for ${to.name}'s free plan to explore the interface and test your core workflows`);
    else if (to.pricing?.freeTrialDays)
      s.push(`Start a ${to.pricing.freeTrialDays}-day free trial of ${to.name} to evaluate whether it fits your needs`);
    else
      s.push(`Create ${aAn(to.name)} ${to.name} account and select the plan that matches your requirements (${priceLbl(to).toLowerCase()})`);
    s.push(`Export your data and settings from ${from.name} in a portable format`);
    s.push(`Configure your ${to.name} workspace, import your data, and set up team permissions if applicable`);
    const tf = feats(to);
    if (tf.length >= 2)
      s.push(`Explore ${to.name}-specific capabilities like ${humanize(tf[0]).toLowerCase()} and ${humanize(tf[1]).toLowerCase()}`);
    else if (tf.length === 1)
      s.push(`Explore ${to.name}'s standout capability: ${humanize(tf[0]).toLowerCase()}`);
    else
      s.push(`Take time to discover ${to.name}'s unique features that aren't available in ${from.name}`);
    s.push(`Run both platforms in parallel for 1-2 weeks to validate the transition before fully committing`);
    return s.map((x, i) => `${i + 1}. ${x}`).join('\n');
  }

  return `## Migration Guide\n\n### From ${a.name} to ${b.name}\n${steps(a, b)}\n\n### From ${b.name} to ${a.name}\n${steps(b, a)}`;
}

function genScenario(a, b, cat, seed) {
  const c = CAT[cat] || CAT.saas;
  const rA = r(a), rB = r(b);
  const eA = r(a, 'ratings_ease_of_use'), eB = r(b, 'ratings_ease_of_use');
  const vA = r(a, 'ratings_value'), vB = r(b, 'ratings_value');
  const sA = r(a, 'ratings_support'), sB = r(b, 'ratings_support');
  const fA = r(a, 'ratings_features'), fB = r(b, 'ratings_features');

  function rec(better, other, metric, metricVal, context) {
    return `${better.name} is the stronger pick here, scoring ${metricVal}/10 in ${metric}. ${other.name} is still a solid option, but ${better.name} offers a more refined experience for ${context}.`;
  }

  const startupBetter = vA >= vB ? a : b;
  const startupOther = vA >= vB ? b : a;
  const startupFree = [isFree(a) ? `${a.name} offers a free plan, ideal for bootstrapped teams.` : '', isFree(b) ? `${b.name} has a free tier, making it accessible for early-stage companies.` : ''].filter(Boolean).join(' ');

  const entBetter = sA >= sB ? a : b;
  const entOther = sA >= sB ? b : a;

  const freeBetter = eA >= eB ? a : b;
  const freeOther = eA >= eB ? b : a;

  const smbBetter = rA >= rB ? a : b;
  const smbOther = rA >= rB ? b : a;

  const scenarios = [
    `### For Startups\n${rec(startupBetter, startupOther, 'value for money', Math.max(vA, vB), 'budget-conscious teams')} ${startupFree}`,
    `### For Enterprise\n${rec(entBetter, entOther, 'customer support', Math.max(sA, sB), 'enterprise deployments requiring dedicated assistance')} Enterprise teams should also evaluate security certifications and compliance features.`,
    `### For Freelancers\n${rec(freeBetter, freeOther, 'ease of use', Math.max(eA, eB), 'solo professionals who need to move fast')} Quick onboarding and minimal setup time are crucial advantages for independent workers.`,
    `### For Small Business\n${rec(smbBetter, smbOther, 'overall capability', Math.max(rA, rB), 'growing teams that need a reliable all-around solution')} Small businesses should weigh total cost against the features most critical to their daily operations.`,
  ];

  return `## Best For Each Scenario\n\n${scenarios.join('\n\n')}`;
}

function genFeatureMatrix(a, b, cat) {
  const mx = [];

  // Rating-based rows
  const pairs = [
    ['Overall Rating', 'Performance', 'ratings_overall'],
    ['Ease of Use', 'Performance', 'ratings_ease_of_use'],
    ['Feature Set', 'Performance', 'ratings_features'],
    ['Value for Money', 'Performance', 'ratings_value'],
    ['Customer Support', 'Performance', 'ratings_support'],
  ];
  for (const [feat, category, field] of pairs) {
    const vA = r(a, field), vB = r(b, field);
    mx.push({ feature: feat, category, toolAValue: `${vA}/10`, toolBValue: `${vB}/10`, winner: vA > vB ? 'a' : vB > vA ? 'b' : 'tie' });
  }

  // Pricing rows
  const pA = price(a), pB = price(b);
  mx.push({
    feature: 'Starting Price', category: 'Pricing',
    toolAValue: pA ? `$${pA}/mo` : 'Contact',
    toolBValue: pB ? `$${pB}/mo` : 'Contact',
    winner: (!pA && !pB) ? 'tie' : !pA ? 'b' : !pB ? 'a' : pA < pB ? 'a' : pB < pA ? 'b' : 'tie',
  });

  const fA = isFree(a), fB = isFree(b);
  mx.push({
    feature: 'Free Plan', category: 'Pricing',
    toolAValue: fA ? 'Yes' : 'No', toolBValue: fB ? 'Yes' : 'No',
    winner: fA && !fB ? 'a' : fB && !fA ? 'b' : 'tie',
  });

  const trialA = a.pricing?.freeTrialDays, trialB = b.pricing?.freeTrialDays;
  if (trialA || trialB) {
    mx.push({
      feature: 'Free Trial', category: 'Pricing',
      toolAValue: trialA ? `${trialA} days` : 'No',
      toolBValue: trialB ? `${trialB} days` : 'No',
      winner: !trialA && !trialB ? 'tie' : !trialA ? 'b' : !trialB ? 'a' : trialA > trialB ? 'a' : trialB > trialA ? 'b' : 'tie',
    });
  }

  // Feature-based rows from actual tool data
  const ftsA = feats(a), ftsB = feats(b);
  const ftsAlow = ftsA.map(f => f.toLowerCase());
  const ftsBlow = ftsB.map(f => f.toLowerCase());

  // Find unique-to-A features
  let added = 0;
  for (const ft of ftsA) {
    if (added >= 3) break;
    const low = ft.toLowerCase();
    const matchB = ftsBlow.some(fb => {
      const words = low.split(/\s+/);
      return words.some(w => w.length > 3 && fb.includes(w));
    });
    if (!matchB) {
      mx.push({ feature: humanize(ft), category: 'Features', toolAValue: true, toolBValue: false, winner: 'a' });
      added++;
    }
  }

  // Find unique-to-B features
  added = 0;
  for (const ft of ftsB) {
    if (added >= 3) break;
    const low = ft.toLowerCase();
    const matchA = ftsAlow.some(fa => {
      const words = low.split(/\s+/);
      return words.some(w => w.length > 3 && fa.includes(w));
    });
    if (!matchA) {
      mx.push({ feature: humanize(ft), category: 'Features', toolAValue: false, toolBValue: true, winner: 'b' });
      added++;
    }
  }

  // Review count as social proof
  const rcA = a.review_count || 0, rcB = b.review_count || 0;
  if (rcA > 0 || rcB > 0) {
    mx.push({
      feature: 'User Reviews', category: 'Social Proof',
      toolAValue: rcA > 0 ? `${rcA.toLocaleString()} reviews` : 'Limited',
      toolBValue: rcB > 0 ? `${rcB.toLocaleString()} reviews` : 'Limited',
      winner: rcA > rcB ? 'a' : rcB > rcA ? 'b' : 'tie',
    });
  }

  return mx;
}

function genFaqs(a, b, cat, seed) {
  const c = CAT[cat] || CAT.saas;
  const rA = r(a), rB = r(b);
  const winner = rA >= rB ? a : b;
  const wScore = Math.max(rA, rB), lScore = Math.min(rA, rB);
  const pA = priceLbl(a), pB = priceLbl(b);
  const tA = tag(a).toLowerCase(), tB = tag(b).toLowerCase();
  const ftsA = feats(a).slice(0, 3), ftsB = feats(b).slice(0, 3);

  const faqs = [];

  // Q1: Which is better?
  faqs.push({
    question: `Which is better in ${YEAR}, ${a.name} or ${b.name}?`,
    answer: `Based on our ${YEAR} analysis, ${winner.name} scores higher at ${wScore}/10 compared to ${lScore}/10. However, "better" depends on your needs. ${a.name} excels as "${tA}" while ${b.name} focuses on "${tB}." We recommend evaluating both against your specific requirements before deciding.`,
  });

  // Q2: Pricing
  faqs.push({
    question: `Is ${a.name} or ${b.name} more affordable?`,
    answer: `${a.name}: ${pA}. ${b.name}: ${pB}. ${isFree(a) && !isFree(b)
      ? `${a.name} has the advantage with a free plan available for those starting out.`
      : isFree(b) && !isFree(a)
        ? `${b.name} has the advantage with a free plan, making it more accessible for budget-conscious users.`
        : isFree(a) && isFree(b)
          ? 'Both offer free plans, so you can test each platform thoroughly before committing to a paid tier.'
          : 'Neither currently offers a permanent free plan, but both provide options to evaluate the platform before purchasing.'}`,
  });

  // Q3: Main differences
  faqs.push({
    question: `What are the key differences between ${a.name} and ${b.name}?`,
    answer: `The primary differences are in approach and capabilities. ${a.name} ("${tA}") ${ftsA.length > 0 ? `offers capabilities like ${ftsA.join(', ').toLowerCase()}` : 'focuses on a specialized feature set'}. ${b.name} ("${tB}") ${ftsB.length > 0 ? `provides ${ftsB.join(', ').toLowerCase()}` : 'takes a different approach with its own unique capabilities'}. ${a.name} scores ${rA}/10 overall while ${b.name} achieves ${rB}/10 in our ratings.`,
  });

  // Q4: Switching
  faqs.push({
    question: `Can I easily switch from ${a.name} to ${b.name}?`,
    answer: `Switching between ${c.plural} is generally manageable. Start by exporting your data from ${a.name}, ${isFree(b) ? `then sign up for ${b.name}'s free plan to test it` : `then create a ${b.name} account`}. We recommend running both tools in parallel during the transition period to ensure a smooth migration with no disruption to your workflow.`,
  });

  // Q5: Category-specific
  const catQs = {
    'ai-tools': {
      q: `Is ${a.name} or ${b.name} better for professional workflows?`,
      a: `For professional use, consider your primary needs. ${r(a, 'ratings_features') >= r(b, 'ratings_features') ? a.name : b.name} scores higher for features (${Math.max(r(a, 'ratings_features'), r(b, 'ratings_features'))}/10), while ${r(a, 'ratings_ease_of_use') >= r(b, 'ratings_ease_of_use') ? a.name : b.name} offers better ease of use (${Math.max(r(a, 'ratings_ease_of_use'), r(b, 'ratings_ease_of_use'))}/10). Both are viable for professional work — the best choice depends on your specific AI workflow requirements.`,
    },
    'marketing': {
      q: `Which ${c.noun} delivers better ROI: ${a.name} or ${b.name}?`,
      a: `ROI depends on your marketing strategy and team size. ${r(a, 'ratings_value') >= r(b, 'ratings_value') ? a.name : b.name} scores higher for value (${Math.max(r(a, 'ratings_value'), r(b, 'ratings_value'))}/10), suggesting better bang for your buck. Consider your campaign volume, required channels, and team collaboration needs when making the final call.`,
    },
    'saas': {
      q: `Which is more suitable for growing teams: ${a.name} or ${b.name}?`,
      a: `For team adoption, ${r(a, 'ratings_ease_of_use') >= r(b, 'ratings_ease_of_use') ? a.name : b.name} has the edge in ease of use (${Math.max(r(a, 'ratings_ease_of_use'), r(b, 'ratings_ease_of_use'))}/10), meaning faster onboarding. ${r(a, 'ratings_support') >= r(b, 'ratings_support') ? a.name : b.name} offers stronger support (${Math.max(r(a, 'ratings_support'), r(b, 'ratings_support'))}/10) for when your team needs help scaling their workflows.`,
    },
    'hosting': {
      q: `Which hosting service offers better reliability: ${a.name} or ${b.name}?`,
      a: `Both ${a.name} and ${b.name} prioritize reliability. ${r(a, 'ratings_features') >= r(b, 'ratings_features') ? a.name : b.name} scores higher on features (${Math.max(r(a, 'ratings_features'), r(b, 'ratings_features'))}/10), which typically includes infrastructure quality. Check each provider's SLA commitments and recent uptime data for the most current reliability comparison.`,
    },
    'ecommerce': {
      q: `Which is better for launching an online store: ${a.name} or ${b.name}?`,
      a: `For online selling, ${winner.name} has the higher overall rating (${wScore}/10). Consider ${a.name} if "${tA}" fits your selling model, or ${b.name} if "${tB}" better matches your needs. Both platforms support core ecommerce functionality — the difference is in the details and pricing structure.`,
    },
    'business': {
      q: `Which ${c.noun} scales better with growth: ${a.name} or ${b.name}?`,
      a: `Scalability depends on your growth trajectory. ${r(a, 'ratings_features') >= r(b, 'ratings_features') ? a.name : b.name} offers a more extensive feature set (${Math.max(r(a, 'ratings_features'), r(b, 'ratings_features'))}/10), which often correlates with better scalability. Review the pricing tiers of both platforms to understand how costs will scale as your usage grows.`,
    },
  };
  const cq = catQs[cat] || catQs.saas;
  faqs.push({ question: cq.q, answer: cq.a });

  return faqs;
}

function genMetaTitle(a, b, seed) {
  const templates = [
    `${a.name} vs ${b.name}: Honest Comparison (${YEAR})`,
    `${a.name} vs ${b.name} (${YEAR}) — Which Is Better?`,
    `${a.name} vs ${b.name}: Full Comparison ${YEAR}`,
    `Comparing ${a.name} and ${b.name} (${YEAR})`,
    `${a.name} vs ${b.name} — Side-by-Side Review ${YEAR}`,
    `${a.name} vs ${b.name}: Features, Pricing & Verdict (${YEAR})`,
    `${a.name} or ${b.name}? Complete ${YEAR} Comparison`,
  ];
  return pick(templates, seed);
}

function genMetaDesc(a, b, cat, seed) {
  const c = CAT[cat] || CAT.saas;
  const rA = r(a), rB = r(b);
  const templates = [
    `Compare ${a.name} vs ${b.name} side by side. Features, pricing, ratings (${rA} vs ${rB}), and which ${c.noun} is better for your needs in ${YEAR}.`,
    `${a.name} or ${b.name}? See our detailed ${YEAR} comparison of features, pricing, and pros & cons to find the right ${c.noun}.`,
    `Honest ${a.name} vs ${b.name} comparison for ${YEAR}. We analyze ratings, pricing, features, and use cases to help you choose the best ${c.noun}.`,
    `${a.name} (${rA}/10) vs ${b.name} (${rB}/10) — which ${c.noun} wins? Our in-depth comparison covers pricing, features, and expert verdict.`,
    `Deciding between ${a.name} and ${b.name}? Our ${YEAR} comparison covers ratings, pricing, features, and our expert recommendation.`,
  ];
  return pick(templates, seed + 3);
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 ProPicked Comparison Generator');
  console.log(`   Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE INSERT'}`);
  console.log(`   Extra pairs: ${INCLUDE_EXTRA}`);
  console.log(`   Limit: ${LIMIT === Infinity ? 'none' : LIMIT}\n`);

  // Load pairs
  const newPairs = JSON.parse(fs.readFileSync(path.join(TMP_DIR, 'new-pairs.json'), 'utf-8'));
  let allPairs = [...newPairs];
  if (INCLUDE_EXTRA) {
    const extraPairs = JSON.parse(fs.readFileSync(path.join(TMP_DIR, 'extra-pairs.json'), 'utf-8'));
    allPairs = [...allPairs, ...extraPairs];
  }
  if (LIMIT < allPairs.length) allPairs = allPairs.slice(0, LIMIT);
  console.log(`📊 Processing ${allPairs.length} pairs\n`);

  // Fetch all tools
  console.log('📥 Fetching tools from Supabase...');
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/tools?select=*&limit=500`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  const tools = await resp.json();
  console.log(`   ${tools.length} tools loaded\n`);

  const byId = {};
  for (const t of tools) byId[t.id] = t;

  // Generate
  console.log('⚙️  Generating comparison content...');
  const comparisons = [];
  let skipped = 0;

  for (const pair of allPairs) {
    const a = byId[pair.tool_a_id];
    const b = byId[pair.tool_b_id];
    if (!a || !b) { skipped++; continue; }

    const slug = `${pair.tool_a_slug}-vs-${pair.tool_b_slug}`;
    const seed = hash(slug);
    const cat = pair.category_slug;

    comparisons.push({
      slug,
      category_slug: cat,
      tool_a_id: pair.tool_a_id,
      tool_b_id: pair.tool_b_id,
      intro_content: genIntro(a, b, cat, seed),
      verdict_content: genVerdict(a, b, cat, seed),
      migration_content: genMigration(a, b, cat, seed),
      scenario_content: genScenario(a, b, cat, seed),
      feature_matrix: genFeatureMatrix(a, b, cat),
      faqs: genFaqs(a, b, cat, seed),
      meta_title: genMetaTitle(a, b, seed),
      meta_description: genMetaDesc(a, b, cat, seed),
      last_updated: new Date().toISOString(),
    });
  }

  console.log(`✅ Generated ${comparisons.length} comparisons (${skipped} skipped)\n`);

  // Uniqueness stats
  const introSet = new Set(comparisons.map(c => c.intro_content));
  const verdictSet = new Set(comparisons.map(c => c.verdict_content));
  console.log(`📝 Uniqueness check:`);
  console.log(`   Unique intros:   ${introSet.size}/${comparisons.length} (${(introSet.size/comparisons.length*100).toFixed(1)}%)`);
  console.log(`   Unique verdicts: ${verdictSet.size}/${comparisons.length} (${(verdictSet.size/comparisons.length*100).toFixed(1)}%)\n`);

  if (DRY_RUN) {
    const outFile = path.join(TMP_DIR, 'generated-comparisons.json');
    fs.writeFileSync(outFile, JSON.stringify(comparisons, null, 2));
    console.log(`💾 Saved to ${outFile}`);
    if (comparisons.length > 0) {
      const s = comparisons[0];
      console.log(`\n📝 Sample — ${s.slug}:`);
      console.log(`   Title: ${s.meta_title}`);
      console.log(`   Intro (${s.intro_content.length} chars)`);
      console.log(`   Verdict (${s.verdict_content.length} chars)`);
      console.log(`   Migration (${s.migration_content.length} chars)`);
      console.log(`   Scenario (${s.scenario_content.length} chars)`);
      console.log(`   Features: ${s.feature_matrix.length} rows`);
      console.log(`   FAQs: ${s.faqs.length} items`);
      console.log(`\n   INTRO:\n   ${s.intro_content.substring(0, 300)}...`);
    }
    return;
  }

  // Insert into Supabase
  const BATCH = 25;
  let inserted = 0, errors = 0;

  for (let i = 0; i < comparisons.length; i += BATCH) {
    const batch = comparisons.slice(i, i + BATCH);
    const batchNum = Math.floor(i / BATCH) + 1;
    const totalBatches = Math.ceil(comparisons.length / BATCH);
    console.log(`📤 Batch ${batchNum}/${totalBatches} (${batch.length} records)...`);

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/comparisons`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=ignore-duplicates,return=minimal',
        },
        body: JSON.stringify(batch),
      });

      if (res.ok) {
        inserted += batch.length;
        console.log(`   ✅ OK`);
      } else {
        const errText = await res.text();
        console.error(`   ❌ Batch failed (${res.status}): ${errText.substring(0, 200)}`);

        // Retry individually
        console.log(`   🔄 Retrying individually...`);
        for (const comp of batch) {
          try {
            const r2 = await fetch(`${SUPABASE_URL}/rest/v1/comparisons`, {
              method: 'POST',
              headers: {
                apikey: SUPABASE_KEY,
                Authorization: `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                Prefer: 'resolution=ignore-duplicates,return=minimal',
              },
              body: JSON.stringify(comp),
            });
            if (r2.ok) { inserted++; }
            else {
              const e = await r2.text();
              console.error(`      ❌ ${comp.slug}: ${e.substring(0, 150)}`);
              errors++;
            }
          } catch (e) {
            console.error(`      ❌ ${comp.slug}: ${e.message}`);
            errors++;
          }
        }
      }
    } catch (e) {
      console.error(`   ❌ Network error: ${e.message}`);
      errors += batch.length;
    }
  }

  console.log(`\n🎉 Complete! Inserted: ${inserted} | Errors: ${errors} | Skipped: ${skipped}`);
  console.log(`   Total comparisons now: ~${326 + inserted}`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
