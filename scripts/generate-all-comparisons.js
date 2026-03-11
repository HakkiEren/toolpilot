#!/usr/bin/env node
/**
 * ProPicked — Generate ALL missing comparison pages
 * Finds every possible within-category tool pair, skips existing, generates + inserts.
 *
 * Usage:
 *   node scripts/generate-all-comparisons.js              # Live insert
 *   node scripts/generate-all-comparisons.js --dry-run     # Count only
 *   node scripts/generate-all-comparisons.js --limit 500   # First N pairs
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://gqqgbfoniyfbpbognnks.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcWdiZm9uaXlmYnBib2dubmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2MTE5MiwiZXhwIjoyMDg4MTM3MTkyfQ.6oFu47JKMXsCIaD7vokhGc0AOlnqyn6Y-oExSy0pcDE';
const YEAR = 2026;
const BATCH_SIZE = 25;
const BATCH_DELAY_MS = 150; // pace to avoid rate limits

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx >= 0 ? parseInt(args[limitIdx + 1]) : Infinity;

// ── Category metadata ───────────────────────────────────────────────────────
const CAT = {
  'ai-tools':   { name: 'AI Tools',           noun: 'AI tool',            plural: 'AI tools',            use: 'artificial intelligence tasks' },
  'marketing':  { name: 'Marketing Tools',     noun: 'marketing tool',     plural: 'marketing tools',     use: 'digital marketing' },
  'saas':       { name: 'SaaS Platforms',      noun: 'SaaS platform',      plural: 'SaaS tools',          use: 'business operations' },
  'hosting':    { name: 'Web Hosting',         noun: 'hosting provider',   plural: 'hosting services',    use: 'web hosting' },
  'ecommerce':  { name: 'Ecommerce Platforms', noun: 'ecommerce platform', plural: 'ecommerce platforms', use: 'online selling' },
  'business':   { name: 'Business Tools',      noun: 'business tool',      plural: 'business tools',      use: 'business management' },
};

// ── Helpers ─────────────────────────────────────────────────────────────────
function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; } return Math.abs(h); }
function pick(arr, seed) { return arr[seed % arr.length]; }
function humanize(s) { return s.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }
function aAn(w) { return /^[aeiou]/i.test(w) ? 'an' : 'a'; }

function feats(tool) {
  if (!tool.features) return [];
  if (Array.isArray(tool.features)) return tool.features.filter(f => typeof f === 'string' && f.length > 2).slice(0, 12);
  if (typeof tool.features === 'object') return Object.entries(tool.features).filter(([, v]) => v === true).map(([k]) => k).slice(0, 12);
  return [];
}
function priceLbl(t) {
  const p = t.pricing; if (!p) return 'Contact for pricing';
  const free = p.hasFreePlan || p.hasFreeplan;
  if (free && p.startingPrice) return `Free plan available, paid from $${p.startingPrice}/mo`;
  if (free) return 'Free';
  if (p.startingPrice) return `From $${p.startingPrice}/mo`;
  if (p.freeTrialDays) return `${p.freeTrialDays}-day free trial`;
  return 'Contact for pricing';
}
function price(t) { return t.pricing?.startingPrice || null; }
function isFree(t) { return !!(t.pricing?.hasFreePlan || t.pricing?.hasFreeplan); }
function r(t, f) { return t[f || 'ratings_overall'] || 7.0; }
function tag(t) { return (t.tagline || `A leading ${(CAT[t.category_slug] || CAT.saas).noun}`).replace(/\.\s*$/, ''); }

function extractPros(html) {
  if (!html) return [];
  const m = html.match(/Pros[\s\S]*?<ul>([\s\S]*?)<\/ul>/i);
  if (!m) return [];
  return [...m[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(x => x[1].replace(/<[^>]+>/g, '').trim()).filter(s => s.length > 5 && s.length < 120).slice(0, 5);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Content Generators (enriched for higher uniqueness) ─────────────────────

function genIntro(a, b, cat, seed) {
  const c = CAT[cat] || CAT.saas;
  const rA = r(a), rB = r(b);
  const pA = priceLbl(a), pB = priceLbl(b);
  const tA = tag(a).toLowerCase(), tB = tag(b).toLowerCase();
  const fA = feats(a), fB = feats(b);
  const rcA = a.review_count || 0, rcB = b.review_count || 0;

  const openers = [
    `Choosing between ${a.name} and ${b.name} is a common dilemma for anyone evaluating ${c.plural} in ${YEAR}.`,
    `${a.name} and ${b.name} are two of the most discussed ${c.plural} on the market today, each with a loyal user base and distinct strengths.`,
    `If you're weighing ${a.name} against ${b.name}, you're looking at two fundamentally different approaches to ${c.use}.`,
    `The ${a.name} vs ${b.name} debate comes up frequently among professionals building their ${c.use} stack.`,
    `Both ${a.name} and ${b.name} have earned solid reputations in the ${c.name.toLowerCase()} landscape, but they serve markedly different needs.`,
    `When it comes to ${c.use}, few matchups generate as much discussion as ${a.name} versus ${b.name}.`,
    `${a.name} and ${b.name} each bring unique value propositions to the ${c.name.toLowerCase()} category, making a direct comparison essential.`,
    `Picking the right ${c.noun} often narrows down to ${a.name} vs ${b.name} — two popular choices with surprisingly different philosophies.`,
    `In the competitive ${c.name.toLowerCase()} space, ${a.name} and ${b.name} consistently rank among the most compared options by industry professionals.`,
    `Whether you're building a startup or managing an enterprise team, the choice between ${a.name} and ${b.name} deserves careful evaluation.`,
    `${a.name}, positioned as "${tA}," goes head to head with ${b.name}, known for "${tB}," in this comprehensive ${YEAR} comparison.`,
    `Looking for the best ${c.noun} for your needs? The ${a.name} vs ${b.name} comparison is one of the most requested matchups we receive.`,
    `The ${c.name.toLowerCase()} market is crowded, yet ${a.name} and ${b.name} stand out for distinctly different reasons.`,
    `Two ${c.plural} that frequently appear on decision-makers' shortlists are ${a.name} and ${b.name} — here's exactly how they stack up.`,
    `Understanding the real differences between ${a.name} and ${b.name} can save you weeks of evaluation time and prevent costly subscription mistakes.`,
  ];

  const middles = [
    `${a.name} positions itself as "${tA}" while ${b.name} focuses on being "${tB}" — quite different value propositions targeting the same market.`,
    `With ${a.name} scoring ${rA}/10 and ${b.name} at ${rB}/10 in our editorial ratings, both clearly have merit, but the details tell a richer story.`,
    `On the pricing front, ${a.name} offers ${pA.toLowerCase()}, compared to ${b.name} at ${pB.toLowerCase()}, which can significantly shift the decision for budget-conscious teams.`,
    `${a.name} rates ${rA}/10 overall versus ${b.name}'s ${rB}/10 — but ratings alone never tell the full story behind these tools.`,
    `While ${a.name} emphasizes "${tA}," ${b.name} takes a distinctly different path with "${tB}," appealing to different user profiles.`,
    `Our editorial team rated ${a.name} at ${rA}/10 and ${b.name} at ${rB}/10 after extensive hands-on evaluation, user research, and feature auditing.`,
    `In terms of value, ${a.name} starts at ${pA.toLowerCase()} while ${b.name} is available at ${pB.toLowerCase()}, creating a notable pricing gap worth investigating.`,
    `With overall scores of ${rA} and ${rB} out of 10 respectively, both platforms have clearly proven their worth to thousands of users worldwide.`,
    `The feature sets diverge in important ways: ${a.name} offers ${fA.length || 'several specialized'} capabilities, while ${b.name} provides ${fB.length || 'its own set of'} features tuned for different workflows.`,
    `Where ${a.name} leans toward "${tA}," ${b.name} counters with "${tB}" — making the ideal choice entirely dependent on your specific requirements.`,
    `Price-wise, ${a.name} (${pA.toLowerCase()}) and ${b.name} (${pB.toLowerCase()}) target different segments, which matters as much as features when making a long-term commitment.`,
    `${a.name} markets itself as "${tA}" while ${b.name} focuses on "${tB}" — understanding these core differences is the key to avoiding buyer's remorse.`,
  ];

  const details = [
    fA.length >= 2 && fB.length >= 2
      ? `${a.name} distinguishes itself with capabilities like ${humanize(fA[0]).toLowerCase()} and ${humanize(fA[1]).toLowerCase()}, whereas ${b.name} counters with ${humanize(fB[0]).toLowerCase()} and ${humanize(fB[1]).toLowerCase()}.`
      : `Each tool brings a unique set of capabilities to the table, with different areas of specialization that cater to distinct workflow needs.`,
    rcA > 100 && rcB > 100
      ? `With ${rcA.toLocaleString()} user reviews for ${a.name} and ${rcB.toLocaleString()} for ${b.name}, both platforms have substantial real-world validation from their user communities.`
      : `Both tools have built active user communities, each contributing real-world feedback that informs our evaluation.`,
    r(a, 'ratings_ease_of_use') !== r(b, 'ratings_ease_of_use')
      ? `Notably, ${r(a, 'ratings_ease_of_use') > r(b, 'ratings_ease_of_use') ? a.name : b.name} scores higher for ease of use (${Math.max(r(a, 'ratings_ease_of_use'), r(b, 'ratings_ease_of_use'))}/10), which can be decisive for teams prioritizing fast onboarding.`
      : `Both tools score similarly on ease of use, so the deciding factor often comes down to specific feature needs and pricing preferences.`,
    isFree(a) !== isFree(b)
      ? `An important distinction: ${isFree(a) ? a.name : b.name} offers a free plan, giving it an edge for users who want to evaluate thoroughly before investing.`
      : isFree(a) && isFree(b)
        ? `Both platforms offer free plans, which is excellent news for teams wanting to conduct a proper side-by-side evaluation before committing.`
        : `Neither tool currently offers a free plan, making a thorough comparison like this one especially valuable before you invest.`,
  ];

  const closers = [
    `This comparison breaks down features, pricing, real-world performance, and expert verdict so you can decide with confidence.`,
    `We examine every angle — features, pricing, ease of use, customer support, and community feedback — in our detailed analysis below.`,
    `Read on for our data-driven breakdown covering features, performance, pricing tiers, and our expert verdict.`,
    `Below, we compare them across every dimension that matters for ${c.use} decisions in ${YEAR}.`,
    `Our side-by-side analysis covers everything you need to know before committing your budget and workflow to either platform.`,
    `Let's dive into the details and discover which ${c.noun} truly delivers more value for your specific requirements and team size.`,
    `Here's our honest, data-backed breakdown of how these two ${c.plural} stack up against each other in ${YEAR}.`,
    `We've analyzed both platforms extensively — here's what we found across features, pricing, support, and overall value.`,
    `This head-to-head comparison reveals exactly where each tool excels, where it falls short, and which team profiles benefit most from each.`,
    `Keep reading for our comprehensive breakdown, feature comparison, pricing analysis, and expert verdict on this popular ${c.noun} matchup.`,
  ];

  return `${pick(openers, seed)} ${pick(middles, seed + 7)} ${pick(details, seed + 11)} ${pick(closers, seed + 17)}`;
}

function genVerdict(a, b, cat, seed) {
  const c = CAT[cat] || CAT.saas;
  const rA = r(a), rB = r(b);
  const diff = Math.abs(rA - rB);
  const w = rA >= rB ? a : b;
  const l = rA >= rB ? b : a;
  const wS = Math.max(rA, rB), lS = Math.min(rA, rB);

  let line;
  if (diff < 0.3)
    line = `${a.name} and ${b.name} are remarkably close in overall quality, scoring ${rA}/10 and ${rB}/10 respectively. The best choice depends on your specific workflow, team size, and budget priorities.`;
  else if (diff > 1.5)
    line = `${w.name} takes a clear lead over ${l.name} with a ${wS}/10 rating versus ${lS}/10. While ${l.name} has its merits in specific niches, ${w.name} delivers a stronger overall package for the majority of ${c.use} use cases.`;
  else
    line = `${w.name} edges ahead with a ${wS}/10 rating versus ${l.name}'s ${lS}/10, but the gap is close enough that ${l.name} may still be the better fit depending on what matters most to your team.`;

  function reasons(t, o) {
    const res = [];
    if (r(t) > r(o)) res.push(`You want the higher-rated ${c.noun} overall (${r(t)}/10 vs ${r(o)}/10)`);
    if (r(t, 'ratings_ease_of_use') > r(o, 'ratings_ease_of_use'))
      res.push(`A smooth learning curve and intuitive interface are top priorities (${r(t, 'ratings_ease_of_use')}/10 ease of use)`);
    if (r(t, 'ratings_value') > r(o, 'ratings_value'))
      res.push(`Getting the best value for money matters most to your team (${r(t, 'ratings_value')}/10 value score)`);
    if (r(t, 'ratings_features') > r(o, 'ratings_features'))
      res.push(`You need the most comprehensive feature set available (${r(t, 'ratings_features')}/10 features)`);
    if (r(t, 'ratings_support') > r(o, 'ratings_support'))
      res.push(`Responsive, reliable customer support is essential for your operations`);
    if (isFree(t) && !isFree(o))
      res.push(`You want to start with a free plan before making a financial commitment`);
    const pT = price(t), pO = price(o);
    if (pT && pO && pT < pO)
      res.push(`Budget is a primary concern — ${t.name} starts at $${pT}/mo vs $${pO}/mo`);
    const pros = extractPros(t.pros_cons_content);
    for (const p of pros.slice(0, 2)) {
      if (p.length < 90 && !res.some(r2 => r2.includes(p.substring(0, 12)))) res.push(p);
    }
    const tf = feats(t);
    if (tf.length > 5 && (!feats(o).length || tf.length > feats(o).length + 2))
      res.push(`You need a wide range of capabilities (${t.name} offers ${tf.length}+ documented features)`);
    if (res.length < 2) res.push(`${t.name}'s approach to "${tag(t).toLowerCase()}" aligns with your daily workflow`);
    if (res.length < 2) res.push(`You prefer the specific capabilities that ${t.name} offers in the ${c.name.toLowerCase()} space`);
    return res.slice(0, 5);
  }

  const rA2 = reasons(a, b).map(x => `- ${x}`).join('\n');
  const rB2 = reasons(b, a).map(x => `- ${x}`).join('\n');

  return `## Our Verdict\n\n${line}\n\n### Choose ${a.name} if:\n${rA2}\n\n### Choose ${b.name} if:\n${rB2}`;
}

function genMigration(a, b, cat, seed) {
  function steps(from, to) {
    const s = [];
    s.push(`Review your current ${from.name} setup — document key workflows, data, integrations, and team configurations`);
    if (isFree(to))
      s.push(`Sign up for ${to.name}'s free plan to explore the interface and test your critical workflows before migrating data`);
    else if (to.pricing?.freeTrialDays)
      s.push(`Start a ${to.pricing.freeTrialDays}-day free trial of ${to.name} to evaluate whether it genuinely fits your team's needs`);
    else
      s.push(`Create ${aAn(to.name)} ${to.name} account and select the plan that matches your requirements (${priceLbl(to).toLowerCase()})`);
    s.push(`Export your data and settings from ${from.name} using their export tools or API`);
    s.push(`Configure your ${to.name} workspace, import your data, and set up team permissions if needed`);
    const tf = feats(to);
    if (tf.length >= 2)
      s.push(`Explore ${to.name}-specific capabilities like ${humanize(tf[0]).toLowerCase()} and ${humanize(tf[1]).toLowerCase()} that may improve your workflow`);
    else
      s.push(`Take time to discover ${to.name}'s unique features that aren't available in ${from.name}`);
    s.push(`Run both platforms in parallel for 1-2 weeks to validate the transition before fully committing`);
    return s.map((x, i) => `${i + 1}. ${x}`).join('\n');
  }
  return `## Migration Guide\n\n### From ${a.name} to ${b.name}\n${steps(a, b)}\n\n### From ${b.name} to ${a.name}\n${steps(b, a)}`;
}

function genScenario(a, b, cat, seed) {
  const c = CAT[cat] || CAT.saas;

  function rec(better, other, metric, val, ctx) {
    return `${better.name} is the stronger pick here, scoring ${val}/10 in ${metric}. ${other.name} remains a viable option, but ${better.name} delivers a more refined experience for ${ctx}.`;
  }

  const vA = r(a, 'ratings_value'), vB = r(b, 'ratings_value');
  const sA = r(a, 'ratings_support'), sB = r(b, 'ratings_support');
  const eA = r(a, 'ratings_ease_of_use'), eB = r(b, 'ratings_ease_of_use');
  const rA = r(a), rB = r(b);
  const fA = r(a, 'ratings_features'), fB = r(b, 'ratings_features');

  const freePhrases = [isFree(a) ? `${a.name} offers a free plan, ideal for bootstrapped teams.` : '', isFree(b) ? `${b.name} has a free tier, making it accessible for early-stage companies.` : ''].filter(Boolean).join(' ');

  const scenarios = [
    `### For Startups\n${rec(vA >= vB ? a : b, vA >= vB ? b : a, 'value for money', Math.max(vA, vB), 'budget-conscious teams')} ${freePhrases}`,
    `### For Enterprise\n${rec(sA >= sB ? a : b, sA >= sB ? b : a, 'customer support', Math.max(sA, sB), 'enterprise deployments requiring dedicated assistance')} Enterprise teams should also consider each platform's security certifications and compliance features.`,
    `### For Freelancers\n${rec(eA >= eB ? a : b, eA >= eB ? b : a, 'ease of use', Math.max(eA, eB), 'solo professionals who need to onboard quickly and move fast')} Minimal setup time and intuitive interfaces are key advantages.`,
    `### For Growing Teams\n${rec(fA >= fB ? a : b, fA >= fB ? b : a, 'feature completeness', Math.max(fA, fB), 'scaling teams that need room to grow within the platform')} Consider how each tool's pricing scales with additional users and usage volume.`,
  ];

  return `## Best For Each Scenario\n\n${scenarios.join('\n\n')}`;
}

function genFeatureMatrix(a, b) {
  const mx = [];
  const ratingPairs = [
    ['Overall Rating', 'Performance', 'ratings_overall'],
    ['Ease of Use', 'Performance', 'ratings_ease_of_use'],
    ['Feature Set', 'Performance', 'ratings_features'],
    ['Value for Money', 'Performance', 'ratings_value'],
    ['Customer Support', 'Performance', 'ratings_support'],
  ];
  for (const [feat, cat, field] of ratingPairs) {
    const vA = r(a, field), vB = r(b, field);
    mx.push({ feature: feat, category: cat, toolAValue: `${vA}/10`, toolBValue: `${vB}/10`, winner: vA > vB ? 'a' : vB > vA ? 'b' : 'tie' });
  }

  const pA = price(a), pB = price(b);
  mx.push({ feature: 'Starting Price', category: 'Pricing', toolAValue: pA ? `$${pA}/mo` : 'Contact', toolBValue: pB ? `$${pB}/mo` : 'Contact', winner: (!pA && !pB) ? 'tie' : !pA ? 'b' : !pB ? 'a' : pA < pB ? 'a' : pB < pA ? 'b' : 'tie' });

  const fA = isFree(a), fB = isFree(b);
  mx.push({ feature: 'Free Plan', category: 'Pricing', toolAValue: fA ? 'Yes' : 'No', toolBValue: fB ? 'Yes' : 'No', winner: fA && !fB ? 'a' : fB && !fA ? 'b' : 'tie' });

  const trA = a.pricing?.freeTrialDays, trB = b.pricing?.freeTrialDays;
  if (trA || trB) {
    mx.push({ feature: 'Free Trial', category: 'Pricing', toolAValue: trA ? `${trA} days` : 'No', toolBValue: trB ? `${trB} days` : 'No', winner: !trA && !trB ? 'tie' : !trA ? 'b' : !trB ? 'a' : trA > trB ? 'a' : trB > trA ? 'b' : 'tie' });
  }

  // Unique features from tool data
  const ftsA = feats(a), ftsB = feats(b);
  const ftsAlow = ftsA.map(f => f.toLowerCase()), ftsBlow = ftsB.map(f => f.toLowerCase());
  let added = 0;
  for (const ft of ftsA) {
    if (added >= 3) break;
    const low = ft.toLowerCase();
    if (!ftsBlow.some(fb => low.split(/\s+/).some(w => w.length > 3 && fb.includes(w)))) {
      mx.push({ feature: humanize(ft), category: 'Features', toolAValue: true, toolBValue: false, winner: 'a' });
      added++;
    }
  }
  added = 0;
  for (const ft of ftsB) {
    if (added >= 3) break;
    const low = ft.toLowerCase();
    if (!ftsAlow.some(fa => low.split(/\s+/).some(w => w.length > 3 && fa.includes(w)))) {
      mx.push({ feature: humanize(ft), category: 'Features', toolAValue: false, toolBValue: true, winner: 'b' });
      added++;
    }
  }

  const rcA = a.review_count || 0, rcB = b.review_count || 0;
  if (rcA > 0 || rcB > 0) {
    mx.push({ feature: 'User Reviews', category: 'Social Proof', toolAValue: rcA > 0 ? `${rcA.toLocaleString()} reviews` : 'Limited', toolBValue: rcB > 0 ? `${rcB.toLocaleString()} reviews` : 'Limited', winner: rcA > rcB ? 'a' : rcB > rcA ? 'b' : 'tie' });
  }

  return mx;
}

function genFaqs(a, b, cat, seed) {
  const c = CAT[cat] || CAT.saas;
  const rA = r(a), rB = r(b);
  const w = rA >= rB ? a : b;
  const wS = Math.max(rA, rB), lS = Math.min(rA, rB);
  const tA = tag(a).toLowerCase(), tB = tag(b).toLowerCase();
  const ftsA = feats(a).slice(0, 3), ftsB = feats(b).slice(0, 3);

  const faqs = [];
  faqs.push({ question: `Which is better in ${YEAR}, ${a.name} or ${b.name}?`, answer: `Based on our ${YEAR} analysis, ${w.name} scores higher at ${wS}/10 versus ${lS}/10. However, the best choice depends on your needs. ${a.name} excels as "${tA}" while ${b.name} focuses on "${tB}." Try both before committing.` });

  faqs.push({ question: `Is ${a.name} or ${b.name} more affordable?`, answer: `${a.name}: ${priceLbl(a)}. ${b.name}: ${priceLbl(b)}. ${isFree(a) && !isFree(b) ? `${a.name} has the advantage with a free plan.` : isFree(b) && !isFree(a) ? `${b.name} offers a free plan, giving it the edge for budget-conscious users.` : isFree(a) && isFree(b) ? 'Both offer free plans — test each before committing to paid.' : 'Neither offers a permanent free plan; check for trial options.'}` });

  faqs.push({ question: `What are the key differences between ${a.name} and ${b.name}?`, answer: `${a.name} ("${tA}") ${ftsA.length > 0 ? `provides ${ftsA.map(f => humanize(f).toLowerCase()).join(', ')}` : 'focuses on a specialized feature set'}. ${b.name} ("${tB}") ${ftsB.length > 0 ? `offers ${ftsB.map(f => humanize(f).toLowerCase()).join(', ')}` : 'takes a different approach'}. Ratings: ${rA}/10 vs ${rB}/10.` });

  faqs.push({ question: `Can I switch from ${a.name} to ${b.name}?`, answer: `Yes, switching is generally straightforward. Export your data from ${a.name}, ${isFree(b) ? `sign up for ${b.name}'s free plan` : `create ${aAn(b.name)} ${b.name} account`}, import your data, and run both in parallel during the transition.` });

  const catQs = {
    'ai-tools': { q: `Is ${a.name} or ${b.name} better for professional use?`, a: `For professional workflows, ${r(a, 'ratings_features') >= r(b, 'ratings_features') ? a.name : b.name} scores higher on features (${Math.max(r(a, 'ratings_features'), r(b, 'ratings_features'))}/10). Both are viable — evaluate against your specific AI workflow needs.` },
    'marketing': { q: `Which ${c.noun} delivers better ROI: ${a.name} or ${b.name}?`, a: `${r(a, 'ratings_value') >= r(b, 'ratings_value') ? a.name : b.name} scores higher for value (${Math.max(r(a, 'ratings_value'), r(b, 'ratings_value'))}/10). ROI depends on your campaign volume, channels, and team size.` },
    'saas': { q: `Which is better for teams: ${a.name} or ${b.name}?`, a: `${r(a, 'ratings_ease_of_use') >= r(b, 'ratings_ease_of_use') ? a.name : b.name} leads in ease of use (${Math.max(r(a, 'ratings_ease_of_use'), r(b, 'ratings_ease_of_use'))}/10) for faster team onboarding. ${r(a, 'ratings_support') >= r(b, 'ratings_support') ? a.name : b.name} has stronger support (${Math.max(r(a, 'ratings_support'), r(b, 'ratings_support'))}/10).` },
    'hosting': { q: `Which hosting is more reliable: ${a.name} or ${b.name}?`, a: `${r(a, 'ratings_features') >= r(b, 'ratings_features') ? a.name : b.name} scores higher on features (${Math.max(r(a, 'ratings_features'), r(b, 'ratings_features'))}/10), which typically correlates with infrastructure quality. Check each provider's SLA for specifics.` },
    'ecommerce': { q: `Which is better for online selling: ${a.name} or ${b.name}?`, a: `${w.name} has the higher overall rating (${wS}/10). Choose based on whether "${tA}" or "${tB}" better fits your selling model.` },
    'business': { q: `Which ${c.noun} scales better: ${a.name} or ${b.name}?`, a: `${r(a, 'ratings_features') >= r(b, 'ratings_features') ? a.name : b.name} has a more comprehensive feature set (${Math.max(r(a, 'ratings_features'), r(b, 'ratings_features'))}/10). Review pricing tiers to understand how costs scale with usage.` },
  };
  faqs.push(catQs[cat] || catQs.saas);

  return faqs;
}

function genMetaTitle(a, b, seed) {
  const t = [
    `${a.name} vs ${b.name}: Honest Comparison (${YEAR})`,
    `${a.name} vs ${b.name} (${YEAR}) — Which Is Better?`,
    `${a.name} vs ${b.name}: Full Comparison ${YEAR}`,
    `Comparing ${a.name} and ${b.name} (${YEAR})`,
    `${a.name} vs ${b.name} — Side-by-Side Review ${YEAR}`,
    `${a.name} vs ${b.name}: Features, Pricing & Verdict (${YEAR})`,
    `${a.name} or ${b.name}? Complete ${YEAR} Comparison`,
  ];
  return pick(t, seed);
}

function genMetaDesc(a, b, cat, seed) {
  const c = CAT[cat] || CAT.saas;
  const rA = r(a), rB = r(b);
  const t = [
    `Compare ${a.name} vs ${b.name} side by side. Features, pricing, ratings (${rA} vs ${rB}), and which ${c.noun} is better for your needs in ${YEAR}.`,
    `${a.name} or ${b.name}? Our detailed ${YEAR} comparison covers features, pricing, pros & cons to help you find the right ${c.noun}.`,
    `Honest ${a.name} vs ${b.name} comparison for ${YEAR}. Ratings, pricing, features, and use cases analyzed by our expert editorial team.`,
    `${a.name} (${rA}/10) vs ${b.name} (${rB}/10) — which ${c.noun} wins? Read our in-depth ${YEAR} comparison with pricing, features & verdict.`,
    `Deciding between ${a.name} and ${b.name}? Our ${YEAR} comparison covers ratings, pricing, features, and our expert recommendation.`,
  ];
  return pick(t, seed + 3);
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const t0 = Date.now();
  console.log('🚀 ProPicked — Generate ALL Missing Comparisons');
  console.log(`   Mode: ${DRY_RUN ? 'DRY RUN (count only)' : 'LIVE INSERT'}`);
  console.log(`   Limit: ${LIMIT === Infinity ? 'none' : LIMIT}\n`);

  // 1. Fetch all tools
  console.log('📥 Fetching tools...');
  const toolsResp = await fetch(`${SUPABASE_URL}/rest/v1/tools?select=*&limit=500`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  const allTools = await toolsResp.json();
  console.log(`   ${allTools.length} tools loaded`);

  // 2. Fetch existing comparison slugs
  console.log('📥 Fetching existing comparisons...');
  const compResp = await fetch(`${SUPABASE_URL}/rest/v1/comparisons?select=slug,tool_a_id,tool_b_id&limit=15000`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  const existingComps = await compResp.json();
  console.log(`   ${existingComps.length} existing comparisons\n`);

  // Build set of existing pairs (both directions)
  const existingPairs = new Set();
  for (const c of existingComps) {
    existingPairs.add(`${c.tool_a_id}|${c.tool_b_id}`);
    existingPairs.add(`${c.tool_b_id}|${c.tool_a_id}`);
  }

  // 3. Group tools by category
  const byCategory = {};
  for (const t of allTools) {
    if (!byCategory[t.category_slug]) byCategory[t.category_slug] = [];
    byCategory[t.category_slug].push(t);
  }

  // 4. Generate all missing pairs
  console.log('🔍 Finding missing pairs...');
  const missingPairs = [];

  for (const [cat, tools] of Object.entries(byCategory)) {
    // Sort by rating (popular tools first for better pair quality)
    tools.sort((a, b) => (b.ratings_overall || 0) - (a.ratings_overall || 0));
    let catMissing = 0;

    for (let i = 0; i < tools.length; i++) {
      for (let j = i + 1; j < tools.length; j++) {
        const tA = tools[i], tB = tools[j];
        const pairKey = `${tA.id}|${tB.id}`;
        if (!existingPairs.has(pairKey)) {
          missingPairs.push({ a: tA, b: tB, cat });
          catMissing++;
        }
      }
    }
    console.log(`   ${cat}: ${catMissing} missing pairs`);
  }

  console.log(`\n📊 Total missing pairs: ${missingPairs.length}`);

  let toProcess = missingPairs;
  if (LIMIT < toProcess.length) toProcess = toProcess.slice(0, LIMIT);
  console.log(`   Processing: ${toProcess.length}\n`);

  if (DRY_RUN) {
    console.log(`💡 DRY RUN — would generate ${toProcess.length} comparisons`);
    console.log(`   Estimated insert time: ~${Math.ceil(toProcess.length / BATCH_SIZE * (BATCH_DELAY_MS + 500) / 60000)} minutes`);

    // Show sample
    if (toProcess.length > 0) {
      const p = toProcess[0];
      const slug = `${p.a.slug}-vs-${p.b.slug}`;
      const seed = hash(slug);
      console.log(`\n📝 Sample — ${slug}:`);
      const intro = genIntro(p.a, p.b, p.cat, seed);
      console.log(`   Intro (${intro.length} chars): ${intro.substring(0, 200)}...`);
    }
    return;
  }

  // 5. Generate and insert
  console.log('⚙️  Generating and inserting comparisons...\n');
  let inserted = 0, errors = 0, dupes = 0;

  for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
    const batch = toProcess.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(toProcess.length / BATCH_SIZE);

    // Generate content for this batch
    const records = [];
    for (const pair of batch) {
      const slug = `${pair.a.slug}-vs-${pair.b.slug}`;
      const seed = hash(slug);
      records.push({
        slug,
        category_slug: pair.cat,
        tool_a_id: pair.a.id,
        tool_b_id: pair.b.id,
        intro_content: genIntro(pair.a, pair.b, pair.cat, seed),
        verdict_content: genVerdict(pair.a, pair.b, pair.cat, seed),
        migration_content: genMigration(pair.a, pair.b, pair.cat, seed),
        scenario_content: genScenario(pair.a, pair.b, pair.cat, seed),
        feature_matrix: genFeatureMatrix(pair.a, pair.b),
        faqs: genFaqs(pair.a, pair.b, pair.cat, seed),
        meta_title: genMetaTitle(pair.a, pair.b, seed),
        meta_description: genMetaDesc(pair.a, pair.b, pair.cat, seed),
        last_updated: new Date().toISOString(),
      });
    }

    // Insert batch
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/comparisons`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=ignore-duplicates,return=minimal',
        },
        body: JSON.stringify(records),
      });

      if (res.ok) {
        inserted += records.length;
      } else {
        const errText = await res.text();
        // Try individually on batch failure
        for (const rec of records) {
          try {
            const r2 = await fetch(`${SUPABASE_URL}/rest/v1/comparisons`, {
              method: 'POST',
              headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', Prefer: 'resolution=ignore-duplicates,return=minimal' },
              body: JSON.stringify(rec),
            });
            if (r2.ok) inserted++;
            else errors++;
          } catch { errors++; }
        }
      }
    } catch (e) {
      errors += records.length;
    }

    // Progress log every 20 batches
    if (batchNum % 20 === 0 || batchNum === totalBatches) {
      const elapsed = ((Date.now() - t0) / 1000).toFixed(0);
      const pct = (i + batch.length) / toProcess.length * 100;
      console.log(`   Batch ${batchNum}/${totalBatches} — ${pct.toFixed(1)}% — ${inserted} inserted — ${elapsed}s elapsed`);
    }

    // Pace
    if (i + BATCH_SIZE < toProcess.length) await sleep(BATCH_DELAY_MS);
  }

  const totalTime = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n🎉 Complete in ${totalTime}s!`);
  console.log(`   Inserted: ${inserted}`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Total comparisons now: ~${existingComps.length + inserted}`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
