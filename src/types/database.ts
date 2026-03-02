export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: "founder" | "validator" | "both" | null;
  industry: string | null;
  experience_level: "student" | "junior" | "mid" | "senior" | "executive" | null;
  interests: string[];
  evaluations_completed: number;
  can_submit: boolean;
  locale: "en" | "tr";
  is_profile_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface Idea {
  id: string;
  author_id: string;
  status: "active" | "closed" | "moderation_review" | "rejected";
  title: string;
  problem: string;
  target_user: string;
  solution: string;
  monetization: string;
  industry: string;
  ai_summary: string | null;
  ai_themes: AiTheme[] | null;
  score_problem: number | null;
  score_payment: number | null;
  score_differ: number | null;
  score_overall: number | null;
  evaluation_count: number;
  goes_live_at: string;
  expires_at: string;
  closed_at: string | null;
  moderation_flag: boolean;
  moderation_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface Evaluation {
  id: string;
  idea_id: string;
  evaluator_id: string;
  q_problem_intensity: number;
  q_would_pay: number;
  q_differentiation: number;
  q_overall_viability: number;
  comment: string | null;
  evaluator_experience: string;
  evaluator_industry: string | null;
  industry_match: boolean;
  comment_flagged: boolean;
  created_at: string;
}

export interface AiTheme {
  label: string;
  summary: string;
  sentiment: "positive" | "negative" | "neutral";
}

export interface RateLimit {
  id: string;
  user_id: string;
  action_type: "evaluation" | "submission" | "ai_call";
  window_start: string;
  count: number;
}
