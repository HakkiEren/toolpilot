'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

// ============================================================
// TOOL FINDER — Interactive decision tree quiz
// Helps users find the right tool based on team size, budget,
// and primary goal. Increases engagement and reduces bounce rate.
// ============================================================

type TeamSize = 'solo' | 'small' | 'medium' | 'enterprise';
type Budget = 'free' | 'starter' | 'pro' | 'enterprise';
type Goal = 'marketing' | 'sales' | 'productivity' | 'development' | 'design' | 'analytics';

interface Recommendation {
  category: string;
  categorySlug: string;
  bestOfSlug: string;
  emoji: string;
  description: string;
}

const GOAL_MAP: Record<Goal, Recommendation[]> = {
  marketing: [
    { category: 'Email Marketing', categorySlug: 'marketing', bestOfSlug: 'email-marketing', emoji: '📧', description: 'Reach and engage your audience with targeted email campaigns' },
    { category: 'Social Media Management', categorySlug: 'marketing', bestOfSlug: 'social-media-management', emoji: '📱', description: 'Schedule, publish, and analyze social media content' },
    { category: 'SEO Tools', categorySlug: 'marketing', bestOfSlug: 'seo-tools', emoji: '🔍', description: 'Improve search rankings and drive organic traffic' },
  ],
  sales: [
    { category: 'CRM Software', categorySlug: 'saas', bestOfSlug: 'crm', emoji: '🤝', description: 'Manage leads, deals, and customer relationships' },
    { category: 'Live Chat', categorySlug: 'saas', bestOfSlug: 'live-chat', emoji: '💬', description: 'Convert visitors into customers with real-time chat' },
    { category: 'Form Builders', categorySlug: 'saas', bestOfSlug: 'form-builders', emoji: '📝', description: 'Create forms and surveys to capture leads' },
  ],
  productivity: [
    { category: 'Project Management', categorySlug: 'saas', bestOfSlug: 'project-management', emoji: '📊', description: 'Plan, track, and deliver projects on time' },
    { category: 'Note Taking', categorySlug: 'saas', bestOfSlug: 'note-taking', emoji: '📓', description: 'Organize knowledge and collaborate with your team' },
    { category: 'Time Tracking', categorySlug: 'business', bestOfSlug: 'time-tracking', emoji: '⏱️', description: 'Track time, manage resources, and bill clients' },
  ],
  development: [
    { category: 'Web Hosting', categorySlug: 'hosting', bestOfSlug: 'web-hosting', emoji: '🌐', description: 'Deploy and host your websites and applications' },
    { category: 'Website Builders', categorySlug: 'hosting', bestOfSlug: 'website-builders', emoji: '🏗️', description: 'Build professional websites without coding' },
    { category: 'AI Tools', categorySlug: 'ai-tools', bestOfSlug: 'ai-writing', emoji: '🤖', description: 'Leverage AI for coding, writing, and automation' },
  ],
  design: [
    { category: 'Graphic Design', categorySlug: 'saas', bestOfSlug: 'graphic-design', emoji: '🎨', description: 'Create stunning visuals, logos, and brand assets' },
    { category: 'Video Editing', categorySlug: 'saas', bestOfSlug: 'video-editing', emoji: '🎬', description: 'Edit and produce professional-quality videos' },
    { category: 'Landing Page Builders', categorySlug: 'marketing', bestOfSlug: 'landing-page-builders', emoji: '🚀', description: 'Design high-converting landing pages' },
  ],
  analytics: [
    { category: 'Accounting', categorySlug: 'business', bestOfSlug: 'accounting', emoji: '📒', description: 'Manage finances, invoices, and bookkeeping' },
    { category: 'Survey Tools', categorySlug: 'saas', bestOfSlug: 'survey-tools', emoji: '📋', description: 'Gather insights with surveys and feedback forms' },
    { category: 'HR Software', categorySlug: 'business', bestOfSlug: 'hr-software', emoji: '👥', description: 'Manage hiring, payroll, and employee engagement' },
  ],
};

const TEAM_OPTIONS: { value: TeamSize; label: string; icon: string; desc: string }[] = [
  { value: 'solo', label: 'Just Me', icon: '👤', desc: 'Solo freelancer or creator' },
  { value: 'small', label: '2-10', icon: '👥', desc: 'Small team or startup' },
  { value: 'medium', label: '11-50', icon: '🏢', desc: 'Growing company' },
  { value: 'enterprise', label: '50+', icon: '🏙️', desc: 'Large organization' },
];

const BUDGET_OPTIONS: { value: Budget; label: string; icon: string; desc: string }[] = [
  { value: 'free', label: 'Free Only', icon: '🆓', desc: '$0/mo — free plans only' },
  { value: 'starter', label: 'Under $50', icon: '💵', desc: 'Budget-friendly options' },
  { value: 'pro', label: '$50-200', icon: '💰', desc: 'Professional-grade tools' },
  { value: 'enterprise', label: '$200+', icon: '💎', desc: 'Enterprise solutions' },
];

const GOAL_OPTIONS: { value: Goal; label: string; icon: string }[] = [
  { value: 'marketing', label: 'Marketing & Growth', icon: '📈' },
  { value: 'sales', label: 'Sales & CRM', icon: '🤝' },
  { value: 'productivity', label: 'Productivity & PM', icon: '⚡' },
  { value: 'development', label: 'Development & Hosting', icon: '💻' },
  { value: 'design', label: 'Design & Creative', icon: '🎨' },
  { value: 'analytics', label: 'Analytics & Finance', icon: '📊' },
];

export function ToolFinder() {
  const [step, setStep] = useState(0); // 0=team, 1=budget, 2=goal, 3=results
  const [teamSize, setTeamSize] = useState<TeamSize | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);

  const recommendations = useMemo(() => {
    if (!goal) return [];
    return GOAL_MAP[goal] || [];
  }, [goal]);

  const searchParams = useMemo(() => {
    const params = new URLSearchParams();
    if (budget === 'free') params.set('price', 'free');
    if (budget === 'starter') params.set('price', 'paid');
    return params.toString();
  }, [budget]);

  const handleReset = () => {
    setStep(0);
    setTeamSize(null);
    setBudget(null);
    setGoal(null);
  };

  const progressPercent = (step / 3) * 100;

  return (
    <section className="mb-16">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50/50 to-blue-50/50 dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-blue-950/10 rounded-3xl border border-indigo-200/40 dark:border-indigo-800/30 p-6 md:p-8">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-700/50 text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm">
              <span className="text-lg">🧭</span>
              Tool Finder
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
              Find Your Perfect Tool
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              Answer 3 quick questions and we&apos;ll recommend the best tools for your needs.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>Step {Math.min(step + 1, 3)} of 3</span>
              {step === 3 && <span className="text-green-600 font-semibold">Results ready!</span>}
            </div>
            <div className="h-1.5 bg-gray-200/60 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${step === 3 ? 100 : progressPercent}%` }}
              />
            </div>
          </div>

          {/* Step 0: Team Size */}
          {step === 0 && (
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-bold text-center mb-5">How big is your team?</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {TEAM_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setTeamSize(opt.value); setStep(1); }}
                    className={`p-4 rounded-xl border-2 text-center transition-all hover:scale-[1.02] active:scale-95 ${
                      teamSize === opt.value
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{opt.icon}</div>
                    <div className="font-bold text-sm">{opt.label}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Budget */}
          {step === 1 && (
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-bold text-center mb-5">What&apos;s your monthly budget?</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {BUDGET_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setBudget(opt.value); setStep(2); }}
                    className={`p-4 rounded-xl border-2 text-center transition-all hover:scale-[1.02] active:scale-95 ${
                      budget === opt.value
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{opt.icon}</div>
                    <div className="font-bold text-sm">{opt.label}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(0)} className="block mx-auto mt-4 text-xs text-gray-400 hover:text-indigo-500 transition-colors">
                &#8592; Back
              </button>
            </div>
          )}

          {/* Step 2: Goal */}
          {step === 2 && (
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-bold text-center mb-5">What&apos;s your primary goal?</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {GOAL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setGoal(opt.value); setStep(3); }}
                    className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] active:scale-95 ${
                      goal === opt.value
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300'
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <div className="font-bold text-sm mt-1">{opt.label}</div>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="block mx-auto mt-4 text-xs text-gray-400 hover:text-indigo-500 transition-colors">
                &#8592; Back
              </button>
            </div>
          )}

          {/* Step 3: Results */}
          {step === 3 && recommendations.length > 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <div className="text-3xl mb-2">&#127942;</div>
                <h3 className="text-lg font-bold">Your Personalized Recommendations</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Based on{' '}
                  {TEAM_OPTIONS.find(t => t.value === teamSize)?.label} team,{' '}
                  {BUDGET_OPTIONS.find(b => b.value === budget)?.label} budget,{' '}
                  {GOAL_OPTIONS.find(g => g.value === goal)?.label} focus
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {recommendations.map((rec, idx) => (
                  <Link
                    key={rec.bestOfSlug}
                    href={`/best/${rec.bestOfSlug}${searchParams ? '?' + searchParams : ''}`}
                    className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center text-2xl">
                      {rec.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {idx === 0 && (
                          <span className="text-[10px] px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full font-bold">
                            Top Pick
                          </span>
                        )}
                        <h4 className="font-bold text-sm group-hover:text-indigo-600 transition-colors">{rec.category}</h4>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{rec.description}</p>
                    </div>
                    <span className="text-indigo-500 group-hover:translate-x-1 transition-transform flex-shrink-0">
                      &#8594;
                    </span>
                  </Link>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={`/search${searchParams ? '?' + searchParams : ''}`}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-600/25"
                >
                  Browse All Tools &#8594;
                </Link>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium hover:border-indigo-300 transition-colors"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
