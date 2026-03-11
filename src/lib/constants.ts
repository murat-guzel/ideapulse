export const EVAL_REQUIRED = 5;
export const IDEA_LIFETIME_HOURS = 48;
export const MAX_COMMENT_LENGTH = 500;
export const MAX_EVALUATIONS_PER_HOUR = 60;
export const MAX_SUBMISSIONS_PER_DAY = 5;
export const MIN_EVALUATIONS_FOR_CONFIDENCE = 20;
export const MIN_EVALUATIONS_FOR_CLUSTERING = 5;

export const EXPERIENCE_LEVELS = [
  "student",
  "junior",
  "mid",
  "senior",
  "executive",
] as const;

export const INDUSTRIES = [
  "fintech",
  "healthtech",
  "edtech",
  "ecommerce",
  "saas",
  "ai_ml",
  "social",
  "marketplace",
  "devtools",
  "enterprise",
  "consumer",
  "gaming",
  "climate",
  "other",
] as const;

export const ROLES = ["founder", "validator", "both"] as const;

export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];
export type Industry = (typeof INDUSTRIES)[number];
export type Role = (typeof ROLES)[number];
