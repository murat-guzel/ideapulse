import { getTranslations } from "next-intl/server";
import { getUserIdeas } from "@/lib/actions/idea";
import { Card } from "@/components/ui/card";
import { IdeaStatusBadge } from "@/components/dashboard/idea-status-badge";
import { TimeRemaining } from "@/components/dashboard/time-remaining";
import { Link } from "@/i18n/navigation";
import { EVAL_REQUIRED } from "@/lib/constants";

export default async function DashboardPage() {
  const { ideas } = await getUserIdeas();
  const t = await getTranslations("dashboard");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">
          {t("title")}
        </h1>
        <p className="mt-1 text-[13px] text-gray-500">{t("subtitle")}</p>
      </div>

      {ideas.length === 0 ? (
        <Card className="py-16 text-center">
          <p className="text-base font-medium text-gray-900">{t("noIdeas")}</p>
          <p className="mt-2 text-[13px] text-gray-500">
            {t("noIdeasDesc", { total: EVAL_REQUIRED })}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {ideas.map((idea) => (
            <Link key={idea.id} href={`/dashboard/${idea.id}`}>
              <Card className="flex items-center justify-between transition-all duration-200 hover:border-brand-200 hover:shadow-md hover:shadow-brand-600/[0.04] cursor-pointer">
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-semibold tracking-tight text-gray-900">
                      {idea.title}
                    </h3>
                    <IdeaStatusBadge
                      status={idea.status}
                      scoreOverall={idea.score_overall}
                    />
                  </div>
                  {idea.ai_summary && (
                    <p className="text-[13px] text-gray-500 line-clamp-1">
                      {idea.ai_summary}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-[11px] text-gray-400">
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
                    <p className="text-2xl font-bold tracking-tight text-brand-600">
                      {idea.score_overall.toFixed(1)}
                    </p>
                    <p className="text-[11px] text-gray-400">{t("overallScore")}</p>
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
