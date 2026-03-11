import { getIdeaWithEvaluations } from "@/lib/actions/idea";
import { calculateIdeaScores, getSignalLabel } from "@/lib/scoring/engine";
import { ScoreOverview } from "@/components/dashboard/score-overview";
import { CommentThemes } from "@/components/dashboard/comment-themes";
import { EvaluatorBreakdown } from "@/components/dashboard/evaluator-breakdown";
import { TimeRemaining } from "@/components/dashboard/time-remaining";
import { IdeaStatusBadge } from "@/components/dashboard/idea-status-badge";
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

  const signal = scores.scoreOverall > 0 ? getSignalLabel(scores.scoreOverall) : null;
  const signalLabel = signal === "strong"
    ? t("signalStrong")
    : signal === "weak"
      ? t("signalWeak")
      : signal === "none"
        ? t("signalNone")
        : "\u2014";

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {idea.title}
          </h1>
          <IdeaStatusBadge
            status={idea.status}
            scoreOverall={scores.scoreOverall}
          />
        </div>
        {idea.ai_summary && (
          <p className="text-sm leading-relaxed text-gray-500">
            {idea.ai_summary}
          </p>
        )}
        <div className="flex items-center gap-4 text-xs text-gray-400">
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

      {/* Overall signal — hero card */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm shadow-gray-950/[0.03]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-50/40 to-transparent" />
        <div className="relative text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            {t("overallScore")}
          </p>
          <p className="mt-3 text-6xl font-bold tracking-tighter text-brand-600">
            {scores.scoreOverall.toFixed(1)}
          </p>
          <p className="mt-2 text-sm font-medium text-gray-500">
            {signalLabel}
          </p>
          {/* Confidence bar */}
          <div className="mx-auto mt-4 h-1 w-32 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-700"
              style={{ width: `${Math.round(scores.confidence * 100)}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-gray-400">
            {t("confidence", { percent: Math.round(scores.confidence * 100) })}
          </p>
        </div>
      </div>

      {/* Dimension scores */}
      <ScoreOverview scores={scores} />

      {/* Comment themes + evaluator breakdown in grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <CommentThemes themes={idea.ai_themes} />
        </div>
        {evaluations.length > 0 && (
          <div className="lg:col-span-2">
            <EvaluatorBreakdown
              byIndustry={byIndustry}
              byExperience={byExperience}
              total={evaluations.length}
            />
          </div>
        )}
      </div>
    </div>
  );
}
