"use client";

import { useTranslations } from "next-intl";
import { ScoreCard } from "./score-card";
import type { ScoringResult } from "@/lib/scoring/engine";

interface ScoreOverviewProps {
  scores: ScoringResult;
}

export function ScoreOverview({ scores }: ScoreOverviewProps) {
  const t = useTranslations("dashboard");

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <ScoreCard label={t("problemScore")} score={scores.scoreProblem} />
      <ScoreCard label={t("paymentScore")} score={scores.scorePayment} />
      <ScoreCard label={t("differentiationScore")} score={scores.scoreDiffer} />
    </div>
  );
}
