# Supabase Kurulum Rehberi

## Adim 1: Hesap Olustur
1. https://supabase.com adresine git
2. "Start your project" tikla
3. GitHub hesabinla giris yap (en kolay yol)

## Adim 2: Yeni Proje Olustur
1. "New Project" tikla
2. Ayarlar:
   - **Organization**: Kendi organizasyonun (otomatik olusur)
   - **Project name**: `global-karsilastirma`
   - **Database password**: Guclu bir sifre sec (kaydet!)
   - **Region**: Frankfurt (EU West) — Avrupa'ya en yakin
   - **Plan**: Free ($0/ay — 500MB DB, 1GB storage, 50K satir)
3. "Create new project" tikla
4. 2-3 dakika bekle, proje hazirlansin

## Adim 3: API Key'leri Al
Proje olusunca:
1. Sol menude **Settings** > **API** tikla
2. Su 3 degeri kopyala:

```
Project URL:        https://xxxxx.supabase.co
anon (public) key:  eyJhbGciOiJIUzI1NiIs...
service_role key:   eyJhbGciOiJIUzI1NiIs...  (GIZLI TUT!)
```

## Adim 4: .env.local Guncelle
`pseo-toolkit/.env.local` dosyasini ac, placeholder'lari gercek degerlerle degistir:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Adim 5: Database Semasini Calistir
1. Supabase Dashboard'da sol menude **SQL Editor** tikla
2. "New query" tikla
3. `pseo-toolkit/scripts/supabase-schema.sql` dosyasinin TAMAMINI yapistir
4. "Run" tikla
5. Tum tablolar olusacak: tools, comparisons, blog_posts, calculators, page_metrics

## Adim 6: Seed Data Yukle
1. SQL Editor'da yeni query ac
2. `global-karsilastirma/seed-ai-tools.sql` dosyasini yapistir
3. "Run" tikla
4. Ilk 200+ AI tool verisi yuklenecek

## Dogrulama
- Sol menude **Table Editor** tikla
- `tools` tablosunu sec
- 200+ satir goruyor olmalisin
- `comparisons` tablosunda karsilastirmalar olmali

## Notlar
- Free tier: 500MB DB, 2 projiye kadar
- Rate limit: 500 request/saniye (bize fazlasiyla yeterli)
- Realtime: Kapalı tutabiliriz (gerekli degil)
- Row Level Security (RLS): Schema'da otomatik ayarlandi
