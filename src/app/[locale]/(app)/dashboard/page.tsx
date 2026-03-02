import { useTranslations } from "next-intl";
import { getUserIdeas } from "@/lib/actions/idea";
import { Card } from "@/components/ui/card";
import { IdeaStatusBadge } from "@/components/dashboard/idea-status-badge";
import { TimeRemaining } from "@/components/dashboard/time-remaining";
import { Link } from "@/i18n/navigation";
import { EVAL_REQUIRED } from "@/lib/constants";

export default async function DashboardPage() {
  const { ideas } = await getUserIdeas();
  const t = useTranslations("dashboard");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-gray-600">{t("subtitle")}</p>
      </div>

      {ideas.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="text-lg font-medium text-gray-900">{t("noIdeas")}</p>
          <p className="mt-2 text-sm text-gray-500">
            {t("noIdeasDesc", { total: EVAL_REQUIRED })}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {ideas.map((idea) => (
            <Link key={idea.id} href={`/dashboard/${idea.id}`}>
              <Card className="flex items-center justify-between hover:border-indigo-200 transition-colors cursor-pointer">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {idea.title}
                    </h3>
                    <IdeaStatusBadge
                      status={idea.status}
                      scoreOverall={idea.score_overall}
                    />
                  </div>
                  {idea.ai_summary && (
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {idea.ai_summary}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      {t("evaluations", { count: idea.evaluation_count })}
                    </span>
                    {idea.status === "active" && (
                      <TimeRemaining expiresAt={idea.expires_at} />
                    )}
                  </div>
                </div>
                {idea.score_overall !== null && (
                  <div className="ml-4 text-right">
                    <p className="text-2xl font-bold text-indigo-600">
                      {idea.score_overall.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500">{t("overallScore")}</p>
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
