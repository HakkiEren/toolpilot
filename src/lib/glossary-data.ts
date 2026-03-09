// ============================================================
// GLOSSARY TERMS DATA — Shared between index and individual pages
// Each term becomes an indexable page at /glossary/[slug]
// ============================================================

export interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  /** Extended definition for the individual page (2-3 sentences) */
  extendedDefinition: string;
  category: string;
  categorySlug: string;
  relatedLink?: string;
  relatedLabel?: string;
  /** Related glossary term slugs for cross-linking */
  relatedTerms?: string[];
}

function slugify(term: string): string {
  return term
    .toLowerCase()
    .replace(/\([^)]*\)/g, '') // Remove parenthetical like (AI)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // ─── AI Terms ───────────────────────────────────────────
  {
    term: 'Artificial Intelligence (AI)',
    slug: slugify('Artificial Intelligence'),
    definition: 'Computer systems designed to perform tasks that normally require human intelligence, such as visual perception, speech recognition, decision-making, and language translation.',
    extendedDefinition: 'Artificial Intelligence encompasses machine learning, deep learning, and rule-based systems that can analyze data, recognize patterns, and make decisions with minimal human intervention. Modern AI tools range from chatbots and writing assistants to complex data analysis platforms, transforming how businesses operate across every industry.',
    category: 'AI',
    categorySlug: 'ai-tools',
    relatedLink: '/ai-tools',
    relatedLabel: 'Browse AI Tools',
    relatedTerms: ['large-language-model', 'generative-ai', 'natural-language-processing'],
  },
  {
    term: 'Large Language Model (LLM)',
    slug: slugify('Large Language Model'),
    definition: 'A type of AI model trained on vast amounts of text data, capable of understanding and generating human-like text. Examples include GPT-4, Claude, and Gemini.',
    extendedDefinition: 'Large Language Models use transformer architectures trained on billions of text parameters to understand context, generate coherent responses, and perform complex reasoning tasks. LLMs power popular AI tools like ChatGPT, Claude, and Gemini, enabling capabilities from creative writing to code generation and data analysis.',
    category: 'AI',
    categorySlug: 'ai-tools',
    relatedLink: '/ai-tools/compare/chatgpt-vs-claude',
    relatedLabel: 'ChatGPT vs Claude',
    relatedTerms: ['artificial-intelligence', 'token', 'fine-tuning'],
  },
  {
    term: 'Natural Language Processing (NLP)',
    slug: slugify('Natural Language Processing'),
    definition: 'A branch of AI that deals with the interaction between computers and human language, enabling machines to read, understand, and derive meaning from text.',
    extendedDefinition: 'NLP combines computational linguistics with machine learning to process and analyze large amounts of natural language data. Applications include sentiment analysis, machine translation, chatbots, and search engines. NLP is the foundation technology behind AI writing tools and conversational AI platforms.',
    category: 'AI',
    categorySlug: 'ai-tools',
    relatedTerms: ['artificial-intelligence', 'large-language-model', 'generative-ai'],
  },
  {
    term: 'Generative AI',
    slug: slugify('Generative AI'),
    definition: 'AI systems that can create new content — including text, images, music, and code — based on patterns learned from training data.',
    extendedDefinition: 'Generative AI uses deep learning models to produce original content that mimics human creativity. This includes text generators (ChatGPT, Claude), image creators (DALL-E, Midjourney), and code assistants (GitHub Copilot). The technology is transforming content creation, software development, and creative industries.',
    category: 'AI',
    categorySlug: 'ai-tools',
    relatedTerms: ['artificial-intelligence', 'large-language-model', 'prompt-engineering'],
  },
  {
    term: 'Prompt Engineering',
    slug: slugify('Prompt Engineering'),
    definition: 'The practice of crafting effective inputs (prompts) to get desired outputs from AI models. A critical skill for maximizing AI tool productivity.',
    extendedDefinition: 'Prompt engineering involves designing clear, specific, and structured instructions for AI models to generate optimal results. Techniques include few-shot examples, chain-of-thought reasoning, role assignment, and iterative refinement. It has become an essential skill for professionals using AI tools in their daily workflow.',
    category: 'AI',
    categorySlug: 'ai-tools',
    relatedTerms: ['generative-ai', 'large-language-model', 'token'],
  },
  {
    term: 'Fine-tuning',
    slug: slugify('Fine-tuning'),
    definition: 'The process of further training a pre-trained AI model on a specific dataset to improve its performance for particular tasks or domains.',
    extendedDefinition: 'Fine-tuning takes a general-purpose AI model and specializes it using domain-specific data, improving accuracy for targeted use cases. This is more cost-effective than training from scratch and is commonly used by businesses to create custom AI solutions for their specific industry, terminology, and workflows.',
    category: 'AI',
    categorySlug: 'ai-tools',
    relatedTerms: ['large-language-model', 'rag-retrieval-augmented-generation', 'artificial-intelligence'],
  },
  {
    term: 'RAG (Retrieval-Augmented Generation)',
    slug: slugify('RAG Retrieval-Augmented Generation'),
    definition: 'An AI technique that combines information retrieval with text generation, allowing models to access external knowledge bases for more accurate responses.',
    extendedDefinition: 'RAG addresses the limitations of static AI models by dynamically retrieving relevant information from external databases or documents before generating a response. This reduces hallucinations, provides up-to-date information, and allows AI systems to reference proprietary company data without expensive model retraining.',
    category: 'AI',
    categorySlug: 'ai-tools',
    relatedTerms: ['large-language-model', 'fine-tuning', 'ai-agent'],
  },
  {
    term: 'Token',
    slug: slugify('Token'),
    definition: 'The basic unit of text processed by language models. A token can be a word, part of a word, or punctuation. API pricing is often based on token usage.',
    extendedDefinition: 'In AI language models, tokens are the fundamental building blocks of text processing. A single word might be one token, while complex words may be split into multiple tokens. Understanding tokenization is essential for managing API costs, as most AI providers (OpenAI, Anthropic, Google) charge per token processed.',
    category: 'AI',
    categorySlug: 'ai-tools',
    relatedLink: '/calculators/ai-cost',
    relatedLabel: 'AI Cost Calculator',
    relatedTerms: ['large-language-model', 'prompt-engineering', 'api-application-programming-interface'],
  },
  {
    term: 'AI Agent',
    slug: slugify('AI Agent'),
    definition: 'An autonomous AI system that can plan, execute tasks, use tools, and make decisions independently to achieve specified goals.',
    extendedDefinition: 'AI agents go beyond simple chatbots by autonomously planning multi-step workflows, using external tools and APIs, and adapting their approach based on results. They can browse the web, write code, manage files, and orchestrate complex business processes with minimal human oversight.',
    category: 'AI',
    categorySlug: 'ai-tools',
    relatedLink: '/best/ai-agents',
    relatedLabel: 'Best AI Agents',
    relatedTerms: ['artificial-intelligence', 'rag-retrieval-augmented-generation', 'generative-ai'],
  },

  // ─── SaaS Terms ─────────────────────────────────────────
  {
    term: 'SaaS (Software as a Service)',
    slug: slugify('SaaS Software as a Service'),
    definition: 'A software distribution model where applications are hosted in the cloud and accessed via the internet on a subscription basis, eliminating the need for local installation.',
    extendedDefinition: 'SaaS has become the dominant software delivery model, offering advantages like automatic updates, scalable pricing, and accessibility from any device. Popular SaaS categories include CRM, project management, accounting, and communication tools. The subscription model provides predictable costs and eliminates upfront licensing fees.',
    category: 'SaaS',
    categorySlug: 'saas',
    relatedLink: '/saas',
    relatedLabel: 'Browse SaaS Tools',
    relatedTerms: ['arr-annual-recurring-revenue', 'churn-rate', 'multi-tenancy'],
  },
  {
    term: 'CRM (Customer Relationship Management)',
    slug: slugify('CRM Customer Relationship Management'),
    definition: 'Software that helps businesses manage interactions with current and potential customers, tracking sales, communications, and support activities.',
    extendedDefinition: 'CRM systems centralize customer data, automate sales workflows, and provide analytics on customer interactions. Modern CRMs integrate with email, social media, and marketing tools to create a unified view of each customer. Leading platforms include Salesforce, HubSpot, and Pipedrive.',
    category: 'SaaS',
    categorySlug: 'saas',
    relatedLink: '/best/crm',
    relatedLabel: 'Best CRM Software',
    relatedTerms: ['saas-software-as-a-service', 'lead-scoring', 'marketing-automation'],
  },
  {
    term: 'ARR (Annual Recurring Revenue)',
    slug: slugify('ARR Annual Recurring Revenue'),
    definition: 'The annualized value of recurring subscription revenue. A key metric for SaaS businesses measuring predictable income streams.',
    extendedDefinition: 'ARR normalizes subscription revenue to an annual figure, making it easier to compare growth across different billing periods. It includes only recurring revenue (not one-time fees) and is the primary metric investors use to value SaaS companies. MRR (Monthly Recurring Revenue) is the monthly equivalent.',
    category: 'SaaS',
    categorySlug: 'saas',
    relatedLink: '/calculators/roi',
    relatedLabel: 'ROI Calculator',
    relatedTerms: ['saas-software-as-a-service', 'churn-rate', 'roi-return-on-investment'],
  },
  {
    term: 'Churn Rate',
    slug: slugify('Churn Rate'),
    definition: 'The percentage of customers who stop using a service during a given time period. Lower churn indicates better customer retention.',
    extendedDefinition: 'Churn rate is calculated by dividing the number of customers lost during a period by the total customers at the start. For SaaS companies, healthy monthly churn is typically under 5%, while best-in-class companies achieve under 2%. Reducing churn through improved onboarding, support, and feature development is often more cost-effective than acquiring new customers.',
    category: 'SaaS',
    categorySlug: 'saas',
    relatedTerms: ['saas-software-as-a-service', 'arr-annual-recurring-revenue', 'roi-return-on-investment'],
  },
  {
    term: 'Multi-tenancy',
    slug: slugify('Multi-tenancy'),
    definition: 'A software architecture where a single instance serves multiple customers (tenants), each with isolated data but sharing the same infrastructure.',
    extendedDefinition: 'Multi-tenant architecture is the backbone of most SaaS platforms, allowing providers to serve thousands of customers from shared infrastructure while keeping each customer\'s data completely separate and secure. This approach reduces costs and enables rapid feature deployment across all users simultaneously.',
    category: 'SaaS',
    categorySlug: 'saas',
    relatedTerms: ['saas-software-as-a-service', 'api-application-programming-interface', 'single-sign-on'],
  },
  {
    term: 'API (Application Programming Interface)',
    slug: slugify('API Application Programming Interface'),
    definition: 'A set of protocols and tools that allows different software applications to communicate with each other, enabling integrations and data exchange.',
    extendedDefinition: 'APIs are the connective tissue of modern software, allowing tools to share data and functionality seamlessly. REST APIs and GraphQL are the most common types. When evaluating SaaS tools, robust API availability is crucial for building custom integrations and automating workflows between different platforms.',
    category: 'SaaS',
    categorySlug: 'saas',
    relatedTerms: ['webhook', 'saas-software-as-a-service', 'workflow-automation'],
  },
  {
    term: 'Webhook',
    slug: slugify('Webhook'),
    definition: 'An automated message sent from one application to another when a specific event occurs, enabling real-time data synchronization between tools.',
    extendedDefinition: 'Unlike APIs where you poll for updates, webhooks push data automatically when events happen (e.g., a new order, a form submission). This makes integrations more efficient and real-time. Webhooks are essential for building automated workflows between SaaS tools like CRMs, payment processors, and communication platforms.',
    category: 'SaaS',
    categorySlug: 'saas',
    relatedTerms: ['api-application-programming-interface', 'workflow-automation', 'saas-software-as-a-service'],
  },
  {
    term: 'Single Sign-On (SSO)',
    slug: slugify('Single Sign-On'),
    definition: 'An authentication method that allows users to log in to multiple applications with a single set of credentials, improving security and user experience.',
    extendedDefinition: 'SSO reduces password fatigue and improves security by centralizing authentication through identity providers like Okta, Azure AD, or Google Workspace. For businesses evaluating SaaS tools, SSO support is often a requirement for enterprise plans and helps IT teams manage access across dozens of applications.',
    category: 'SaaS',
    categorySlug: 'saas',
    relatedTerms: ['saas-software-as-a-service', 'multi-tenancy', 'api-application-programming-interface'],
  },

  // ─── E-commerce Terms ───────────────────────────────────
  {
    term: 'E-commerce Platform',
    slug: slugify('E-commerce Platform'),
    definition: 'Software that enables businesses to build, manage, and operate online stores, handling product catalogs, shopping carts, checkout, and order management.',
    extendedDefinition: 'E-commerce platforms range from all-in-one solutions like Shopify to self-hosted options like WooCommerce. Key features to evaluate include payment processing, inventory management, SEO tools, mobile responsiveness, and third-party integrations. The right platform depends on your business size, technical expertise, and growth plans.',
    category: 'E-commerce',
    categorySlug: 'ecommerce',
    relatedLink: '/ecommerce',
    relatedLabel: 'Browse E-commerce Tools',
    relatedTerms: ['payment-gateway', 'headless-commerce', 'cart-abandonment'],
  },
  {
    term: 'Payment Gateway',
    slug: slugify('Payment Gateway'),
    definition: 'A service that processes credit card payments for online and traditional retail stores, securely transmitting transaction data between merchants and banks.',
    extendedDefinition: 'Payment gateways encrypt sensitive card data and facilitate authorization between the customer\'s bank and the merchant. Popular options include Stripe, PayPal, and Square. When choosing a gateway, consider transaction fees (typically 2.9% + $0.30), supported payment methods, international coverage, and PCI compliance.',
    category: 'E-commerce',
    categorySlug: 'ecommerce',
    relatedLink: '/best/payment-processing',
    relatedLabel: 'Best Payment Processing',
    relatedTerms: ['e-commerce-platform', 'cart-abandonment', 'aov-average-order-value'],
  },
  {
    term: 'Cart Abandonment',
    slug: slugify('Cart Abandonment'),
    definition: 'When a customer adds items to their online shopping cart but leaves the site without completing the purchase. Average abandonment rates are around 70%.',
    extendedDefinition: 'Cart abandonment costs e-commerce businesses billions annually. Common causes include unexpected shipping costs, complicated checkout processes, and account creation requirements. Effective recovery strategies include abandoned cart emails (which can recover 5-15% of lost sales), exit-intent popups, and streamlined one-page checkouts.',
    category: 'E-commerce',
    categorySlug: 'ecommerce',
    relatedLink: '/calculators/ecommerce-profit',
    relatedLabel: 'Profit Calculator',
    relatedTerms: ['e-commerce-platform', 'conversion-rate', 'aov-average-order-value'],
  },
  {
    term: 'Dropshipping',
    slug: slugify('Dropshipping'),
    definition: 'A retail fulfillment method where stores sell products without holding inventory. Orders are forwarded to suppliers who ship directly to customers.',
    extendedDefinition: 'Dropshipping lowers the barrier to entry for e-commerce by eliminating inventory costs and warehousing. However, it typically offers lower profit margins (10-30%) and less control over shipping times and product quality. Platforms like Shopify and WooCommerce integrate with dropshipping suppliers such as AliExpress, Spocket, and Printful.',
    category: 'E-commerce',
    categorySlug: 'ecommerce',
    relatedTerms: ['e-commerce-platform', 'sku-stock-keeping-unit', 'aov-average-order-value'],
  },
  {
    term: 'AOV (Average Order Value)',
    slug: slugify('AOV Average Order Value'),
    definition: 'The average amount spent per order. Calculated by dividing total revenue by the number of orders. A key metric for e-commerce optimization.',
    extendedDefinition: 'Increasing AOV is often more cost-effective than acquiring new customers. Common strategies include upselling, cross-selling, bundle deals, free shipping thresholds, and loyalty programs. Tracking AOV alongside conversion rate and customer lifetime value provides a complete picture of e-commerce performance.',
    category: 'E-commerce',
    categorySlug: 'ecommerce',
    relatedLink: '/calculators/ecommerce-profit',
    relatedLabel: 'Profit Calculator',
    relatedTerms: ['cart-abandonment', 'conversion-rate', 'e-commerce-platform'],
  },
  {
    term: 'SKU (Stock Keeping Unit)',
    slug: slugify('SKU Stock Keeping Unit'),
    definition: 'A unique identifier assigned to each product variant for inventory tracking purposes. Helps manage stock levels and fulfillment accuracy.',
    extendedDefinition: 'SKUs are alphanumeric codes that identify specific products, including attributes like size, color, and style. A well-organized SKU system streamlines inventory management, order fulfillment, and demand forecasting. Most e-commerce platforms and inventory management tools support custom SKU generation and tracking.',
    category: 'E-commerce',
    categorySlug: 'ecommerce',
    relatedTerms: ['e-commerce-platform', 'dropshipping', 'aov-average-order-value'],
  },
  {
    term: 'Headless Commerce',
    slug: slugify('Headless Commerce'),
    definition: 'An e-commerce architecture that separates the frontend presentation layer from the backend commerce functionality, enabling greater design flexibility.',
    extendedDefinition: 'Headless commerce allows businesses to use any frontend technology (React, Next.js, mobile apps) while connecting to commerce APIs for product data, cart, and checkout. This enables faster page loads, omnichannel experiences, and unique designs. Platforms like Shopify Hydrogen, BigCommerce, and Medusa support headless architecture.',
    category: 'E-commerce',
    categorySlug: 'ecommerce',
    relatedTerms: ['e-commerce-platform', 'api-application-programming-interface', 'serverless-computing'],
  },

  // ─── Marketing Terms ────────────────────────────────────
  {
    term: 'SEO (Search Engine Optimization)',
    slug: slugify('SEO Search Engine Optimization'),
    definition: 'The practice of optimizing websites and content to rank higher in search engine results, increasing organic (non-paid) traffic.',
    extendedDefinition: 'SEO encompasses on-page optimization (content, meta tags, headings), off-page factors (backlinks, brand mentions), and technical SEO (site speed, mobile-friendliness, structured data). With Google processing over 8.5 billion searches daily, SEO remains one of the highest-ROI marketing channels for businesses of all sizes.',
    category: 'Marketing',
    categorySlug: 'marketing',
    relatedLink: '/best/seo-tools',
    relatedLabel: 'Best SEO Tools',
    relatedTerms: ['ctr-click-through-rate', 'conversion-rate', 'content-marketing'],
  },
  {
    term: 'Email Marketing',
    slug: slugify('Email Marketing'),
    definition: 'A digital marketing strategy that uses email to promote products, build relationships, and drive conversions through targeted, personalized communications.',
    extendedDefinition: 'Email marketing consistently delivers the highest ROI of any digital marketing channel, averaging $36-42 for every $1 spent. Key components include list building, segmentation, automation sequences, A/B testing, and deliverability optimization. Leading platforms include Mailchimp, ConvertKit, and ActiveCampaign.',
    category: 'Marketing',
    categorySlug: 'marketing',
    relatedLink: '/best/email-marketing',
    relatedLabel: 'Best Email Marketing',
    relatedTerms: ['marketing-automation', 'conversion-rate', 'a-b-testing'],
  },
  {
    term: 'CTR (Click-Through Rate)',
    slug: slugify('CTR Click-Through Rate'),
    definition: 'The percentage of people who click on a link or ad out of the total who see it. A key metric for measuring engagement effectiveness.',
    extendedDefinition: 'CTR is calculated as (Clicks / Impressions) x 100. Average CTRs vary by channel: Google search ads average 3-5%, display ads 0.5-1%, and email campaigns 2-5%. Higher CTRs indicate more compelling headlines, relevant targeting, and effective calls-to-action. Improving CTR is one of the fastest ways to increase traffic without additional spend.',
    category: 'Marketing',
    categorySlug: 'marketing',
    relatedLink: '/calculators/email-marketing-roi',
    relatedLabel: 'Email ROI Calculator',
    relatedTerms: ['conversion-rate', 'seo-search-engine-optimization', 'a-b-testing'],
  },
  {
    term: 'Conversion Rate',
    slug: slugify('Conversion Rate'),
    definition: 'The percentage of visitors who complete a desired action (purchase, sign-up, download). Critical for measuring marketing and website effectiveness.',
    extendedDefinition: 'Conversion rate optimization (CRO) involves testing and improving landing pages, checkout flows, and calls-to-action. Average e-commerce conversion rates range from 2-4%, while top-performing sites achieve 5-10%. Factors affecting conversion include page speed, trust signals, pricing clarity, and mobile experience.',
    category: 'Marketing',
    categorySlug: 'marketing',
    relatedTerms: ['ctr-click-through-rate', 'a-b-testing', 'cart-abandonment'],
  },
  {
    term: 'Marketing Automation',
    slug: slugify('Marketing Automation'),
    definition: 'Software that automates repetitive marketing tasks like email sequences, social media posting, and lead nurturing, improving efficiency and personalization.',
    extendedDefinition: 'Marketing automation platforms enable businesses to create sophisticated multi-channel campaigns triggered by user behavior. Features typically include email drip campaigns, lead scoring, CRM integration, landing page builders, and analytics dashboards. Companies using automation see 53% higher conversion rates on average.',
    category: 'Marketing',
    categorySlug: 'marketing',
    relatedLink: '/best/marketing-automation',
    relatedLabel: 'Best Marketing Automation',
    relatedTerms: ['email-marketing', 'lead-scoring', 'crm-customer-relationship-management'],
  },
  {
    term: 'A/B Testing',
    slug: slugify('A/B Testing'),
    definition: 'A method of comparing two versions of a webpage, email, or ad to determine which performs better, using statistical analysis of user behavior.',
    extendedDefinition: 'A/B testing (split testing) randomly divides traffic between two variants and measures which achieves better results. Common elements to test include headlines, CTAs, images, pricing, and layouts. Statistical significance typically requires 1,000+ visitors per variant. Tools like Optimizely, VWO, and Google Optimize facilitate A/B testing.',
    category: 'Marketing',
    categorySlug: 'marketing',
    relatedTerms: ['conversion-rate', 'ctr-click-through-rate', 'marketing-automation'],
  },
  {
    term: 'Lead Scoring',
    slug: slugify('Lead Scoring'),
    definition: 'A methodology for ranking prospects based on their perceived value to the organization, helping sales teams prioritize outreach efforts.',
    extendedDefinition: 'Lead scoring assigns numerical values to leads based on demographic fit (company size, industry, job title) and behavioral signals (website visits, email opens, content downloads). Higher scores indicate sales-readiness. Effective lead scoring integrates CRM data with marketing automation to ensure sales teams focus on the most promising opportunities.',
    category: 'Marketing',
    categorySlug: 'marketing',
    relatedTerms: ['crm-customer-relationship-management', 'marketing-automation', 'conversion-rate'],
  },
  {
    term: 'Content Marketing',
    slug: slugify('Content Marketing'),
    definition: 'A strategy focused on creating and distributing valuable, relevant content to attract and retain a clearly defined audience and drive profitable actions.',
    extendedDefinition: 'Content marketing encompasses blog posts, videos, podcasts, infographics, and white papers designed to educate and engage potential customers. Unlike traditional advertising, it builds trust and authority over time. Companies with active content marketing programs generate 3x more leads than those without, at 62% lower cost.',
    category: 'Marketing',
    categorySlug: 'marketing',
    relatedLink: '/best/content-marketing',
    relatedLabel: 'Best Content Marketing',
    relatedTerms: ['seo-search-engine-optimization', 'email-marketing', 'conversion-rate'],
  },

  // ─── Hosting Terms ──────────────────────────────────────
  {
    term: 'Web Hosting',
    slug: slugify('Web Hosting'),
    definition: 'A service that provides the technologies and infrastructure needed for a website to be accessible on the internet, storing files on servers.',
    extendedDefinition: 'Web hosting options range from shared hosting ($3-10/mo) to dedicated servers ($100+/mo), with VPS and cloud hosting in between. Key factors include uptime guarantees, server speed, security features, backup policies, and customer support quality. The right hosting choice significantly impacts website performance and SEO rankings.',
    category: 'Hosting',
    categorySlug: 'hosting',
    relatedLink: '/hosting',
    relatedLabel: 'Browse Hosting Providers',
    relatedTerms: ['vps-virtual-private-server', 'cdn-content-delivery-network', 'ssl-certificate'],
  },
  {
    term: 'VPS (Virtual Private Server)',
    slug: slugify('VPS Virtual Private Server'),
    definition: 'A hosting solution that uses virtualization to provide dedicated server resources on a shared physical server, offering more control than shared hosting.',
    extendedDefinition: 'VPS hosting provides isolated CPU, RAM, and storage resources with root access for full server configuration. It bridges the gap between affordable shared hosting and expensive dedicated servers, typically costing $20-100/mo. VPS is ideal for growing websites, development environments, and applications requiring custom server configurations.',
    category: 'Hosting',
    categorySlug: 'hosting',
    relatedLink: '/best/vps-hosting',
    relatedLabel: 'Best VPS Hosting',
    relatedTerms: ['web-hosting', 'managed-hosting', 'serverless-computing'],
  },
  {
    term: 'CDN (Content Delivery Network)',
    slug: slugify('CDN Content Delivery Network'),
    definition: 'A geographically distributed network of servers that delivers web content to users from the nearest server location, reducing latency and load times.',
    extendedDefinition: 'CDNs cache static assets (images, CSS, JavaScript) across global edge servers, reducing the distance data travels to reach users. This improves page load times by 40-60%, enhances security through DDoS protection, and reduces origin server load. Leading CDN providers include Cloudflare, AWS CloudFront, and Fastly.',
    category: 'Hosting',
    categorySlug: 'hosting',
    relatedLink: '/best/cdn',
    relatedLabel: 'Best CDN Services',
    relatedTerms: ['web-hosting', 'ssl-certificate', 'uptime'],
  },
  {
    term: 'SSL Certificate',
    slug: slugify('SSL Certificate'),
    definition: 'A digital certificate that authenticates a website identity and enables an encrypted connection (HTTPS), essential for security and SEO ranking.',
    extendedDefinition: 'SSL (Secure Sockets Layer) certificates encrypt data transmitted between browsers and servers, protecting sensitive information like passwords and payment details. Google has made HTTPS a ranking factor, and browsers flag non-HTTPS sites as "Not Secure." Most hosting providers now include free SSL certificates via Let\'s Encrypt.',
    category: 'Hosting',
    categorySlug: 'hosting',
    relatedLink: '/calculators/hosting-cost',
    relatedLabel: 'Hosting Cost Calculator',
    relatedTerms: ['web-hosting', 'cdn-content-delivery-network', 'uptime'],
  },
  {
    term: 'Uptime',
    slug: slugify('Uptime'),
    definition: 'The percentage of time a server or website is operational and accessible. Industry standard targets 99.9% uptime (8.76 hours of downtime per year).',
    extendedDefinition: 'Uptime SLAs (Service Level Agreements) define guaranteed availability levels. 99.9% uptime allows ~8.7 hours downtime/year, while 99.99% allows only ~52 minutes. Hosting providers typically offer credits for SLA violations. Monitoring tools like UptimeRobot and Pingdom help track actual uptime performance.',
    category: 'Hosting',
    categorySlug: 'hosting',
    relatedTerms: ['web-hosting', 'managed-hosting', 'vps-virtual-private-server'],
  },
  {
    term: 'Managed Hosting',
    slug: slugify('Managed Hosting'),
    definition: 'A hosting service where the provider handles server management tasks including updates, security, backups, and performance optimization.',
    extendedDefinition: 'Managed hosting removes the technical burden of server administration, letting businesses focus on their core products. Providers handle OS updates, security patches, malware scanning, daily backups, and performance tuning. Popular managed WordPress hosts include WP Engine, Kinsta, and Flywheel, typically starting at $25-30/mo.',
    category: 'Hosting',
    categorySlug: 'hosting',
    relatedLink: '/best/wordpress-hosting',
    relatedLabel: 'Best WordPress Hosting',
    relatedTerms: ['web-hosting', 'vps-virtual-private-server', 'uptime'],
  },
  {
    term: 'Serverless Computing',
    slug: slugify('Serverless Computing'),
    definition: 'A cloud execution model where the provider dynamically manages server allocation. Users only pay for actual compute time, not idle capacity.',
    extendedDefinition: 'Serverless platforms like AWS Lambda, Vercel, and Cloudflare Workers automatically scale code execution based on demand, charging only for actual usage. This eliminates capacity planning and reduces costs for variable-traffic applications. Serverless is ideal for APIs, webhooks, scheduled tasks, and event-driven architectures.',
    category: 'Hosting',
    categorySlug: 'hosting',
    relatedTerms: ['web-hosting', 'cdn-content-delivery-network', 'headless-commerce'],
  },

  // ─── Business Terms ─────────────────────────────────────
  {
    term: 'ERP (Enterprise Resource Planning)',
    slug: slugify('ERP Enterprise Resource Planning'),
    definition: 'Integrated software that manages core business processes including finance, HR, manufacturing, supply chain, and procurement in a single system.',
    extendedDefinition: 'ERP systems provide a single source of truth for business data, eliminating data silos and improving cross-departmental visibility. Modern cloud ERP solutions (SAP S/4HANA, Oracle Cloud, NetSuite) offer modular deployments, allowing businesses to start with core finance and add modules as needed.',
    category: 'Business',
    categorySlug: 'business',
    relatedLink: '/business',
    relatedLabel: 'Browse Business Tools',
    relatedTerms: ['workflow-automation', 'business-intelligence', 'saas-software-as-a-service'],
  },
  {
    term: 'No-Code Platform',
    slug: slugify('No-Code Platform'),
    definition: 'Software development tools that allow users to create applications through visual interfaces and drag-and-drop builders without writing traditional code.',
    extendedDefinition: 'No-code platforms democratize software development, enabling non-technical users to build websites, mobile apps, workflows, and databases. Tools like Bubble, Webflow, and Airtable handle the underlying code automatically. The no-code market is growing 28% annually, enabling faster prototyping and reducing dependency on developers.',
    category: 'Business',
    categorySlug: 'business',
    relatedLink: '/best/no-code',
    relatedLabel: 'Best No-Code Platforms',
    relatedTerms: ['workflow-automation', 'api-application-programming-interface', 'digital-transformation'],
  },
  {
    term: 'Business Intelligence (BI)',
    slug: slugify('Business Intelligence'),
    definition: 'Technologies and practices for collecting, integrating, analyzing, and presenting business data to support better decision-making.',
    extendedDefinition: 'BI tools transform raw data into actionable insights through dashboards, reports, and visualizations. Key capabilities include data warehousing, ETL (Extract, Transform, Load), ad-hoc querying, and predictive analytics. Popular BI platforms include Tableau, Power BI, and Looker, helping organizations make data-driven decisions.',
    category: 'Business',
    categorySlug: 'business',
    relatedTerms: ['erp-enterprise-resource-planning', 'roi-return-on-investment', 'digital-transformation'],
  },
  {
    term: 'ROI (Return on Investment)',
    slug: slugify('ROI Return on Investment'),
    definition: 'A financial metric measuring the profitability of an investment. Calculated as (Net Profit / Cost of Investment) x 100. Essential for tool evaluation.',
    extendedDefinition: 'ROI helps businesses compare the profitability of different investments and justify technology spending. When evaluating software tools, consider both direct ROI (revenue increase, cost savings) and indirect benefits (time savings, error reduction, employee satisfaction). A positive ROI above 100% means the investment has paid for itself.',
    category: 'Business',
    categorySlug: 'business',
    relatedLink: '/calculators/roi',
    relatedLabel: 'ROI Calculator',
    relatedTerms: ['arr-annual-recurring-revenue', 'business-intelligence', 'workflow-automation'],
  },
  {
    term: 'Workflow Automation',
    slug: slugify('Workflow Automation'),
    definition: 'The use of technology to automate sequences of tasks that make up business processes, reducing manual effort and human error.',
    extendedDefinition: 'Workflow automation tools like Zapier, Make (Integromat), and n8n connect different software applications to create automated workflows triggered by specific events. Common automations include data entry, report generation, notification routing, and approval processes. Businesses using workflow automation report 30-50% time savings on repetitive tasks.',
    category: 'Business',
    categorySlug: 'business',
    relatedLink: '/calculators/team-productivity',
    relatedLabel: 'Productivity Calculator',
    relatedTerms: ['api-application-programming-interface', 'webhook', 'no-code-platform'],
  },
  {
    term: 'Digital Transformation',
    slug: slugify('Digital Transformation'),
    definition: 'The process of integrating digital technology into all areas of a business, fundamentally changing how operations are conducted and value is delivered.',
    extendedDefinition: 'Digital transformation goes beyond simply adopting new tools — it requires rethinking business processes, culture, and customer experiences through technology. Key pillars include cloud migration, data analytics, automation, and customer experience optimization. McKinsey reports that companies with successful digital transformations are 1.5x more likely to report revenue growth above 10%.',
    category: 'Business',
    categorySlug: 'business',
    relatedTerms: ['erp-enterprise-resource-planning', 'no-code-platform', 'workflow-automation'],
  },
];

/** Get a term by slug */
export function getGlossaryTermBySlug(slug: string): GlossaryTerm | undefined {
  return GLOSSARY_TERMS.find((t) => t.slug === slug);
}

/** Get all term slugs for generateStaticParams */
export function getAllGlossaryTermSlugs(): string[] {
  return GLOSSARY_TERMS.map((t) => t.slug);
}

/** Get related terms by slugs */
export function getRelatedGlossaryTerms(slugs: string[]): GlossaryTerm[] {
  return slugs
    .map((s) => GLOSSARY_TERMS.find((t) => t.slug === s))
    .filter((t): t is GlossaryTerm => t !== undefined);
}

/** Group terms by category */
export function groupTermsByCategory(terms: GlossaryTerm[]): Record<string, GlossaryTerm[]> {
  const groups: Record<string, GlossaryTerm[]> = {};
  terms.forEach((t) => {
    if (!groups[t.category]) groups[t.category] = [];
    groups[t.category].push(t);
  });
  return groups;
}

/** Group terms by first letter */
export function groupTermsByLetter(terms: GlossaryTerm[]): Record<string, GlossaryTerm[]> {
  const groups: Record<string, GlossaryTerm[]> = {};
  terms.forEach((t) => {
    const letter = t.term[0].toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(t);
  });
  return groups;
}

// ============================================================
// CROSS-LINKING MAPS — Glossary ↔ Calculators ↔ Categories
// Boosts internal link equity and topical authority signals
// ============================================================

/** Calculator → related glossary term slugs */
export const CALCULATOR_GLOSSARY_MAP: Record<string, string[]> = {
  'roi': ['roi-return-on-investment', 'arr-annual-recurring-revenue', 'churn-rate', 'saas-software-as-a-service'],
  'email-marketing-roi': ['email-marketing', 'ctr-click-through-rate', 'conversion-rate', 'marketing-automation', 'a-b-testing'],
  'hosting-cost': ['web-hosting', 'vps-virtual-private-server', 'cdn-content-delivery-network', 'ssl-certificate', 'managed-hosting'],
  'ecommerce-profit': ['e-commerce-platform', 'aov-average-order-value', 'cart-abandonment', 'payment-gateway', 'dropshipping'],
  'ai-cost': ['artificial-intelligence', 'large-language-model', 'token', 'generative-ai', 'ai-agent'],
  'team-productivity': ['workflow-automation', 'erp-enterprise-resource-planning', 'no-code-platform', 'digital-transformation', 'business-intelligence'],
};

/** Glossary category → related calculator slugs */
export const CATEGORY_CALCULATOR_MAP: Record<string, { slug: string; title: string }[]> = {
  'ai-tools': [{ slug: 'ai-cost', title: 'AI Cost Estimator' }],
  'saas': [{ slug: 'roi', title: 'SaaS ROI Calculator' }],
  'ecommerce': [{ slug: 'ecommerce-profit', title: 'Profit Margin Calculator' }],
  'marketing': [{ slug: 'email-marketing-roi', title: 'Email Marketing ROI Calculator' }],
  'hosting': [{ slug: 'hosting-cost', title: 'Hosting Cost Calculator' }],
  'business': [{ slug: 'team-productivity', title: 'Productivity Calculator' }, { slug: 'roi', title: 'ROI Calculator' }],
};

/** Get glossary terms for a calculator */
export function getGlossaryTermsForCalculator(calcSlug: string): GlossaryTerm[] {
  const slugs = CALCULATOR_GLOSSARY_MAP[calcSlug] || [];
  return slugs
    .map((s) => GLOSSARY_TERMS.find((t) => t.slug === s))
    .filter((t): t is GlossaryTerm => t !== undefined);
}

/** Get related calculators for a glossary term's category */
export function getCalculatorsForCategory(categorySlug: string): { slug: string; title: string }[] {
  return CATEGORY_CALCULATOR_MAP[categorySlug] || [];
}
