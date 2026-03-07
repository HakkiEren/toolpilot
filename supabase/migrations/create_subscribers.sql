-- ============================================================
-- SUBSCRIBERS TABLE — Newsletter subscription storage
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.subscribers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'footer' CHECK (source IN ('footer', 'popup', 'blog', 'homepage')),
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers (email);
CREATE INDEX IF NOT EXISTS idx_subscribers_active ON public.subscribers (is_active) WHERE is_active = TRUE;

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything (API routes use service role key)
CREATE POLICY "Service role full access" ON public.subscribers
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Comment
COMMENT ON TABLE public.subscribers IS 'Newsletter subscribers collected from footer and popup forms';
