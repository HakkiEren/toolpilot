#!/usr/bin/env node
/**
 * ProPicked — Comparison Content Generator v2
 * Generates human-sounding, tool-specific comparison content.
 * Pulls from each tool's unique description, pros/cons, use cases, and bestFor data.
 *
 * Usage:
 *   node scripts/generate-all-comparisons.js                  # Insert missing only
 *   node scripts/generate-all-comparisons.js --update-all     # Regenerate ALL (upsert)
 *   node scripts/generate-all-comparisons.js --dry-run        # Preview only
 *   node scripts/generate-all-comparisons.js --limit 10       # First N pairs
 */

const SUPABASE_URL = 'https://gqqgbfoniyfbpbognnks.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcWdiZm9uaXlmYnBib2dubmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2MTE5MiwiZXhwIjoyMDg4MTM3MTkyfQ.6oFu47JKMXsCIaD7vokhGc0AOlnqyn6Y-oExSy0pcDE';
const YEAR = 2026;
const BATCH_SIZE = 25;
const BATCH_DELAY_MS = 200;

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const UPDATE_ALL = args.includes('--update-all');
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx >= 0 ? parseInt(args[limitIdx + 1]) : Infinity;

// ── Category metadata ───────────────────────────────────────────────────────
const CAT = {
  'ai-tools':   { name: 'AI Tools',           noun: 'AI tool',            plural: 'AI tools',            use: 'artificial intelligence' },
  'marketing':  { name: 'Marketing Tools',     noun: 'marketing tool',     plural: 'marketing tools',     use: 'digital marketing' },
  'saas':       { name: 'SaaS Platforms',      noun: 'SaaS platform',      plural: 'SaaS tools',          use: 'business operations' },
  'hosting':    { name: 'Web Hosting',         noun: 'hosting provider',   plural: 'hosting services',    use: 'web hosting' },
  'ecommerce':  { name: 'Ecommerce Platforms', noun: 'ecommerce platform', plural: 'ecommerce platforms', use: 'online selling' },
  'business':   { name: 'Business Tools',      noun: 'business tool',      plural: 'business tools',      use: 'business management' },
};

// ── Core helpers ─────────────────────────────────────────────────────────────
function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; } return Math.abs(h); }
function pick(arr, seed) { return arr[seed % arr.length]; }
function pickN(arr, seed, n) {
  const copy = [...arr];
  const result = [];
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = (seed + i * 7) % copy.length;
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}
function humanize(s) { return s.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }
function aAn(w) { return /^[aeiou]/i.test(w) ? 'an' : 'a'; }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}
function lc(s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : ''; }
function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

// ── Tool data accessors ─────────────────────────────────────────────────────
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
function rc(t) { return t.review_count || 0; }

// ── Content extraction from rich HTML fields ────────────────────────────────
function extractPros(html) {
  if (!html) return [];
  const m = html.match(/Pros[\s\S]*?<ul>([\s\S]*?)<\/ul>/i);
  if (!m) return [];
  return [...m[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map(x => stripHtml(x[1]))
    .filter(s => s.length > 5 && s.length < 150)
    .slice(0, 6);
}

function extractCons(html) {
  if (!html) return [];
  const m = html.match(/Cons[\s\S]*?<ul>([\s\S]*?)<\/ul>/i);
  if (!m) return [];
  return [...m[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map(x => stripHtml(x[1]))
    .filter(s => s.length > 5 && s.length < 150)
    .slice(0, 5);
}

function extractUseCases(html) {
  if (!html) return [];
  return [...(html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi) || [])]
    .map(x => stripHtml(x[1]))
    .filter(s => s.length > 3 && s.length < 100)
    .slice(0, 5);
}

function extractBestFor(html) {
  if (!html) return [];
  return [...(html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [])]
    .map(x => stripHtml(x[1]))
    .filter(s => s.length > 10 && s.length < 200)
    .slice(0, 5);
}

function descSentences(text) {
  if (!text) return [];
  return text.split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.length < 250)
    .slice(0, 5);
}

// ── Content Generators ──────────────────────────────────────────────────────

function genIntro(a, b, cat, seed) {
  const c = CAT[cat] || CAT.saas;
  const tA = tag(a), tB = tag(b);
  const rA = r(a), rB = r(b);
  const dA = descSentences(a.description);
  const dB = descSentences(b.description);
  const prosA = extractPros(a.pros_cons_content);
  const prosB = extractPros(b.pros_cons_content);
  const bfA = extractBestFor(a.best_for_content);
  const bfB = extractBestFor(b.best_for_content);

  // ── P1: Conversational hook (40 variants) ──
  const hooks = [
    `So you're trying to decide between ${a.name} and ${b.name}. They both handle ${c.use} well, but they go about it very differently.`,
    `${a.name} or ${b.name} — it's one of the most common matchups we see in the ${c.name.toLowerCase()} space, and for good reason.`,
    `Here's the thing about ${a.name} vs ${b.name}: on paper they look similar, but once you dig in, they're built for different people.`,
    `If you've narrowed your ${c.noun} search down to ${a.name} and ${b.name}, you're already looking at two solid options. The question is which one fits you.`,
    `The ${a.name} vs ${b.name} debate keeps coming up, and honestly? There's no universal winner — it depends on what you actually need.`,
    `Picking between ${a.name} and ${b.name} is trickier than it looks. Both are popular for a reason, but they shine in different areas.`,
    `We get asked about ${a.name} vs ${b.name} a lot. These are two of the most talked-about ${c.plural} right now, and the choice matters.`,
    `${a.name} and ${b.name} keep showing up on the same shortlists — but they take very different approaches to ${c.use}.`,
    `Trying to choose between ${a.name} and ${b.name}? You're not alone. This is one of the most common comparisons in ${c.use}.`,
    `Let's be real: both ${a.name} and ${b.name} are solid ${c.plural}. The real question is which one's the right fit for your specific situation.`,
    `${a.name} vs ${b.name} — two tools that look comparable at first glance but feel completely different once you start using them.`,
    `If you're evaluating ${c.plural}, chances are ${a.name} and ${b.name} are both on your list. Here's how they actually compare.`,
    `We've spent a lot of time with both ${a.name} and ${b.name}. Here's our honest take on how they stack up in ${YEAR}.`,
    `${a.name} and ${b.name} are both popular picks for ${c.use}, but they serve different needs. Let's break down which one works better for you.`,
    `Choosing a ${c.noun} often comes down to ${a.name} vs ${b.name}. Both have loyal users, but for completely different reasons.`,
    `You've probably seen ${a.name} and ${b.name} compared before. Here's what most comparisons miss — and what actually matters.`,
    `${a.name} vs ${b.name}: two names you'll hear constantly in the ${c.name.toLowerCase()} world. But which one deserves your time (and money)?`,
    `Looking at ${a.name} and ${b.name} side by side? Smart move. These are two of the most capable ${c.plural} available right now.`,
    `The choice between ${a.name} and ${b.name} isn't as straightforward as ratings suggest. Let's look at what actually makes them different.`,
    `Here's our take on the ${a.name} vs ${b.name} matchup — because choosing the wrong ${c.noun} can cost you months of migration headaches.`,
    `Two ${c.plural} that consistently come up in the same conversations: ${a.name} and ${b.name}. But they're more different than you might think.`,
    `${a.name} or ${b.name}? It's a question we hear daily. The short answer: it depends. The detailed answer? Keep reading.`,
    `Both ${a.name} and ${b.name} have earned their spot in the ${c.name.toLowerCase()} market. The trick is figuring out which one earns a spot in your stack.`,
    `If ${a.name} and ${b.name} are your top two picks, you've got good taste. Now let's figure out which one's the better match.`,
    `We've tested, compared, and analyzed both ${a.name} and ${b.name}. Here's what you need to know before making a decision.`,
    `${a.name} and ${b.name} are often mentioned in the same breath, but they target surprisingly different use cases.`,
    `Stuck between ${a.name} and ${b.name}? We've been there. This comparison covers everything you need to make a confident call.`,
    `The ${a.name} vs ${b.name} comparison is one of the most requested on our site — and it's easy to see why.`,
    `When it comes to ${c.use}, ${a.name} and ${b.name} represent two distinct philosophies. Understanding the difference saves you time and money.`,
    `${a.name} bills itself as "${lc(tA)}" while ${b.name} goes with "${lc(tB)}." Same market, very different pitch.`,
    `Here's what we tell people who ask about ${a.name} vs ${b.name}: don't just look at ratings. Look at what each tool is actually built for.`,
    `${a.name} and ${b.name} — we've reviewed both extensively, and the right choice really comes down to your priorities.`,
    `Trying to pick between ${a.name} and ${b.name} can feel overwhelming. We'll make it simple: here's what each one does best.`,
    `${a.name} vs ${b.name} is the kind of comparison where both sides have strong arguments. Let's cut through the noise.`,
    `You want the best ${c.noun} for your needs — and it's probably either ${a.name} or ${b.name}. Let's figure out which.`,
    `Two popular ${c.plural}, two very different strengths. Here's how ${a.name} and ${b.name} compare where it counts.`,
    `Ready to settle the ${a.name} vs ${b.name} debate? We've done the homework so you don't have to.`,
    `${a.name} and ${b.name} each have something the other doesn't. The question is: what matters more to you?`,
    `Deciding between ${a.name} and ${b.name} doesn't have to be complicated. Here's a clear-eyed look at both.`,
    `This is one of those comparisons where both tools are genuinely good. ${a.name} and ${b.name} just happen to be good at different things.`,
  ];

  // ── P2: Tool-specific (UNIQUE per pair — pulls from descriptions) ──
  let p2;
  if (dA.length > 0 && dB.length > 0) {
    const p2s = [
      `What is ${a.name} exactly? ${dA[0]} And ${b.name}? ${dB[0]}`,
      `${a.name}'s pitch: "${lc(tA)}." In practice? ${dA[0]} On the flip side, ${b.name} positions itself around "${lc(tB)}." ${dB[0]}`,
      `Here's what each tool brings to the table. ${a.name} — ${dA[0]} ${b.name} — ${dB[0]}`,
      `In a nutshell, ${a.name} is all about "${lc(tA)}." ${dA[0]} Meanwhile, ${b.name} takes a different route. ${dB[0]}`,
      `${a.name} is built around the idea of "${lc(tA)}." ${dA[0]} ${b.name} goes a different direction. ${dB[0]}`,
      `What sets them apart starts with their core identity. ${a.name}: ${dA[0]} ${b.name}: ${dB[0]}`,
      `A quick look at each: ${dA[0]} That's ${a.name}. Now ${b.name}? ${dB[0]}`,
      `${dA[0]} That's ${a.name} in a sentence. ${b.name} tells a different story: ${dB[0]}`,
    ];
    p2 = pick(p2s, seed + 3);
  } else if (dA.length > 0) {
    p2 = `${a.name} describes itself as "${lc(tA)}." ${dA[0]} ${b.name} takes a different approach with "${lc(tB)}."`;
  } else if (dB.length > 0) {
    p2 = `${a.name} focuses on "${lc(tA)}," while ${b.name} takes a different angle. ${dB[0]}`;
  } else {
    p2 = `${a.name} positions itself as "${lc(tA)}" while ${b.name} leans into "${lc(tB)}" — two different approaches to the same problem.`;
  }

  // ── P3: User perspective (UNIQUE — pulls from pros/cons) ──
  let p3;
  if (prosA.length > 0 && prosB.length > 0) {
    const p3s = [
      `What do users actually like? ${a.name} gets praise for ${lc(prosA[0])}. ${b.name} earns points for ${lc(prosB[0])}.`,
      `Users tend to highlight different strengths: ${a.name} stands out for ${lc(prosA[0])}, while ${b.name} gets noticed for ${lc(prosB[0])}.`,
      `On the ground, ${a.name} users appreciate ${lc(prosA[0])}. ${b.name} fans, on the other hand, point to ${lc(prosB[0])}.`,
      `Real feedback tells an interesting story — ${a.name} shines with ${lc(prosA[0])}, and ${b.name} wins fans with ${lc(prosB[0])}.`,
      `The things people love about each tool are telling. ${a.name}: ${lc(prosA[0])}. ${b.name}: ${lc(prosB[0])}.`,
      `Where they get the most love: ${a.name} for ${lc(prosA[0])}, ${b.name} for ${lc(prosB[0])}.`,
    ];
    p3 = pick(p3s, seed + 11);
  } else if (bfA.length > 0 && bfB.length > 0) {
    p3 = `${a.name} tends to attract ${lc(bfA[0])}, while ${b.name} appeals more to ${lc(bfB[0])}.`;
  } else {
    const eA = r(a, 'ratings_ease_of_use'), eB = r(b, 'ratings_ease_of_use');
    p3 = eA !== eB
      ? `One notable difference: ${eA > eB ? a.name : b.name} scores ${Math.max(eA, eB)}/10 for ease of use, making it the more approachable option for new users.`
      : `Both tools score well for ease of use, so the deciding factor usually comes down to specific features and pricing.`;
  }

  // ── P4: Context + CTA (25 variants) ──
  const closers = [
    `We break down features, pricing, and real-world performance below so you can decide with confidence.`,
    `Let's get into the details — features, pricing, pros, cons, and our honest verdict.`,
    `Below, we cover everything from features to pricing to help you make the right call.`,
    `Here's our full breakdown — no fluff, just the facts you need to make a smart decision.`,
    `Read on for our honest side-by-side analysis of both ${c.plural}.`,
    `We've compared them across every dimension that matters. Here's what we found.`,
    `Our goal? Help you skip the trial-and-error and pick the right tool the first time.`,
    `Let's dive in and see which one actually delivers more value for your money.`,
    `We'll walk you through features, pricing, strengths, weaknesses, and our final recommendation.`,
    `Time to cut through the marketing and see how these ${c.plural} really compare.`,
    `Below, we lay out exactly where each tool excels and where it falls short.`,
    `Here's everything you need to know before committing to either platform.`,
    `We've done the legwork — here's an honest, data-backed breakdown of both tools.`,
    `Keep reading for our detailed comparison, complete with pricing analysis and expert verdict.`,
    `Here's our ${YEAR} breakdown of how these two stack up — and which one we'd recommend.`,
    `Let's look at the numbers, the features, and most importantly, which one fits your needs.`,
    `No generic advice here — just a practical comparison based on real data and hands-on testing.`,
    `We compared ratings, features, pricing, and user feedback. Here's the full picture.`,
    `Everything you need to decide between these two — laid out clearly below.`,
    `Our comparison covers features, pricing, use cases, and a clear recommendation at the end.`,
    `Let's see how they compare on what actually matters: features, price, usability, and support.`,
    `Ratings tell part of the story (${rA}/10 vs ${rB}/10), but the details below tell the rest.`,
    `We'll help you figure out which ${c.noun} is worth your time — and your budget.`,
    `Below, we put both tools through the same lens so you can compare apples to apples.`,
    `Let's settle this — here's a fair, thorough look at both options.`,
  ];

  return `${pick(hooks, seed)} ${p2} ${p3} ${pick(closers, seed + 17)}`;
}

function genVerdict(a, b, cat, seed) {
  const c = CAT[cat] || CAT.saas;
  const rA = r(a), rB = r(b);
  const diff = Math.abs(rA - rB);
  const w = rA >= rB ? a : b;
  const l = rA >= rB ? b : a;
  const wS = Math.max(rA, rB), lS = Math.min(rA, rB);
  const prosW = extractPros(w.pros_cons_content);
  const prosL = extractPros(l.pros_cons_content);
  const bfA = extractBestFor(a.best_for_content);
  const bfB = extractBestFor(b.best_for_content);

  // ── Opening line (10+ variants, context-aware) ──
  let line;
  if (diff < 0.3) {
    const ties = [
      `This one's basically a coin flip on paper — ${a.name} scores ${rA}/10 and ${b.name} hits ${rB}/10. The right pick comes down to what you actually need day-to-day.`,
      `With scores this close (${rA} vs ${rB}), neither tool has a clear edge. Your decision should be based on workflow fit, not ratings.`,
      `${a.name} and ${b.name} are neck and neck at ${rA}/10 and ${rB}/10. At this point, the best choice is whichever one clicks with how you work.`,
    ];
    line = pick(ties, seed);
  } else if (diff > 1.5) {
    const clears = [
      `${w.name} pulls ahead with a ${wS}/10 rating versus ${l.name}'s ${lS}/10. That's a meaningful gap — ${w.name} delivers a stronger package overall.`,
      `The numbers tell a clear story: ${w.name} at ${wS}/10 outperforms ${l.name}'s ${lS}/10 by a solid margin. That said, ${l.name} still has its niche.`,
      `${w.name} takes this one convincingly — ${wS}/10 vs ${lS}/10. But "better overall" doesn't always mean "better for you."`,
    ];
    line = pick(clears, seed);
  } else {
    const edges = [
      `${w.name} has a slight edge at ${wS}/10 versus ${l.name}'s ${lS}/10 — close enough that ${l.name} could still be the better fit depending on your priorities.`,
      `${w.name} comes out ahead (${wS} vs ${lS}/10), but the gap isn't huge. The tiebreaker? Which tool's strengths match your specific needs.`,
      `It's close, but ${w.name} nudges ahead with ${wS}/10 vs ${lS}/10. The real deciding factor is what you plan to use it for.`,
      `${w.name} leads by a hair — ${wS}/10 vs ${lS}/10. At this margin, the specifics matter more than the overall score.`,
    ];
    line = pick(edges, seed);
  }

  // ── Reasons (data-driven from pros, bestFor, ratings) ──
  function reasons(t, o) {
    const res = [];
    // Pull real pros first
    const pros = extractPros(t.pros_cons_content);
    for (const p of pros.slice(0, 3)) {
      if (p.length < 100 && !res.some(r2 => r2.includes(p.substring(0, 15)))) {
        res.push(p);
      }
    }
    // Pull bestFor personas
    const bf = extractBestFor(t.best_for_content);
    if (bf.length > 0 && res.length < 4) {
      res.push(`You match the profile: ${lc(bf[0])}`);
    }
    // Rating-based reasons
    if (r(t) > r(o) && !res.some(x => x.includes('overall')))
      res.push(`You want the higher-rated option overall (${r(t)}/10 vs ${r(o)}/10)`);
    if (r(t, 'ratings_ease_of_use') > r(o, 'ratings_ease_of_use') && !res.some(x => x.includes('ease')))
      res.push(`Ease of use matters to you — ${t.name} scores ${r(t, 'ratings_ease_of_use')}/10 here`);
    if (r(t, 'ratings_value') > r(o, 'ratings_value') && !res.some(x => x.includes('value')))
      res.push(`You're watching your budget — ${t.name} gets a ${r(t, 'ratings_value')}/10 for value`);
    if (isFree(t) && !isFree(o) && !res.some(x => x.includes('free')))
      res.push(`You want to start for free before committing any money`);
    const pT = price(t), pO = price(o);
    if (pT && pO && pT < pO && !res.some(x => x.includes('$')))
      res.push(`Budget is key — ${t.name} starts at $${pT}/mo vs $${pO}/mo`);
    if (res.length < 3) res.push(`${t.name}'s approach to "${lc(tag(t))}" fits your workflow`);
    return res.slice(0, 5);
  }

  const rA2 = reasons(a, b).map(x => `- ${x}`).join('\n');
  const rB2 = reasons(b, a).map(x => `- ${x}`).join('\n');

  return `## Our Verdict\n\n${line}\n\n### Choose ${a.name} if:\n${rA2}\n\n### Choose ${b.name} if:\n${rB2}`;
}

function genMigration(a, b, cat, seed) {
  const c = CAT[cat] || CAT.saas;

  function steps(from, to) {
    const s = [];
    const fFrom = feats(from), fTo = feats(to);
    const hasApiFrom = from.features?.hasApi || from.features?.apiAccess;
    const hasApiTo = to.features?.hasApi || to.features?.apiAccess;
    const ucFrom = extractUseCases(from.use_cases_content);
    const ucTo = extractUseCases(to.use_cases_content);

    // Step 1: Audit current setup
    const audits = [
      `Take stock of how you're using ${from.name} — which features you rely on daily, what data you've stored, and any integrations you've set up.`,
      `Before anything else, document your current ${from.name} setup. Note your key workflows, connected tools, and any custom configurations.`,
      `Start by listing everything you use in ${from.name}. Knowing what you need to replicate makes the switch smoother.`,
    ];
    s.push(pick(audits, seed));

    // Step 2: Get started with new tool (conditional)
    if (isFree(to)) {
      s.push(`Create a free ${to.name} account to test the waters. No credit card needed — just explore the interface and see if it feels right.`);
    } else if (to.pricing?.freeTrialDays) {
      s.push(`Sign up for ${to.name}'s ${to.pricing.freeTrialDays}-day free trial. That's enough time to test your core workflows before paying.`);
    } else {
      const pr = price(to);
      s.push(`Set up your ${to.name} account and pick a plan${pr ? ` (starting at $${pr}/mo)` : ''}. Look for a plan that covers your must-have features.`);
    }

    // Step 3: Data export (conditional on API)
    if (hasApiFrom) {
      s.push(`Export your data from ${from.name} using their API — it's the cleanest way to pull everything without losing structure.`);
    } else {
      s.push(`Export your data from ${from.name}. Check their settings for CSV, JSON, or bulk export options. Download everything you might need.`);
    }

    // Step 4: Import and configure
    if (hasApiTo) {
      s.push(`Import your data into ${to.name}. If you're technical, their API makes this faster. Otherwise, use the built-in import wizard.`);
    } else {
      s.push(`Set up your ${to.name} workspace and import your data. Configure team permissions, preferences, and any custom settings.`);
    }

    // Step 5: Explore unique features (tool-specific)
    if (ucTo.length > 0) {
      s.push(`Explore what ${to.name} does that ${from.name} doesn't — things like ${lc(ucTo[0])}${ucTo.length > 1 ? ` and ${lc(ucTo[1])}` : ''}. These could change how you work.`);
    } else if (fTo.length >= 2) {
      s.push(`Check out ${to.name}'s unique features like ${humanize(fTo[0]).toLowerCase()} and ${humanize(fTo[1]).toLowerCase()} — they might save you time in ways you hadn't considered.`);
    } else {
      s.push(`Spend some time discovering ${to.name}'s unique capabilities. Every tool has features the other doesn't — find the ones that matter to you.`);
    }

    // Step 6: Price awareness (if significant difference)
    const pFrom = price(from), pTo = price(to);
    if (pFrom && pTo && Math.abs(pFrom - pTo) > 10) {
      const more = pTo > pFrom;
      s.push(more
        ? `Heads up: ${to.name} costs ${pTo > pFrom ? `$${pTo - pFrom} more` : 'less'} per month. Make sure the extra features justify the price bump.`
        : `Good news on pricing: ${to.name} is $${pFrom - pTo}/mo cheaper. That savings adds up over time.`);
    } else {
      s.push(`Run both tools side by side for a week or two. This overlap period helps you catch anything you might have missed in the migration.`);
    }

    return s.map((x, i) => `${i + 1}. ${x}`).join('\n');
  }

  const intros = [
    `Thinking about making the switch? Here's a practical, step-by-step plan for each direction.`,
    `Switching tools doesn't have to be painful. Here's how to do it with minimal disruption.`,
    `Migration between these tools is straightforward if you plan ahead. Here's our recommended approach.`,
    `Whether you're going from ${a.name} to ${b.name} or the other way around, here's how to do it right.`,
  ];

  return `## Migration Guide\n\n${pick(intros, seed)}\n\n### Moving from ${a.name} to ${b.name}\n${steps(a, b)}\n\n### Moving from ${b.name} to ${a.name}\n${steps(b, a)}`;
}

function genScenario(a, b, cat, seed) {
  const c = CAT[cat] || CAT.saas;
  const bfA = extractBestFor(a.best_for_content);
  const bfB = extractBestFor(b.best_for_content);
  const ucA = extractUseCases(a.use_cases_content);
  const ucB = extractUseCases(b.use_cases_content);

  function winner(metricField) {
    const va = r(a, metricField), vb = r(b, metricField);
    return va >= vb ? { w: a, l: b, ws: va, ls: vb } : { w: b, l: a, ws: vb, ls: va };
  }

  const val = winner('ratings_value');
  const sup = winner('ratings_support');
  const ease = winner('ratings_ease_of_use');
  const feat = winner('ratings_features');
  const overall = winner('ratings_overall');

  // Generate 6 scenarios with tool-specific data injection
  const scenarios = [];

  // 1. Startups
  const startupExtra = isFree(val.w) ? ` Plus, ${val.w.name} has a free plan — perfect for bootstrapped teams.` : '';
  scenarios.push(`### For Startups & Small Teams\n${val.w.name} is the smarter pick for startups — it scores ${val.ws}/10 for value, meaning you get more bang for your buck.${startupExtra} ${val.l.name} (${val.ls}/10 value) is still solid, but if budget matters, ${val.w.name} stretches further.`);

  // 2. Enterprise
  const entExtra = bfA.some(x => /enterprise|large|corporate/i.test(x)) ? ` ${a.name} specifically targets enterprise users.` :
                   bfB.some(x => /enterprise|large|corporate/i.test(x)) ? ` ${b.name} specifically targets enterprise users.` : '';
  scenarios.push(`### For Enterprise & Large Teams\nEnterprise teams need reliable support — ${sup.w.name} leads here with ${sup.ws}/10.${entExtra} Consider security features, SLAs, and how pricing scales with team size. ${sup.l.name} scores ${sup.ls}/10 for support, which may still be adequate depending on your needs.`);

  // 3. Freelancers
  const freeExtra = ucA.length > 0 || ucB.length > 0
    ? ` If you're a freelancer ${ucA.length > 0 ? `doing ${lc(ucA[0])}` : `using ${c.plural}`}, ${ease.w.name} gets you productive faster.`
    : '';
  scenarios.push(`### For Freelancers & Solopreneurs\nWhen you're working solo, you don't have time for a steep learning curve. ${ease.w.name} scores ${ease.ws}/10 for ease of use — that means less time setting up and more time doing actual work.${freeExtra} ${ease.l.name} (${ease.ls}/10) works too, but may take longer to get comfortable with.`);

  // 4. Growing teams
  scenarios.push(`### For Growing Teams\nIf your team is scaling, you want a tool that grows with you. ${feat.w.name} leads in features (${feat.ws}/10), which means fewer workarounds as your needs expand. ${feat.l.name} (${feat.ls}/10) covers the basics well, but ${feat.w.name} has more room to stretch.`);

  // 5. Budget-conscious
  const pA = price(a), pB = price(b);
  let budgetRec;
  if (isFree(a) && !isFree(b)) {
    budgetRec = `${a.name} wins hands down for tight budgets — it has a free plan. ${b.name} starts at $${pB || '?'}/mo with no free option.`;
  } else if (isFree(b) && !isFree(a)) {
    budgetRec = `${b.name} is the clear budget pick with its free plan. ${a.name} starts at $${pA || '?'}/mo.`;
  } else if (pA && pB) {
    const cheaper = pA <= pB ? a : b;
    const pricier = pA <= pB ? b : a;
    budgetRec = `${cheaper.name} starts at $${Math.min(pA, pB)}/mo vs ${pricier.name}'s $${Math.max(pA, pB)}/mo. That $${Math.abs(pA - pB)} monthly difference adds up over a year.`;
  } else {
    budgetRec = `Compare the free tiers and starter plans carefully. Even a $10/mo difference is $120/year.`;
  }
  scenarios.push(`### For Budget-Conscious Buyers\n${budgetRec} Don't just look at the sticker price — check what's included at each tier. A pricier tool that saves you hours is often cheaper in the long run.`);

  // 6. Agency / content-specific (uses bestFor data)
  const bfRec = bfA.length > 0 && bfB.length > 0
    ? `${a.name} tends to work well for ${lc(bfA[0])}. ${b.name} is better suited for ${lc(bfB[0])}.`
    : `Consider which tool's feature set maps more closely to your team's daily workflow.`;
  scenarios.push(`### For Agencies & Power Users\nIf you're handling multiple clients or complex workflows, feature depth matters more than simplicity. ${feat.w.name} has the edge in features (${feat.ws}/10). ${bfRec} Power users should also check API access and integration options.`);

  return `## Who Should Use Which?\n\n${scenarios.join('\n\n')}`;
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

  const rcA = rc(a), rcB = rc(b);
  if (rcA > 0 || rcB > 0) {
    mx.push({ feature: 'User Reviews', category: 'Social Proof', toolAValue: rcA > 0 ? `${rcA.toLocaleString()} reviews` : 'Limited', toolBValue: rcB > 0 ? `${rcB.toLocaleString()} reviews` : 'Limited', winner: rcA > rcB ? 'a' : rcB > rcA ? 'b' : 'tie' });
  }

  return mx;
}

function genFaqs(a, b, cat, seed) {
  const c = CAT[cat] || CAT.saas;
  const rA = r(a), rB = r(b);
  const w = rA >= rB ? a : b, l = rA >= rB ? b : a;
  const wS = Math.max(rA, rB), lS = Math.min(rA, rB);
  const prosA = extractPros(a.pros_cons_content);
  const prosB = extractPros(b.pros_cons_content);
  const consA = extractCons(a.pros_cons_content);
  const consB = extractCons(b.pros_cons_content);
  const ucA = extractUseCases(a.use_cases_content);
  const ucB = extractUseCases(b.use_cases_content);
  const bfA = extractBestFor(a.best_for_content);
  const bfB = extractBestFor(b.best_for_content);

  // Pool of 15+ FAQ templates — seed picks 8
  const pool = [
    // 1. Overall winner
    {
      q: `Which is better in ${YEAR}, ${a.name} or ${b.name}?`,
      a: `${w.name} scores higher overall (${wS}/10 vs ${lS}/10), but "better" depends on what you need. ${prosA.length > 0 ? `${a.name} stands out for ${lc(prosA[0])}` : `${a.name} brings solid ${c.use} capabilities`}. ${prosB.length > 0 ? `${b.name} is known for ${lc(prosB[0])}` : `${b.name} offers its own set of strengths`}. Try both if you can.`,
    },
    // 2. Pricing
    {
      q: `Is ${a.name} or ${b.name} more affordable?`,
      a: `${a.name}: ${priceLbl(a)}. ${b.name}: ${priceLbl(b)}. ${isFree(a) && !isFree(b) ? `${a.name} has the budget advantage with its free plan.` : isFree(b) && !isFree(a) ? `${b.name} wins on budget with a free plan.` : isFree(a) && isFree(b) ? 'Both offer free plans — great for testing before you buy.' : 'Neither has a free plan, so compare trial options carefully.'}`,
    },
    // 3. Key differences (uses real features)
    {
      q: `What are the main differences between ${a.name} and ${b.name}?`,
      a: `The biggest differences: ${prosA.length > 0 ? `${a.name} excels at ${lc(prosA[0])}` : `${a.name} focuses on "${lc(tag(a))}"`}${prosB.length > 0 ? `, while ${b.name} is better for ${lc(prosB[0])}` : `, while ${b.name} takes a different approach with "${lc(tag(b))}"`}. Ratings are ${rA}/10 vs ${rB}/10. Check the feature matrix above for a detailed breakdown.`,
    },
    // 4. Ease of use
    {
      q: `Is ${a.name} or ${b.name} easier to use?`,
      a: (() => {
        const eA = r(a, 'ratings_ease_of_use'), eB = r(b, 'ratings_ease_of_use');
        const easier = eA >= eB ? a : b;
        const harder = eA >= eB ? b : a;
        return eA === eB
          ? `They're about equal on ease of use (both around ${eA}/10). Neither has a steep learning curve.`
          : `${easier.name} is more beginner-friendly with a ${Math.max(eA, eB)}/10 ease-of-use score vs ${harder.name}'s ${Math.min(eA, eB)}/10. If you want to hit the ground running, ${easier.name} has the edge.`;
      })(),
    },
    // 5. Switching
    {
      q: `Can I switch from ${a.name} to ${b.name} easily?`,
      a: `Yes, switching is doable. Export your data from ${a.name}, ${isFree(b) ? `sign up for ${b.name}'s free plan` : `create a ${b.name} account`}, and import your content. We recommend running both in parallel for 1-2 weeks to make sure nothing falls through the cracks.`,
    },
    // 6. User feedback (uses real pros)
    {
      q: `What do users like about ${a.name} and ${b.name}?`,
      a: `${prosA.length > 0 ? `${a.name} users highlight: ${prosA.slice(0, 2).map(p => lc(p)).join('; ')}.` : `${a.name} users appreciate its approach to ${c.use}.`} ${prosB.length > 0 ? `${b.name} fans point to: ${prosB.slice(0, 2).map(p => lc(p)).join('; ')}.` : `${b.name} has built a loyal following in the ${c.name.toLowerCase()} space.`}`,
    },
    // 7. Weaknesses (uses real cons)
    {
      q: `What are the downsides of ${a.name} and ${b.name}?`,
      a: `No tool is perfect. ${consA.length > 0 ? `${a.name}'s main criticism: ${lc(consA[0])}.` : `${a.name} could improve in some areas.`} ${consB.length > 0 ? `${b.name}'s weak spot: ${lc(consB[0])}.` : `${b.name} has room for improvement too.`} Weigh these against your priorities — a con for one user might not matter to you.`,
    },
    // 8. Use cases (uses real use case data)
    {
      q: `What can I use ${a.name} and ${b.name} for?`,
      a: `${ucA.length > 0 ? `${a.name} is commonly used for ${ucA.slice(0, 2).map(u => lc(u)).join(' and ')}.` : `${a.name} covers a range of ${c.use} tasks.`} ${ucB.length > 0 ? `${b.name} works well for ${ucB.slice(0, 2).map(u => lc(u)).join(' and ')}.` : `${b.name} handles core ${c.use} workflows effectively.`} There's some overlap, but each has areas where it's stronger.`,
    },
    // 9. Target audience (uses bestFor data)
    {
      q: `Who is ${a.name} best for compared to ${b.name}?`,
      a: `${bfA.length > 0 ? `${a.name} is ideal for ${lc(bfA[0])}.` : `${a.name} works well for teams focused on ${c.use}.`} ${bfB.length > 0 ? `${b.name} fits better for ${lc(bfB[0])}.` : `${b.name} appeals to a different set of users.`} If you see yourself in either description, that's your answer.`,
    },
    // 10. Value for money
    {
      q: `Which offers better value: ${a.name} or ${b.name}?`,
      a: (() => {
        const vA = r(a, 'ratings_value'), vB = r(b, 'ratings_value');
        const better = vA >= vB ? a : b;
        return `${better.name} scores higher for value (${Math.max(vA, vB)}/10 vs ${Math.min(vA, vB)}/10). But "value" is personal — a tool that costs more but saves you 5 hours a week might be the better deal.`;
      })(),
    },
    // 11. Support quality
    {
      q: `Which has better customer support, ${a.name} or ${b.name}?`,
      a: (() => {
        const sA = r(a, 'ratings_support'), sB = r(b, 'ratings_support');
        const better = sA >= sB ? a : b;
        return `${better.name} leads in support with ${Math.max(sA, sB)}/10 vs ${Math.min(sA, sB)}/10. If responsive help is non-negotiable for your team, that's a meaningful difference.`;
      })(),
    },
    // 12. Free plan
    {
      q: `Do ${a.name} and ${b.name} offer free plans?`,
      a: `${a.name}: ${isFree(a) ? 'Yes, free plan available.' : a.pricing?.freeTrialDays ? `No free plan, but there's a ${a.pricing.freeTrialDays}-day trial.` : 'No free plan.'} ${b.name}: ${isFree(b) ? 'Yes, free plan available.' : b.pricing?.freeTrialDays ? `No free plan, but there's a ${b.pricing.freeTrialDays}-day trial.` : 'No free plan.'} ${isFree(a) || isFree(b) ? 'Take advantage of any free options to test before you commit.' : 'Without free plans, check for trial offers or money-back guarantees.'}`,
    },
    // 13. Features
    {
      q: `Which has more features, ${a.name} or ${b.name}?`,
      a: (() => {
        const fA = r(a, 'ratings_features'), fB = r(b, 'ratings_features');
        const more = fA >= fB ? a : b;
        const less = fA >= fB ? b : a;
        return `${more.name} scores ${Math.max(fA, fB)}/10 for features vs ${less.name}'s ${Math.min(fA, fB)}/10. But more features isn't always better — if ${less.name} covers everything you need, the simpler tool might be the smarter choice.`;
      })(),
    },
    // 14. Category-specific
    {
      q: cat === 'ai-tools' ? `Is ${a.name} or ${b.name} better for professional AI work?`
         : cat === 'marketing' ? `Which delivers better marketing ROI: ${a.name} or ${b.name}?`
         : cat === 'hosting' ? `Which hosting is more reliable: ${a.name} or ${b.name}?`
         : cat === 'ecommerce' ? `Which is better for selling online: ${a.name} or ${b.name}?`
         : `Which is better for teams: ${a.name} or ${b.name}?`,
      a: cat === 'ai-tools' ? `For professional use, check features (${r(a, 'ratings_features')}/10 vs ${r(b, 'ratings_features')}/10) and pricing. ${prosA.length > 0 ? `${a.name} stands out for ${lc(prosA[0])}` : `${a.name} offers solid AI capabilities`}. Both can handle professional workflows — the best fit depends on your specific AI use case.`
         : cat === 'marketing' ? `ROI depends on your specific channels and goals. ${r(a, 'ratings_value') >= r(b, 'ratings_value') ? a.name : b.name} scores higher for value (${Math.max(r(a, 'ratings_value'), r(b, 'ratings_value'))}/10). Consider which tool covers more of your marketing stack.`
         : cat === 'hosting' ? `${r(a, 'ratings_support') >= r(b, 'ratings_support') ? a.name : b.name} leads on support (${Math.max(r(a, 'ratings_support'), r(b, 'ratings_support'))}/10), which often correlates with reliability. Check each provider's uptime guarantee and SLA.`
         : cat === 'ecommerce' ? `${w.name} (${wS}/10) has the edge for online sellers. Consider whether "${lc(tag(a))}" or "${lc(tag(b))}" fits your selling model better.`
         : `For team use, ease of onboarding matters: ${r(a, 'ratings_ease_of_use') >= r(b, 'ratings_ease_of_use') ? a.name : b.name} scores ${Math.max(r(a, 'ratings_ease_of_use'), r(b, 'ratings_ease_of_use'))}/10 for ease of use. Support quality (${r(a, 'ratings_support')}/10 vs ${r(b, 'ratings_support')}/10) is also key for teams.`,
    },
    // 15. Last updated / freshness
    {
      q: `Is this ${a.name} vs ${b.name} comparison up to date?`,
      a: `Yes — this comparison reflects our ${YEAR} data, including the latest pricing, features, and ratings for both ${a.name} and ${b.name}. We regularly update our comparisons to make sure you're getting current information.`,
    },
  ];

  // Select 8 FAQs deterministically using seed
  return pickN(pool, seed, 8);
}

function genMetaTitle(a, b, seed) {
  const t = [
    `${a.name} vs ${b.name}: Honest Comparison (${YEAR})`,
    `${a.name} vs ${b.name} (${YEAR}) — Which Is Better?`,
    `${a.name} vs ${b.name}: Full Comparison ${YEAR}`,
    `Comparing ${a.name} and ${b.name} in ${YEAR}`,
    `${a.name} vs ${b.name} — Side-by-Side Review ${YEAR}`,
    `${a.name} vs ${b.name}: Features, Pricing & Verdict (${YEAR})`,
    `${a.name} or ${b.name}? Complete ${YEAR} Comparison`,
    `${a.name} vs ${b.name} — Which One Wins in ${YEAR}?`,
    `${a.name} vs ${b.name}: Detailed Breakdown (${YEAR})`,
    `${a.name} or ${b.name}? Our ${YEAR} Verdict`,
  ];
  return pick(t, seed);
}

function genMetaDesc(a, b, cat, seed) {
  const c = CAT[cat] || CAT.saas;
  const rA = r(a), rB = r(b);
  const t = [
    `Compare ${a.name} vs ${b.name} side by side. Features, pricing, ratings (${rA} vs ${rB}), and which ${c.noun} is better for your needs in ${YEAR}.`,
    `${a.name} or ${b.name}? Our detailed ${YEAR} comparison covers features, pricing, pros & cons to help you pick the right ${c.noun}.`,
    `Honest ${a.name} vs ${b.name} comparison for ${YEAR}. Ratings, pricing, features, and use cases — all analyzed by our editorial team.`,
    `${a.name} (${rA}/10) vs ${b.name} (${rB}/10) — which ${c.noun} wins? Read our ${YEAR} comparison with pricing, features & expert verdict.`,
    `Deciding between ${a.name} and ${b.name}? Our ${YEAR} comparison covers ratings, pricing, features, and our recommendation.`,
    `${a.name} vs ${b.name}: which is better in ${YEAR}? We compare features, pricing, ease of use, and more to help you choose.`,
    `Side-by-side comparison of ${a.name} and ${b.name}. See ratings (${rA} vs ${rB}), pricing, pros, cons, and our ${YEAR} verdict.`,
  ];
  return pick(t, seed + 3);
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const t0 = Date.now();
  console.log('🚀 ProPicked — Comparison Content Generator v2');
  console.log(`   Mode: ${DRY_RUN ? 'DRY RUN' : UPDATE_ALL ? 'UPDATE ALL (upsert)' : 'INSERT MISSING'}`);
  console.log(`   Limit: ${LIMIT === Infinity ? 'none' : LIMIT}\n`);

  // 1. Fetch all tools with rich content fields
  console.log('📥 Fetching tools with full content...');
  const toolsResp = await fetch(`${SUPABASE_URL}/rest/v1/tools?select=*&limit=500`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  const allTools = await toolsResp.json();
  console.log(`   ${allTools.length} tools loaded`);

  // Check rich data availability
  const withDesc = allTools.filter(t => t.description && t.description.length > 50).length;
  const withPros = allTools.filter(t => t.pros_cons_content && t.pros_cons_content.length > 50).length;
  const withUC = allTools.filter(t => t.use_cases_content && t.use_cases_content.length > 50).length;
  const withBF = allTools.filter(t => t.best_for_content && t.best_for_content.length > 50).length;
  console.log(`   Rich data: ${withDesc} descriptions, ${withPros} pros/cons, ${withUC} use cases, ${withBF} best-for\n`);

  // 2. Fetch existing comparisons (paginated — Supabase limits to 1000/page)
  console.log('📥 Fetching existing comparisons...');
  const existingComps = [];
  let offset = 0;
  const PAGE = 1000;
  while (true) {
    const compResp = await fetch(`${SUPABASE_URL}/rest/v1/comparisons?select=slug,tool_a_id,tool_b_id&limit=${PAGE}&offset=${offset}&order=slug`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    const page = await compResp.json();
    existingComps.push(...page);
    if (page.length < PAGE) break;
    offset += PAGE;
  }
  console.log(`   ${existingComps.length} existing comparisons\n`);

  const existingPairs = new Set();
  for (const c of existingComps) {
    existingPairs.add(`${c.tool_a_id}|${c.tool_b_id}`);
    existingPairs.add(`${c.tool_b_id}|${c.tool_a_id}`);
  }
  const existingSlugs = new Set(existingComps.map(c => c.slug));

  // 3. Group by category and generate pairs
  const byCategory = {};
  for (const t of allTools) {
    if (!byCategory[t.category_slug]) byCategory[t.category_slug] = [];
    byCategory[t.category_slug].push(t);
  }

  console.log('🔍 Generating pairs...');
  const pairs = [];

  for (const [cat, tools] of Object.entries(byCategory)) {
    tools.sort((a, b) => (b.ratings_overall || 0) - (a.ratings_overall || 0));
    let count = 0;

    for (let i = 0; i < tools.length; i++) {
      for (let j = i + 1; j < tools.length; j++) {
        const tA = tools[i], tB = tools[j];
        const pairKey = `${tA.id}|${tB.id}`;

        if (UPDATE_ALL || !existingPairs.has(pairKey)) {
          pairs.push({ a: tA, b: tB, cat });
          count++;
        }
      }
    }
    console.log(`   ${cat}: ${count} pairs`);
  }

  console.log(`\n📊 Total pairs to process: ${pairs.length}`);

  let toProcess = pairs;
  if (LIMIT < toProcess.length) toProcess = toProcess.slice(0, LIMIT);
  console.log(`   Processing: ${toProcess.length}\n`);

  if (DRY_RUN) {
    console.log(`💡 DRY RUN — would ${UPDATE_ALL ? 'upsert' : 'insert'} ${toProcess.length} comparisons`);

    // Show 3 samples for uniqueness verification
    for (let s = 0; s < Math.min(3, toProcess.length); s++) {
      const p = toProcess[s];
      const slug = `${p.a.slug}-vs-${p.b.slug}`;
      const sd = hash(slug);
      console.log(`\n📝 Sample ${s + 1} — ${slug}:`);
      const intro = genIntro(p.a, p.b, p.cat, sd);
      console.log(`   Intro (${intro.length} chars):\n   ${intro.substring(0, 300)}...\n`);
      const faqs = genFaqs(p.a, p.b, p.cat, sd);
      console.log(`   FAQs: ${faqs.length} questions`);
      console.log(`   Q1: ${faqs[0].q}`);
      console.log(`   A1: ${faqs[0].a.substring(0, 120)}...`);
    }
    return;
  }

  // 4. Generate and upsert
  const mode = UPDATE_ALL ? 'upsert' : 'insert';
  console.log(`⚙️  Generating and ${mode}ing comparisons...\n`);
  let processed = 0, errors = 0;

  for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
    const batch = toProcess.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(toProcess.length / BATCH_SIZE);

    const records = [];
    for (const pair of batch) {
      const slug = `${pair.a.slug}-vs-${pair.b.slug}`;
      const sd = hash(slug);
      records.push({
        slug,
        category_slug: pair.cat,
        tool_a_id: pair.a.id,
        tool_b_id: pair.b.id,
        intro_content: genIntro(pair.a, pair.b, pair.cat, sd),
        verdict_content: genVerdict(pair.a, pair.b, pair.cat, sd),
        migration_content: genMigration(pair.a, pair.b, pair.cat, sd),
        scenario_content: genScenario(pair.a, pair.b, pair.cat, sd),
        feature_matrix: genFeatureMatrix(pair.a, pair.b),
        faqs: genFaqs(pair.a, pair.b, pair.cat, sd),
        meta_title: genMetaTitle(pair.a, pair.b, sd),
        meta_description: genMetaDesc(pair.a, pair.b, pair.cat, sd),
        last_updated: new Date().toISOString(),
      });
    }

    try {
      const prefer = UPDATE_ALL
        ? 'resolution=merge-duplicates,return=minimal'
        : 'resolution=ignore-duplicates,return=minimal';

      const res = await fetch(`${SUPABASE_URL}/rest/v1/comparisons?on_conflict=category_slug,slug`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: prefer,
        },
        body: JSON.stringify(records),
      });

      if (res.ok) {
        processed += records.length;
      } else {
        // Retry individually on batch failure
        for (const rec of records) {
          try {
            const r2 = await fetch(`${SUPABASE_URL}/rest/v1/comparisons?on_conflict=category_slug,slug`, {
              method: 'POST',
              headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', Prefer: prefer },
              body: JSON.stringify(rec),
            });
            if (r2.ok) processed++;
            else errors++;
          } catch { errors++; }
        }
      }
    } catch (e) {
      errors += records.length;
    }

    if (batchNum % 20 === 0 || batchNum === totalBatches) {
      const elapsed = ((Date.now() - t0) / 1000).toFixed(0);
      const pct = (i + batch.length) / toProcess.length * 100;
      console.log(`   Batch ${batchNum}/${totalBatches} — ${pct.toFixed(1)}% — ${processed} processed — ${elapsed}s`);
    }

    if (i + BATCH_SIZE < toProcess.length) await sleep(BATCH_DELAY_MS);
  }

  const totalTime = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n🎉 Complete in ${totalTime}s!`);
  console.log(`   Processed: ${processed}`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Total comparisons: ~${UPDATE_ALL ? existingComps.length : existingComps.length + processed}`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
