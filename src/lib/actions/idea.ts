"use server";

import { createClient } from "@/lib/supabase/server";
import { EVAL_REQUIRED, MAX_SUBMISSIONS_PER_DAY } from "@/lib/constants";
import { generateIdeaSummary } from "@/lib/anthropic/summarize";
import { moderateContent } from "@/lib/anthropic/moderate";
import type { Idea } from "@/types/database";

interface SubmitResult {
  error?: string;
  ideaId?: string;
}

export async function submitIdea(formData: FormData): Promise<SubmitResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Check evaluation gate
  const { data: profile } = await supabase
    .from("profiles")
    .select("evaluations_completed")
    .eq("id", user.id)
    .single();

  if (!profile || profile.evaluations_completed < EVAL_REQUIRED) {
    return { error: "Complete 15 evaluations first" };
  }

  // Rate limit: max submissions per day
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("ideas")
    .select("*", { count: "exact", head: true })
    .eq("author_id", user.id)
    .gte("created_at", dayStart.toISOString());

  if (count !== null && count >= MAX_SUBMISSIONS_PER_DAY) {
    return { error: "Daily submission limit reached" };
  }

  const title = (formData.get("title") as string)?.trim();
  const problem = (formData.get("problem") as string)?.trim();
  const targetUser = (formData.get("target_user") as string)?.trim();
  const solution = (formData.get("solution") as string)?.trim();
  const monetization = (formData.get("monetization") as string)?.trim();
  const industry = formData.get("industry") as string;

  // Basic validation
  if (!title || !problem || !targetUser || !solution || !monetization || !industry) {
    return { error: "All fields are required" };
  }

  // Content moderation
  const fullText = `${title} ${problem} ${targetUser} ${solution} ${monetization}`;
  const moderation = await moderateContent(fullText);

  // Generate AI summary
  const aiSummary = await generateIdeaSummary({
    title,
    problem,
    target_user: targetUser,
    solution,
    monetization,
  });

  // Insert idea
  const { data: idea, error: insertError } = await supabase
    .from("ideas")
    .insert({
      author_id: user.id,
      title,
      problem,
      target_user: targetUser,
      solution,
      monetization,
      industry,
      ai_summary: aiSummary,
      status: moderation.flagged ? "moderation_review" : "active",
      moderation_flag: moderation.flagged,
      moderation_note: moderation.reason,
    })
    .select("id")
    .single();

  if (insertError) {
    return { error: insertError.message };
  }

  return { ideaId: idea.id };
}

export async function getUserIdeas(): Promise<{ ideas: Idea[]; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ideas: [], error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { ideas: [], error: error.message };
  }

  return { ideas: (data || []) as Idea[] };
}

export async function getIdeaWithEvaluations(ideaId: string): Promise<{
  idea: Idea | null;
  evaluations: Array<{
    q_problem_intensity: number;
    q_would_pay: number;
    q_differentiation: number;
    q_overall_viability: number;
    comment: string | null;
    evaluator_experience: string;
    evaluator_industry: string | null;
    industry_match: boolean;
  }>;
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { idea: null, evaluations: [], error: "Not authenticated" };
  }

  const { data: idea, error: ideaError } = await supabase
    .from("ideas")
    .select("*")
    .eq("id", ideaId)
    .eq("author_id", user.id)
    .single();

  if (ideaError || !idea) {
    return { idea: null, evaluations: [], error: "Idea not found" };
  }

  const { data: evaluations } = await supabase
    .from("evaluations")
    .select(
      "q_problem_intensity, q_would_pay, q_differentiation, q_overall_viability, comment, evaluator_experience, evaluator_industry, industry_match"
    )
    .eq("idea_id", ideaId);

  return {
    idea: idea as Idea,
    evaluations: evaluations || [],
  };
}
