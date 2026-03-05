import os

target = os.path.join(os.path.dirname(os.path.abspath(__file__)), '27-more-tools.sql')

sql = r"""
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
"""

with open(target, 'a', encoding='utf-8') as f:
    f.write(sql)

print(f'SaaS tools appended to {target}')
