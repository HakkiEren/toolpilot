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

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers (email);
CREATE INDEX IF NOT EXISTS idx_subscribers_active ON public.subscribers (is_active) WHERE is_active = TRUE;

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON public.subscribers
  FOR ALL
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE public.subscribers IS 'Newsletter subscribers collected from footer and popup forms';


-- ============================================================
-- CONTACT SUBMISSIONS TABLE — Contact form data storage
-- ============================================================

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  category TEXT DEFAULT 'General question',
  message TEXT NOT NULL,
  ip_address TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_status ON public.contact_submissions (status);
CREATE INDEX IF NOT EXISTS idx_contact_created ON public.contact_submissions (created_at DESC);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON public.contact_submissions
  FOR ALL
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE public.contact_submissions IS 'Contact form submissions from /contact page';
