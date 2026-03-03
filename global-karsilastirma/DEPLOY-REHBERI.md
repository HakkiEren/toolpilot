# Deploy Rehberi: GitHub + Vercel

## Adim 1: GitHub Repository Olustur
1. https://github.com/new adresine git
2. Repository ayarlari:
   - **Name**: `global-karsilastirma` (veya domain adinla ayni)
   - **Visibility**: Private
   - **Initialize**: YAPMA (.gitignore, README ekleme)
3. "Create repository" tikla

## Adim 2: Lokaldeki Projeyi GitHub'a Push Et
PowerShell/Terminal'de:
```bash
cd C:\Users\hakki\OneDrive\Masaüstü\pseo-toolkit
git init
git add .
git commit -m "Initial commit: pSEO multi-vertical platform"
git remote add origin https://github.com/KULLANICIADIN/global-karsilastirma.git
git branch -M main
git push -u origin main
```

## Adim 3: Vercel Hesabi Olustur
1. https://vercel.com adresine git
2. "Start Deploying" tikla
3. GitHub hesabinla giris yap

## Adim 4: Vercel'e Import Et
1. Dashboard'da "Add New Project" tikla
2. GitHub repo'nu sec: `global-karsilastirma`
3. Framework: Next.js (otomatik algilar)
4. Environment Variables ekle:
   - `NEXT_PUBLIC_SUPABASE_URL` = Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = Supabase service role key
   - `NEXT_PUBLIC_SITE_URL` = https://domain-adin.vercel.app (baslangicta)
5. "Deploy" tikla

## Adim 5: Custom Domain (Sonra)
1. Domain alindiktan sonra Vercel > Settings > Domains
2. Custom domain ekle
3. DNS ayarlarini yap (Vercel'in verdigi CNAME/A kayitlari)
4. HTTPS otomatik aktif olur

## Adim 6: Otomatik Deploy
- Her `git push origin main` komutunda Vercel otomatik deploy eder
- Preview deploy'lar PR'lar icin otomatik olusur

## Onemli Notlar
- Vercel Free tier: 100GB bandwidth/ay, commercial use SERBEST
- Build limiti: 45 dakika (bizim icin fazlasiyla yeterli)
- Serverless function limiti: 12 saniye (ISR icin yeterli)
- Analytics: Vercel Speed Insights ucretsiz
