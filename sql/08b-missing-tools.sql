-- =====================================================
-- 08b-missing-tools.sql
-- 6 missing tools needed for comparison pages
-- Generated 2026-03-04
-- =====================================================

-- =====================================================
-- SaaS Category
-- =====================================================

-- 1. Monday.com (Project Management)
INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, description, logo_url, website_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, pros_cons_content, use_cases_content, best_for_content, meta_title, meta_description, status)
VALUES (
  'monday',
  'Monday.com',
  'saas',
  'project-management',
  'The Work OS that powers teams to run projects and workflows with confidence',
  'Monday.com is a versatile Work Operating System (Work OS) that enables teams to build custom workflows for project management, CRM, software development, marketing, and more. Its highly visual interface uses color-coded boards, timelines, Gantt charts, and Kanban views to keep everyone aligned. With over 200 integrations, powerful automations, and a no-code app builder, Monday.com adapts to virtually any team workflow. The platform serves over 225,000 customers worldwide, from small startups to enterprise organizations like Canva, Coca-Cola, and Universal Music Group.',
  null,
  'https://monday.com',
  '{"hasFreePlan":true,"freeTrialDays":14,"startingPrice":9.00,"currency":"USD","plans":[{"name":"Free","price":0,"period":"monthly","features":["Up to 2 seats","3 boards","Unlimited docs"]},{"name":"Basic","price":9.00,"period":"monthly","features":["Unlimited items","5 GB storage","Prioritized support"]},{"name":"Standard","price":12.00,"period":"monthly","features":["Timeline & Gantt views","Automations (250/month)","Integrations (250/month)"]},{"name":"Pro","price":19.00,"period":"monthly","features":["Private boards","Time tracking","Formula column"]},{"name":"Enterprise","price":null,"period":"monthly","features":["Enterprise automation","Advanced reporting","Multi-level permissions"]}]}',
  '["Customizable boards & workflows","Timeline & Gantt chart views","Kanban boards","Automations & integrations","Dashboards & reporting","Time tracking","Workload management","No-code app builder"]',
  8.6, 9.0, 8.5, 8.2, 8.3, 12450,
  '<div class="pros-cons"><div class="pros"><h4>Pros</h4><ul><li>Highly visual and intuitive interface that requires minimal training for new team members</li><li>Extremely flexible platform that adapts to project management, CRM, HR, and dozens of other use cases</li><li>Powerful no-code automations save hours of repetitive work each week</li></ul></div><div class="cons"><h4>Cons</h4><ul><li>Pricing is per-seat and requires a minimum of 3 seats on paid plans, which adds up quickly</li><li>Automations and integrations are capped by monthly action limits on Standard and Pro plans</li><li>Can feel overwhelming due to the sheer number of features and customization options available</li></ul></div></div>',
  '<div class="use-cases"><h4>Use Cases</h4><ul><li><strong>Marketing Teams:</strong> Plan campaigns, manage content calendars, and track creative assets from ideation to launch.</li><li><strong>Software Development:</strong> Run agile sprints with Kanban boards, bug tracking, and GitHub/GitLab integrations.</li><li><strong>PMOs & Operations:</strong> Build portfolio dashboards that aggregate data across dozens of project boards for executive visibility.</li><li><strong>Client Services:</strong> Manage client projects, track billable hours, and share progress updates with external stakeholders via guest access.</li></ul></div>',
  '<div class="best-for"><p>Monday.com is best for mid-sized teams and growing organizations that need a flexible, visual project management platform capable of adapting to multiple departments and workflows. It''s particularly strong for teams that want to consolidate several tools into one customizable Work OS without writing any code.</p></div>',
  'Monday.com Review 2026: Features, Pricing & Alternatives',
  'Read our in-depth Monday.com review for 2026. Explore Work OS features, pricing plans, pros & cons, and how it compares to Asana, ClickUp, and other project management tools.',
  'published'
);

-- 2. Zendesk (Helpdesk)
INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, description, logo_url, website_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, pros_cons_content, use_cases_content, best_for_content, meta_title, meta_description, status)
VALUES (
  'zendesk',
  'Zendesk',
  'saas',
  'helpdesk',
  'The complete customer service solution for growing and enterprise businesses',
  'Zendesk is an industry-leading customer service and engagement platform used by over 160,000 businesses worldwide. It offers a comprehensive suite of tools including ticketing, live chat, voice, email, social messaging, and a self-service help center, all unified in a single agent workspace. With advanced AI capabilities, powerful workflow automations, and an extensive marketplace of 1,500+ integrations, Zendesk scales from startup support desks to enterprise-grade customer experience operations. The platform is trusted by companies like Uber, Airbnb, Slack, and Shopify.',
  null,
  'https://www.zendesk.com',
  '{"hasFreePlan":false,"freeTrialDays":14,"startingPrice":19.00,"currency":"USD","plans":[{"name":"Support Team","price":19.00,"period":"monthly","features":["Ticketing system","Email & social channels","Business rules"]},{"name":"Support Professional","price":55.00,"period":"monthly","features":["Multilingual support","SLA management","CSAT surveys"]},{"name":"Support Enterprise","price":115.00,"period":"monthly","features":["Custom agent roles","Sandbox environment","Advanced AI"]},{"name":"Suite Professional","price":115.00,"period":"monthly","features":["All channels","AI agents","Advanced analytics"]}]}',
  '["Omnichannel ticketing","AI-powered agent workspace","Live chat & messaging","Help center & knowledge base","Advanced workflow automation","Analytics & reporting","1,500+ marketplace integrations","Customer satisfaction surveys"]',
  8.5, 7.9, 9.0, 7.6, 8.1, 15200,
  '<div class="pros-cons"><div class="pros"><h4>Pros</h4><ul><li>Industry-leading omnichannel support that unifies email, chat, phone, and social into one agent workspace</li><li>Massive integration marketplace with 1,500+ apps covering virtually every business tool</li><li>Highly scalable platform that grows from small teams to enterprise-grade operations seamlessly</li></ul></div><div class="cons"><h4>Cons</h4><ul><li>Pricing is significantly higher than competitors, especially for the full Suite plans with all channels</li><li>Initial setup and configuration can be complex and often requires dedicated admin resources</li><li>Per-agent pricing model becomes very expensive as support teams scale beyond 20-30 agents</li></ul></div></div>',
  '<div class="use-cases"><h4>Use Cases</h4><ul><li><strong>Enterprise Support Operations:</strong> Manage thousands of daily tickets across email, chat, phone, and social from a unified agent workspace.</li><li><strong>E-commerce Customer Service:</strong> Resolve order inquiries, returns, and complaints quickly with Shopify and WooCommerce integrations.</li><li><strong>SaaS Companies:</strong> Provide tiered support with SLA management and escalation workflows for different customer segments.</li><li><strong>Global Organizations:</strong> Deliver multilingual support with dynamic content translations and locale-based routing rules.</li></ul></div>',
  '<div class="best-for"><p>Zendesk is best for mid-sized to enterprise businesses that need a comprehensive, omnichannel customer service platform with advanced automation and analytics. It''s the top choice for organizations that prioritize a unified agent experience and require deep integrations with their existing tech stack.</p></div>',
  'Zendesk Review 2026: Features, Pricing & Alternatives',
  'Read our comprehensive Zendesk review for 2026. Explore ticketing features, pricing plans, pros & cons, and how it compares to Freshdesk, Intercom, and other helpdesk tools.',
  'published'
);

-- 3. Freshdesk (Helpdesk)
INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, description, logo_url, website_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, pros_cons_content, use_cases_content, best_for_content, meta_title, meta_description, status)
VALUES (
  'freshdesk',
  'Freshdesk',
  'saas',
  'helpdesk',
  'Effortless customer support with intuitive helpdesk software',
  'Freshdesk by Freshworks is a cloud-based customer support platform that helps businesses deliver exceptional service across email, phone, chat, social media, and messaging apps. Known for its intuitive interface and affordable pricing, Freshdesk offers robust ticketing, automation, self-service portals, and AI-powered features through its Freddy AI engine. The platform supports over 60,000 businesses of all sizes including Honda, Bridgestone, Hugo Boss, and Pearson, making it one of the most popular alternatives to Zendesk in the helpdesk market.',
  null,
  'https://www.freshdesk.com',
  '{"hasFreePlan":true,"freeTrialDays":14,"startingPrice":15.00,"currency":"USD","plans":[{"name":"Free","price":0,"period":"monthly","features":["Up to 10 agents","Email & social ticketing","Knowledge base"]},{"name":"Growth","price":15.00,"period":"monthly","features":["Automations","SLA management","Marketplace apps"]},{"name":"Pro","price":49.00,"period":"monthly","features":["Round-robin routing","CSAT surveys","Custom reports"]},{"name":"Enterprise","price":79.00,"period":"monthly","features":["Sandbox","Audit log","Skill-based routing"]}]}',
  '["Multi-channel ticketing","Freddy AI assistant","Self-service portal","SLA management","Automations & workflows","Collision detection","Satisfaction surveys","Team collaboration tools"]',
  8.3, 8.7, 8.2, 8.8, 8.0, 9870,
  '<div class="pros-cons"><div class="pros"><h4>Pros</h4><ul><li>Generous free plan supports up to 10 agents with email and social ticketing included</li><li>Intuitive, clean interface that support agents can learn and start using within hours</li><li>Excellent value for money with paid plans starting at just $15 per agent per month</li></ul></div><div class="cons"><h4>Cons</h4><ul><li>Advanced features like custom roles and sandbox environments are locked to the Enterprise tier</li><li>Reporting and analytics capabilities feel limited compared to Zendesk on lower-tier plans</li><li>Omnichannel features like phone and chat require separate Freshcaller and Freshchat add-ons</li></ul></div></div>',
  '<div class="use-cases"><h4>Use Cases</h4><ul><li><strong>Small Business Support:</strong> Set up a professional helpdesk with email, social, and knowledge base support on the free plan.</li><li><strong>Growing Teams:</strong> Automate ticket routing, escalations, and SLA tracking as support volume increases.</li><li><strong>IT Service Management:</strong> Handle internal IT requests and incidents with asset management and approval workflows.</li><li><strong>E-commerce Support:</strong> Manage order-related queries across email and social media with Shopify and WooCommerce integrations.</li></ul></div>',
  '<div class="best-for"><p>Freshdesk is best for small to mid-sized businesses that want a feature-rich helpdesk platform without the premium price tag of Zendesk. It''s ideal for teams that value ease of use and quick setup, and for organizations looking for a generous free tier to get started with professional customer support.</p></div>',
  'Freshdesk Review 2026: Features, Pricing & Alternatives',
  'Explore our detailed Freshdesk review for 2026. Compare features, pricing, Freddy AI capabilities, and see how it stacks up against Zendesk and other helpdesk solutions.',
  'published'
);

-- =====================================================
-- Marketing Category
-- =====================================================

-- 4. ActiveCampaign (Email Marketing)
INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, description, logo_url, website_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, pros_cons_content, use_cases_content, best_for_content, meta_title, meta_description, status)
VALUES (
  'activecampaign',
  'ActiveCampaign',
  'marketing',
  'email-marketing',
  'The email marketing and automation platform built for customer experience',
  'ActiveCampaign is an advanced email marketing, marketing automation, and CRM platform trusted by over 185,000 businesses in 170 countries. It stands out for its exceptionally powerful automation builder that enables sophisticated multi-step, conditional workflows far beyond basic email sequences. The platform combines email marketing, site tracking, lead scoring, SMS, landing pages, and a built-in CRM to create a unified customer experience engine. ActiveCampaign consistently ranks among the top-rated marketing automation tools for its depth of features and deliverability rates.',
  null,
  'https://www.activecampaign.com',
  '{"hasFreePlan":false,"freeTrialDays":14,"startingPrice":29.00,"currency":"USD","plans":[{"name":"Starter","price":29.00,"period":"monthly","features":["1 user","Email marketing","Marketing automation","Inline forms"]},{"name":"Plus","price":49.00,"period":"monthly","features":["3 users","CRM & sales automation","Landing pages","Lead scoring"]},{"name":"Pro","price":149.00,"period":"monthly","features":["5 users","Predictive sending","Split automations","Attribution reporting"]},{"name":"Enterprise","price":259.00,"period":"monthly","features":["10 users","Custom reporting","Dedicated account rep","Uptime SLA"]}]}',
  '["Advanced automation builder","Email marketing & templates","Built-in CRM","Lead scoring","Site & event tracking","SMS marketing","Landing page builder","Predictive sending with AI"]',
  8.7, 8.0, 9.2, 8.5, 8.3, 11340,
  '<div class="pros-cons"><div class="pros"><h4>Pros</h4><ul><li>Best-in-class marketing automation builder with conditional logic, splits, and multi-channel triggers</li><li>Excellent email deliverability rates consistently ranking among the highest in the industry</li><li>Built-in CRM with sales automation eliminates the need for a separate sales tool</li></ul></div><div class="cons"><h4>Cons</h4><ul><li>Steeper learning curve than simpler email tools due to the depth of automation capabilities</li><li>No free plan available, and pricing increases significantly as contact list grows</li><li>Reporting and analytics interface can feel cluttered and unintuitive for new users</li></ul></div></div>',
  '<div class="use-cases"><h4>Use Cases</h4><ul><li><strong>E-commerce Automation:</strong> Build sophisticated abandoned cart, post-purchase, and win-back sequences that trigger based on browsing and purchase behavior.</li><li><strong>B2B Lead Nurturing:</strong> Score leads based on email engagement and website activity, then automate handoff to sales when they reach threshold.</li><li><strong>Course Creators & Coaches:</strong> Deliver automated email sequences, segment students by progress, and trigger personalized follow-ups.</li><li><strong>Agencies:</strong> Manage multiple client accounts with powerful segmentation and reporting across different brands.</li></ul></div>',
  '<div class="best-for"><p>ActiveCampaign is best for small to mid-sized businesses that need powerful marketing automation beyond basic email blasts. It''s the top choice for marketers who want to build complex, behavior-driven workflows with CRM integration and lead scoring, without paying enterprise-level prices for platforms like HubSpot or Marketo.</p></div>',
  'ActiveCampaign Review 2026: Features, Pricing & Alternatives',
  'Read our in-depth ActiveCampaign review for 2026. Explore automation features, CRM capabilities, pricing plans, and how it compares to Mailchimp, HubSpot, and other email marketing tools.',
  'published'
);

-- =====================================================
-- Business Category
-- =====================================================

-- 5. LastPass (Cybersecurity)
INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, description, logo_url, website_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, pros_cons_content, use_cases_content, best_for_content, meta_title, meta_description, status)
VALUES (
  'lastpass',
  'LastPass',
  'business',
  'cybersecurity',
  'Simplify password management and secure your digital life',
  'LastPass is one of the most widely recognized password managers in the world, serving over 33 million users and 100,000 businesses. It stores passwords, credit card details, and secure notes in an encrypted vault accessible across all devices. LastPass offers auto-fill, password generation, dark web monitoring, and secure sharing for both individual users and enterprise teams. Despite facing security incidents in 2022, the company has since overhauled its security infrastructure with zero-knowledge architecture, hardware security modules, and enhanced encryption protocols.',
  null,
  'https://www.lastpass.com',
  '{"hasFreePlan":true,"freeTrialDays":30,"startingPrice":3.00,"currency":"USD","plans":[{"name":"Free","price":0,"period":"monthly","features":["Unlimited passwords","One device type","Password generator"]},{"name":"Premium","price":3.00,"period":"monthly","features":["All device types","Dark web monitoring","1 GB encrypted storage"]},{"name":"Families","price":4.00,"period":"monthly","features":["6 users","Family dashboard","Unlimited shared folders"]},{"name":"Business","price":7.00,"period":"monthly","features":["Admin console","SSO integrations","Directory sync"]}]}',
  '["Encrypted password vault","Auto-fill & auto-login","Password generator","Dark web monitoring","Secure password sharing","Multi-factor authentication","Emergency access","Admin console for teams"]',
  7.8, 8.5, 7.9, 7.5, 7.2, 10850,
  '<div class="pros-cons"><div class="pros"><h4>Pros</h4><ul><li>Very user-friendly interface with seamless browser extension auto-fill across all major browsers</li><li>Affordable pricing with plans starting at just $3/month for individual users</li><li>Comprehensive business features including SSO, directory sync, and centralized admin controls</li></ul></div><div class="cons"><h4>Cons</h4><ul><li>Past security breaches in 2022 have eroded trust among security-conscious users</li><li>Free plan is limited to a single device type, forcing users to choose between mobile or desktop</li><li>Customer support response times can be slow, especially for free and premium tier users</li></ul></div></div>',
  '<div class="use-cases"><h4>Use Cases</h4><ul><li><strong>Individual Users:</strong> Store and auto-fill passwords, credit cards, and addresses securely across all devices.</li><li><strong>Small Business Teams:</strong> Share credentials for shared accounts like social media, hosting, and SaaS tools securely.</li><li><strong>Enterprise IT:</strong> Enforce password policies, provision access via directory sync, and monitor security posture from a centralized console.</li><li><strong>Families:</strong> Manage household passwords for streaming services, utilities, and shared accounts with a family dashboard.</li></ul></div>',
  '<div class="best-for"><p>LastPass is best for individuals and small businesses that prioritize ease of use and affordability in a password manager. It''s well-suited for teams that need straightforward credential sharing and admin controls without the complexity of enterprise-only platforms. However, security-conscious users should evaluate its post-breach improvements before committing.</p></div>',
  'LastPass Review 2026: Features, Pricing & Alternatives',
  'Read our LastPass review for 2026. Explore security features, pricing, pros & cons after the 2022 breach, and how it compares to 1Password, Bitwarden, and Dashlane.',
  'published'
);

-- 6. 1Password (Cybersecurity)
INSERT INTO tools (slug, name, category_slug, subcategory_slug, tagline, description, logo_url, website_url, pricing, features, ratings_overall, ratings_ease_of_use, ratings_features, ratings_value, ratings_support, review_count, pros_cons_content, use_cases_content, best_for_content, meta_title, meta_description, status)
VALUES (
  '1password',
  '1Password',
  'business',
  'cybersecurity',
  'The password manager trusted by over 150,000 businesses and millions of users',
  '1Password is a premium password management platform built for both individuals and businesses, known for its exceptional security architecture and polished user experience. It uses a unique dual-key encryption model combining your master password with a Secret Key that never leaves your devices, making it virtually impossible for breaches to expose user data. Beyond passwords, 1Password secures credit cards, documents, SSH keys, API tokens, and developer secrets. The platform is trusted by companies like IBM, Slack, Shopify, and GitLab, and has never experienced a security breach in its 18-year history.',
  null,
  'https://1password.com',
  '{"hasFreePlan":false,"freeTrialDays":14,"startingPrice":2.99,"currency":"USD","plans":[{"name":"Individual","price":2.99,"period":"monthly","features":["Unlimited passwords","All devices","1 GB document storage"]},{"name":"Families","price":4.99,"period":"monthly","features":["5 family members","Shared vaults","Recovery options"]},{"name":"Teams Starter Pack","price":19.95,"period":"monthly","features":["Up to 10 users","Admin controls","Guest accounts"]},{"name":"Business","price":7.99,"period":"monthly","features":["Advanced reporting","Custom groups","SSO with Okta & Azure AD"]},{"name":"Enterprise","price":null,"period":"monthly","features":["Custom onboarding","Dedicated support","Enterprise policies"]}]}',
  '["Dual-key encryption (Master Password + Secret Key)","Watchtower security dashboard","Cross-platform apps","Developer tools & CLI","Secure document storage","Travel Mode","Shared vaults & access controls","SSO & SCIM provisioning"]',
  9.1, 9.0, 8.9, 8.5, 8.7, 8920,
  '<div class="pros-cons"><div class="pros"><h4>Pros</h4><ul><li>Industry-leading security with dual-key encryption and a clean track record of zero breaches</li><li>Beautifully designed apps across every platform with a polished, consistent user experience</li><li>Watchtower proactively alerts you to weak, reused, and compromised passwords in your vault</li></ul></div><div class="cons"><h4>Cons</h4><ul><li>No free plan available, which is a barrier for users comparing against Bitwarden''s free tier</li><li>Not open-source, so security relies on independent audits rather than public code review</li><li>Families plan is limited to 5 members with no option to add additional users individually</li></ul></div></div>',
  '<div class="use-cases"><h4>Use Cases</h4><ul><li><strong>Developer Teams:</strong> Securely store and share API keys, SSH keys, database credentials, and environment variables with CLI and CI/CD integrations.</li><li><strong>Enterprise Security:</strong> Deploy organization-wide password management with SSO, SCIM provisioning, and advanced access controls.</li><li><strong>Frequent Travelers:</strong> Use Travel Mode to remove sensitive vaults from devices before crossing borders and restore them after arrival.</li><li><strong>Families:</strong> Share household passwords for streaming, banking, and utilities securely through shared vaults with customizable permissions.</li></ul></div>',
  '<div class="best-for"><p>1Password is best for security-focused individuals, families, and businesses that want a premium password management experience with an impeccable security track record. It''s the top choice for developer teams that need to manage secrets and credentials alongside personal passwords, and for enterprises that require robust SSO integration and granular access controls.</p></div>',
  '1Password Review 2026: Features, Pricing & Alternatives',
  'Discover our 1Password review for 2026. Explore security features, pricing, Watchtower dashboard, and how it compares to LastPass, Bitwarden, and Dashlane.',
  'published'
);
