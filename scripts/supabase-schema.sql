-- ============================================================
-- SUPABASE DATABASE SCHEMA — Multi-Vertical pSEO Platform
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  parent_id UUID REFERENCES categories(id),
  meta_title TEXT,
  meta_description TEXT,
  seo_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUBCATEGORIES
-- ============================================================
CREATE TABLE subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_slug, slug)
);

-- ============================================================
-- TOOLS (Core entity — each row = 1 tool page)
-- ============================================================
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  subcategory_slug TEXT,
  tagline TEXT,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,

  -- Pricing (JSONB for flexibility across categories)
  pricing JSONB DEFAULT '{"hasFreeplan": false, "freeTrialDays": null, "startingPrice": null, "currency": "USD", "plans": []}'::jsonb,

  -- Features (JSONB — varies by category)
  features JSONB DEFAULT '{}'::jsonb,

  -- Ratings (denormalized for fast queries)
  ratings_overall NUMERIC(3,1) DEFAULT 0,
  ratings_ease_of_use NUMERIC(3,1) DEFAULT 0,
  ratings_features NUMERIC(3,1) DEFAULT 0,
  ratings_value NUMERIC(3,1) DEFAULT 0,
  ratings_support NUMERIC(3,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,

  -- Pre-generated unique content blocks
  pros_cons_content TEXT,
  use_cases_content TEXT,
  best_for_content TEXT,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,

  -- Workflow
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'generated', 'reviewed', 'published')),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(category_slug, slug)
);

-- Indexes for fast ISR queries
CREATE INDEX idx_tools_category ON tools(category_slug) WHERE status = 'published';
CREATE INDEX idx_tools_subcategory ON tools(category_slug, subcategory_slug) WHERE status = 'published';
CREATE INDEX idx_tools_status ON tools(status);
CREATE INDEX idx_tools_rating ON tools(ratings_overall DESC) WHERE status = 'published';
CREATE INDEX idx_tools_slug_lookup ON tools(category_slug, slug) WHERE status = 'published';

-- ============================================================
-- COMPARISONS (Each row = 1 VS page, ONLY 2-way)
-- ============================================================
CREATE TABLE comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL,               -- "chatgpt-vs-claude"
  category_slug TEXT NOT NULL,
  tool_a_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  tool_b_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,

  -- Pre-generated unique content
  intro_content TEXT,               -- 150-200 words unique intro
  verdict_content TEXT,             -- Who should choose A vs B
  migration_content TEXT,           -- How to switch
  scenario_content TEXT,            -- Use-case based recommendations

  -- Feature comparison matrix (JSONB)
  feature_matrix JSONB DEFAULT '[]'::jsonb,

  -- FAQ (unique per comparison)
  faqs JSONB DEFAULT '[]'::jsonb,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,

  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(category_slug, slug),
  -- Prevent duplicate comparisons (A vs B = B vs A)
  CONSTRAINT unique_tool_pair UNIQUE (tool_a_id, tool_b_id),
  CONSTRAINT different_tools CHECK (tool_a_id != tool_b_id)
);

CREATE INDEX idx_comparisons_category ON comparisons(category_slug);
CREATE INDEX idx_comparisons_tool_a ON comparisons(tool_a_id);
CREATE INDEX idx_comparisons_tool_b ON comparisons(tool_b_id);
CREATE INDEX idx_comparisons_slug ON comparisons(category_slug, slug);

-- ============================================================
-- BLOG POSTS (Editorial content — topical authority)
-- ============================================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  category_slug TEXT,              -- Optional: tie to a vertical
  author TEXT DEFAULT 'ToolPilot Team',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  related_tool_slugs TEXT[] DEFAULT '{}',
  related_comparison_slugs TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blog_status ON blog_posts(status, published_at DESC);

-- ============================================================
-- CALCULATORS
-- ============================================================
CREATE TABLE calculators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category_slug TEXT NOT NULL,
  inputs JSONB DEFAULT '[]'::jsonb,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ANALYTICS / TRACKING (for revenue-per-page monitoring)
-- ============================================================
CREATE TABLE page_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_url TEXT NOT NULL,
  page_type TEXT NOT NULL,          -- 'tool', 'comparison', 'blog', 'calculator'
  category_slug TEXT,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  position NUMERIC(5,2) DEFAULT 0,
  date DATE NOT NULL,
  UNIQUE(page_url, date)
);

CREATE INDEX idx_metrics_date ON page_metrics(date DESC);
CREATE INDEX idx_metrics_type ON page_metrics(page_type, date DESC);

-- ============================================================
-- AUTO-UPDATE TIMESTAMPS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tools_updated_at
  BEFORE UPDATE ON tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER comparisons_updated_at
  BEFORE UPDATE ON comparisons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculators ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_metrics ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public read tools" ON tools FOR SELECT USING (status = 'published');
CREATE POLICY "Public read comparisons" ON comparisons FOR SELECT USING (true);
CREATE POLICY "Public read blog" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public read calculators" ON calculators FOR SELECT USING (true);

-- Service role full access (for content pipeline)
CREATE POLICY "Service full access tools" ON tools FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access comparisons" ON comparisons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access blog" ON blog_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access calculators" ON calculators FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access metrics" ON page_metrics FOR ALL USING (true) WITH CHECK (true);
