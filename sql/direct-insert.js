const { createClient } = require('@supabase/supabase-js');
const s = createClient(
  'https://gqqgbfoniyfbpbognnks.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcWdiZm9uaXlmYnBib2dubmtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2MTE5MiwiZXhwIjoyMDg4MTM3MTkyfQ.6oFu47JKMXsCIaD7vokhGc0AOlnqyn6Y-oExSy0pcDE'
);

const tools = [
  {
    name: 'Perplexity', slug: 'perplexity', category_slug: 'ai-tools', subcategory_slug: 'ai-research',
    tagline: 'AI-powered search engine that delivers direct answers with cited sources',
    description: 'Perplexity is an AI-powered search engine that combines large language models with real-time web search to deliver comprehensive, cited answers to complex questions. Unlike traditional search engines that return lists of links, Perplexity synthesizes information from multiple sources and presents clear, well-organized responses with inline citations. The platform supports follow-up questions for deeper exploration, making it ideal for research, fact-checking, and knowledge discovery. With features like Collections for organizing research threads and Pro Search for more thorough analysis, Perplexity has become a go-to tool for professionals, students, and curious minds who need accurate, up-to-date information quickly.',
    ratings_overall: 8.8, ratings_ease_of_use: 9.2, ratings_features: 8.6, ratings_value: 8.5, ratings_support: 8.0, review_count: 847,
    pricing: {hasFreeplan: true, startingPrice: 20, currency: 'USD', plans: [{name:'Free',price:0,billingCycle:'monthly',features:['5 Pro searches/day','Standard AI model','Basic citations']},{name:'Pro',price:20,billingCycle:'monthly',features:['Unlimited Pro searches','GPT-4 & Claude access','File upload','API access'],isPopular:true}]},
    features: {hasApi: true, aiModel: 'Multi-model', citations: true, fileUpload: true, mobileApp: true},
    pros_cons_content: '<div class="pros"><ul><li>Accurate, well-cited answers from multiple sources</li><li>Real-time web search integration</li><li>Clean, intuitive interface</li><li>Multi-model support (GPT-4, Claude)</li></ul></div><div class="cons"><ul><li>Free tier limited to 5 Pro searches/day</li><li>Can occasionally hallucinate despite citations</li></ul></div>',
    use_cases_content: '<p>Perplexity excels for academic research, competitive analysis, fact-checking claims, and staying current on rapidly evolving topics.</p>',
    best_for_content: '<p>Best for researchers, students, journalists, and knowledge workers who need fast, accurate, cited answers.</p>',
    status: 'published'
  },
  {
    name: 'Windsurf', slug: 'windsurf', category_slug: 'ai-tools', subcategory_slug: 'ai-coding',
    tagline: 'AI-powered IDE with deep codebase understanding for intelligent coding assistance',
    description: 'Windsurf is an AI-powered integrated development environment that provides intelligent code completion, generation, and refactoring capabilities. It stands out by deeply understanding your entire codebase context, enabling more accurate and relevant suggestions than generic AI assistants. With features like Cascade for multi-file editing, Flows for complex task automation, and deep repository understanding, Windsurf transforms the coding experience from simple autocomplete to intelligent pair programming. The IDE supports dozens of programming languages and integrates seamlessly into existing development workflows, making it a powerful choice for both individual developers and engineering teams looking to boost productivity.',
    ratings_overall: 8.5, ratings_ease_of_use: 8.8, ratings_features: 8.7, ratings_value: 8.3, ratings_support: 7.8, review_count: 523,
    pricing: {hasFreeplan: true, startingPrice: 10, currency: 'USD', plans: [{name:'Free',price:0,billingCycle:'monthly',features:['Basic autocomplete','Limited AI generations']},{name:'Pro',price:10,billingCycle:'monthly',features:['Unlimited AI generations','Cascade multi-file edit','Priority models'],isPopular:true}]},
    features: {multiFileEdit: true, codebaseAwareness: true, languageSupport: '50+', vscodeIntegration: true},
    pros_cons_content: '<div class="pros"><ul><li>Deep codebase understanding for better suggestions</li><li>Cascade multi-file editing is powerful</li><li>Generous free tier</li></ul></div><div class="cons"><ul><li>Newer entrant, still maturing</li><li>Some advanced features behind paywall</li></ul></div>',
    use_cases_content: '<p>Ideal for full-stack development, large codebase refactoring, rapid prototyping, and teams looking to boost developer productivity.</p>',
    best_for_content: '<p>Best for developers who want deep codebase-aware AI assistance beyond simple autocomplete.</p>',
    status: 'published'
  },
  {
    name: 'Bolt.new', slug: 'bolt-new', category_slug: 'ai-tools', subcategory_slug: 'ai-coding',
    tagline: 'AI-powered full-stack web development environment in your browser',
    description: 'Bolt.new is a revolutionary AI-powered development platform by StackBlitz that enables users to build, run, and deploy full-stack web applications entirely in the browser. Powered by advanced AI models, Bolt.new can generate complete applications from natural language prompts, including frontend components, backend logic, database schemas, and deployment configurations. The platform uses WebContainers technology to run Node.js directly in the browser, eliminating the need for local development setups. Whether you are prototyping a SaaS application or building internal tools, Bolt.new dramatically accelerates development from concept to deployed application in minutes rather than days.',
    ratings_overall: 8.3, ratings_ease_of_use: 9.0, ratings_features: 8.4, ratings_value: 8.0, ratings_support: 7.5, review_count: 412,
    pricing: {hasFreeplan: true, startingPrice: 20, currency: 'USD', plans: [{name:'Free',price:0,billingCycle:'monthly',features:['Limited tokens/day','Basic projects']},{name:'Pro',price:20,billingCycle:'monthly',features:['More tokens','Priority AI','GitHub sync'],isPopular:true}]},
    features: {browserBased: true, fullStackGeneration: true, deployment: true, gitHubSync: true},
    pros_cons_content: '<div class="pros"><ul><li>Generate full-stack apps from prompts</li><li>No local setup needed</li><li>Instant preview and deployment</li></ul></div><div class="cons"><ul><li>Token limits on free tier</li><li>Complex apps may need refinement</li></ul></div>',
    use_cases_content: '<p>Perfect for rapid prototyping, building MVPs, and going from idea to deployed app in minutes.</p>',
    best_for_content: '<p>Best for developers and founders who want to quickly prototype and deploy web applications using AI.</p>',
    status: 'published'
  },
  {
    name: 'v0 by Vercel', slug: 'v0-by-vercel', category_slug: 'ai-tools', subcategory_slug: 'ai-design',
    tagline: 'AI-powered UI generation tool that creates React components from text descriptions',
    description: 'v0 by Vercel is an AI-powered generative UI tool that creates production-ready React components and full page layouts from natural language descriptions. Built by the team behind Next.js, v0 generates clean, accessible code using shadcn/ui components and Tailwind CSS. The platform excels at creating modern web interfaces including dashboards, landing pages, forms, and interactive components. Each generation produces multiple design variations that can be refined through conversation. The generated code is clean, well-structured, and ready to copy into any React/Next.js project, making it invaluable for rapidly prototyping interfaces and accelerating frontend development workflows.',
    ratings_overall: 8.6, ratings_ease_of_use: 9.3, ratings_features: 8.4, ratings_value: 8.2, ratings_support: 8.0, review_count: 634,
    pricing: {hasFreeplan: true, startingPrice: 20, currency: 'USD', plans: [{name:'Free',price:0,billingCycle:'monthly',features:['200 credits/month','Basic generations']},{name:'Premium',price:20,billingCycle:'monthly',features:['Unlimited generations','Priority queue'],isPopular:true}]},
    features: {reactComponents: true, tailwindCSS: true, shadcnUI: true, codeExport: true, responsiveDesign: true},
    pros_cons_content: '<div class="pros"><ul><li>Generates production-ready React components</li><li>Beautiful designs with shadcn/ui</li><li>Easy conversational refinement</li></ul></div><div class="cons"><ul><li>Limited to React/Next.js ecosystem</li><li>Free tier has credit limits</li></ul></div>',
    use_cases_content: '<p>Ideal for rapidly prototyping UI components, creating landing pages, and building admin dashboards in React projects.</p>',
    best_for_content: '<p>Best for React developers who want to quickly generate professional UI components from text descriptions.</p>',
    status: 'published'
  },
  {
    name: 'Lovable', slug: 'lovable', category_slug: 'ai-tools', subcategory_slug: 'ai-coding',
    tagline: 'AI full-stack engineer that builds production-ready web apps from prompts',
    description: 'Lovable (formerly GPT Engineer) is an AI-powered platform that acts as a full-stack software engineer, capable of building complete web applications from natural language descriptions. The platform handles everything from UI design to backend logic, database setup, authentication, and deployment. What sets Lovable apart is its ability to create truly production-ready applications with proper architecture, error handling, and best practices. Users can iterate through conversation, adding features and fixing bugs without writing code. With built-in Supabase integration and one-click deployment, Lovable bridges the gap between idea and production application for entrepreneurs, designers, and developers alike.',
    ratings_overall: 8.4, ratings_ease_of_use: 9.1, ratings_features: 8.5, ratings_value: 7.8, ratings_support: 7.6, review_count: 389,
    pricing: {hasFreeplan: true, startingPrice: 20, currency: 'USD', plans: [{name:'Free',price:0,billingCycle:'monthly',features:['5 generations/day','Basic projects']},{name:'Starter',price:20,billingCycle:'monthly',features:['More generations','GitHub export'],isPopular:true}]},
    features: {fullStackGeneration: true, supabaseIntegration: true, authentication: true, deployment: true},
    pros_cons_content: '<div class="pros"><ul><li>Generates complete production-ready applications</li><li>Built-in Supabase backend integration</li><li>Iterative development through conversation</li></ul></div><div class="cons"><ul><li>Free tier quite limited</li><li>Complex apps may need developer refinement</li></ul></div>',
    use_cases_content: '<p>Perfect for building MVPs, internal tools, SaaS prototypes, and web applications without deep coding knowledge.</p>',
    best_for_content: '<p>Best for entrepreneurs and developers who want to rapidly build web applications using AI.</p>',
    status: 'published'
  },
  {
    name: 'Coolify', slug: 'coolify', category_slug: 'hosting', subcategory_slug: 'cloud-hosting',
    tagline: 'Open-source self-hosted alternative to Heroku, Netlify, and Vercel',
    description: 'Coolify is an open-source, self-hostable platform that serves as an alternative to cloud services like Heroku, Netlify, and Vercel. It allows developers to deploy applications, databases, and services on their own servers with a simple, intuitive interface. Coolify supports Docker-based deployments, automatic SSL certificates, one-click database provisioning (PostgreSQL, MySQL, Redis, MongoDB), and Git-based continuous deployment. The platform handles reverse proxying, monitoring, and backups automatically, making self-hosting accessible even for developers who prefer not to manage infrastructure manually. Teams can maintain full control over their data and infrastructure while enjoying a modern deployment experience.',
    ratings_overall: 8.2, ratings_ease_of_use: 7.8, ratings_features: 8.5, ratings_value: 9.3, ratings_support: 7.5, review_count: 312,
    pricing: {hasFreeplan: true, startingPrice: 5, currency: 'USD', plans: [{name:'Self-Hosted',price:0,billingCycle:'monthly',features:['Unlimited apps','All features','Your own server']},{name:'Cloud',price:5,billingCycle:'monthly',features:['Managed hosting','Automatic backups'],isPopular:true}]},
    features: {openSource: true, dockerSupport: true, autoSSL: true, gitDeployment: true, databaseProvisioning: true},
    pros_cons_content: '<div class="pros"><ul><li>Open-source and self-hostable</li><li>Excellent value on your own servers</li><li>One-click database provisioning</li></ul></div><div class="cons"><ul><li>Requires your own server</li><li>Steeper learning curve than managed services</li></ul></div>',
    use_cases_content: '<p>Ideal for developers wanting PaaS convenience with self-hosting control, cost-conscious startups, and privacy-focused deployments.</p>',
    best_for_content: '<p>Best for developers who want Heroku-like convenience on their own infrastructure.</p>',
    status: 'published'
  },
  {
    name: 'Notion Calendar', slug: 'notion-calendar', category_slug: 'business', subcategory_slug: 'scheduling',
    tagline: 'Time management app that integrates deeply with Notion workspaces',
    description: 'Notion Calendar (formerly Cron) is a modern calendar application designed for professionals who use Notion for their productivity workflow. It provides a beautiful, fast interface for managing schedules while deeply integrating with Notion databases, pages, and projects. Users can link calendar events directly to Notion pages, view tasks and deadlines alongside meetings, and share availability through built-in scheduling links. The calendar supports multiple calendar accounts (Google, Outlook), provides keyboard shortcuts for power users, and offers a mobile app for on-the-go scheduling. For Notion users, it creates a seamless bridge between time management and project management.',
    ratings_overall: 8.1, ratings_ease_of_use: 8.8, ratings_features: 7.9, ratings_value: 8.5, ratings_support: 7.6, review_count: 278,
    pricing: {hasFreeplan: true, startingPrice: 0, currency: 'USD', plans: [{name:'Free',price:0,billingCycle:'monthly',features:['Unlimited calendars','Notion integration','Scheduling links','Mobile app']}]},
    features: {notionIntegration: true, multiCalendar: true, schedulingLinks: true, mobileApp: true},
    pros_cons_content: '<div class="pros"><ul><li>Beautiful, fast calendar interface</li><li>Deep Notion workspace integration</li><li>Built-in scheduling links</li><li>Completely free</li></ul></div><div class="cons"><ul><li>Most valuable with Notion</li><li>Fewer integrations than Calendly</li></ul></div>',
    use_cases_content: '<p>Perfect for Notion power users who want unified time and project management.</p>',
    best_for_content: '<p>Best for Notion users who want a beautiful, integrated calendar experience at no cost.</p>',
    status: 'published'
  },
  {
    name: 'Beehiiv', slug: 'beehiiv', category_slug: 'marketing', subcategory_slug: 'email-marketing',
    tagline: 'Newsletter platform built for growth with monetization and referral tools',
    description: 'Beehiiv is a newsletter platform designed specifically for content creators and media companies who want to grow and monetize their audience. Founded by early Morning Brew employees, Beehiiv combines powerful email delivery with growth tools like referral programs, recommendation networks, and A/B testing. The platform offers a clean writing experience with a block-based editor, audience segmentation, detailed analytics, and built-in monetization through ads and premium subscriptions. What sets Beehiiv apart is its focus on newsletter-specific features like subscriber acquisition widgets, boost recommendations between newsletters, and revenue attribution. It has quickly become the platform of choice for independent writers building sustainable newsletter businesses.',
    ratings_overall: 8.7, ratings_ease_of_use: 8.9, ratings_features: 8.8, ratings_value: 8.5, ratings_support: 8.2, review_count: 456,
    pricing: {hasFreeplan: true, startingPrice: 49, currency: 'USD', plans: [{name:'Launch',price:0,billingCycle:'monthly',features:['Up to 2,500 subscribers','Custom domain','Referral program']},{name:'Scale',price:49,billingCycle:'monthly',features:['Up to 100K subscribers','Ad network','A/B testing','API access'],isPopular:true}]},
    features: {referralProgram: true, adNetwork: true, premiumSubscriptions: true, customDomain: true, abTesting: true},
    pros_cons_content: '<div class="pros"><ul><li>Built-in referral program for growth</li><li>Monetization through ads and subscriptions</li><li>Generous free tier (2,500 subscribers)</li></ul></div><div class="cons"><ul><li>Less suitable for traditional email marketing</li><li>Limited automation compared to Mailchimp</li></ul></div>',
    use_cases_content: '<p>Ideal for newsletter creators, media companies, and content entrepreneurs building audience through email.</p>',
    best_for_content: '<p>Best for newsletter creators who want growth tools and monetization built in from day one.</p>',
    status: 'published'
  },
  {
    name: 'Lemon Squeezy', slug: 'lemon-squeezy', category_slug: 'ecommerce', subcategory_slug: 'payment-processing',
    tagline: 'All-in-one platform for selling digital products with built-in tax compliance',
    description: 'Lemon Squeezy is a merchant of record platform designed specifically for selling digital products, subscriptions, and SaaS. Unlike traditional payment processors, Lemon Squeezy handles global tax compliance, fraud prevention, and payment processing as your merchant of record, meaning they handle international sales tax, VAT, and GST on your behalf. The platform provides customizable checkout pages, subscription management, license key generation, affiliate programs, and detailed analytics. For indie hackers, SaaS founders, and digital creators, Lemon Squeezy eliminates the need for separate tools for payments, taxes, and billing management. The developer-friendly API makes it easy to integrate into any application.',
    ratings_overall: 8.4, ratings_ease_of_use: 9.0, ratings_features: 8.2, ratings_value: 8.3, ratings_support: 8.1, review_count: 367,
    pricing: {hasFreeplan: true, startingPrice: 0, currency: 'USD', plans: [{name:'Free',price:0,billingCycle:'monthly',features:['No monthly fees','5% + 50c per transaction','Unlimited products','Tax compliance']},{name:'Growth',price:0,billingCycle:'monthly',features:['3.5% + 50c per transaction','Custom domain','Priority support']}]},
    features: {merchantOfRecord: true, globalTaxCompliance: true, subscriptionManagement: true, licenseKeys: true, affiliateProgram: true},
    pros_cons_content: '<div class="pros"><ul><li>Handles all global tax compliance</li><li>No monthly fees</li><li>Beautiful checkout experience</li></ul></div><div class="cons"><ul><li>Higher per-transaction fees than Stripe</li><li>Primarily for digital products</li></ul></div>',
    use_cases_content: '<p>Perfect for SaaS products, digital downloads, online courses, and software licenses.</p>',
    best_for_content: '<p>Best for indie hackers and SaaS founders who want hassle-free global selling.</p>',
    status: 'published'
  },
  {
    name: 'Plane', slug: 'plane', category_slug: 'saas', subcategory_slug: 'project-management',
    tagline: 'Open-source project management tool as an alternative to Jira and Linear',
    description: 'Plane is an open-source project management and issue tracking tool designed as a modern alternative to Jira and Linear. It offers a clean, intuitive interface for managing projects with features including issues, cycles (sprints), modules, views, and pages. Plane supports multiple project views including list, board (kanban), spreadsheet, and Gantt chart, catering to different team workflows. The platform includes built-in documentation through Pages, making it a unified workspace for planning and documenting projects. As an open-source solution, Plane can be self-hosted for complete data control, or used as a managed cloud service. It supports GitHub and GitLab integrations and detailed analytics.',
    ratings_overall: 8.1, ratings_ease_of_use: 8.5, ratings_features: 8.3, ratings_value: 9.0, ratings_support: 7.4, review_count: 298,
    pricing: {hasFreeplan: true, startingPrice: 7, currency: 'USD', plans: [{name:'Free',price:0,billingCycle:'monthly',features:['Unlimited members','Unlimited projects','5GB storage']},{name:'Pro',price:7,billingCycle:'monthly',features:['Unlimited storage','Advanced analytics','Custom workflows'],isPopular:true}]},
    features: {openSource: true, selfHosted: true, kanbanBoard: true, ganttChart: true, builtInDocs: true},
    pros_cons_content: '<div class="pros"><ul><li>Open-source with self-hosting option</li><li>Clean, modern interface</li><li>Built-in documentation</li><li>Generous free tier</li></ul></div><div class="cons"><ul><li>Younger platform, still adding features</li><li>Smaller ecosystem than Jira</li></ul></div>',
    use_cases_content: '<p>Ideal for engineering teams wanting a modern, privacy-first project management tool and startups looking for Jira alternatives.</p>',
    best_for_content: '<p>Best for development teams who want a clean, open-source alternative to Jira with self-hosting capabilities.</p>',
    status: 'published'
  },
];

async function run() {
  let success = 0, dupes = 0, errors = 0;
  for (const tool of tools) {
    const { error } = await s.from('tools').insert(tool);
    if (error) {
      if (error.code === '23505') { dupes++; process.stdout.write('D'); }
      else { errors++; console.error('\n' + tool.slug + ':', error.message); }
    } else { success++; process.stdout.write('.'); }
  }
  console.log('\nSuccess:', success, 'Dupes:', dupes, 'Errors:', errors);
  const {count} = await s.from('tools').select('id', {count:'exact', head:true});
  console.log('Total tools:', count);
}
run();
