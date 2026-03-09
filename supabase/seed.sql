-- ============================================================
-- IdeaPulse: Seed Data for Testing
-- Run this in Supabase SQL Editor AFTER running combined_migration.sql
-- and AFTER signing up your test user account
-- ============================================================

-- Step 1: Create a fake "seed author" user in auth.users
-- This user "owns" the seed ideas so your real test user can evaluate them.
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'seed-author@ideapulse.test',
  crypt('SeedPassword123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '{"provider":"email","providers":["email"]}',
  '{}'
) ON CONFLICT (id) DO NOTHING;

-- The trigger should auto-create the profile, but let's ensure it's complete
UPDATE public.profiles
SET
  full_name = 'Seed Author',
  role = 'founder',
  industry = 'saas',
  experience_level = 'senior',
  interests = ARRAY['saas', 'ai_ml', 'fintech'],
  is_profile_complete = true,
  evaluations_completed = 20
WHERE id = '00000000-0000-0000-0000-000000000001';

-- Step 2: Insert 20 diverse seed ideas
INSERT INTO public.ideas (id, author_id, status, title, problem, target_user, solution, monetization, industry, ai_summary, goes_live_at, expires_at) VALUES

-- 1. Fintech
('10000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0000-000000000001',
 'active',
 'FinTrack — AI-Powered Personal Finance Dashboard',
 'Most people struggle to track their spending across multiple bank accounts, credit cards, and investment platforms. Existing tools like Mint are shutting down, and alternatives are either too complex or lack AI-powered insights. People waste hours manually categorizing transactions and miss opportunities to save money.',
 'Young professionals aged 25-40 who have multiple financial accounts and want a unified view of their finances. They are tech-savvy but don''t have time to manually manage spreadsheets. They want actionable insights, not just pretty charts.',
 'A unified dashboard that connects to all bank accounts via Plaid, uses AI to auto-categorize transactions, detect recurring charges, identify savings opportunities, and provide personalized financial advice. Features include bill negotiation alerts, subscription tracking, and investment portfolio overview.',
 'Freemium model: free basic tracking, $9.99/month for AI insights and bill negotiation alerts. Premium tier at $19.99/month includes investment advisory features. Revenue from affiliate partnerships with recommended financial products.',
 'fintech',
 'An AI-powered personal finance dashboard that unifies multiple accounts and provides automated insights for spending optimization.',
 now() - interval '2 hours',
 now() + interval '46 hours'),

-- 2. Healthtech
('10000000-0000-0000-0000-000000000002',
 '00000000-0000-0000-0000-000000000001',
 'active',
 'MediSync — Chronic Disease Management Platform',
 'Patients with chronic diseases like diabetes, hypertension, and asthma struggle to consistently track their symptoms, medications, and appointments. This leads to poor health outcomes and preventable hospital visits. Current health apps are too generic and don''t connect patients with their care teams effectively.',
 'Adults aged 35-65 managing one or more chronic conditions who need daily medication adherence, symptom tracking, and regular check-ins with healthcare providers. Also targets caregivers managing elderly parents'' health.',
 'A mobile-first platform that provides personalized daily health check-ins, medication reminders with smart scheduling, symptom tracking with AI-powered trend analysis, and direct messaging to care teams. Integrates with wearables for automatic vitals tracking and provides early warning alerts.',
 'B2B2C model: hospitals and clinics pay per-patient-per-month ($15/patient). Direct-to-consumer plan at $4.99/month. Revenue from pharmaceutical company partnerships for medication adherence programs.',
 'healthtech',
 'A comprehensive chronic disease management platform connecting patients with care teams through smart tracking and AI-powered health insights.',
 now() - interval '5 hours',
 now() + interval '43 hours'),

-- 3. EdTech
('10000000-0000-0000-0000-000000000003',
 '00000000-0000-0000-0000-000000000001',
 'active',
 'CodeMentor Live — Real-Time Pair Programming Education',
 'Self-taught developers and bootcamp students often get stuck on complex coding problems and lack access to experienced mentors. Video tutorials don''t adapt to individual learning speeds, and Stack Overflow answers often lack context. The gap between watching tutorials and building real projects is enormous.',
 'Aspiring developers aged 18-35 who are learning to code through self-study or bootcamps. They have basic programming knowledge but struggle with intermediate-to-advanced concepts. They need hands-on guidance, not just theory.',
 'A live pair programming platform where learners can book 30-minute sessions with experienced developers. Features include shared code editor, screen sharing, session recording for later review, and an AI assistant that suggests relevant documentation during sessions. Mentors are matched based on tech stack and learning goals.',
 'Commission-based: learners pay $30-80 per session, platform takes 20%. Monthly subscription for unlimited sessions at $99/month. Corporate training partnerships. Mentors earn 80% of session fees.',
 'edtech',
 'A real-time pair programming platform connecting aspiring developers with experienced mentors for hands-on coding sessions.',
 now() - interval '1 hour',
 now() + interval '47 hours'),

-- 4. E-commerce
('10000000-0000-0000-0000-000000000004',
 '00000000-0000-0000-0000-000000000001',
 'active',
 'LocalCraft — Hyperlocal Artisan Marketplace',
 'Independent artisans and small-batch producers struggle to reach local customers beyond farmers'' markets. Etsy is too competitive and global, making it hard for local creators to stand out. Consumers who want to support local makers have no easy way to discover them outside of occasional weekend markets.',
 'Local artisans, bakers, jewelry makers, and small-batch food producers who sell primarily at farmers'' markets and craft fairs. Also targets conscious consumers aged 25-50 who prefer buying locally made, unique products over mass-produced items.',
 'A hyperlocal marketplace app focused on a 50-mile radius. Features include artisan profiles with behind-the-scenes content, local delivery and pickup scheduling, community events calendar, and a maker of the week spotlight. Customers can subscribe to favorite artisans for regular deliveries.',
 'Transaction fee of 8% per sale (lower than Etsy). Premium artisan profiles at $14.99/month with featured placement. Sponsored local delivery partnerships. Revenue from hosting virtual craft fair events.',
 'ecommerce',
 'A hyperlocal marketplace connecting artisans with nearby consumers who want unique, locally-made products.',
 now() - interval '3 hours',
 now() + interval '45 hours'),

-- 5. SaaS
('10000000-0000-0000-0000-000000000005',
 '00000000-0000-0000-0000-000000000001',
 'active',
 'TeamPulse — Async Team Health Check Tool',
 'Remote and hybrid teams struggle with burnout and disengagement that goes unnoticed until it''s too late. Traditional employee surveys are annual, bureaucratic, and rarely actionable. Managers don''t have visibility into team morale and can''t identify problems early enough to prevent turnover.',
 'Engineering managers and team leads in remote-first companies with 10-200 employees. They care about team culture but don''t have time for lengthy survey processes. They want quick, actionable insights without making the team feel surveilled.',
 'A lightweight weekly pulse check (3 questions, 30 seconds) delivered via Slack/Teams. AI analyzes trends, flags concerns early, and suggests specific actions for managers. Features include anonymous feedback channels, team mood heatmaps, and integration with 1-on-1 meeting tools for follow-up.',
 'Per-seat SaaS pricing: $4/user/month for teams up to 50, $3/user/month for 50-200. Enterprise plan with custom reporting at $6/user/month. Free tier for teams under 10 users.',
 'saas',
 'A lightweight async tool that helps remote teams track morale and prevent burnout through quick weekly pulse checks.',
 now() - interval '6 hours',
 now() + interval '42 hours'),

-- 6. AI/ML
('10000000-0000-0000-0000-000000000006',
 '00000000-0000-0000-0000-000000000001',
 'active',
 'PromptForge — AI Prompt Engineering Workspace',
 'Companies using LLMs waste enormous time crafting, testing, and iterating on prompts. There is no systematic way to version control prompts, A/B test them, or share effective prompts across teams. Individual prompt engineers work in isolation, leading to duplicated effort and inconsistent AI outputs.',
 'AI/ML teams at companies with 50+ employees that are deploying LLM-powered features. Specifically targets prompt engineers, product managers who work with AI features, and content teams using AI for generation. They need collaboration and version control for prompts.',
 'A collaborative workspace for prompt engineering with version control, A/B testing against multiple LLM providers, team sharing, and performance analytics. Features prompt templates marketplace, automated regression testing when models update, and cost optimization recommendations across providers.',
 'Team plan at $49/month for up to 10 users. Enterprise at $199/month with SSO and audit logging. Pay-per-test pricing for A/B testing ($0.01 per test run). Marketplace commission on premium prompt templates.',
 'ai_ml',
 'A collaborative prompt engineering workspace with version control, A/B testing, and team sharing for LLM-powered teams.',
 now() - interval '4 hours',
 now() + interval '44 hours'),

-- 7. Social
('10000000-0000-0000-0000-000000000007',
 '00000000-0000-0000-0000-000000000001',
 'active',
 'Circles — Interest-Based Local Community App',
 'Despite being hyper-connected online, people feel lonelier than ever. Meetup.com has become dominated by professional networking events, and Facebook Groups lack the intimacy needed for real friendships. There is no good platform for finding small, interest-based groups of people nearby.',
 'Adults aged 22-45 who recently moved to a new city or want to expand their social circle around specific interests. Not looking for dating or professional networking, but genuine hobby-based friendships. Particularly relevant for remote workers who miss office social connections.',
 'An app that creates small groups (6-12 people) based on shared interests and proximity. AI matches people into compatible groups, suggests local activities, and facilitates the first meeting. Features include group chat, activity scheduling, and a structured 4-week getting to know you program for new groups.',
 'Freemium: free to join one circle, $7.99/month to join unlimited circles. Revenue from sponsored venue partnerships for meetup locations. Premium circles with curated experiences at $19.99/month. Corporate wellness partnerships for employee social wellness.',
 'social',
 'An interest-based community app that creates small, local groups to combat loneliness and build genuine friendships.',
 now() - interval '7 hours',
 now() + interval '41 hours'),

-- 8. Marketplace
('10000000-0000-0000-0000-000000000008',
 '00000000-0000-0000-0000-000000000001',
 'active',
 'ExpertHour — Micro-Consulting Marketplace',
 'Professionals and entrepreneurs often need quick expert advice but cannot justify hiring a full consultant. Traditional consulting firms have high minimums ($5,000+) and slow onboarding. Meanwhile, industry experts have fragmented free time they could monetize but lack a platform to do so efficiently.',
 'Startup founders, product managers, and small business owners who need 30-60 minute expert consultations on specific topics. Also targets experienced professionals (15+ years) who want to monetize their expertise in flexible time blocks.',
 'A micro-consulting marketplace where experts offer 30 or 60-minute video sessions at set rates. AI-powered matching based on the question topic, smart scheduling across timezones, and structured session formats with post-session notes. Experts build reputation through reviews and can create mini-courses.',
 'Commission model: 15% platform fee on each session. Expert subscription for premium profile features at $29/month. Corporate credits program for companies buying consultation hours in bulk. Average session price $100-300.',
 'marketplace',
 'A micro-consulting marketplace enabling quick, affordable expert advice sessions for professionals and entrepreneurs.',
 now() - interval '8 hours',
 now() + interval '40 hours'),

-- 9. DevTools
('10000000-0000-0000-0000-000000000009',
 '00000000-0000-0000-0000-000000000001',
 'active',
 'LogLens — AI-Powered Log Analysis for Small Teams',
 'Small development teams cannot afford enterprise observability tools like Datadog or Splunk, which cost thousands per month. Free alternatives require too much setup and DevOps expertise. When production issues occur, developers spend hours manually searching through logs instead of fixing the actual problem.',
 'Small development teams (2-15 developers) at startups and SMBs who deploy web applications. They have basic logging in place but lack the tools and time to properly analyze logs. They need fast root cause analysis without a dedicated DevOps team.',
 'A lightweight log analysis tool that ingests logs via a simple SDK, uses AI to automatically detect anomalies, group related errors, and suggest root causes. Features include natural language log querying, smart alerting with context, and a postmortem generator that creates incident reports automatically.',
 'Usage-based pricing starting at $29/month for up to 5GB/day of logs. $79/month for 20GB/day. Enterprise tier with custom retention and compliance at $199/month. Free tier for up to 500MB/day.',
 'devtools',
 'An AI-powered log analysis tool designed for small teams who cannot afford enterprise observability platforms.',
 now() - interval '10 hours',
 now() + interval '38 hours'),

-- 10. Enterprise
('10000000-0000-0000-0000-000000000010',
 '00000000-0000-0000-0000-000000000001',
 'active',
 'CompliBot — Automated Compliance Documentation',
 'Companies seeking SOC 2, ISO 27001, and HIPAA compliance spend months and tens of thousands on consultants to create policy documents. These documents quickly become outdated, and maintaining compliance requires constant vigilance. Small companies either skip compliance (losing enterprise deals) or overspend on consultants.',
 'CTOs and security leads at B2B SaaS companies with 20-200 employees who need compliance certifications to close enterprise deals. They understand the importance but lack dedicated compliance staff and find the process overwhelming and expensive.',
 'An AI-powered compliance automation platform that generates policy documents tailored to the company tech stack, continuously monitors adherence through integrations with cloud providers and dev tools, and prepares audit-ready evidence packages. Features include employee training modules, vendor risk assessment, and automated gap analysis.',
 'Subscription based: $499/month for single framework (SOC 2 or ISO), $899/month for multi-framework bundle. Implementation fee of $2,000 one-time. Revenue from compliance training courses and audit preparation support.',
 'enterprise',
 'An AI-powered platform automating compliance documentation and monitoring for growing SaaS companies.',
 now() - interval '12 hours',
 now() + interval '36 hours'),

-- 11. Consumer
('10000000-0000-0000-0000-000000000011',
 '00000000-0000-0000-0000-000000000001',
 'active',
 'MealSwap — Neighborhood Home Cooking Exchange',
 'Home cooking is healthier and cheaper than eating out, but cooking every day is exhausting, especially for busy families. Many neighborhoods have great home cooks who make large batches, but there is no efficient way to share or trade meals with neighbors. Food goes to waste while people order expensive delivery.',
 'Busy professionals and families in suburban neighborhoods who enjoy cooking but do not want to cook every night. Also targets passionate home cooks who make large portions and would love to share with neighbors. Ages 28-55, health-conscious, community-oriented.',
 'A neighborhood meal exchange app where home cooks post available meals, and neighbors can request portions. Features include dietary preference matching, allergen tracking, a credit system (cook meals to earn credits, spend credits to receive meals), and community recipe sharing. Verified home kitchens with hygiene ratings.',
 'Transaction fee: $1.50 per exchange. Premium membership at $9.99/month for priority access and larger credit bonuses. Revenue from sponsored cooking supply partnerships. No-cook subscription option at $49/month for meal recipients only.',
 'consumer',
 'A neighborhood meal exchange platform connecting home cooks with busy families through a credit-based sharing system.',
 now() - interval '9 hours',
 now() + interval '39 hours'),

-- 12. Gaming
('10000000-0000-0000-0000-000000000012',
 '00000000-0000-0000-0000-000000000001',
 'active',
 'QuestLog — Gamified Productivity for ADHD Adults',
 'Adults with ADHD struggle with traditional productivity tools that rely on willpower and linear task management. Existing apps like Todoist and Notion feel overwhelming and lack the immediate reward feedback that ADHD brains need. Gamification attempts so far have been too childish or shallow to maintain engagement.',
 'Adults aged 20-40 diagnosed with or suspecting ADHD who have tried and failed with conventional productivity tools. They respond well to game mechanics but need something sophisticated enough for professional use. Also appeals to neurotypical people who enjoy gamification.',
 'A productivity app designed with ADHD neuroscience in mind. Features RPG-style character progression, quest chains for multi-step projects, randomized daily challenges for mundane tasks, co-op mode for body doubling, and an urgency engine that creates healthy time pressure. Integrates with calendar and project management tools.',
 'Freemium: free basic quest tracking, $6.99/month for full RPG features, character customization, and integrations. Annual plan at $59.99/year. Revenue from cosmetic character items and themed quest packs. Corporate licenses for neurodiversity-inclusive workplaces.',
 'gaming',
 'A gamified productivity app designed specifically for ADHD adults using RPG mechanics and neuroscience-based engagement.',
 now() - interval '11 hours',
 now() + interval '37 hours'),

-- 13. Climate
('10000000-0000-0000-0000-000000000013',
 '00000000-0000-0000-0000-000000000001',
 'active',
 'CarbonLens — Personal Carbon Footprint Tracker',
 'Individuals want to reduce their carbon footprint but have no idea which of their daily actions matter most. Existing carbon calculators give one-time estimates but do not track ongoing behavior or provide actionable guidance. People feel overwhelmed by climate anxiety without clear, personalized steps they can take.',
 'Environmentally conscious consumers aged 22-45 in urban areas who want to actively reduce their personal carbon impact. They care about sustainability but need guidance on what actually moves the needle. Early adopters and eco-conscious millennials who already make some green choices.',
 'An automated carbon tracking app that connects to purchase history, travel data, and energy bills to calculate real-time carbon impact. AI provides personalized reduction recommendations ranked by impact, tracks progress over time, and enables social challenges with friends. Features include carbon offset marketplace and impact visualization.',
 'Freemium: free basic tracking, $4.99/month for AI recommendations and social features. Carbon offset commissions (10% of offset purchases). B2B version for companies tracking employee carbon impact at $3/employee/month. Sponsored sustainable product recommendations.',
 'climate',
 'A real-time personal carbon tracking app with AI-powered reduction recommendations and social accountability features.',
 now() - interval '13 hours',
 now() + interval '35 hours'),

-- 14. SaaS
('10000000-0000-0000-0000-000000000014',
 '00000000-0000-0000-0000-000000000001',
 'active',
 'FeedbackLoop — Customer Interview Automation',
 'Product teams know they should do regular customer interviews, but scheduling, conducting, and synthesizing interviews is incredibly time-consuming. Most teams do fewer than 5 interviews per month, missing crucial insights. Manual note-taking during interviews means important details get lost.',
 'Product managers and UX researchers at SaaS companies with 50-500 employees who want to increase their customer research velocity. They value qualitative insights but are bottlenecked by the logistics of running interviews consistently.',
 'An end-to-end customer interview platform that automates scheduling, provides AI-guided interview scripts based on research goals, transcribes and summarizes conversations in real-time, and synthesizes themes across multiple interviews. Features include participant recruitment from existing customer base and insight sharing dashboards.',
 'Per-seat pricing: $49/month per researcher with up to 20 interviews/month. Team plan at $149/month for 5 seats and unlimited interviews. Enterprise with custom integrations at $399/month. Pay-per-interview option at $15/interview for occasional users.',
 'saas',
 'An automated customer interview platform that handles scheduling, AI-guided questioning, and insight synthesis for product teams.',
 now() - interval '14 hours',
 now() + interval '34 hours'),

-- 15. AI/ML
('10000000-0000-0000-0000-000000000015',
 '00000000-0000-0000-0000-000000000001',
 'active',
 'DataLabel — Crowdsourced Data Labeling Marketplace',
 'Training custom ML models requires thousands of labeled data points, but professional data labeling services charge $0.10-1.00 per label with multi-week turnaround times. Small AI startups and research teams cannot afford these prices, and doing it internally is painfully slow.',
 'Machine learning engineers and data scientists at early-stage AI startups (seed to Series A) and academic research labs. They need high-quality labeled training data but have limited budgets and tight deadlines. Teams of 2-10 ML practitioners working on computer vision, NLP, or audio models.',
 'A crowdsourced data labeling marketplace that matches labeling tasks with a global community of vetted labelers. Features include quality assurance through multi-labeler consensus, custom annotation interfaces for different data types, active learning integration to minimize required labels, and real-time progress tracking with quality metrics.',
 'Usage-based pricing: $0.02-0.15 per label depending on complexity. Managed labeling service with dedicated team at $0.05-0.30 per label. Platform subscription for custom workflows at $199/month. Labelers earn 70% of label fees.',
 'ai_ml',
 'An affordable crowdsourced data labeling marketplace with quality assurance for ML teams who need training data fast.',
 now() - interval '15 hours',
 now() + interval '33 hours'),

-- 16. Fintech
('10000000-0000-0000-0000-000000000016',
 '00000000-0000-0000-0000-000000000001',
 'active',
 'SplitSmart — Intelligent Group Expense Splitting',
 'Splitting expenses in groups (roommates, trips, events) creates awkward social situations and tracking headaches. Splitwise has become stale and lacks smart features. Complex scenarios like recurring bills with different splits, currency conversion for international groups, and settling up across multiple payment methods are poorly handled.',
 'Young adults aged 20-35 who frequently share expenses with roommates, travel groups, or friend groups. International students and expats who deal with multi-currency splitting. Groups that have recurring shared costs like rent, utilities, and subscriptions.',
 'An intelligent expense splitting app with AI that learns group spending patterns, auto-detects recurring expenses, handles multi-currency conversions, and suggests optimal settlement paths to minimize transactions. Features include receipt scanning, integration with payment apps for instant settlement, and predictive budgeting for shared expenses.',
 'Freemium: free for basic splitting with unlimited groups. Premium at $3.99/month for receipt scanning, multi-currency, and analytics. Revenue from payment processing fees (1% on in-app settlements). Group premium plans for households at $6.99/month covering all members.',
 'fintech',
 'An intelligent expense splitting app with AI-powered pattern recognition, multi-currency support, and optimized settlement paths.',
 now() - interval '16 hours',
 now() + interval '32 hours'),

-- 17. Healthtech
('10000000-0000-0000-0000-000000000017',
 '00000000-0000-0000-0000-000000000001',
 'active',
 'TherapyMatch — AI-Powered Therapist Matching',
 'Finding the right therapist is a frustrating process that often takes months of trial and error. Directories list thousands of therapists with generic profiles, and insurance compatibility adds another layer of complexity. Many people give up searching and never get the help they need.',
 'Adults aged 25-50 seeking therapy for the first time or looking to switch therapists. They are frustrated by the current trial-and-error approach and want a more intelligent matching process. Includes people dealing with anxiety, depression, relationship issues, and work-related stress.',
 'An AI matching platform that uses a detailed intake questionnaire covering therapy preferences, communication style, cultural background, and specific concerns to match clients with compatible therapists. Features include insurance verification, session preference matching, therapist video introductions, and satisfaction tracking with re-matching support.',
 'Referral fee model: therapists pay $50 per new matched client (only after first session). Monthly listing fee of $29/month for enhanced therapist profiles. Client-side always free. Enterprise wellness partnerships for employee therapy benefits.',
 'healthtech',
 'An AI-powered platform that matches therapy seekers with compatible therapists based on personality, needs, and insurance.',
 now() - interval '17 hours',
 now() + interval '31 hours'),

-- 18. Marketplace
('10000000-0000-0000-0000-000000000018',
 '00000000-0000-0000-0000-000000000001',
 'active',
 'SkillBridge — Skill-for-Skill Bartering Platform',
 'Freelancers and solopreneurs often need services they cannot afford (design, legal, accounting) while having valuable skills they could trade. Traditional bartering is inefficient and hard to value fairly. There is no structured platform for professional skill exchange with built-in trust and quality assurance.',
 'Freelancers, solopreneurs, and early-stage founders aged 25-45 who have marketable skills but limited cash budgets. Designers who need legal help, developers who need marketing expertise, writers who need web development — professionals who can exchange value without money.',
 'A structured skill bartering platform where professionals can list their skills and needs, with AI-powered fair value estimation for skill exchanges. Features include skill verification, time-banking credits, project scoping templates, and escrow-style completion verification. Both parties rate the exchange for reputation building.',
 'Freemium: free for direct 1-to-1 exchanges. Premium at $12.99/month for access to credit-based multi-party exchanges and priority matching. Transaction fee of 5% on credit-based exchanges. Revenue from featured profile placements and skill certification partnerships.',
 'marketplace',
 'A professional skill bartering platform with AI-powered value estimation, time banking, and trust verification.',
 now() - interval '18 hours',
 now() + interval '30 hours'),

-- 19. DevTools
('10000000-0000-0000-0000-000000000019',
 '00000000-0000-0000-0000-000000000001',
 'active',
 'APIGuard — Automated API Security Testing',
 'APIs are the most common attack vector for web applications, yet most development teams lack the expertise and tools to properly test their APIs for security vulnerabilities. Manual penetration testing is expensive and infrequent, leaving APIs exposed between tests. Existing tools require deep security knowledge to configure.',
 'Backend developers and DevOps engineers at startups and mid-size companies who build and maintain REST and GraphQL APIs. They understand security is important but lack dedicated security teams. Teams shipping API updates weekly who need continuous security testing.',
 'An automated API security testing tool that runs in CI/CD pipelines and performs intelligent fuzzing, authentication bypass testing, injection attacks, and rate limit validation. Features include OpenAPI/GraphQL schema-aware testing, auto-generated fix suggestions with code examples, compliance reporting, and a developer-friendly dashboard.',
 'Usage-based: free for up to 100 API endpoints per month. Pro at $79/month for unlimited endpoints and CI/CD integration. Team plan at $199/month with 5 seats and priority support. Enterprise with on-premise deployment at $499/month.',
 'devtools',
 'An automated API security testing tool that runs in CI/CD pipelines with schema-aware testing and fix suggestions.',
 now() - interval '19 hours',
 now() + interval '29 hours'),

-- 20. Consumer
('10000000-0000-0000-0000-000000000020',
 '00000000-0000-0000-0000-000000000001',
 'active',
 'PlantPal — AI Plant Care Assistant',
 'Houseplant ownership has surged but so has plant mortality rates. New plant parents kill their plants because care instructions are generic, and they cannot diagnose problems until it is too late. Existing apps focus on identification but do not provide ongoing personalized care based on the user specific environment.',
 'Millennial and Gen-Z houseplant enthusiasts aged 22-40 who own 3-20 houseplants but struggle to keep them alive. They want to improve their plant care skills but find conflicting advice online. Urban apartment dwellers with varying light conditions and no outdoor space.',
 'An AI plant care assistant that uses phone camera analysis to assess plant health, identify diseases and pests, and provide environment-specific care schedules. Features include light level assessment via phone sensor, watering reminders calibrated to pot size and humidity, growth tracking with time-lapse photos, and a community for plant trading and advice.',
 'Freemium: free for up to 5 plants with basic care reminders. Premium at $4.99/month for unlimited plants, AI diagnosis, and growth tracking. Revenue from plant shop affiliate partnerships, sponsored soil and fertilizer recommendations. Premium plant care courses at $19.99 each.',
 'consumer',
 'An AI plant care assistant providing personalized care schedules, disease diagnosis, and environment-specific recommendations.',
 now() - interval '20 hours',
 now() + interval '28 hours');

-- ============================================================
-- DONE! You now have 20 diverse seed ideas ready for evaluation.
-- Sign up with a real account to test the evaluate flow.
-- ============================================================
