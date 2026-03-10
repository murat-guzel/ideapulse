// Production cleanup — removes mock data, keeps 20 seed ideas
// Run: node scripts/cleanup-prod.mjs
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://oucrqwucwarowjyphjph.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function cleanup() {
  console.log("🧹 Production cleanup starting...\n");

  // 1. List all users
  const { data: allUsers } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const users = allUsers?.users || [];
  console.log(`Total users in system: ${users.length}`);

  // 2. Find mock evaluators
  const mockEvaluators = users.filter((u) => u.email?.endsWith("@ideapulse.mock"));
  console.log(`\n1️⃣  Mock evaluators found: ${mockEvaluators.length}`);

  // 3. Find test user
  const testUser = users.find((u) => u.email === "test@ideapulse.com");
  console.log(`2️⃣  Test user found: ${testUser ? "yes" : "no"}`);

  // 4. Delete DevFlow idea + its evaluations (cascade)
  if (testUser) {
    const { data: testIdeas } = await supabase
      .from("ideas")
      .select("id, title")
      .eq("author_id", testUser.id);

    if (testIdeas && testIdeas.length > 0) {
      for (const idea of testIdeas) {
        console.log(`3️⃣  Deleting idea: ${idea.title}`);
      }
      const { error: delErr } = await supabase
        .from("ideas")
        .delete()
        .eq("author_id", testUser.id);
      if (delErr) console.error("   ❌", delErr.message);
      else console.log("   ✅ Test ideas + evaluations deleted (cascade)");
    }
  }

  // 5. Delete mock evaluator auth users (profiles cascade deleted)
  let deleted = 0;
  for (const evaluator of mockEvaluators) {
    const { error } = await supabase.auth.admin.deleteUser(evaluator.id);
    if (!error) deleted++;
    if (deleted % 20 === 0) console.log(`   📌 Deleted ${deleted}/${mockEvaluators.length}`);
  }
  console.log(`4️⃣  Mock evaluators deleted: ${deleted}/${mockEvaluators.length}`);

  // 6. Delete test user
  if (testUser) {
    const { error } = await supabase.auth.admin.deleteUser(testUser.id);
    if (!error) console.log("5️⃣  ✅ test@ideapulse.com deleted");
    else console.error("5️⃣  ❌", error.message);
  }

  // 7. Verify remaining data
  const { data: remainingIdeas } = await supabase
    .from("ideas")
    .select("id, title, status");

  console.log("\n📊 Remaining data:");
  console.log(`   Ideas: ${remainingIdeas?.length || 0}`);
  if (remainingIdeas) {
    remainingIdeas.forEach((idea, i) => {
      console.log(`   ${i + 1}. [${idea.status}] ${idea.title}`);
    });
  }

  const { data: remainingUsers } = await supabase.auth.admin.listUsers({ perPage: 10 });
  console.log(`   Users: ${remainingUsers?.users?.length || 0}`);
  remainingUsers?.users?.forEach((u) => {
    console.log(`   - ${u.email}`);
  });

  console.log("\n🎉 Cleanup done! 20 seed ideas ready for production.");
}

cleanup().catch(console.error);
