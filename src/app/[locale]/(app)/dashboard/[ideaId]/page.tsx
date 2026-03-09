import { getIdeaWithEvaluations } from "@/lib/actions/idea";
import { calculateIdeaScores, getSignalLabel } from "@/lib/scoring/engine";
import { ScoreOverview } from "@/components/dashboard/score-overview";
import { CommentThemes } from "@/components/dashboard/comment-themes";
import { EvaluatorBreakdown } from "@/components/dashboard/evaluator-breakdown";
import { TimeRemaining } from "@/components/dashboard/time-remaining";
import { IdeaStatusBadge } from "@/components/dashboard/idea-status-badge";
import { ScoreCard } from "@/components/dashboard/score-card";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function IdeaDetailPage({
  params,
}: {
  params: Promise<{ ideaId: string; locale: string }>;
}) {
  const { ideaId } = await params;
  const t = await getTranslations("dashboard");
  const { idea, evaluations, error } = await getIdeaWithEvaluations(ideaId);

  if (error || !idea) {
    notFound();
  }

  // Calculate scores from evaluations
  const scores = calculateIdeaScores(evaluations);

  // Build breakdown data
  const industryMap = new Map<string, number>();
  const experienceMap = new Map<string, number>();

  for (const evaluation of evaluations) {
    const ind = evaluation.evaluator_industry || "other";
    industryMap.set(ind, (industryMap.get(ind) || 0) + 1);
    const exp = evaluation.evaluator_experience;
    experienceMap.set(exp, (experienceMap.get(exp) || 0) + 1);
  }

  const byIndustry = Array.from(industryMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);

  const byExperience = Array.from(experienceMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{idea.title}</h1>
            <IdeaStatusBadge
              status={idea.status}
              scoreOverall={scores.scoreOverall}
            />
          </div>
          {idea.ai_summary && (
            <p className="mt-1 text-sm text-gray-600">{idea.ai_summary}</p>
          )}
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span>{t("evaluations", { count: scores.evaluationCount })}</span>
            <span>
              {t("confidence", {
                percent: Math.round(scores.confidence * 100),
              })}
            </span>
            {idea.status === "active" && (
              <TimeRemaining expiresAt={idea.expires_at} />
            )}
          </div>
        </div>
      </div>

      {/* Overall signal */}
      <Card className="text-center py-6">
        <p className="text-sm text-gray-500 uppercase tracking-wide">
          {t("overallScore")}
        </p>
        <p className="mt-1 text-5xl font-bold text-emerald-600">
          {scores.scoreOverall.toFixed(1)}
        </p>
        <p className="mt-2 text-sm font-medium">
          {scores.scoreOverall > 0
            ? getSignalLabel(scores.scoreOverall) === "strong"
              ? t("signalStrong")
              : getSignalLabel(scores.scoreOverall) === "weak"
                ? t("signalWeak")
                : t("signalNone")
            : "—"}
        </p>
      </Card>

      {/* Dimension scores */}
      <ScoreOverview scores={scores} />

      {/* Comment themes */}
      <CommentThemes themes={idea.ai_themes} />

      {/* Evaluator breakdown */}
      {evaluations.length > 0 && (
        <EvaluatorBreakdown
          byIndustry={byIndustry}
          byExperience={byExperience}
          total={evaluations.length}
        />
      )}
    </div>
  );
}
