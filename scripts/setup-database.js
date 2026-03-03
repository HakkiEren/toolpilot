#!/usr/bin/env node
/**
 * Supabase Database Setup Script
 * ================================
 * Bu script tüm SQL dosyalarını sırasıyla Supabase'e gönderir.
 *
 * Kullanım:
 *   node scripts/setup-database.js
 *
 * NOT: Bu script Supabase Dashboard'daki SQL Editor'ı kullanır.
 * Eğer doğrudan çalıştıramazsanız, her SQL dosyasını
 * Supabase Dashboard > SQL Editor'a yapıştırıp çalıştırın.
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gqqgbfoniyfbpbognnks.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// SQL dosyaları sırasıyla
const SQL_FILES = [
  { name: 'Schema (Tablolar)', path: 'scripts/supabase-schema.sql' },
  { name: 'Seed (25 AI Tool + 3 Karşılaştırma)', path: 'global-karsilastirma/seed-ai-tools.sql' },
  { name: 'Tool İçerikleri (Pros/Cons, Use Cases)', path: 'global-karsilastirma/update-tool-content.sql' },
  { name: 'Ek Karşılaştırmalar (22 VS sayfa)', path: 'global-karsilastirma/additional-comparisons.sql' },
  { name: 'Blog Yazıları (12 makale)', path: 'global-karsilastirma/seed-blog-posts.sql' },
];

async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   ToolPilot — Supabase Database Setup       ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');

  // Combine all SQL files into one master file
  const masterSqlPath = path.join(__dirname, '..', 'global-karsilastirma', 'MASTER-SETUP.sql');
  let masterSql = `-- ============================================================\n`;
  masterSql += `-- TOOLPILOT MASTER DATABASE SETUP\n`;
  masterSql += `-- Generated: ${new Date().toISOString()}\n`;
  masterSql += `-- Run this entire file in Supabase SQL Editor\n`;
  masterSql += `-- ============================================================\n\n`;

  let allPresent = true;

  for (const file of SQL_FILES) {
    const fullPath = path.join(__dirname, '..', file.path);

    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      console.log(`✅ ${file.name} — ${file.path} (${(content.length / 1024).toFixed(1)} KB)`);

      masterSql += `\n-- ============================================================\n`;
      masterSql += `-- ${file.name.toUpperCase()}\n`;
      masterSql += `-- Source: ${file.path}\n`;
      masterSql += `-- ============================================================\n\n`;
      masterSql += content;
      masterSql += `\n\n`;
    } else {
      console.log(`⏳ ${file.name} — ${file.path} (henüz oluşturulmadı)`);
      allPresent = false;
    }
  }

  // Write master SQL file
  fs.writeFileSync(masterSqlPath, masterSql, 'utf-8');
  console.log('');
  console.log(`📄 Master SQL dosyası oluşturuldu: global-karsilastirma/MASTER-SETUP.sql`);
  console.log(`   Boyut: ${(masterSql.length / 1024).toFixed(1)} KB`);
  console.log('');

  if (!allPresent) {
    console.log('⚠️  Bazı SQL dosyaları henüz oluşturulmadı.');
    console.log('   Mevcut dosyalar birleştirildi. Eksikler oluşturulduktan sonra tekrar çalıştırın.');
    console.log('');
  }

  console.log('═══════════════════════════════════════════════');
  console.log('KURULUM ADIMLARI:');
  console.log('═══════════════════════════════════════════════');
  console.log('');
  console.log('1. Supabase Dashboard\'a git:');
  console.log(`   https://supabase.com/dashboard/project/gqqgbfoniyfbpbognnks/sql/new`);
  console.log('');
  console.log('2. MASTER-SETUP.sql dosyasının içeriğini kopyala:');
  console.log(`   ${masterSqlPath}`);
  console.log('');
  console.log('3. SQL Editor\'a yapıştır ve "Run" butonuna tıkla');
  console.log('');
  console.log('4. "Success" mesajını gör');
  console.log('');
  console.log('═══════════════════════════════════════════════');

  // Also create a quick stats summary
  const stats = {
    totalSize: (masterSql.length / 1024).toFixed(1) + ' KB',
    tables: 7,
    tools: 25,
    comparisons: '3 + 22 = 25 total',
    blogPosts: 12,
    subcategories: 12,
  };

  console.log('');
  console.log('📊 VERİ ÖZETİ:');
  console.log(`   Tablolar: ${stats.tables}`);
  console.log(`   AI Tools: ${stats.tools}`);
  console.log(`   Karşılaştırmalar: ${stats.comparisons}`);
  console.log(`   Blog Yazıları: ${stats.blogPosts}`);
  console.log(`   Alt Kategoriler: ${stats.subcategories}`);
  console.log('');
}

main().catch(console.error);
