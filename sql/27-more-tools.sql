-- =============================================================================
-- 27-more-tools.sql
-- 50 NEW tools across 6 categories
-- Distribution: ai-tools(9), saas(8), ecommerce(8), marketing(8), hosting(8), business(9)
-- Generated: 2026-03-05
-- =============================================================================

-- ---------------------------------------------------------------------------
-- AI-TOOLS (9 tools)
-- ---------------------------------------------------------------------------

INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, description, website_url, logo_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, pros_cons_content, use_cases_content, best_for_content, meta_title, meta_description, status, last_updated)
VALUES (
  'cohere',
  'Cohere',
  'ai-tools',
  NULL,
  'Enterprise AI platform for text generation, embeddings, and retrieval',
  'Cohere is an enterprise-focused AI platform that provides powerful language models for text generation, semantic search, and classification. Unlike consumer-facing AI tools, Cohere is built specifically for businesses that need to integrate NLP capabilities into their products and workflows.\n\nThe platform offers three core model families: Command for text generation, Embed for creating vector embeddings, and Rerank for improving search relevance. Cohere stands out with its retrieval-augmented generation (RAG) capabilities, allowing businesses to ground AI responses in their own data.\n\nCohere supports deployment flexibility with cloud API access, private cloud deployment, and even on-premises options for organizations with strict data residency requirements.',
  'https://cohere.com',
  NULL,
  '{"hasFreeplan": true, "freeTrialDays": 0, "startingPrice": 0, "currency": "USD", "plans": [{"name": "Free", "price": 0, "features": ["Rate-limited API access", "Command models", "Embed models"]}, {"name": "Production", "price": 0, "features": ["Pay-per-token pricing", "Higher rate limits", "Priority support", "Fine-tuning"]}, {"name": "Enterprise", "price": 0, "features": ["Custom deployment", "VPC/on-prem options", "Dedicated support", "SLA guarantees"]}]}',
  '{"text_generation": true, "embeddings": true, "reranking": true, "rag": true, "fine_tuning": true, "on_premises": true, "multilingual": true}',
  8.4, 8.0, 8.6, 8.2, 8.1, 185,
  '## Pros\n- Excellent enterprise-grade RAG capabilities\n- Flexible deployment including on-premises options\n- Strong multilingual support across 100+ languages\n- Pay-per-token pricing with no minimum commitment\n\n## Cons\n- Less consumer brand recognition than OpenAI\n- Documentation can be technical for non-developers\n- Smaller model ecosystem compared to competitors',
  '## Best Use Cases\n- Enterprise search and knowledge management systems\n- Building customer support chatbots grounded in company data\n- Semantic search for e-commerce product discovery\n- Document classification and content moderation',
  'Best for enterprises needing production-grade NLP with flexible deployment options',
  'Cohere Review (2025) - Features, Pricing & Alternatives',
  'Read our in-depth Cohere review. Enterprise AI platform for text generation, embeddings, and RAG with flexible deployment options including on-premises.',
  'published',
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, description, website_url, logo_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, pros_cons_content, use_cases_content, best_for_content, meta_title, meta_description, status, last_updated)
VALUES (
  'ai21-labs',
  'AI21 Labs',
  'ai-tools',
  NULL,
  'Enterprise language models with superior reading comprehension and accuracy',
  'AI21 Labs develops Jamba, a production-grade large language model built on a novel SSM-Transformer hybrid architecture. The model excels at long-context tasks, supporting up to 256K tokens, making it ideal for processing lengthy documents and complex business workflows.\n\nThe platform provides a straightforward API for text generation, summarization, paraphrasing, and grammar correction. AI21 differentiates itself with its focus on accuracy and factual grounding, reducing hallucinations compared to many competing models.\n\nAI21 also offers a fine-tuning platform and enterprise deployment options, with a strong focus on the legal, financial, and healthcare sectors where accuracy is paramount.',
  'https://ai21.com',
  NULL,
  '{"hasFreeplan": true, "freeTrialDays": 0, "startingPrice": 0, "currency": "USD", "plans": [{"name": "Free", "price": 0, "features": ["API access with rate limits", "Jamba models", "Playground"]}, {"name": "Scale", "price": 0, "features": ["Pay-per-token", "Higher limits", "Fine-tuning", "Priority support"]}]}',
  '{"text_generation": true, "long_context": true, "fine_tuning": true, "summarization": true, "grammar_correction": true, "api_access": true}',
  8.1, 8.3, 8.0, 8.2, 7.8, 120,
  '## Pros\n- Excellent long-context performance up to 256K tokens\n- Lower hallucination rates than many competitors\n- Novel SSM-Transformer architecture is very efficient\n- Strong enterprise compliance and security\n\n## Cons\n- Smaller community and ecosystem than OpenAI\n- Fewer model variants available\n- Brand recognition lags behind larger competitors',
  '## Best Use Cases\n- Processing and analyzing long legal documents\n- Financial report summarization and analysis\n- Enterprise knowledge base question answering\n- High-accuracy content generation for regulated industries',
  'Best for enterprises requiring high-accuracy language AI for long-document processing',
  'AI21 Labs Review (2025) - Features, Pricing & Alternatives',
  'Read our in-depth AI21 Labs review. Enterprise language models with 256K context, low hallucination rates, and strong accuracy for regulated industries.',
  'published',
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, description, website_url, logo_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, pros_cons_content, use_cases_content, best_for_content, meta_title, meta_description, status, last_updated)
VALUES (
  'mistral-ai',
  'Mistral AI',
  'ai-tools',
  NULL,
  'Open-weight European AI models with leading performance-to-cost ratio',
  'Mistral AI is a Paris-based AI company building some of the most efficient large language models available. Their models, including Mistral Large, Mixtral, and Codestral, consistently deliver impressive benchmark performance while being significantly more cost-effective than competitors.\n\nMistral offers both open-weight models that can be self-hosted and a managed API platform called La Plateforme. The Mixtral mixture-of-experts architecture is particularly notable for achieving high performance with lower computational requirements.\n\nAs a European company, Mistral emphasizes data sovereignty and GDPR compliance, making it an attractive choice for European enterprises. They also provide function calling, JSON mode, and fine-tuning capabilities through their API.',
  'https://mistral.ai',
  NULL,
  '{"hasFreeplan": true, "freeTrialDays": 0, "startingPrice": 0, "currency": "USD", "plans": [{"name": "Free", "price": 0, "features": ["Open-weight model downloads", "Community support"]}, {"name": "API", "price": 0, "features": ["Pay-per-token", "All model access", "Function calling", "Fine-tuning"]}, {"name": "Enterprise", "price": 0, "features": ["VPC deployment", "Dedicated support", "Custom SLAs"]}]}',
  '{"text_generation": true, "code_generation": true, "open_weight_models": true, "function_calling": true, "json_mode": true, "fine_tuning": true, "self_hosting": true}',
  8.7, 8.2, 8.8, 9.0, 7.9, 210,
  '## Pros\n- Outstanding performance-to-cost ratio\n- Open-weight models allow full self-hosting control\n- European company with strong GDPR compliance\n- Mixture-of-experts architecture is highly efficient\n\n## Cons\n- Smaller ecosystem of tools and integrations\n- API documentation could be more detailed\n- Enterprise support is still maturing',
  '## Best Use Cases\n- Cost-effective AI integration for startups and scale-ups\n- European companies needing GDPR-compliant AI\n- Self-hosting AI models on own infrastructure\n- Code generation with Codestral model',
  'Best for developers and enterprises wanting high-performance open-weight AI models',
  'Mistral AI Review (2025) - Features, Pricing & Alternatives',
  'Read our in-depth Mistral AI review. Open-weight European language models with leading cost-efficiency, self-hosting options, and GDPR compliance.',
  'published',
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, description, website_url, logo_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, pros_cons_content, use_cases_content, best_for_content, meta_title, meta_description, status, last_updated)
VALUES (
  'anthropic-api',
  'Anthropic API',
  'ai-tools',
  NULL,
  'Build with Claude models via a developer-first API platform',
  'The Anthropic API provides direct access to Claude models for developers building AI-powered applications. It supports text generation, vision, tool use, and structured outputs with an emphasis on safety and reliability.\n\nThe API features a Messages endpoint with streaming support, system prompts, multi-turn conversations, and function calling. Anthropic also offers the Workbench for prompt engineering and an evaluation framework for testing model outputs.\n\nWith a strong focus on responsible AI development, the Anthropic API includes built-in content filtering, usage policies, and Constitutional AI principles that help ensure safe and helpful outputs in production applications.',
  'https://docs.anthropic.com',
  NULL,
  '{"hasFreeplan": true, "freeTrialDays": 0, "startingPrice": 0, "currency": "USD", "plans": [{"name": "Free Credits", "price": 0, "features": ["$5 free credits", "All Claude models", "API access"]}, {"name": "Pay-as-you-go", "price": 0, "features": ["Per-token pricing", "All models", "Tool use", "Vision", "Batch API"]}]}',
  '{"text_generation": true, "vision": true, "tool_use": true, "streaming": true, "structured_outputs": true, "batch_api": true, "prompt_caching": true}',
  8.9, 8.7, 9.0, 8.5, 8.3, 275,
  '## Pros\n- Claude models excel at nuanced reasoning and instruction following\n- Excellent tool use and function calling capabilities\n- Prompt caching reduces costs for repeated contexts\n- Strong safety features built into the platform\n\n## Cons\n- Smaller model selection compared to OpenAI\n- Rate limits can be restrictive on lower tiers\n- No image generation capabilities',
  '## Best Use Cases\n- Building conversational AI assistants and chatbots\n- Document analysis and summarization pipelines\n- Code generation and developer tooling\n- Complex reasoning and multi-step task automation',
  'Best for developers building reliable AI applications that require strong reasoning and safety',
  'Anthropic API Review (2025) - Features, Pricing & Alternatives',
  'Read our in-depth Anthropic API review. Access Claude models for text generation, vision, and tool use with industry-leading safety and reasoning capabilities.',
  'published',
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, description, website_url, logo_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, pros_cons_content, use_cases_content, best_for_content, meta_title, meta_description, status, last_updated)
VALUES (
  'openai-api',
  'OpenAI API',
  'ai-tools',
  NULL,
  'The most widely adopted AI API platform for GPT and DALL-E models',
  'The OpenAI API provides developer access to GPT-4o, GPT-4, DALL-E 3, Whisper, and TTS models for building AI-powered applications. It is the most widely adopted AI API in the world, powering thousands of products across every industry.\n\nThe platform offers chat completions, embeddings, image generation, speech-to-text, text-to-speech, and fine-tuning capabilities. The Assistants API provides stateful conversation management with file search, code interpreter, and function calling built in.\n\nOpenAI also provides a comprehensive ecosystem including the Playground for experimentation, usage dashboards, and extensive SDKs for Python, Node.js, and other languages.',
  'https://platform.openai.com',
  NULL,
  '{"hasFreeplan": true, "freeTrialDays": 0, "startingPrice": 0, "currency": "USD", "plans": [{"name": "Free Tier", "price": 0, "features": ["Limited free credits", "GPT-3.5 access", "Rate limited"]}, {"name": "Pay-as-you-go", "price": 0, "features": ["All models", "Higher rate limits", "Fine-tuning", "Assistants API"]}]}',
  '{"text_generation": true, "image_generation": true, "speech_to_text": true, "text_to_speech": true, "embeddings": true, "fine_tuning": true, "assistants_api": true, "vision": true}',
  9.0, 8.8, 9.2, 8.0, 8.0, 450,
  '## Pros\n- Largest AI model ecosystem with GPT, DALL-E, Whisper, TTS\n- Most extensive third-party integrations and tooling\n- Excellent documentation and developer experience\n- Assistants API simplifies stateful application development\n\n## Cons\n- Premium pricing compared to open-source alternatives\n- Rate limits and usage caps can be frustrating\n- Frequent model updates can break existing prompts',
  '## Best Use Cases\n- Building full-featured AI applications with multiple modalities\n- Enterprise chatbots and virtual assistants\n- Image generation for creative and marketing workflows\n- Voice-enabled applications with Whisper and TTS',
  'Best for developers wanting the broadest AI model ecosystem with maximum third-party support',
  'OpenAI API Review (2025) - Features, Pricing & Alternatives',
  'Read our in-depth OpenAI API review. The most widely adopted AI platform with GPT-4o, DALL-E 3, Whisper, and comprehensive developer tools.',
  'published',
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, description, website_url, logo_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, pros_cons_content, use_cases_content, best_for_content, meta_title, meta_description, status, last_updated)
VALUES (
  'groq',
  'Groq',
  'ai-tools',
  NULL,
  'Ultra-fast AI inference engine with custom LPU hardware',
  'Groq provides the fastest AI inference available, powered by their custom Language Processing Unit (LPU) hardware. The platform delivers responses from models like Llama, Mixtral, and Gemma at speeds 10-18x faster than GPU-based alternatives.\n\nGroq offers a simple API compatible with the OpenAI SDK, making it trivial to switch from existing providers. The platform hosts popular open-source models and provides both synchronous and streaming response modes.\n\nThe speed advantage makes Groq particularly compelling for real-time applications like voice assistants, live coding tools, and interactive chatbots where latency directly impacts user experience.',
  'https://groq.com',
  NULL,
  '{"hasFreeplan": true, "freeTrialDays": 0, "startingPrice": 0, "currency": "USD", "plans": [{"name": "Free", "price": 0, "features": ["Rate-limited API access", "Open-source models", "Community support"]}, {"name": "Developer", "price": 0, "features": ["Pay-per-token", "Higher rate limits", "Priority support"]}]}',
  '{"ultra_fast_inference": true, "openai_compatible": true, "streaming": true, "open_source_models": true, "custom_lpu_hardware": true}',
  8.6, 9.0, 8.3, 8.8, 7.5, 165,
  '## Pros\n- Dramatically faster inference than any GPU-based provider\n- OpenAI-compatible API for easy migration\n- Generous free tier for development and testing\n- Excellent for real-time and latency-sensitive applications\n\n## Cons\n- Limited to open-source models only\n- Smaller model selection than multi-provider platforms\n- Enterprise features still in development',
  '## Best Use Cases\n- Real-time voice assistants requiring low latency\n- Interactive coding assistants needing instant responses\n- High-throughput batch processing of text\n- Chatbots where response speed impacts user satisfaction',
  'Best for developers building latency-sensitive AI applications that need the fastest possible inference',
  'Groq Review (2025) - Features, Pricing & Alternatives',
  'Read our in-depth Groq review. Ultra-fast AI inference with custom LPU hardware delivering 10-18x faster responses than GPU alternatives.',
  'published',
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, description, website_url, logo_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, pros_cons_content, use_cases_content, best_for_content, meta_title, meta_description, status, last_updated)
VALUES (
  'weights-and-biases',
  'Weights & Biases',
  'ai-tools',
  NULL,
  'ML experiment tracking, model management, and AI developer platform',
  'Weights & Biases (W&B) is the leading platform for machine learning experiment tracking, dataset versioning, and model management. Used by over 70,000 ML teams, it provides tools for logging experiments, visualizing results, and collaborating on model development.\n\nThe platform includes W&B Experiments for tracking training runs, Sweeps for hyperparameter optimization, Artifacts for dataset and model versioning, and Tables for interactive data visualization. It integrates with every major ML framework including PyTorch, TensorFlow, and Hugging Face.\n\nW&B also offers a hosted model registry and deployment tools, making it a comprehensive MLOps platform for teams moving from experimentation to production.',
  'https://wandb.ai',
  NULL,
  '{"hasFreeplan": true, "freeTrialDays": 0, "startingPrice": 0, "currency": "USD", "plans": [{"name": "Personal", "price": 0, "features": ["Unlimited experiments", "100GB storage", "Community support"]}, {"name": "Teams", "price": 50, "features": ["Team collaboration", "1TB storage", "Service accounts", "Priority support"]}, {"name": "Enterprise", "price": 0, "features": ["SSO/SAML", "On-prem deployment", "Dedicated support"]}]}',
  '{"experiment_tracking": true, "hyperparameter_sweeps": true, "dataset_versioning": true, "model_registry": true, "interactive_dashboards": true, "team_collaboration": true}',
  8.8, 8.4, 9.0, 8.5, 8.2, 230,
  '## Pros\n- Industry-standard experiment tracking with beautiful visualizations\n- Integrates with every major ML framework seamlessly\n- Generous free tier for individual researchers\n- Comprehensive MLOps platform beyond just tracking\n\n## Cons\n- Teams pricing can be expensive for larger organizations\n- Learning curve for advanced features like Artifacts\n- Self-hosted option requires significant infrastructure',
  '## Best Use Cases\n- Tracking and comparing ML experiment results across runs\n- Hyperparameter optimization with automated sweeps\n- Dataset and model versioning for reproducibility\n- Team collaboration on ML projects with shared dashboards',
  'Best for ML teams needing comprehensive experiment tracking and model management',
  'Weights & Biases Review (2025) - Features, Pricing & Alternatives',
  'Read our in-depth Weights & Biases review. The leading ML experiment tracking platform with sweeps, artifacts, and model registry for AI teams.',
  'published',
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, description, website_url, logo_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, pros_cons_content, use_cases_content, best_for_content, meta_title, meta_description, status, last_updated)
VALUES (
  'langchain',
  'LangChain',
  'ai-tools',
  NULL,
  'Open-source framework for building applications with large language models',
  'LangChain is the most popular open-source framework for building applications powered by large language models. It provides abstractions for chains, agents, retrieval-augmented generation, and memory that simplify the development of complex AI workflows.\n\nThe ecosystem includes LangChain (the core framework), LangSmith (for debugging and monitoring), LangGraph (for building agentic workflows), and LangServe (for deploying chains as APIs). Together, they cover the full lifecycle of LLM application development.\n\nLangChain supports every major LLM provider and integrates with hundreds of tools and data sources, making it the go-to framework for developers building everything from simple chatbots to sophisticated AI agents.',
  'https://langchain.com',
  NULL,
  '{"hasFreeplan": true, "freeTrialDays": 0, "startingPrice": 0, "currency": "USD", "plans": [{"name": "Open Source", "price": 0, "features": ["Full framework", "Community support", "All integrations"]}, {"name": "LangSmith Plus", "price": 39, "features": ["Debugging and tracing", "Monitoring", "Evaluations", "Prompt hub"]}, {"name": "Enterprise", "price": 0, "features": ["SSO", "Advanced security", "Dedicated support"]}]}',
  '{"llm_chains": true, "agents": true, "rag_pipelines": true, "memory": true, "tool_integrations": true, "langsmith_debugging": true, "langgraph_agents": true}',
  8.5, 7.5, 9.0, 9.2, 7.8, 310,
  '## Pros\n- Most comprehensive LLM application framework available\n- Huge ecosystem with 700+ integrations\n- LangSmith provides excellent debugging and monitoring\n- LangGraph enables sophisticated agentic workflows\n\n## Cons\n- Steep learning curve due to many abstractions\n- Frequent breaking changes between versions\n- Can add unnecessary complexity for simple use cases',
  '## Best Use Cases\n- Building RAG applications over private data\n- Creating AI agents with tool use and reasoning\n- Developing complex multi-step LLM workflows\n- Prototyping and iterating on LLM applications quickly',
  'Best for developers building complex LLM applications that need RAG, agents, or multi-step workflows',
  'LangChain Review (2025) - Features, Pricing & Alternatives',
  'Read our in-depth LangChain review. The leading open-source framework for building LLM applications with chains, agents, RAG, and comprehensive tooling.',
  'published',
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, description, website_url, logo_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, pros_cons_content, use_cases_content, best_for_content, meta_title, meta_description, status, last_updated)
VALUES (
  'perplexity-api',
  'Perplexity API',
  'ai-tools',
  NULL,
  'AI-powered search API that provides grounded, cited answers in real time',
  'The Perplexity API (Sonar) provides programmatic access to an AI-powered search engine that returns factual, cited answers to queries. Unlike traditional LLM APIs, Perplexity Sonar models search the web in real-time and ground their responses in current sources.\n\nThe API offers Sonar and Sonar Pro models that combine web retrieval with language model reasoning. Every response includes inline citations to source URLs, enabling developers to build applications that provide trustworthy, verifiable information.\n\nPerplexity API is ideal for building research tools, knowledge assistants, and any application where factual accuracy and source attribution are critical requirements.',
  'https://docs.perplexity.ai',
  NULL,
  '{"hasFreeplan": false, "freeTrialDays": 0, "startingPrice": 5, "currency": "USD", "plans": [{"name": "API Access", "price": 5, "features": ["Per-request pricing", "Sonar models", "Web search grounding", "Inline citations"]}]}',
  '{"web_search_grounded": true, "inline_citations": true, "real_time_data": true, "streaming": true, "api_access": true}',
  8.3, 8.5, 8.2, 7.9, 7.6, 130,
  '## Pros\n- Answers grounded in real-time web search results\n- Inline citations provide source transparency\n- Great for building research and fact-checking tools\n- Simple API with streaming support\n\n## Cons\n- No free tier available\n- Per-request pricing can add up for high-volume use\n- Less flexible than general-purpose LLM APIs',
  '## Best Use Cases\n- Research tools that need current, cited information\n- Customer support bots with factual grounding\n- News and market intelligence applications\n- Educational tools requiring source attribution',
  'Best for developers building applications that require factual, cited, real-time information',
  'Perplexity API Review (2025) - Features, Pricing & Alternatives',
  'Read our in-depth Perplexity API review. AI search API delivering grounded, cited answers with real-time web search for developer applications.',
  'published',
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------------
-- SAAS (8 tools)
-- ---------------------------------------------------------------------------

INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, description, website_url, logo_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, pros_cons_content, use_cases_content, best_for_content, meta_title, meta_description, status, last_updated)
VALUES (
  'harvest',
  'Harvest',
  'saas',
  NULL,
  'Simple time tracking and invoicing for teams and freelancers',
  'Harvest is a time tracking and invoicing tool designed for teams that need to track billable hours, manage project budgets, and send professional invoices. With over 18 years in the market, it is one of the most trusted names in time management software.\n\nThe platform features intuitive timers, timesheet approvals, project budget tracking with alerts, expense management, and seamless invoicing with online payment acceptance through Stripe and PayPal. Harvest integrates with 50+ tools including Asana, Slack, and QuickBooks.\n\nHarvest stands out for its simplicity and focus. Rather than trying to be an all-in-one project management tool, it excels at time tracking and turns that data into actionable reports about team capacity and project profitability.',
  'https://www.getharvest.com',
  NULL,
  '{"hasFreeplan": true, "freeTrialDays": 30, "startingPrice": 10.80, "currency": "USD", "plans": [{"name": "Free", "price": 0, "features": ["1 seat", "2 projects", "Time tracking", "Invoicing"]}, {"name": "Pro", "price": 10.80, "features": ["Unlimited seats", "Unlimited projects", "Team management", "Budget alerts", "Expense tracking"]}]}',
  '{"time_tracking": true, "invoicing": true, "project_budgets": true, "expense_tracking": true, "team_reports": true, "integrations": true}',
  8.3, 9.0, 7.8, 8.0, 8.2, 195,
  '## Pros\n- Exceptionally simple and intuitive interface\n- Mature product with 18+ years of development\n- Strong invoicing with online payment support\n- Excellent project profitability reporting\n\n## Cons\n- Limited project management features\n- Mobile app can be sluggish\n- Free plan restricted to 1 seat and 2 projects',
  '## Best Use Cases\n- Agencies tracking billable hours across client projects\n- Freelancers managing time and sending invoices\n- Teams monitoring project budgets and profitability\n- Organizations needing timesheet approvals and reporting',
  'Best for agencies and freelancers who need straightforward time tracking with integrated invoicing',
  'Harvest Review (2025) - Features, Pricing & Alternatives',
  'Read our in-depth Harvest review. Simple time tracking and invoicing for agencies and freelancers with project budgets and profitability reports.',
  'published',
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, description, website_url, logo_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, pros_cons_content, use_cases_content, best_for_content, meta_title, meta_description, status, last_updated)
VALUES (
  'scoro',
  'Scoro',
  'saas',
  NULL,
  'End-to-end work management for professional and creative services',
  'Scoro is an all-in-one business management platform designed for professional and creative services firms. It combines project management, time tracking, CRM, quoting, billing, and financial reporting into a single unified platform.\n\nThe platform provides real-time dashboards showing utilization rates, project margins, and revenue forecasts. Scoro excels at connecting the dots between sales pipeline, project delivery, and financial outcomes in ways that separate tools cannot.\n\nWith Gantt charts, Kanban boards, resource planning, and automated workflows, Scoro replaces the need for multiple disconnected tools while providing the financial visibility that services businesses need to grow profitably.',
  'https://www.scoro.com',
  NULL,
  '{"hasFreeplan": false, "freeTrialDays": 14, "startingPrice": 26, "currency": "USD", "plans": [{"name": "Essential", "price": 26, "features": ["Project management", "Time tracking", "Invoicing", "Dashboards"]}, {"name": "Standard", "price": 37, "features": ["Gantt charts", "Resource planning", "Advanced reporting", "Triggers"]}, {"name": "Pro", "price": 63, "features": ["Budget forecasting", "Utilization tracking", "Custom fields", "API access"]}]}',
  '{"project_management": true, "crm": true, "invoicing": true, "resource_planning": true, "financial_reporting": true, "time_tracking": true}',
  8.2, 7.5, 8.8, 7.9, 8.0, 140,
  '## Pros\n- Truly all-in-one platform replacing 5+ separate tools\n- Excellent financial visibility and profitability tracking\n- Strong resource planning and utilization dashboards\n- Purpose-built for professional services firms\n\n## Cons\n- Steep learning curve due to breadth of features\n- Starting price higher than single-purpose alternatives\n- Interface can feel overwhelming for new users',
  '## Best Use Cases\n- Creative agencies managing client projects end-to-end\n- Consulting firms tracking utilization and profitability\n- Professional services teams needing CRM-to-invoice workflows\n- Growing businesses wanting to consolidate multiple tools',
  'Best for professional services firms needing unified project, financial, and resource management',
  'Scoro Review (2025) - Features, Pricing & Alternatives',
  'Read our in-depth Scoro review. End-to-end business management for professional services with project management, CRM, billing, and financial reporting.',
  'published',
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, description, website_url, logo_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, pros_cons_content, use_cases_content, best_for_content, meta_title, meta_description, status, last_updated)
VALUES (
  'productive-io',
  'Productive',
  'saas',
  NULL,
  'Agency management platform for resource planning and profitability',
  'Productive is a modern agency management platform that gives creative and digital agencies visibility into their projects, resources, and finances. It combines project management, resource scheduling, time tracking, sales pipeline, and budgeting in one place.\n\nThe platform features a visual resource planner that shows team availability and scheduled work across projects. Its budgeting system tracks project margins in real-time, and the sales pipeline helps agencies manage their deal flow from lead to signed contract.\n\nProductive is built specifically for agencies, with features like retainer management, multi-currency invoicing, and agency-specific reporting that generic project management tools lack.',
  'https://productive.io',
  NULL,
  '{"hasFreeplan": false, "freeTrialDays": 14, "startingPrice": 9, "currency": "USD", "plans": [{"name": "Essential", "price": 9, "features": ["Project management", "Time tracking", "Basic budgeting"]}, {"name": "Professional", "price": 24, "features": ["Resource planning", "Advanced budgeting", "Sales pipeline", "Custom fields"]}, {"name": "Ultimate", "price": 32, "features": ["Forecasting", "Overhead tracking", "Advanced permissions", "API access"]}]}',
  '{"project_management": true, "resource_scheduling": true, "time_tracking": true, "budgeting": true, "sales_pipeline": true, "invoicing": true}',
  8.4, 8.3, 8.5, 8.2, 8.4, 115,
  '## Pros\n- Purpose-built for agency workflows and needs\n- Excellent resource scheduling with visual planner\n- Real-time project margin and profitability tracking\n- Competitive pricing for the feature set\n\n## Cons\n- Less suitable for non-agency businesses\n- Mobile app has limited functionality\n- Reporting customization can be restrictive',
  '## Best Use Cases\n- Digital agencies planning resources across client projects\n- Creative studios tracking project profitability\n- Marketing agencies managing retainers and one-off projects\n- Growing agencies needing financial visibility',
  'Best for digital and creative agencies needing integrated resource planning with profitability tracking',
  'Productive Review (2025) - Features, Pricing & Alternatives',
  'Read our in-depth Productive review. Agency management platform combining resource planning, project management, and financial tracking.',
  'published',
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, description, website_url, logo_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, pros_cons_content, use_cases_content, best_for_content, meta_title, meta_description, status, last_updated)
VALUES (
  'teamleader',
  'Teamleader',
  'saas',
  NULL,
  'CRM, project management, and invoicing for European SMBs',
  'Teamleader is a business management platform popular in Europe that combines CRM, project management, invoicing, and time tracking. It is designed for small and medium-sized businesses that need an affordable all-in-one tool rather than stitching together separate solutions.\n\nThe CRM module handles contacts, companies, deals, and call logging. Project management includes task boards, planning, and time tracking. The invoicing system supports quotes, invoices, credit notes, and integrates with major European accounting software.\n\nTeamleader Focus and Teamleader Orbit serve different segments, with Focus targeting SMBs and Orbit targeting larger professional services firms with more complex needs around resource planning and advanced reporting.',
  'https://www.teamleader.eu',
  NULL,
  '{"hasFreeplan": false, "freeTrialDays": 14, "startingPrice": 37.50, "currency": "EUR", "plans": [{"name": "Go", "price": 37.50, "features": ["CRM", "Invoicing", "2 users"]}, {"name": "Move", "price": 52.50, "features": ["Project management", "Time tracking", "Ticketing"]}, {"name": "Boost", "price": 67.50, "features": ["Advanced CRM", "Email campaigns", "Advanced reporting"]}]}',
  '{"crm": true, "invoicing": true, "project_management": true, "time_tracking": true, "quotes": true, "ticketing": true}',
  7.9, 8.2, 7.8, 8.0, 7.8, 95,
  '## Pros\n- Genuine all-in-one for CRM, projects, and invoicing\n- Strong European market focus with GDPR compliance\n- Integrates with European accounting and banking tools\n- Competitive pricing for bundled feature set\n\n## Cons\n- Less well-known outside of European markets\n- Each module is less deep than best-of-breed alternatives\n- Interface can feel dated compared to newer tools',
  '## Best Use Cases\n- European SMBs needing CRM with integrated invoicing\n- Small services businesses managing sales and project delivery\n- Companies wanting to replace disconnected spreadsheets\n- Teams needing a simple all-in-one business tool',
  'Best for European small businesses needing an affordable all-in-one CRM, projects, and invoicing tool',
  'Teamleader Review (2025) - Features, Pricing & Alternatives',
  'Read our in-depth Teamleader review. European all-in-one business platform combining CRM, project management, and invoicing for SMBs.',
  'published',
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, description, website_url, logo_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, pros_cons_content, use_cases_content, best_for_content, meta_title, meta_description, status, last_updated)
VALUES (
  'kantata',
  'Kantata',
  'saas',
  NULL,
  'Professional services automation for resource management and delivery',
  'Kantata (formerly Mavenlink) is a professional services automation platform that helps services organizations optimize resource allocation, project delivery, and financial performance. It is purpose-built for the unique needs of consulting, IT services, and business advisory firms.\n\nThe platform provides advanced resource management with skills-based matching, demand forecasting, and what-if scenario planning. Its project management capabilities include templates, dependencies, and milestone tracking integrated with financial metrics.\n\nKantata excels at giving leadership real-time visibility into utilization rates, revenue forecasts, and project health across the entire services portfolio.',
  'https://www.kantata.com',
  NULL,
  '{"hasFreeplan": false, "freeTrialDays": 0, "startingPrice": 0, "currency": "USD", "plans": [{"name": "Professional", "price": 0, "features": ["Project management", "Time tracking", "Resource management", "Reporting"]}, {"name": "Enterprise", "price": 0, "features": ["Advanced analytics", "Scenario planning", "Custom integrations", "Dedicated support"]}]}',
  '{"resource_management": true, "project_management": true, "financial_management": true, "time_tracking": true, "demand_forecasting": true, "utilization_tracking": true}',
  8.0, 7.2, 8.5, 7.6, 7.8, 105,
  '## Pros\n- Best-in-class resource management with skills matching\n- Strong financial tracking tied to project delivery\n- Excellent portfolio-level visibility and reporting\n- Purpose-built for professional services organizations\n\n## Cons\n- Enterprise pricing with no transparent public pricing\n- Steep learning curve for administrators\n- Implementation can take several weeks',
  '## Best Use Cases\n- IT services firms managing large project portfolios\n- Consulting companies optimizing consultant utilization\n- Professional services orgs needing demand forecasting\n- Enterprises requiring skills-based resource allocation',
  'Best for mid-to-large professional services organizations needing advanced resource and financial management',
  'Kantata Review (2025) - Features, Pricing & Alternatives',
  'Read our in-depth Kantata review. Professional services automation platform with advanced resource management, utilization tracking, and financial forecasting.',
  'published',
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, description, website_url, logo_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, pros_cons_content, use_cases_content, best_for_content, meta_title, meta_description, status, last_updated)
VALUES (
  'forecast-app',
  'Forecast',
  'saas',
  NULL,
  'AI-powered project and resource management for teams',
  'Forecast is an AI-powered project and resource management platform that uses machine learning to help teams plan, execute, and analyze their work. The platform learns from historical project data to provide more accurate estimates, identify risks, and optimize resource allocation.\n\nThe AI assistant suggests task estimates based on past projects, flags when projects are likely to go over budget, and recommends optimal team member assignments. Combined with traditional project management features like timelines, budgets, and time tracking, Forecast offers a unique blend of intelligence and control.\n\nThe platform integrates with Jira, Asana, and other tools, allowing teams to keep their existing workflows while gaining AI-powered insights.',
  'https://www.forecast.app',
  NULL,
  '{"hasFreeplan": false, "freeTrialDays": 14, "startingPrice": 29, "currency": "USD", "plans": [{"name": "Lite", "price": 29, "features": ["Project management", "Time tracking", "AI estimates"]}, {"name": "Pro", "price": 49, "features": ["Resource management", "Budget tracking", "Advanced reporting", "Integrations"]}]}',
  '{"ai_estimates": true, "project_management": true, "resource_management": true, "time_tracking": true, "budget_tracking": true, "risk_detection": true}',
  8.1, 8.0, 8.3, 7.8, 8.0, 85,
  '## Pros\n- AI-powered estimates improve with usage over time\n- Proactive risk detection flags issues before they escalate\n- Clean, modern interface for project planning\n- Good integration with existing PM tools\n\n## Cons\n- AI features need historical data to be useful\n- Higher price point than traditional PM tools\n- Smaller user community and ecosystem',
  '## Best Use Cases\n- Teams wanting data-driven project estimates\n- Organizations looking to reduce project overruns\n- Resource managers optimizing team allocation\n- Agencies wanting AI-assisted project planning',
  'Best for teams that want AI-powered project estimation and risk detection layered onto solid project management',
  'Forecast Review (2025) - Features, Pricing & Alternatives',
  'Read our in-depth Forecast review. AI-powered project and resource management with intelligent estimates, risk detection, and resource optimization.',
  'published',
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, description, website_url, logo_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, pros_cons_content, use_cases_content, best_for_content, meta_title, meta_description, status, last_updated)
VALUES (
  'front-app',
  'Front',
  'saas',
  NULL,
  'Shared inbox and customer communication platform for teams',
  'Front is a customer communication platform that combines the familiarity of email with the efficiency of a help desk. It provides shared inboxes where teams can collaboratively manage email, SMS, social media, and live chat conversations without losing the personal touch.\n\nUnlike traditional help desks with ticket numbers and canned responses, Front preserves the natural email experience for customers while giving teams internal collaboration tools like comments, assignments, and SLA tracking behind the scenes.\n\nFront is particularly strong for teams that need to manage high-volume, relationship-driven communication where personalization matters more than ticket deflection.',
  'https://front.com',
  NULL,
  '{"hasFreeplan": false, "freeTrialDays": 7, "startingPrice": 19, "currency": "USD", "plans": [{"name": "Starter", "price": 19, "features": ["Shared inboxes", "Basic rules", "Integrations"]}, {"name": "Growth", "price": 59, "features": ["Analytics", "Advanced rules", "CRM integrations", "SLA tracking"]}, {"name": "Scale", "price": 99, "features": ["AI features", "Advanced analytics", "Custom roles", "Dedicated support"]}]}',
  '{"shared_inbox": true, "team_collaboration": true, "multi_channel": true, "sla_tracking": true, "analytics": true, "crm_integration": true}',
  8.5, 8.7, 8.4, 7.8, 8.3, 175,
  '## Pros\n- Preserves natural email experience for customers\n- Excellent team collaboration with internal comments\n- Multi-channel support including email, SMS, and chat\n- Beautiful, intuitive interface\n\n## Cons\n- Gets expensive as team size grows\n- Advanced features locked behind higher tiers\n- Learning curve for teams used to traditional help desks',
  '## Best Use Cases\n- Account management teams handling client communications\n- Customer success teams managing relationship-driven support\n- Operations teams processing email-heavy workflows\n- Teams needing shared inboxes with internal collaboration',
  'Best for teams managing relationship-driven customer communication across multiple channels',
  'Front Review (2025) - Features, Pricing & Alternatives',
  'Read our in-depth Front review. Shared inbox platform for team-based customer communication with collaboration, analytics, and multi-channel support.',
  'published',
  NOW()
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, description, website_url, logo_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, pros_cons_content, use_cases_content, best_for_content, meta_title, meta_description, status, last_updated)
VALUES (
  'missive-app',
  'Missive',
  'saas',
  NULL,
  'Team inbox and chat for collaborative email and messaging',
  'Missive is a collaborative email client that combines shared inboxes, team chat, and task management in a single application. It allows teams to collaborate on emails in real-time with shared drafts, internal comments, and instant assignment workflows.\n\nThe platform supports email, SMS, WhatsApp, Instagram, Facebook Messenger, and live chat, unifying all customer conversations in one place. Unique features include shared email drafts where multiple team members can edit simultaneously, and a built-in team chat that eliminates the need for a separate messaging tool.\n\nMissive appeals to teams that want Slack-like collaboration built directly into their email workflow rather than switching between multiple applications.',
  'https://missiveapp.com',
  NULL,
  '{"hasFreeplan": true, "freeTrialDays": 0, "startingPrice": 14, "currency": "USD", "plans": [{"name": "Free", "price": 0, "features": ["3 users", "Shared inboxes", "Team chat"]}, {"name": "Starter", "price": 14, "features": ["Unlimited users", "Rules", "Integrations"]}, {"name": "Productive", "price": 24, "features": ["Advanced rules", "Analytics", "API access", "Custom branding"]}]}',
  '{"shared_inbox": true, "team_chat": true, "shared_drafts": true, "multi_channel": true, "rules_automation": true, "task_management": true}',
  8.3, 8.8, 8.2, 8.5, 8.0, 90,
  '## Pros\n- Unique shared drafts feature for real-time email collaboration\n- Built-in team chat eliminates need for separate messaging\n- Very affordable pricing compared to competitors\n- Supports many messaging channels beyond email\n\n## Cons\n- Smaller brand recognition than Front or Zendesk\n- Mobile app less polished than desktop experience\n- Fewer enterprise-grade features and compliance options',
  '## Best Use Cases\n- Small teams needing email collaboration without enterprise pricing\n- Customer support teams handling multi-channel conversations\n- Agencies co-drafting client emails in real time\n- Teams wanting to replace separate email and chat tools',
  'Best for small teams wanting affordable, collaborative email management with built-in team chat',
  'Missive Review (2025) - Features, Pricing & Alternatives',
  'Read our in-depth Missive review. Collaborative team inbox combining shared email drafts, team chat, and multi-channel messaging at an affordable price.',
  'published',
  NOW()
) ON CONFLICT (slug) DO NOTHING;
