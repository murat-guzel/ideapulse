// Dashboard demo seed — run with: node scripts/seed-dashboard-demo.mjs
// Creates a submitted idea by test user + 100 mock evaluators with evaluations
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://oucrqwucwarowjyphjph.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// --- Helpers ---
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
// Weighted random: skew towards higher scores for a "strong signal" idea
function skewedScore(low, high, skew = 0.6) {
  const r = Math.pow(Math.random(), 1 - skew); // higher skew → higher scores
  return Math.round(low + r * (high - low));
}

const INDUSTRIES = [
  "fintech", "healthtech", "edtech", "ecommerce", "saas",
  "ai_ml", "social", "marketplace", "devtools", "enterprise",
  "consumer", "gaming", "climate", "other",
];
const EXPERIENCES = ["student", "junior", "mid", "senior", "executive"];
const EXP_DISTRIBUTION = [
  // Realistic distribution: more mid/senior, fewer student/executive
  "student", "student", "student",
  "junior", "junior", "junior", "junior", "junior",
  "mid", "mid", "mid", "mid", "mid", "mid", "mid", "mid", "mid", "mid",
  "mid", "mid", "mid", "mid", "mid", "mid", "mid", "mid",
  "senior", "senior", "senior", "senior", "senior", "senior", "senior",
  "senior", "senior", "senior", "senior", "senior", "senior", "senior",
  "senior", "senior",
  "executive", "executive", "executive", "executive", "executive",
];

const POSITIVE_COMMENTS = [
  "This is a real problem. I've been looking for something like this.",
  "Love the approach — the AI-powered matching could be a real differentiator.",
  "The market timing feels right for this. Remote work has amplified the need.",
  "I'd pay for this tomorrow if it existed. Take my money!",
  "Clean value prop. The pricing model makes sense for the target audience.",
  "This could easily expand into enterprise after nailing the SMB market.",
  "The competitive moat from network effects is strong here.",
  "I've tried 3 similar tools and none solved the core problem this well.",
  "The freemium-to-paid conversion funnel seems well thought out.",
  "Interesting take on a crowded space. The AI angle is the key differentiator.",
  "Solid execution plan. The 48-hour validation loop is genius.",
  "My team would switch to this in a heartbeat.",
  "The onboarding friction seems low which is crucial for adoption.",
  "I can see this becoming a category-defining product.",
  "The B2B2C model gives you multiple revenue streams. Smart.",
];

const NEUTRAL_COMMENTS = [
  "Interesting concept but I'd want to see the unit economics work out.",
  "The market exists but competition is fierce. Execution will matter.",
  "Good idea, but the differentiation isn't crystal clear to me yet.",
  "I'd want to see a prototype before committing to paying.",
  "The target user segment might be too broad. Consider narrowing.",
  "There might be regulatory hurdles to consider in some markets.",
  "Could work, but customer acquisition cost might be challenging.",
  "The idea is solid but the monetization model needs more thought.",
  "I see potential but also significant technical challenges.",
  "Worth testing, but the market validation is key before scaling.",
];

const CRITICAL_COMMENTS = [
  "I've seen similar products fail. What makes this different?",
  "The pricing seems too low to sustain the business.",
  "This solves a nice-to-have, not a must-have problem.",
  "Hard to see how this scales beyond a niche market.",
  "The cold start problem could be really challenging here.",
];

const FIRST_NAMES = [
  "Emma", "Liam", "Sophia", "Noah", "Olivia", "James", "Ava", "William",
  "Isabella", "Oliver", "Mia", "Benjamin", "Charlotte", "Elijah", "Amelia",
  "Lucas", "Harper", "Mason", "Evelyn", "Logan", "Luna", "Alexander",
  "Ella", "Ethan", "Aria", "Daniel", "Chloe", "Henry", "Scarlett", "Jackson",
  "Grace", "Sebastian", "Lily", "Aiden", "Zoey", "Matthew", "Nora", "Samuel",
  "Riley", "David", "Layla", "Joseph", "Penelope", "Carter", "Victoria",
  "Owen", "Stella", "Wyatt", "Hannah", "John", "Emilia", "Jack", "Zoe",
  "Luke", "Aurora", "Jayden", "Savannah", "Dylan", "Audrey", "Grayson",
  "Brooklyn", "Levi", "Leah", "Isaac", "Claire", "Gabriel", "Skylar",
  "Julian", "Lucy", "Mateo", "Paisley", "Anthony", "Everly", "Jaxon",
  "Anna", "Lincoln", "Caroline", "Joshua", "Nova", "Christopher", "Genesis",
  "Andrew", "Emery", "Theodore", "Kennedy", "Caleb", "Samantha", "Ryan",
  "Maya", "Asher", "Willow", "Nathan", "Kinsley", "Thomas", "Naomi",
  "Leo", "Aaliyah", "Isaiah", "Elena", "Charles", "Sarah",
];

async function seedDashboardDemo() {
  console.log("🎯 Starting Dashboard Demo Seed...\n");

  // 1. Find the test user
  console.log("1️⃣  Finding test user...");
  const { data: users } = await supabase.auth.admin.listUsers();
  const testUser = users?.users?.find((u) => u.email === "test@ideapulse.com");

  if (!testUser) {
    console.error("❌ Test user not found. Create test@ideapulse.com first.");
    process.exit(1);
  }
  console.log(`   ✅ Found: ${testUser.id}`);

  // 2. Insert the test user's idea
  console.log("\n2️⃣  Creating submitted idea...");
  const now = new Date();

  const { data: idea, error: ideaErr } = await supabase
    .from("ideas")
    .insert({
      author_id: testUser.id,
      status: "active",
      title: "DevFlow — AI-Powered Developer Workflow Automation",
      problem:
        "Developers spend 40% of their time on repetitive tasks like writing boilerplate, managing PRs, updating documentation, and context-switching between tools. Current automation tools are fragmented and require significant setup. No single platform intelligently orchestrates the full development workflow from ticket to deployment.",
      target_user:
        "Full-stack developers and engineering leads at startups and mid-size companies (10-500 employees) who ship code daily and feel overwhelmed by tooling fragmentation. They value speed and developer experience over enterprise-grade features.",
      solution:
        "An AI-powered CLI and VS Code extension that learns your workflow patterns and automates repetitive tasks. It auto-generates boilerplate from natural language, creates PRs with contextual descriptions, keeps docs in sync with code changes, and orchestrates your entire CI/CD pipeline with intelligent defaults. Uses local LLM inference for privacy-sensitive codebases.",
      monetization:
        "Freemium: free for individual devs (5 automations/day). Pro at $19/month for unlimited automations and team features. Team plan at $12/seat/month for 5+ developers with shared workflow templates and analytics.",
      industry: "devtools",
      ai_summary:
        "An AI-powered developer workflow automation platform that learns coding patterns and automates repetitive tasks from boilerplate generation to PR management, reducing developer friction and increasing shipping velocity.",
      ai_themes: JSON.stringify([
        { theme: "Strong developer pain point", sentiment: "positive", count: 42 },
        { theme: "Market timing is right", sentiment: "positive", count: 35 },
        { theme: "Pricing concerns for startups", sentiment: "neutral", count: 18 },
        { theme: "Competition from GitHub Copilot", sentiment: "negative", count: 12 },
        { theme: "Privacy advantage with local LLM", sentiment: "positive", count: 28 },
        { theme: "Enterprise potential", sentiment: "positive", count: 22 },
      ]),
      goes_live_at: new Date(now.getTime() - 24 * 3600000).toISOString(),
      expires_at: new Date(now.getTime() + 24 * 3600000).toISOString(),
    })
    .select("id")
    .single();

  if (ideaErr) {
    console.error("   ❌ Idea insert failed:", ideaErr.message);
    process.exit(1);
  }
  console.log(`   ✅ Idea created: ${idea.id}`);

  // 3. Create 100 mock evaluator users + profiles
  console.log("\n3️⃣  Creating 100 mock evaluators...");
  const evaluatorIds = [];

  for (let i = 1; i <= 100; i++) {
    const email = `evaluator-${i}@ideapulse.mock`;
    const experience = pick(EXP_DISTRIBUTION);
    const industry = pick(INDUSTRIES);
    const interests = [industry, pick(INDUSTRIES), pick(INDUSTRIES)].filter(
      (v, idx, arr) => arr.indexOf(v) === idx
    );

    // Create user
    const { data: evalUser, error: userErr } =
      await supabase.auth.admin.createUser({
        email,
        password: "MockEval123!",
        email_confirm: true,
      });

    let userId;
    if (userErr) {
      if (userErr.message?.includes("already been registered")) {
        // Find existing user
        const existing = users?.users?.find((u) => u.email === email);
        userId = existing?.id;
        if (!userId) {
          // re-fetch users to find this one
          const { data: allUsers } = await supabase.auth.admin.listUsers({ perPage: 1000 });
          const found = allUsers?.users?.find((u) => u.email === email);
          userId = found?.id;
        }
      } else {
        console.error(`   ❌ Failed to create evaluator ${i}:`, userErr.message);
        continue;
      }
    } else {
      userId = evalUser.user?.id;
    }

    if (!userId) {
      console.error(`   ❌ No ID for evaluator ${i}`);
      continue;
    }

    // Update profile
    await supabase
      .from("profiles")
      .update({
        full_name: `${pick(FIRST_NAMES)} ${String.fromCharCode(65 + rand(0, 25))}.`,
        role: pick(["founder", "validator", "both"]),
        industry,
        experience_level: experience,
        interests,
        is_profile_complete: true,
        evaluations_completed: rand(15, 50),
      })
      .eq("id", userId);

    evaluatorIds.push({ id: userId, experience, industry });

    if (i % 20 === 0) console.log(`   📌 Created ${i}/100 evaluators`);
  }
  console.log(`   ✅ ${evaluatorIds.length} evaluators ready`);

  // 4. Insert 100 evaluations
  console.log("\n4️⃣  Inserting evaluations...");
  const evaluations = [];

  for (const evaluator of evaluatorIds) {
    const industryMatch = evaluator.industry === "devtools";

    // Skew scores towards positive (this is a "strong signal" idea)
    // Problem intensity: most people feel this pain → higher scores
    const q1 = skewedScore(1, 5, 0.65);
    // Would pay: developers have budgets → moderate-high scores
    const q2 = skewedScore(1, 5, 0.55);
    // Differentiation: good but some competition → slightly lower
    const q3 = skewedScore(1, 5, 0.45);
    // Overall viability: generally positive
    const q4 = skewedScore(1, 5, 0.55);

    // Pick a comment based on score sentiment
    const avgScore = (q1 + q2 + q3 + q4) / 4;
    let comment = null;
    if (Math.random() < 0.6) {
      // 60% leave a comment
      if (avgScore >= 4) {
        comment = pick(POSITIVE_COMMENTS);
      } else if (avgScore >= 2.5) {
        comment = pick(NEUTRAL_COMMENTS);
      } else {
        comment = pick(CRITICAL_COMMENTS);
      }
    }

    evaluations.push({
      idea_id: idea.id,
      evaluator_id: evaluator.id,
      q_problem_intensity: q1,
      q_would_pay: q2,
      q_differentiation: q3,
      q_overall_viability: q4,
      comment,
      evaluator_experience: evaluator.experience,
      evaluator_industry: evaluator.industry,
      industry_match: industryMatch,
    });
  }

  // Batch insert evaluations
  const { error: evalErr } = await supabase.from("evaluations").insert(evaluations);
  if (evalErr) {
    console.error("   ❌ Evaluations insert failed:", evalErr.message);
    process.exit(1);
  }
  console.log(`   ✅ ${evaluations.length} evaluations inserted`);

  // 5. Update denormalized scores on the idea
  console.log("\n5️⃣  Updating idea scores...");

  // Calculate weighted scores (matching the scoring engine logic)
  const EXP_WEIGHTS = { student: 0.6, junior: 0.8, mid: 1.0, senior: 1.2, executive: 1.3 };
  const MATCH_BONUS = 1.25;

  function calcWeightedAvg(evals, field) {
    let ws = 0, tw = 0;
    for (const e of evals) {
      const w = (EXP_WEIGHTS[e.evaluator_experience] ?? 1.0) * (e.industry_match ? MATCH_BONUS : 1.0);
      ws += e[field] * w;
      tw += w;
    }
    return tw === 0 ? 0 : Math.round(((ws / tw - 1) * 2.5) * 100) / 100;
  }

  const scoreProblem = calcWeightedAvg(evaluations, "q_problem_intensity");
  const scorePayment = calcWeightedAvg(evaluations, "q_would_pay");
  const scoreDiffer = calcWeightedAvg(evaluations, "q_differentiation");
  const scoreOverall = Math.round(
    (0.4 * scoreProblem + 0.35 * scorePayment + 0.25 * scoreDiffer) * 100
  ) / 100;

  const { error: updateErr } = await supabase
    .from("ideas")
    .update({
      score_problem: scoreProblem,
      score_payment: scorePayment,
      score_differ: scoreDiffer,
      score_overall: scoreOverall,
      evaluation_count: evaluations.length,
    })
    .eq("id", idea.id);

  if (updateErr) {
    console.error("   ❌ Score update failed:", updateErr.message);
  } else {
    console.log(`   ✅ Scores updated:`);
    console.log(`      Problem:        ${scoreProblem.toFixed(2)} / 10`);
    console.log(`      Payment:        ${scorePayment.toFixed(2)} / 10`);
    console.log(`      Differentiation: ${scoreDiffer.toFixed(2)} / 10`);
    console.log(`      Overall:        ${scoreOverall.toFixed(2)} / 10`);
  }

  console.log("\n🎉 Dashboard demo ready!");
  console.log(`   Idea ID: ${idea.id}`);
  console.log(`   Log in as test@ideapulse.com / Test1234!`);
  console.log(`   Navigate to /en/dashboard to see the results`);
}

seedDashboardDemo().catch(console.error);
