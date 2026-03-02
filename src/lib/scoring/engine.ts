import { MIN_EVALUATIONS_FOR_CONFIDENCE } from "@/lib/constants";

interface EvaluationForScoring {
  q_problem_intensity: number;
  q_would_pay: number;
  q_differentiation: number;
  q_overall_viability: number;
  evaluator_experience: string;
  industry_match: boolean;
}

export interface ScoringResult {
  scoreProblem: number;
  scorePayment: number;
  scoreDiffer: number;
  scoreOverall: number;
  confidence: number;
  evaluationCount: number;
}

const EXPERIENCE_WEIGHTS: Record<string, number> = {
  student: 0.6,
  junior: 0.8,
  mid: 1.0,
  senior: 1.2,
  executive: 1.3,
};

const INDUSTRY_MATCH_BONUS = 1.25;

const DIMENSION_WEIGHTS = {
  problem: 0.4,
  payment: 0.35,
  differentiation: 0.25,
};

function getValidatorWeight(experience: string, industryMatch: boolean): number {
  const expWeight = EXPERIENCE_WEIGHTS[experience] ?? 1.0;
  const matchBonus = industryMatch ? INDUSTRY_MATCH_BONUS : 1.0;
  return expWeight * matchBonus;
}

function weightedAverage(
  evaluations: EvaluationForScoring[],
  field: keyof Pick<
    EvaluationForScoring,
    "q_problem_intensity" | "q_would_pay" | "q_differentiation" | "q_overall_viability"
  >
): number {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const evaluation of evaluations) {
    const weight = getValidatorWeight(
      evaluation.evaluator_experience,
      evaluation.industry_match
    );
    weightedSum += evaluation[field] * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 0;

  const rawAvg = weightedSum / totalWeight;
  // Normalize from [1, 5] to [0, 10]
  return Math.round(((rawAvg - 1) * 2.5) * 100) / 100;
}

export function calculateIdeaScores(
  evaluations: EvaluationForScoring[]
): ScoringResult {
  if (evaluations.length === 0) {
    return {
      scoreProblem: 0,
      scorePayment: 0,
      scoreDiffer: 0,
      scoreOverall: 0,
      confidence: 0,
      evaluationCount: 0,
    };
  }

  const scoreProblem = weightedAverage(evaluations, "q_problem_intensity");
  const scorePayment = weightedAverage(evaluations, "q_would_pay");
  const scoreDiffer = weightedAverage(evaluations, "q_differentiation");

  const scoreOverall =
    Math.round(
      (DIMENSION_WEIGHTS.problem * scoreProblem +
        DIMENSION_WEIGHTS.payment * scorePayment +
        DIMENSION_WEIGHTS.differentiation * scoreDiffer) *
        100
    ) / 100;

  const confidence = Math.min(
    evaluations.length / MIN_EVALUATIONS_FOR_CONFIDENCE,
    1.0
  );

  return {
    scoreProblem,
    scorePayment,
    scoreDiffer,
    scoreOverall,
    confidence,
    evaluationCount: evaluations.length,
  };
}

export function getSignalLabel(
  scoreOverall: number
): "strong" | "weak" | "none" {
  if (scoreOverall >= 6.5) return "strong";
  if (scoreOverall >= 4.0) return "weak";
  return "none";
}
