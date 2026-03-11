import { getTranslations } from "next-intl/server";
import { getUserIdeas } from "@/lib/actions/idea";
import { IdeaStatusBadge } from "@/components/dashboard/idea-status-badge";
import { TimeRemaining } from "@/components/dashboard/time-remaining";
import { Link } from "@/i18n/navigation";
import { EVAL_REQUIRED } from "@/lib/constants";

export default async function DashboardPage() {
  const { ideas } = await getUserIdeas();
  const t = await getTranslations("dashboard");

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {t("title")}
        </h1>
        <p className="text-sm text-gray-500">{t("subtitle")}</p>
      </div>

      {ideas.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center shadow-sm shadow-gray-950/[0.03]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-900">{t("noIdeas")}</p>
          <p className="mt-1.5 text-sm text-gray-500">
            {t("noIdeasDesc", { total: EVAL_REQUIRED })}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {ideas.map((idea) => (
            <Link key={idea.id} href={`/dashboard/${idea.id}`}>
              <div className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-gray-950/[0.03] transition-all duration-200 hover:border-brand-200 hover:shadow-md hover:shadow-brand-600/[0.04] cursor-pointer">
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-[15px] font-semibold tracking-tight text-gray-900 group-hover:text-brand-700 transition-colors">
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
                  <div className="ml-6 flex flex-col items-center">
                    <p className="text-3xl font-bold tracking-tighter text-brand-600">
                      {idea.score_overall.toFixed(1)}
                    </p>
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                      {t("overallScore")}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
