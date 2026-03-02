"use server";

import { createClient } from "@/lib/supabase/server";
import { MAX_COMMENT_LENGTH, MAX_EVALUATIONS_PER_HOUR } from "@/lib/constants";
import type { Idea } from "@/types/database";

interface EvaluationResult {
  error?: string;
  success?: boolean;
}

export async function getNextIdea(): Promise<{ idea: Idea | null; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { idea: null, error: "Not authenticated" };
  }

  const { data, error } = await supabase.rpc("get_next_idea_for_user", {
    p_user_id: user.id,
  });

  if (error) {
    return { idea: null, error: error.message };
  }

  return { idea: (data && data.length > 0 ? data[0] : null) as Idea | null };
}

export async function submitEvaluation(formData: FormData): Promise<EvaluationResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const ideaId = formData.get("idea_id") as string;
  const qProblem = parseInt(formData.get("q_problem_intensity") as string);
  const qPay = parseInt(formData.get("q_would_pay") as string);
  const qDiff = parseInt(formData.get("q_differentiation") as string);
  const qViability = parseInt(formData.get("q_overall_viability") as string);
  const comment = (formData.get("comment") as string)?.trim() || null;

  // Validate
  if (!ideaId || !qProblem || !qPay || !qDiff || !qViability) {
    return { error: "All questions are required" };
  }

  for (const val of [qProblem, qPay, qDiff, qViability]) {
    if (val < 1 || val > 5) {
      return { error: "Invalid score value" };
    }
  }

  if (comment && comment.length > MAX_COMMENT_LENGTH) {
    return { error: `Comment must be ${MAX_COMMENT_LENGTH} characters or less` };
  }

  // Rate limit check
  const hourStart = new Date();
  hourStart.setMinutes(0, 0, 0);

  const { data: rateData } = await supabase
    .from("rate_limits")
    .select("count")
    .eq("user_id", user.id)
    .eq("action_type", "evaluation")
    .gte("window_start", hourStart.toISOString())
    .single();

  if (rateData && rateData.count >= MAX_EVALUATIONS_PER_HOUR) {
    return { error: "Rate limit reached. Try again in an hour." };
  }

  // Get evaluator profile for metadata snapshot
  const { data: profile } = await supabase
    .from("profiles")
    .select("experience_level, industry")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return { error: "Profile not found" };
  }

  // Get idea's industry for match check
  const { data: idea } = await supabase
    .from("ideas")
    .select("industry, author_id")
    .eq("id", ideaId)
    .single();

  if (!idea) {
    return { error: "Idea not found" };
  }

  if (idea.author_id === user.id) {
    return { error: "Cannot evaluate your own idea" };
  }

  const industryMatch = profile.industry === idea.industry;

  // Insert evaluation
  const { error: insertError } = await supabase.from("evaluations").insert({
    idea_id: ideaId,
    evaluator_id: user.id,
    q_problem_intensity: qProblem,
    q_would_pay: qPay,
    q_differentiation: qDiff,
    q_overall_viability: qViability,
    comment,
    evaluator_experience: profile.experience_level || "mid",
    evaluator_industry: profile.industry,
    industry_match: industryMatch,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return { error: "You already evaluated this idea" };
    }
    return { error: insertError.message };
  }

  // Update rate limit
  await supabase.from("rate_limits").upsert(
    {
      user_id: user.id,
      action_type: "evaluation" as const,
      window_start: hourStart.toISOString(),
      count: (rateData?.count || 0) + 1,
    },
    { onConflict: "user_id,action_type,window_start" }
  );

  return { success: true };
}

export async function getEvaluationProgress(): Promise<{
  completed: number;
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { completed: 0, error: "Not authenticated" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("evaluations_completed")
    .eq("id", user.id)
    .single();

  return { completed: profile?.evaluations_completed ?? 0 };
}
