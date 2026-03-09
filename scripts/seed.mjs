// Seed script — run with: node scripts/seed.mjs
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://oucrqwucwarowjyphjph.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Try both key formats
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SEED_USER_ID = "00000000-0000-0000-0000-000000000001";

async function seed() {
  console.log("🌱 Starting seed...\n");

  // Step 1: Create seed author via admin API
  console.log("1️⃣  Creating seed author user...");
  const { data: user, error: userError } =
    await supabase.auth.admin.createUser({
      email: "seed-author@ideapulse.test",
      password: "SeedPassword123!",
      email_confirm: true,
      user_metadata: {},
    });

  if (userError) {
    if (userError.message?.includes("already been registered")) {
      console.log("   ✅ Seed user already exists, continuing...");
    } else {
      console.error("   ❌ Failed to create user:", userError.message);
      console.log("   ℹ️  You may need to run supabase/seed.sql in the SQL Editor instead.");
      process.exit(1);
    }
  } else {
    console.log("   ✅ Created user:", user.user?.id);
  }

  // Get the actual user ID (might differ from our fixed UUID)
  const { data: users } = await supabase.auth.admin.listUsers();
  const seedUser = users?.users?.find(
    (u) => u.email === "seed-author@ideapulse.test"
  );
  const authorId = seedUser?.id;

  if (!authorId) {
    console.error("   ❌ Could not find seed user");
    process.exit(1);
  }
  console.log("   📌 Author ID:", authorId);

  // Step 2: Complete seed author profile
  console.log("\n2️⃣  Completing seed author profile...");
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: "Seed Author",
      role: "founder",
      industry: "saas",
      experience_level: "senior",
      interests: ["saas", "ai_ml", "fintech"],
      is_profile_complete: true,
      evaluations_completed: 20,
    })
    .eq("id", authorId);

  if (profileError) {
    console.error("   ❌ Profile update failed:", profileError.message);
  } else {
    console.log("   ✅ Profile completed");
  }

  // Step 3: Insert seed ideas
  console.log("\n3️⃣  Inserting 20 seed ideas...");

  const now = new Date();
  const ideas = [
    {
      author_id: authorId,
      status: "active",
      title: "FinTrack — AI-Powered Personal Finance Dashboard",
      problem: "Most people struggle to track their spending across multiple bank accounts, credit cards, and investment platforms. Existing tools are shutting down, and alternatives are either too complex or lack AI-powered insights.",
      target_user: "Young professionals aged 25-40 who have multiple financial accounts and want a unified view of their finances.",
      solution: "A unified dashboard that connects to all bank accounts via Plaid, uses AI to auto-categorize transactions, detect recurring charges, identify savings opportunities, and provide personalized financial advice.",
      monetization: "Freemium model: free basic tracking, $9.99/month for AI insights. Premium tier at $19.99/month includes investment advisory features.",
      industry: "fintech",
      ai_summary: "An AI-powered personal finance dashboard that unifies multiple accounts and provides automated insights for spending optimization.",
      goes_live_at: new Date(now.getTime() - 2 * 3600000).toISOString(),
      expires_at: new Date(now.getTime() + 46 * 3600000).toISOString(),
    },
    {
      author_id: authorId,
      status: "active",
      title: "MediSync — Chronic Disease Management Platform",
      problem: "Patients with chronic diseases struggle to consistently track symptoms, medications, and appointments. Current health apps are too generic and don't connect patients with their care teams.",
      target_user: "Adults aged 35-65 managing chronic conditions who need daily medication adherence, symptom tracking, and regular check-ins with healthcare providers.",
      solution: "A mobile-first platform with personalized daily health check-ins, medication reminders, symptom tracking with AI-powered trend analysis, and direct messaging to care teams.",
      monetization: "B2B2C model: hospitals pay $15/patient/month. Direct-to-consumer plan at $4.99/month.",
      industry: "healthtech",
      ai_summary: "A comprehensive chronic disease management platform connecting patients with care teams through smart tracking and AI-powered health insights.",
      goes_live_at: new Date(now.getTime() - 5 * 3600000).toISOString(),
      expires_at: new Date(now.getTime() + 43 * 3600000).toISOString(),
    },
    {
      author_id: authorId,
      status: "active",
      title: "CodeMentor Live — Real-Time Pair Programming Education",
      problem: "Self-taught developers get stuck on complex problems and lack access to experienced mentors. Video tutorials don't adapt to individual learning speeds.",
      target_user: "Aspiring developers aged 18-35 learning to code through self-study or bootcamps who need hands-on guidance.",
      solution: "A live pair programming platform where learners book 30-minute sessions with experienced developers, with shared code editor and AI assistant.",
      monetization: "Commission-based: learners pay $30-80 per session, platform takes 20%. Monthly unlimited at $99/month.",
      industry: "edtech",
      ai_summary: "A real-time pair programming platform connecting aspiring developers with experienced mentors for hands-on coding sessions.",
      goes_live_at: new Date(now.getTime() - 1 * 3600000).toISOString(),
      expires_at: new Date(now.getTime() + 47 * 3600000).toISOString(),
    },
    {
      author_id: authorId,
      status: "active",
      title: "LocalCraft — Hyperlocal Artisan Marketplace",
      problem: "Independent artisans struggle to reach local customers beyond farmers' markets. Etsy is too competitive and global.",
      target_user: "Local artisans and conscious consumers aged 25-50 who prefer locally made, unique products.",
      solution: "A hyperlocal marketplace app focused on a 50-mile radius with artisan profiles, local delivery scheduling, and community events.",
      monetization: "Transaction fee of 8% per sale. Premium profiles at $14.99/month with featured placement.",
      industry: "ecommerce",
      ai_summary: "A hyperlocal marketplace connecting artisans with nearby consumers who want unique, locally-made products.",
      goes_live_at: new Date(now.getTime() - 3 * 3600000).toISOString(),
      expires_at: new Date(now.getTime() + 45 * 3600000).toISOString(),
    },
    {
      author_id: authorId,
      status: "active",
      title: "TeamPulse — Async Team Health Check Tool",
      problem: "Remote teams struggle with burnout that goes unnoticed until it's too late. Traditional surveys are annual and rarely actionable.",
      target_user: "Engineering managers and team leads in remote-first companies with 10-200 employees.",
      solution: "A lightweight weekly pulse check (3 questions, 30 seconds) via Slack/Teams with AI trend analysis and manager action suggestions.",
      monetization: "Per-seat SaaS: $4/user/month for teams up to 50. Free tier for teams under 10.",
      industry: "saas",
      ai_summary: "A lightweight async tool that helps remote teams track morale and prevent burnout through quick weekly pulse checks.",
      goes_live_at: new Date(now.getTime() - 6 * 3600000).toISOString(),
      expires_at: new Date(now.getTime() + 42 * 3600000).toISOString(),
    },
    {
      author_id: authorId,
      status: "active",
      title: "PromptForge — AI Prompt Engineering Workspace",
      problem: "Companies using LLMs waste time crafting prompts with no version control, A/B testing, or team sharing capabilities.",
      target_user: "AI/ML teams at companies with 50+ employees deploying LLM-powered features.",
      solution: "A collaborative prompt engineering workspace with version control, A/B testing against multiple LLM providers, and performance analytics.",
      monetization: "Team plan at $49/month for 10 users. Enterprise at $199/month with SSO.",
      industry: "ai_ml",
      ai_summary: "A collaborative prompt engineering workspace with version control, A/B testing, and team sharing for LLM-powered teams.",
      goes_live_at: new Date(now.getTime() - 4 * 3600000).toISOString(),
      expires_at: new Date(now.getTime() + 44 * 3600000).toISOString(),
    },
    {
      author_id: authorId,
      status: "active",
      title: "Circles — Interest-Based Local Community App",
      problem: "Despite being hyper-connected online, people feel lonelier than ever. No good platform for finding small, interest-based groups nearby.",
      target_user: "Adults aged 22-45 who recently moved to a new city or want to expand their social circle around specific interests.",
      solution: "An app creating small groups (6-12 people) based on shared interests and proximity with AI matching and activity suggestions.",
      monetization: "Freemium: free for one circle, $7.99/month for unlimited. Premium curated experiences at $19.99/month.",
      industry: "social",
      ai_summary: "An interest-based community app that creates small, local groups to combat loneliness and build genuine friendships.",
      goes_live_at: new Date(now.getTime() - 7 * 3600000).toISOString(),
      expires_at: new Date(now.getTime() + 41 * 3600000).toISOString(),
    },
    {
      author_id: authorId,
      status: "active",
      title: "ExpertHour — Micro-Consulting Marketplace",
      problem: "Professionals need quick expert advice but can't justify hiring a full consultant. Traditional firms have $5,000+ minimums.",
      target_user: "Startup founders and small business owners who need 30-60 minute expert consultations on specific topics.",
      solution: "A micro-consulting marketplace with AI-powered matching, smart scheduling, and structured session formats with post-session notes.",
      monetization: "15% platform commission. Expert subscription at $29/month for premium features.",
      industry: "marketplace",
      ai_summary: "A micro-consulting marketplace enabling quick, affordable expert advice sessions for professionals and entrepreneurs.",
      goes_live_at: new Date(now.getTime() - 8 * 3600000).toISOString(),
      expires_at: new Date(now.getTime() + 40 * 3600000).toISOString(),
    },
    {
      author_id: authorId,
      status: "active",
      title: "LogLens — AI-Powered Log Analysis for Small Teams",
      problem: "Small dev teams can't afford enterprise observability tools. Free alternatives require too much DevOps expertise.",
      target_user: "Small development teams (2-15 devs) at startups who need fast root cause analysis without a dedicated DevOps team.",
      solution: "A lightweight log analysis tool with AI anomaly detection, natural language querying, and automatic postmortem generation.",
      monetization: "Usage-based: $29/month for 5GB/day. Free tier for 500MB/day.",
      industry: "devtools",
      ai_summary: "An AI-powered log analysis tool designed for small teams who can't afford enterprise observability platforms.",
      goes_live_at: new Date(now.getTime() - 10 * 3600000).toISOString(),
      expires_at: new Date(now.getTime() + 38 * 3600000).toISOString(),
    },
    {
      author_id: authorId,
      status: "active",
      title: "CompliBot — Automated Compliance Documentation",
      problem: "Companies seeking SOC 2, ISO 27001 compliance spend months and tens of thousands on consultants. Documents quickly become outdated.",
      target_user: "CTOs and security leads at B2B SaaS companies with 20-200 employees who need compliance certifications.",
      solution: "An AI-powered compliance platform generating policy documents, monitoring adherence, and preparing audit-ready evidence packages.",
      monetization: "Subscription: $499/month for single framework, $899/month for multi-framework bundle.",
      industry: "enterprise",
      ai_summary: "An AI-powered platform automating compliance documentation and monitoring for growing SaaS companies.",
      goes_live_at: new Date(now.getTime() - 12 * 3600000).toISOString(),
      expires_at: new Date(now.getTime() + 36 * 3600000).toISOString(),
    },
    {
      author_id: authorId,
      status: "active",
      title: "MealSwap — Neighborhood Home Cooking Exchange",
      problem: "Cooking every day is exhausting. Neighborhoods have great cooks making large batches but no way to share efficiently.",
      target_user: "Busy professionals and families aged 28-55 who enjoy cooking but don't want to cook every night.",
      solution: "A meal exchange app with dietary matching, allergen tracking, credit system, and community recipe sharing.",
      monetization: "$1.50 per exchange fee. Premium at $9.99/month for priority access.",
      industry: "consumer",
      ai_summary: "A neighborhood meal exchange platform connecting home cooks with busy families through a credit-based sharing system.",
      goes_live_at: new Date(now.getTime() - 9 * 3600000).toISOString(),
      expires_at: new Date(now.getTime() + 39 * 3600000).toISOString(),
    },
    {
      author_id: authorId,
      status: "active",
      title: "QuestLog — Gamified Productivity for ADHD Adults",
      problem: "Adults with ADHD struggle with traditional productivity tools. Gamification attempts have been too childish to maintain engagement.",
      target_user: "Adults aged 20-40 with ADHD who respond well to game mechanics but need professional-grade tools.",
      solution: "A productivity app with RPG character progression, quest chains, randomized daily challenges, and co-op body doubling mode.",
      monetization: "Freemium: free basic tracking, $6.99/month for full RPG features. Annual at $59.99/year.",
      industry: "gaming",
      ai_summary: "A gamified productivity app designed specifically for ADHD adults using RPG mechanics and neuroscience-based engagement.",
      goes_live_at: new Date(now.getTime() - 11 * 3600000).toISOString(),
      expires_at: new Date(now.getTime() + 37 * 3600000).toISOString(),
    },
    {
      author_id: authorId,
      status: "active",
      title: "CarbonLens — Personal Carbon Footprint Tracker",
      problem: "People want to reduce their carbon footprint but have no idea which daily actions matter most.",
      target_user: "Environmentally conscious consumers aged 22-45 in urban areas who want personalized carbon reduction guidance.",
      solution: "An automated carbon tracking app connecting to purchase history, travel data, and energy bills with AI reduction recommendations.",
      monetization: "Freemium: free tracking, $4.99/month for AI recommendations. B2B at $3/employee/month.",
      industry: "climate",
      ai_summary: "A real-time personal carbon tracking app with AI-powered reduction recommendations and social accountability features.",
      goes_live_at: new Date(now.getTime() - 13 * 3600000).toISOString(),
      expires_at: new Date(now.getTime() + 35 * 3600000).toISOString(),
    },
    {
      author_id: authorId,
      status: "active",
      title: "FeedbackLoop — Customer Interview Automation",
      problem: "Product teams do fewer than 5 customer interviews/month. Manual note-taking means important details get lost.",
      target_user: "Product managers and UX researchers at SaaS companies with 50-500 employees.",
      solution: "An end-to-end interview platform with automated scheduling, AI-guided scripts, real-time transcription, and cross-interview theme synthesis.",
      monetization: "Per-seat: $49/month per researcher, 20 interviews/month. Team plan at $149/month for 5 seats.",
      industry: "saas",
      ai_summary: "An automated customer interview platform that handles scheduling, AI-guided questioning, and insight synthesis for product teams.",
      goes_live_at: new Date(now.getTime() - 14 * 3600000).toISOString(),
      expires_at: new Date(now.getTime() + 34 * 3600000).toISOString(),
    },
    {
      author_id: authorId,
      status: "active",
      title: "DataLabel — Crowdsourced Data Labeling Marketplace",
      problem: "Professional data labeling services charge $0.10-1.00 per label with multi-week turnaround. Small AI startups can't afford this.",
      target_user: "ML engineers at early-stage AI startups and academic research labs with limited budgets and tight deadlines.",
      solution: "A crowdsourced labeling marketplace with quality assurance via multi-labeler consensus, custom annotation interfaces, and active learning integration.",
      monetization: "Usage-based: $0.02-0.15 per label. Managed service at $0.05-0.30 per label. Platform subscription at $199/month.",
      industry: "ai_ml",
      ai_summary: "An affordable crowdsourced data labeling marketplace with quality assurance for ML teams who need training data fast.",
      goes_live_at: new Date(now.getTime() - 15 * 3600000).toISOString(),
      expires_at: new Date(now.getTime() + 33 * 3600000).toISOString(),
    },
    {
      author_id: authorId,
      status: "active",
      title: "SplitSmart — Intelligent Group Expense Splitting",
      problem: "Splitting expenses in groups creates awkward situations. Complex scenarios with recurring bills and multi-currency are poorly handled.",
      target_user: "Young adults aged 20-35 who share expenses with roommates, travel groups, or friend groups.",
      solution: "An intelligent splitting app with AI that learns spending patterns, handles multi-currency, and suggests optimal settlement paths.",
      monetization: "Freemium: free basic splitting. Premium at $3.99/month for receipt scanning and multi-currency.",
      industry: "fintech",
      ai_summary: "An intelligent expense splitting app with AI-powered pattern recognition, multi-currency support, and optimized settlement paths.",
      goes_live_at: new Date(now.getTime() - 16 * 3600000).toISOString(),
      expires_at: new Date(now.getTime() + 32 * 3600000).toISOString(),
    },
    {
      author_id: authorId,
      status: "active",
      title: "TherapyMatch — AI-Powered Therapist Matching",
      problem: "Finding the right therapist takes months of trial and error. Directories have generic profiles and insurance adds complexity.",
      target_user: "Adults aged 25-50 seeking therapy who want an intelligent matching process instead of trial and error.",
      solution: "An AI matching platform using detailed intake questionnaires covering therapy preferences, communication style, and specific concerns.",
      monetization: "Referral fee: therapists pay $50 per matched client. Monthly listing fee of $29/month for enhanced profiles.",
      industry: "healthtech",
      ai_summary: "An AI-powered platform that matches therapy seekers with compatible therapists based on personality, needs, and insurance.",
      goes_live_at: new Date(now.getTime() - 17 * 3600000).toISOString(),
      expires_at: new Date(now.getTime() + 31 * 3600000).toISOString(),
    },
    {
      author_id: authorId,
      status: "active",
      title: "SkillBridge — Skill-for-Skill Bartering Platform",
      problem: "Freelancers need services they can't afford while having valuable skills to trade. No structured platform exists for professional skill exchange.",
      target_user: "Freelancers and solopreneurs aged 25-45 with marketable skills but limited cash budgets.",
      solution: "A structured bartering platform with AI-powered fair value estimation, time-banking credits, and escrow-style completion verification.",
      monetization: "Freemium: free for 1-to-1 exchanges. Premium at $12.99/month for credit-based multi-party exchanges.",
      industry: "marketplace",
      ai_summary: "A professional skill bartering platform with AI-powered value estimation, time banking, and trust verification.",
      goes_live_at: new Date(now.getTime() - 18 * 3600000).toISOString(),
      expires_at: new Date(now.getTime() + 30 * 3600000).toISOString(),
    },
    {
      author_id: authorId,
      status: "active",
      title: "APIGuard — Automated API Security Testing",
      problem: "APIs are the most common attack vector but most teams lack expertise for security testing. Manual pen testing is expensive and infrequent.",
      target_user: "Backend developers at startups who build REST and GraphQL APIs and ship updates weekly.",
      solution: "An automated API security testing tool for CI/CD pipelines with schema-aware fuzzing, bypass testing, and auto-generated fix suggestions.",
      monetization: "Free for 100 endpoints/month. Pro at $79/month unlimited. Team at $199/month with 5 seats.",
      industry: "devtools",
      ai_summary: "An automated API security testing tool that runs in CI/CD pipelines with schema-aware testing and fix suggestions.",
      goes_live_at: new Date(now.getTime() - 19 * 3600000).toISOString(),
      expires_at: new Date(now.getTime() + 29 * 3600000).toISOString(),
    },
    {
      author_id: authorId,
      status: "active",
      title: "PlantPal — AI Plant Care Assistant",
      problem: "Houseplant ownership surged but so has plant mortality. Care instructions are generic and diagnosis comes too late.",
      target_user: "Millennial and Gen-Z houseplant enthusiasts aged 22-40 who own 3-20 plants but struggle to keep them alive.",
      solution: "An AI plant care assistant with camera-based health assessment, environment-specific care schedules, and growth tracking.",
      monetization: "Freemium: free for 5 plants. Premium at $4.99/month for unlimited plants and AI diagnosis.",
      industry: "consumer",
      ai_summary: "An AI plant care assistant providing personalized care schedules, disease diagnosis, and environment-specific recommendations.",
      goes_live_at: new Date(now.getTime() - 20 * 3600000).toISOString(),
      expires_at: new Date(now.getTime() + 28 * 3600000).toISOString(),
    },
  ];

  const { data: insertedIdeas, error: ideasError } = await supabase
    .from("ideas")
    .insert(ideas)
    .select("id, title");

  if (ideasError) {
    console.error("   ❌ Ideas insert failed:", ideasError.message);
    process.exit(1);
  }

  console.log(`   ✅ Inserted ${insertedIdeas.length} ideas:`);
  insertedIdeas.forEach((idea, i) => {
    console.log(`      ${i + 1}. ${idea.title}`);
  });

  console.log("\n🎉 Seed complete! You can now test the evaluate flow.");
}

seed().catch(console.error);
