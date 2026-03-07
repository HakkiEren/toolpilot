-- ============================================================
-- ProPicked — Newsletter Subscribers & Contact Form Tables
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Subscribers table for newsletter
CREATE TABLE IF NOT EXISTS public.subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  source text DEFAULT 'footer',
  subscribed_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Index for quick email lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_active ON public.subscribers(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role full access on subscribers"
  ON public.subscribers
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Anon can insert (subscribe)
CREATE POLICY "Anon can subscribe"
  ON public.subscribers
  FOR INSERT
  WITH CHECK (true);

-- 2. Contact form submissions
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  category text DEFAULT 'General question',
  message text NOT NULL,
  ip_address text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Index for status filtering (admin dashboard)
CREATE INDEX IF NOT EXISTS idx_contact_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_created ON public.contact_submissions(created_at DESC);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role full access on contacts"
  ON public.contact_submissions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Anon can insert (submit contact form)
CREATE POLICY "Anon can submit contact"
  ON public.contact_submissions
  FOR INSERT
  WITH CHECK (true);
