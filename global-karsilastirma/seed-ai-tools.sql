-- ============================================================
-- SEED DATA: AI Tools Category — Initial 50 Tools
-- Run in Supabase SQL Editor AFTER schema creation
-- ============================================================

-- Insert AI Tools subcategories
INSERT INTO subcategories (slug, name, category_slug, description) VALUES
('ai-writing', 'AI Writing Tools', 'ai-tools', 'AI-powered content creation, copywriting, and text generation tools.'),
('ai-image', 'AI Image Generators', 'ai-tools', 'Text-to-image, image editing, and AI art generation tools.'),
('ai-video', 'AI Video Tools', 'ai-tools', 'AI video generation, editing, and enhancement tools.'),
('ai-coding', 'AI Coding Assistants', 'ai-tools', 'AI-powered code generation, completion, and development tools.'),
('ai-chatbots', 'AI Chatbots', 'ai-tools', 'Conversational AI, customer service bots, and AI assistants.'),
('ai-voice', 'AI Voice & Speech', 'ai-tools', 'Text-to-speech, speech recognition, and voice cloning tools.'),
('ai-music', 'AI Music Tools', 'ai-tools', 'AI music generation, audio editing, and sound design tools.'),
('ai-research', 'AI Research Tools', 'ai-tools', 'AI-powered research assistants, summarizers, and knowledge tools.'),
('ai-productivity', 'AI Productivity', 'ai-tools', 'AI meeting assistants, note-taking, scheduling, and workflow automation.'),
('ai-design', 'AI Design Tools', 'ai-tools', 'AI-powered graphic design, UI/UX, and presentation tools.'),
('ai-data', 'AI Data & Analytics', 'ai-tools', 'AI-powered data analysis, visualization, and business intelligence.'),
('ai-agents', 'AI Agents & Automation', 'ai-tools', 'Autonomous AI agents, workflow automation, and multi-step AI systems.')
ON CONFLICT DO NOTHING;

-- ============================================================
-- AI CHATBOTS & ASSISTANTS
-- ============================================================

INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, website_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, status, last_updated) VALUES

('chatgpt', 'ChatGPT', 'ai-tools', 'ai-chatbots',
 'Get instant answers, find creative inspiration, and learn something new.',
 'https://chatgpt.com',
 '{"hasFreeplan": true, "freeTrialDays": null, "startingPrice": 20, "currency": "USD", "plans": [{"name": "Free", "price": 0, "billingCycle": "monthly", "features": ["GPT-4o mini", "Limited access to GPT-4o", "Web browsing", "Limited image generation"], "isPopular": false}, {"name": "Plus", "price": 20, "billingCycle": "monthly", "features": ["GPT-4o full access", "DALL-E image generation", "Advanced Data Analysis", "Custom GPTs", "5x more messages"], "isPopular": true}, {"name": "Pro", "price": 200, "billingCycle": "monthly", "features": ["Unlimited GPT-4o", "o1 pro mode", "Unlimited advanced tools", "Priority access"], "isPopular": false}]}'::jsonb,
 '{"hasApi": true, "contextWindow": 128000, "multimodal": true, "webBrowsing": true, "codeInterpreter": true, "imageGeneration": true, "plugins": true, "customGpts": true}'::jsonb,
 9.0, 9.5, 9.2, 8.5, 8.0, 2500, 'published', NOW()),

('claude', 'Claude', 'ai-tools', 'ai-chatbots',
 'Talk with Claude, an AI assistant from Anthropic.',
 'https://claude.ai',
 '{"hasFreeplan": true, "freeTrialDays": null, "startingPrice": 20, "currency": "USD", "plans": [{"name": "Free", "price": 0, "billingCycle": "monthly", "features": ["Claude 3.5 Sonnet", "Limited messages", "Web search"], "isPopular": false}, {"name": "Pro", "price": 20, "billingCycle": "monthly", "features": ["Claude 3.5 Opus", "5x more usage", "Projects", "Priority access", "Early feature access"], "isPopular": true}, {"name": "Team", "price": 30, "billingCycle": "monthly", "features": ["Everything in Pro", "Team collaboration", "Admin dashboard", "Higher rate limits"], "isPopular": false}]}'::jsonb,
 '{"hasApi": true, "contextWindow": 200000, "multimodal": true, "webBrowsing": true, "codeInterpreter": true, "imageGeneration": false, "artifacts": true, "projects": true}'::jsonb,
 9.1, 9.3, 9.0, 8.8, 8.5, 1800, 'published', NOW()),

('gemini', 'Google Gemini', 'ai-tools', 'ai-chatbots',
 'Supercharge your creativity and productivity with Google AI.',
 'https://gemini.google.com',
 '{"hasFreeplan": true, "freeTrialDays": null, "startingPrice": 20, "currency": "USD", "plans": [{"name": "Free", "price": 0, "billingCycle": "monthly", "features": ["Gemini 1.5 Flash", "Google integration", "Image generation"], "isPopular": false}, {"name": "Advanced", "price": 20, "billingCycle": "monthly", "features": ["Gemini 1.5 Pro", "2TB Google storage", "Gems custom AI", "Priority access"], "isPopular": true}]}'::jsonb,
 '{"hasApi": true, "contextWindow": 1000000, "multimodal": true, "webBrowsing": true, "googleIntegration": true, "imageGeneration": true}'::jsonb,
 8.5, 9.0, 8.8, 9.0, 8.0, 1500, 'published', NOW()),

('perplexity', 'Perplexity AI', 'ai-tools', 'ai-chatbots',
 'Ask anything. Get instant answers backed by real sources.',
 'https://www.perplexity.ai',
 '{"hasFreeplan": true, "freeTrialDays": null, "startingPrice": 20, "currency": "USD", "plans": [{"name": "Free", "price": 0, "billingCycle": "monthly", "features": ["Standard searches", "Quick AI answers", "Basic sources"], "isPopular": false}, {"name": "Pro", "price": 20, "billingCycle": "monthly", "features": ["Pro Search unlimited", "GPT-4o & Claude access", "File analysis", "API access"], "isPopular": true}]}'::jsonb,
 '{"hasApi": true, "contextWindow": 128000, "realTimeSearch": true, "sourceCitations": true, "fileAnalysis": true}'::jsonb,
 8.8, 9.2, 8.5, 8.5, 7.5, 1200, 'published', NOW()),

-- ============================================================
-- AI CODING ASSISTANTS
-- ============================================================

('github-copilot', 'GitHub Copilot', 'ai-tools', 'ai-coding',
 'Your AI pair programmer. Code faster with AI-powered suggestions.',
 'https://github.com/features/copilot',
 '{"hasFreeplan": true, "freeTrialDays": 30, "startingPrice": 10, "currency": "USD", "plans": [{"name": "Free", "price": 0, "billingCycle": "monthly", "features": ["2000 code completions/mo", "50 chat messages/mo", "VS Code & JetBrains"], "isPopular": false}, {"name": "Pro", "price": 10, "billingCycle": "monthly", "features": ["Unlimited completions", "Unlimited chat", "CLI assistant", "Multi-model support"], "isPopular": true}, {"name": "Business", "price": 19, "billingCycle": "monthly", "features": ["Everything in Pro", "Organization management", "IP indemnity", "Policy management"], "isPopular": false}]}'::jsonb,
 '{"hasApi": false, "languages": "All major", "ideSupport": "VS Code, JetBrains, Neovim", "codeCompletion": true, "chatAssistant": true, "cliTool": true}'::jsonb,
 8.7, 9.0, 8.8, 8.5, 8.0, 2000, 'published', NOW()),

('cursor', 'Cursor', 'ai-tools', 'ai-coding',
 'The AI Code Editor. Build software faster with AI.',
 'https://cursor.com',
 '{"hasFreeplan": true, "freeTrialDays": 14, "startingPrice": 20, "currency": "USD", "plans": [{"name": "Hobby", "price": 0, "billingCycle": "monthly", "features": ["2000 completions", "50 slow premium requests", "VS Code fork"], "isPopular": false}, {"name": "Pro", "price": 20, "billingCycle": "monthly", "features": ["Unlimited completions", "500 fast premium requests", "10 o1-mini uses/day"], "isPopular": true}, {"name": "Business", "price": 40, "billingCycle": "monthly", "features": ["Everything in Pro", "Admin dashboard", "Centralized billing", "SSO"], "isPopular": false}]}'::jsonb,
 '{"hasApi": false, "languages": "All major", "ideType": "Full IDE (VS Code fork)", "codeCompletion": true, "multiFileEditing": true, "terminalIntegration": true, "composerMode": true}'::jsonb,
 9.0, 8.5, 9.2, 8.5, 7.5, 1500, 'published', NOW()),

('claude-code', 'Claude Code', 'ai-tools', 'ai-coding',
 'An agentic coding tool from Anthropic that lives in your terminal.',
 'https://docs.anthropic.com/en/docs/claude-code',
 '{"hasFreeplan": false, "freeTrialDays": null, "startingPrice": null, "currency": "USD", "plans": [{"name": "Usage-based", "price": null, "billingCycle": "monthly", "features": ["Terminal-native", "Multi-file editing", "Git integration", "MCP server support", "Agentic workflows"], "isPopular": true}]}'::jsonb,
 '{"hasApi": true, "languages": "All major", "ideType": "Terminal CLI", "agenticMode": true, "gitIntegration": true, "mcpSupport": true}'::jsonb,
 8.8, 7.5, 9.0, 8.0, 8.5, 800, 'published', NOW()),

('replit-agent', 'Replit Agent', 'ai-tools', 'ai-coding',
 'Build apps with AI. Describe what you want, Replit builds it.',
 'https://replit.com',
 '{"hasFreeplan": true, "freeTrialDays": null, "startingPrice": 25, "currency": "USD", "plans": [{"name": "Free", "price": 0, "billingCycle": "monthly", "features": ["Basic AI assistance", "Public repls", "Limited compute"], "isPopular": false}, {"name": "Core", "price": 25, "billingCycle": "monthly", "features": ["AI Agent full access", "Private repls", "4x compute", "SSH access"], "isPopular": true}]}'::jsonb,
 '{"hasApi": false, "languages": "All major", "ideType": "Browser IDE", "deployment": true, "collaboration": true, "agenticMode": true}'::jsonb,
 8.2, 9.0, 8.0, 7.5, 7.5, 900, 'published', NOW()),

('windsurf', 'Windsurf', 'ai-tools', 'ai-coding',
 'The first agentic IDE. Let AI write, refactor, and fix your code.',
 'https://codeium.com/windsurf',
 '{"hasFreeplan": true, "freeTrialDays": null, "startingPrice": 15, "currency": "USD", "plans": [{"name": "Free", "price": 0, "billingCycle": "monthly", "features": ["Autocomplete", "Chat", "Limited Cascade actions"], "isPopular": false}, {"name": "Pro", "price": 15, "billingCycle": "monthly", "features": ["Unlimited Flows", "Premium models", "Cascade Agent"], "isPopular": true}]}'::jsonb,
 '{"hasApi": false, "languages": "All major", "ideType": "Full IDE (VS Code fork)", "cascadeAgent": true, "multiFileEditing": true}'::jsonb,
 8.3, 8.5, 8.5, 8.8, 7.0, 700, 'published', NOW()),

-- ============================================================
-- AI WRITING TOOLS
-- ============================================================

('jasper', 'Jasper', 'ai-tools', 'ai-writing',
 'AI copilot for enterprise marketing teams.',
 'https://www.jasper.ai',
 '{"hasFreeplan": false, "freeTrialDays": 7, "startingPrice": 49, "currency": "USD", "plans": [{"name": "Creator", "price": 49, "billingCycle": "monthly", "features": ["1 seat", "Brand voice", "SEO mode", "Browser extension"], "isPopular": false}, {"name": "Pro", "price": 69, "billingCycle": "monthly", "features": ["1 seat", "3 brand voices", "Collaboration", "Custom templates"], "isPopular": true}, {"name": "Business", "price": null, "billingCycle": "custom", "features": ["Custom seats", "Unlimited brand voices", "API access", "SSO"], "isPopular": false}]}'::jsonb,
 '{"hasApi": true, "templates": 50, "brandVoice": true, "seoMode": true, "browserExtension": true, "teamCollaboration": true}'::jsonb,
 8.2, 8.5, 8.0, 7.0, 8.0, 1100, 'published', NOW()),

('copy-ai', 'Copy.ai', 'ai-tools', 'ai-writing',
 'Go-to-market AI platform for enterprise marketing.',
 'https://www.copy.ai',
 '{"hasFreeplan": true, "freeTrialDays": null, "startingPrice": 49, "currency": "USD", "plans": [{"name": "Free", "price": 0, "billingCycle": "monthly", "features": ["2000 words/mo", "1 user", "Blog wizard"], "isPopular": false}, {"name": "Starter", "price": 49, "billingCycle": "monthly", "features": ["Unlimited words", "1 user", "Brand voices", "90+ tools"], "isPopular": true}]}'::jsonb,
 '{"hasApi": true, "templates": 90, "brandVoice": true, "workflows": true, "infobase": true}'::jsonb,
 7.8, 8.5, 7.5, 7.0, 7.5, 900, 'published', NOW()),

('writesonic', 'Writesonic', 'ai-tools', 'ai-writing',
 'Create SEO-optimized, factual content 10x faster.',
 'https://writesonic.com',
 '{"hasFreeplan": true, "freeTrialDays": null, "startingPrice": 20, "currency": "USD", "plans": [{"name": "Free", "price": 0, "billingCycle": "monthly", "features": ["10000 words/mo", "1 user", "100+ templates"], "isPopular": false}, {"name": "Individual", "price": 20, "billingCycle": "monthly", "features": ["Unlimited words", "GPT-4 access", "Brand voice"], "isPopular": true}]}'::jsonb,
 '{"hasApi": true, "templates": 100, "seoOptimization": true, "factChecking": true, "brandVoice": true}'::jsonb,
 7.5, 8.0, 7.5, 8.0, 7.0, 800, 'published', NOW()),

('grammarly', 'Grammarly', 'ai-tools', 'ai-writing',
 'AI writing assistance that helps you communicate confidently.',
 'https://www.grammarly.com',
 '{"hasFreeplan": true, "freeTrialDays": 7, "startingPrice": 12, "currency": "USD", "plans": [{"name": "Free", "price": 0, "billingCycle": "monthly", "features": ["Grammar checking", "Spelling", "Punctuation", "Tone detection"], "isPopular": false}, {"name": "Premium", "price": 12, "billingCycle": "monthly", "features": ["Full writing feedback", "Tone adjustments", "Plagiarism detection", "AI rewrites"], "isPopular": true}, {"name": "Business", "price": 15, "billingCycle": "monthly", "features": ["Everything in Premium", "Brand tones", "Analytics", "Admin panel"], "isPopular": false}]}'::jsonb,
 '{"hasApi": false, "grammarCheck": true, "plagiarismDetection": true, "toneDetection": true, "browserExtension": true, "msOfficePlugin": true}'::jsonb,
 8.5, 9.5, 8.0, 8.5, 7.5, 3000, 'published', NOW()),

-- ============================================================
-- AI IMAGE GENERATORS
-- ============================================================

('midjourney', 'Midjourney', 'ai-tools', 'ai-image',
 'Expanding the imaginative powers of the human species.',
 'https://www.midjourney.com',
 '{"hasFreeplan": false, "freeTrialDays": null, "startingPrice": 10, "currency": "USD", "plans": [{"name": "Basic", "price": 10, "billingCycle": "monthly", "features": ["~200 generations/mo", "3 concurrent jobs", "General commercial terms"], "isPopular": false}, {"name": "Standard", "price": 30, "billingCycle": "monthly", "features": ["15 GPU hours/mo", "Unlimited relaxed", "Stealth mode"], "isPopular": true}, {"name": "Pro", "price": 60, "billingCycle": "monthly", "features": ["30 GPU hours/mo", "12 concurrent jobs", "Stealth mode"], "isPopular": false}]}'::jsonb,
 '{"hasApi": false, "imageQuality": "Highest", "styles": "Artistic, Photorealistic", "upscaling": true, "variations": true, "discordBased": true}'::jsonb,
 9.2, 7.5, 9.5, 8.5, 6.5, 2000, 'published', NOW()),

('dall-e', 'DALL-E 3', 'ai-tools', 'ai-image',
 'Create realistic images and art from a text description.',
 'https://openai.com/dall-e-3',
 '{"hasFreeplan": true, "freeTrialDays": null, "startingPrice": 20, "currency": "USD", "plans": [{"name": "Free (via ChatGPT)", "price": 0, "billingCycle": "monthly", "features": ["Limited generations", "Via ChatGPT free tier"], "isPopular": false}, {"name": "ChatGPT Plus", "price": 20, "billingCycle": "monthly", "features": ["Included in ChatGPT Plus", "Higher limits", "Editing tools"], "isPopular": true}, {"name": "API", "price": null, "billingCycle": "custom", "features": ["$0.040/image standard", "$0.080/image HD", "Full API access"], "isPopular": false}]}'::jsonb,
 '{"hasApi": true, "imageQuality": "High", "textInImages": true, "editing": true, "chatGptIntegration": true}'::jsonb,
 8.5, 9.0, 8.5, 8.0, 8.0, 1800, 'published', NOW()),

('stable-diffusion', 'Stable Diffusion', 'ai-tools', 'ai-image',
 'Open-source AI image generation model.',
 'https://stability.ai',
 '{"hasFreeplan": true, "freeTrialDays": null, "startingPrice": 0, "currency": "USD", "plans": [{"name": "Open Source", "price": 0, "billingCycle": "monthly", "features": ["Free to download", "Run locally", "No usage limits", "Full customization"], "isPopular": true}, {"name": "DreamStudio", "price": 10, "billingCycle": "monthly", "features": ["Cloud-hosted", "1000 credits", "Web interface"], "isPopular": false}]}'::jsonb,
 '{"hasApi": true, "openSource": true, "runLocally": true, "customModels": true, "controlNet": true, "inpainting": true}'::jsonb,
 8.8, 6.5, 9.5, 9.5, 6.0, 1500, 'published', NOW()),

('leonardo-ai', 'Leonardo.Ai', 'ai-tools', 'ai-image',
 'Create production-quality visual assets with AI.',
 'https://leonardo.ai',
 '{"hasFreeplan": true, "freeTrialDays": null, "startingPrice": 12, "currency": "USD", "plans": [{"name": "Free", "price": 0, "billingCycle": "monthly", "features": ["150 tokens/day", "Basic models", "Community features"], "isPopular": false}, {"name": "Apprentice", "price": 12, "billingCycle": "monthly", "features": ["8500 tokens/mo", "All models", "Private generation"], "isPopular": true}]}'::jsonb,
 '{"hasApi": true, "imageQuality": "High", "trainCustomModels": true, "canvasEditor": true, "realTimeGeneration": true}'::jsonb,
 8.3, 8.5, 8.5, 8.5, 7.0, 900, 'published', NOW()),

-- ============================================================
-- AI VIDEO TOOLS
-- ============================================================

('runway', 'Runway', 'ai-tools', 'ai-video',
 'Advancing creativity with artificial intelligence.',
 'https://runwayml.com',
 '{"hasFreeplan": true, "freeTrialDays": null, "startingPrice": 15, "currency": "USD", "plans": [{"name": "Free", "price": 0, "billingCycle": "monthly", "features": ["125 credits", "3 projects", "720p exports"], "isPopular": false}, {"name": "Standard", "price": 15, "billingCycle": "monthly", "features": ["625 credits/mo", "Gen-3 Alpha", "Unlimited projects"], "isPopular": true}]}'::jsonb,
 '{"hasApi": true, "textToVideo": true, "imageToVideo": true, "videoEditing": true, "gen3Alpha": true, "greenScreen": true}'::jsonb,
 8.5, 8.0, 9.0, 7.5, 7.0, 800, 'published', NOW()),

('heygen', 'HeyGen', 'ai-tools', 'ai-video',
 'AI video generator with talking avatars.',
 'https://www.heygen.com',
 '{"hasFreeplan": true, "freeTrialDays": null, "startingPrice": 29, "currency": "USD", "plans": [{"name": "Free", "price": 0, "billingCycle": "monthly", "features": ["1 free credit", "100+ avatars", "300+ voices"], "isPopular": false}, {"name": "Creator", "price": 29, "billingCycle": "monthly", "features": ["15 credits/mo", "Custom avatar", "Brand kit"], "isPopular": true}]}'::jsonb,
 '{"hasApi": true, "talkingAvatars": true, "voiceCloning": true, "multiLanguage": true, "customAvatars": true}'::jsonb,
 8.0, 8.5, 8.0, 7.5, 7.5, 700, 'published', NOW()),

-- ============================================================
-- AI VOICE & SPEECH
-- ============================================================

('elevenlabs', 'ElevenLabs', 'ai-tools', 'ai-voice',
 'The most realistic AI voice generator and text to speech platform.',
 'https://elevenlabs.io',
 '{"hasFreeplan": true, "freeTrialDays": null, "startingPrice": 5, "currency": "USD", "plans": [{"name": "Free", "price": 0, "billingCycle": "monthly", "features": ["10000 characters/mo", "3 custom voices", "28 languages"], "isPopular": false}, {"name": "Starter", "price": 5, "billingCycle": "monthly", "features": ["30000 characters/mo", "10 custom voices", "Commercial license"], "isPopular": true}, {"name": "Creator", "price": 22, "billingCycle": "monthly", "features": ["100000 characters/mo", "30 custom voices", "Voice cloning"], "isPopular": false}]}'::jsonb,
 '{"hasApi": true, "voiceCloning": true, "textToSpeech": true, "languages": 28, "realtimeStreaming": true}'::jsonb,
 9.0, 9.0, 9.0, 8.5, 7.5, 1200, 'published', NOW()),

-- ============================================================
-- AI PRODUCTIVITY
-- ============================================================

('notion-ai', 'Notion AI', 'ai-tools', 'ai-productivity',
 'AI-powered workspace for notes, docs, and project management.',
 'https://www.notion.so/product/ai',
 '{"hasFreeplan": true, "freeTrialDays": null, "startingPrice": 10, "currency": "USD", "plans": [{"name": "Free", "price": 0, "billingCycle": "monthly", "features": ["Limited AI responses", "Basic blocks", "7-day page history"], "isPopular": false}, {"name": "Plus", "price": 10, "billingCycle": "monthly", "features": ["Unlimited AI", "Unlimited blocks", "30-day history"], "isPopular": true}]}'::jsonb,
 '{"hasApi": true, "aiWriting": true, "projectManagement": true, "databases": true, "collaboration": true}'::jsonb,
 8.5, 8.5, 8.5, 8.0, 7.5, 1500, 'published', NOW()),

('otter-ai', 'Otter.ai', 'ai-tools', 'ai-productivity',
 'AI meeting assistant that records, transcribes, and summarizes.',
 'https://otter.ai',
 '{"hasFreeplan": true, "freeTrialDays": 7, "startingPrice": 17, "currency": "USD", "plans": [{"name": "Basic", "price": 0, "billingCycle": "monthly", "features": ["300 min/mo transcription", "30 min per conversation", "English only"], "isPopular": false}, {"name": "Pro", "price": 17, "billingCycle": "monthly", "features": ["1200 min/mo", "90 min per conversation", "Zoom/Teams/Meet"], "isPopular": true}]}'::jsonb,
 '{"hasApi": true, "transcription": true, "meetingRecording": true, "actionItems": true, "zoomIntegration": true}'::jsonb,
 8.0, 8.5, 8.0, 7.5, 7.0, 800, 'published', NOW()),

-- ============================================================
-- AI RESEARCH
-- ============================================================

('consensus', 'Consensus', 'ai-tools', 'ai-research',
 'AI-powered search engine for scientific research.',
 'https://consensus.app',
 '{"hasFreeplan": true, "freeTrialDays": null, "startingPrice": 9, "currency": "USD", "plans": [{"name": "Free", "price": 0, "billingCycle": "monthly", "features": ["20 AI credits/mo", "Basic search", "Paper summaries"], "isPopular": false}, {"name": "Premium", "price": 9, "billingCycle": "monthly", "features": ["Unlimited AI credits", "GPT-4 summaries", "Copilot features"], "isPopular": true}]}'::jsonb,
 '{"hasApi": false, "peerReviewed": true, "citations": true, "studySummaries": true, "meterAnalysis": true}'::jsonb,
 8.2, 8.5, 8.0, 8.5, 7.0, 500, 'published', NOW()),

('elicit', 'Elicit', 'ai-tools', 'ai-research',
 'AI research assistant that helps automate research workflows.',
 'https://elicit.com',
 '{"hasFreeplan": true, "freeTrialDays": null, "startingPrice": 12, "currency": "USD", "plans": [{"name": "Free", "price": 0, "billingCycle": "monthly", "features": ["5000 credits", "Basic extraction", "Paper search"], "isPopular": false}, {"name": "Plus", "price": 12, "billingCycle": "monthly", "features": ["12000 credits/mo", "Advanced extraction", "PDF analysis"], "isPopular": true}]}'::jsonb,
 '{"hasApi": false, "paperSearch": true, "dataExtraction": true, "synthesis": true, "citations": true}'::jsonb,
 8.0, 8.0, 8.0, 8.0, 7.0, 400, 'published', NOW()),

-- ============================================================
-- AI DESIGN
-- ============================================================

('canva-ai', 'Canva AI', 'ai-tools', 'ai-design',
 'Design anything with AI-powered tools, templates, and magic.',
 'https://www.canva.com',
 '{"hasFreeplan": true, "freeTrialDays": 30, "startingPrice": 13, "currency": "USD", "plans": [{"name": "Free", "price": 0, "billingCycle": "monthly", "features": ["250000+ templates", "Basic AI tools", "5GB storage"], "isPopular": false}, {"name": "Pro", "price": 13, "billingCycle": "monthly", "features": ["All premium templates", "Magic AI suite", "100GB storage", "Brand Kit"], "isPopular": true}]}'::jsonb,
 '{"hasApi": false, "templates": 250000, "magicDesign": true, "backgroundRemover": true, "brandKit": true, "collaboration": true}'::jsonb,
 8.8, 9.5, 8.5, 9.0, 8.0, 2500, 'published', NOW())

ON CONFLICT (category_slug, slug) DO NOTHING;

-- ============================================================
-- SAMPLE COMPARISONS (Most searched AI tool comparisons)
-- ============================================================

-- ChatGPT vs Claude
INSERT INTO comparisons (slug, category_slug, tool_a_id, tool_b_id, intro_content, verdict_content, migration_content, scenario_content, feature_matrix, faqs, meta_title, meta_description, last_updated)
SELECT
  'chatgpt-vs-claude',
  'ai-tools',
  (SELECT id FROM tools WHERE slug = 'chatgpt' AND category_slug = 'ai-tools'),
  (SELECT id FROM tools WHERE slug = 'claude' AND category_slug = 'ai-tools'),
  'ChatGPT and Claude are the two leading AI chatbots in 2026, each backed by billions in funding and used by millions worldwide. While ChatGPT pioneered the conversational AI revolution in late 2022, Claude has rapidly closed the gap with its emphasis on safety, longer context windows, and more nuanced responses. This comparison breaks down every aspect to help you choose the right AI assistant for your specific needs.',
  'For most users, ChatGPT offers the more complete package with its ecosystem of plugins, DALL-E integration, and custom GPTs. However, Claude excels in long-form content, coding assistance, and tasks requiring careful analysis of lengthy documents thanks to its 200K context window. If you primarily work with large documents or need more thoughtful, less hallucination-prone responses, Claude is the better choice.',
  'You should consider ChatGPT if you need image generation built in, want access to thousands of custom GPTs, or require a mature plugin ecosystem. You should consider Claude if you frequently work with long documents, need precise coding assistance, or prefer a more careful and nuanced AI that refuses less often on edge cases.',
  'For creative writing and brainstorming, ChatGPT tends to be more playful and generative. For technical writing, code review, and analytical tasks, Claude often produces more structured and accurate output. For daily productivity, both are excellent — your choice may come down to which interface you prefer.',
  '[{"feature": "Context Window", "category": "Core Capabilities", "toolAValue": "128K tokens", "toolBValue": "200K tokens", "winner": "b"}, {"feature": "Image Generation", "category": "Core Capabilities", "toolAValue": true, "toolBValue": false, "winner": "a"}, {"feature": "Web Browsing", "category": "Core Capabilities", "toolAValue": true, "toolBValue": true, "winner": "tie"}, {"feature": "Code Interpreter", "category": "Core Capabilities", "toolAValue": true, "toolBValue": true, "winner": "tie"}, {"feature": "Custom Bots", "category": "Customization", "toolAValue": "GPTs Store", "toolBValue": "Projects", "winner": "a"}, {"feature": "API Pricing (input)", "category": "Pricing", "toolAValue": "$2.50/1M tokens", "toolBValue": "$3.00/1M tokens", "winner": "a"}, {"feature": "Free Plan", "category": "Pricing", "toolAValue": true, "toolBValue": true, "winner": "tie"}, {"feature": "Pro Price", "category": "Pricing", "toolAValue": "$20/mo", "toolBValue": "$20/mo", "winner": "tie"}]'::jsonb,
  '[{"question": "Is ChatGPT or Claude better for coding?", "answer": "Both are excellent for coding, but they have different strengths. ChatGPT with GPT-4o excels at generating boilerplate code and working with its code interpreter for data analysis. Claude tends to be better at understanding large codebases, producing well-documented code, and catching subtle bugs during code review."}, {"question": "Which has a longer memory — ChatGPT or Claude?", "answer": "Claude has a significantly longer context window at 200K tokens compared to ChatGPT standard 128K tokens. This means Claude can process and remember approximately 500 pages of text in a single conversation, while ChatGPT handles about 300 pages."}, {"question": "Can I use both ChatGPT and Claude for free?", "answer": "Yes, both offer free tiers. ChatGPT Free gives you access to GPT-4o mini with limited GPT-4o access. Claude Free provides access to Claude 3.5 Sonnet with limited daily messages. Both free tiers are quite generous for casual use."}, {"question": "Which is better for writing — ChatGPT or Claude?", "answer": "It depends on the type of writing. ChatGPT tends to produce more creative, varied output for marketing copy, stories, and brainstorming. Claude excels at analytical writing, technical documentation, and tasks that require following complex instructions precisely."}, {"question": "Is there a difference in accuracy between ChatGPT and Claude?", "answer": "Both models can hallucinate, but they do so differently. ChatGPT tends to be confidently wrong in some cases, while Claude is more likely to express uncertainty when it is not sure. For factual accuracy, both benefit from web search integration, which both now support."}]'::jsonb,
  'ChatGPT vs Claude: Honest Comparison (2026)',
  'Compare ChatGPT and Claude side by side. Features, pricing, context window, coding ability, and which AI chatbot is better for your needs.',
  NOW()
ON CONFLICT DO NOTHING;

-- GitHub Copilot vs Cursor
INSERT INTO comparisons (slug, category_slug, tool_a_id, tool_b_id, intro_content, verdict_content, migration_content, scenario_content, feature_matrix, faqs, meta_title, meta_description, last_updated)
SELECT
  'github-copilot-vs-cursor',
  'ai-tools',
  (SELECT id FROM tools WHERE slug = 'github-copilot' AND category_slug = 'ai-tools'),
  (SELECT id FROM tools WHERE slug = 'cursor' AND category_slug = 'ai-tools'),
  'GitHub Copilot and Cursor represent two fundamentally different approaches to AI-assisted coding. Copilot works as a plugin inside your existing editor, while Cursor replaces your editor entirely with an AI-native IDE. Both aim to dramatically increase developer productivity, but they do so in very different ways.',
  'GitHub Copilot is the safer, more established choice — it works inside VS Code and JetBrains without changing your workflow. Cursor is the more innovative option, offering deeper AI integration with its Composer mode for multi-file editing and agent capabilities. If you want AI assistance without disrupting your setup, choose Copilot. If you want the most advanced AI coding experience available, choose Cursor.',
  'Choose GitHub Copilot if you want to keep your existing VS Code or JetBrains setup, need organizational management features, or prefer a proven tool backed by GitHub/Microsoft. Choose Cursor if you want the deepest possible AI integration, need multi-file editing capabilities, or are willing to switch editors for a more powerful experience.',
  'For quick inline completions while coding, both are excellent. For complex refactoring across multiple files, Cursor Composer mode is significantly more capable. For enterprise teams with compliance requirements, GitHub Copilot Business offers better organizational controls.',
  '[{"feature": "Approach", "category": "Architecture", "toolAValue": "IDE Plugin", "toolBValue": "Full IDE", "winner": "tie"}, {"feature": "Base Editor", "category": "Architecture", "toolAValue": "VS Code/JetBrains", "toolBValue": "VS Code Fork", "winner": "tie"}, {"feature": "Multi-file Editing", "category": "AI Features", "toolAValue": "Limited", "toolBValue": "Composer Mode", "winner": "b"}, {"feature": "Agent Mode", "category": "AI Features", "toolAValue": "Basic", "toolBValue": "Advanced", "winner": "b"}, {"feature": "Price", "category": "Pricing", "toolAValue": "$10/mo", "toolBValue": "$20/mo", "winner": "a"}, {"feature": "Free Tier", "category": "Pricing", "toolAValue": "2000 completions", "toolBValue": "2000 completions", "winner": "tie"}]'::jsonb,
  '[{"question": "Is Cursor worth the switch from GitHub Copilot?", "answer": "If you primarily use VS Code, Cursor offers a similar experience with significantly deeper AI integration, especially the Composer feature for multi-file edits. The transition is smooth since Cursor is a VS Code fork. However, at $20/mo vs $10/mo, you are paying double."}, {"question": "Can I use both GitHub Copilot and Cursor?", "answer": "Technically yes, but it is not recommended. Running both simultaneously can cause conflicting suggestions and degraded performance. Most developers choose one or the other."}, {"question": "Which is better for beginners?", "answer": "GitHub Copilot is slightly easier for beginners because it works within existing editors without requiring a switch. Cursor has a steeper initial learning curve but offers more powerful features once mastered."}]'::jsonb,
  'GitHub Copilot vs Cursor: Which AI Coding Assistant is Better? (2026)',
  'Compare GitHub Copilot and Cursor side by side. Features, pricing, multi-file editing, and which AI coding tool is right for you.',
  NOW()
ON CONFLICT DO NOTHING;

-- Midjourney vs DALL-E
INSERT INTO comparisons (slug, category_slug, tool_a_id, tool_b_id, intro_content, verdict_content, migration_content, scenario_content, feature_matrix, faqs, meta_title, meta_description, last_updated)
SELECT
  'midjourney-vs-dall-e',
  'ai-tools',
  (SELECT id FROM tools WHERE slug = 'midjourney' AND category_slug = 'ai-tools'),
  (SELECT id FROM tools WHERE slug = 'dall-e' AND category_slug = 'ai-tools'),
  'Midjourney and DALL-E 3 are the two most popular AI image generators in 2026. Midjourney is known for stunning artistic quality and has become the go-to tool for professional creatives. DALL-E 3, integrated into ChatGPT, offers unmatched convenience and the best text rendering in images of any AI tool. This comparison helps you decide which is worth your investment.',
  'Midjourney produces the most visually impressive images, especially for artistic and photorealistic styles. DALL-E 3 wins on accessibility, text-in-image accuracy, and integration with the ChatGPT ecosystem. For professional creative work, Midjourney is the clear leader. For quick, good-enough images integrated into your AI workflow, DALL-E 3 is more practical.',
  'Choose Midjourney if you need the highest quality images for creative projects, marketing materials, or artistic exploration and do not mind the Discord-based workflow. Choose DALL-E 3 if you want seamless integration with ChatGPT, need accurate text in your images, or prefer a simpler interface.',
  'For social media content, DALL-E 3 via ChatGPT is faster and easier. For client presentations, marketing campaigns, and portfolio work, Midjourney produces more polished results. For technical diagrams or images with text, DALL-E 3 is significantly better.',
  '[{"feature": "Image Quality", "category": "Output", "toolAValue": "Exceptional", "toolBValue": "Very Good", "winner": "a"}, {"feature": "Text in Images", "category": "Output", "toolAValue": "Poor", "toolBValue": "Excellent", "winner": "b"}, {"feature": "Ease of Use", "category": "UX", "toolAValue": "Discord-based", "toolBValue": "ChatGPT integrated", "winner": "b"}, {"feature": "Starting Price", "category": "Pricing", "toolAValue": "$10/mo", "toolBValue": "$20/mo (ChatGPT Plus)", "winner": "a"}, {"feature": "API Access", "category": "Integration", "toolAValue": false, "toolBValue": true, "winner": "b"}, {"feature": "Free Tier", "category": "Pricing", "toolAValue": false, "toolBValue": true, "winner": "b"}]'::jsonb,
  '[{"question": "Is Midjourney better than DALL-E for professional work?", "answer": "For most professional creative applications, yes. Midjourney consistently produces higher quality, more aesthetically pleasing images, especially for marketing, advertising, and artistic projects. However, DALL-E 3 is better for images that need accurate text rendering."}, {"question": "Can I use Midjourney without Discord?", "answer": "Midjourney has been developing a web interface, but as of 2026, Discord remains the primary way to use Midjourney for most users. The web alpha is available for subscribers but has more limited features."}, {"question": "Which is cheaper — Midjourney or DALL-E?", "answer": "Midjourney Basic starts at $10/mo. DALL-E 3 is included with ChatGPT Plus at $20/mo, but you also get the full ChatGPT experience. If you only need image generation, Midjourney is cheaper. If you want an all-in-one AI assistant plus image generation, ChatGPT Plus offers better value."}]'::jsonb,
  'Midjourney vs DALL-E 3: Which AI Image Generator is Better? (2026)',
  'Compare Midjourney and DALL-E 3 side by side. Image quality, pricing, ease of use, and which AI art generator fits your needs.',
  NOW()
ON CONFLICT DO NOTHING;
