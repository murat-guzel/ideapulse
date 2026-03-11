import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreCard } from "@/components/dashboard/score-card";
import { CommentThemes } from "@/components/dashboard/comment-themes";
import { EvaluatorBreakdown } from "@/components/dashboard/evaluator-breakdown";
import { IdeaStatusBadge } from "@/components/dashboard/idea-status-badge";
import { TimeRemaining } from "@/components/dashboard/time-remaining";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { AiTheme, Idea } from "@/types/database";
import type { ScoringResult } from "@/lib/scoring/engine";

// ─── MOCK DATA ───────────────────────────────────────
const MOCK_SCORES: ScoringResult = {
  scoreProblem: 7.8,
  scorePayment: 6.5,
  scoreDiffer: 8.2,
  scoreOverall: 7.4,
  confidence: 0.75,
  evaluationCount: 15,
};

const MOCK_THEMES: AiTheme[] = [
  {
    label: "Strong Market Need",
    summary:
      "Multiple evaluators confirmed experiencing this problem daily. High demand signal across SaaS and fintech segments.",
    sentiment: "positive",
  },
  {
    label: "Monetization Concern",
    summary:
      "Several evaluators questioned the freemium model. Consider stronger B2B pricing or enterprise tier.",
    sentiment: "negative",
  },
  {
    label: "Differentiation Opportunity",
    summary:
      "AI-powered summarization and structured scoring set this apart from survey tools. Unique reciprocal model praised.",
    sentiment: "positive",
  },
  {
    label: "UX Simplicity",
    summary:
      "Evaluators appreciated the guided evaluation format. Some suggested adding a skip option for irrelevant industries.",
    sentiment: "neutral",
  },
];

const MOCK_IDEA: Idea = {
  id: "demo-1",
  author_id: "user-1",
  status: "active",
  title: "AI-Powered Code Review Platform for Small Teams",
  problem:
    "Small development teams (2-10 people) struggle with code quality because they lack senior reviewers. Manual reviews are slow, inconsistent, and create bottlenecks.",
  target_user:
    "Early-stage startup CTOs and tech leads managing small engineering teams who ship daily.",
  solution:
    "An AI assistant that reviews pull requests in real-time, catches bugs, suggests improvements, and learns from team patterns. Integrates with GitHub/GitLab in one click.",
  monetization:
    "Freemium model: free for open-source repos, $29/month per team for private repos, $99/month for enterprise with custom rules.",
  industry: "devtools",
  ai_summary:
    "An AI code review tool designed for small teams that lack senior reviewers. It integrates with GitHub/GitLab to provide real-time PR feedback, bug detection, and team-specific improvement suggestions.",
  ai_themes: MOCK_THEMES,
  score_problem: 7.8,
  score_payment: 6.5,
  score_differ: 8.2,
  score_overall: 7.4,
  evaluation_count: 15,
  goes_live_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  closed_at: null,
  moderation_flag: false,
  moderation_note: null,
  created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
};

const MOCK_IDEAS: Idea[] = [
  MOCK_IDEA,
  {
    ...MOCK_IDEA,
    id: "demo-2",
    title: "Subscription Analytics for Indie Makers",
    ai_summary:
      "A lightweight analytics dashboard for indie makers to track MRR, churn, and customer lifetime value without complex BI tools.",
    industry: "saas",
    status: "closed",
    score_overall: 5.2,
    score_problem: 5.8,
    score_payment: 4.5,
    score_differ: 5.5,
    evaluation_count: 12,
    expires_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    closed_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    ...MOCK_IDEA,
    id: "demo-3",
    title: "AI Meal Planner Based on Grocery Discounts",
    ai_summary:
      "Generates weekly meal plans based on grocery store discounts in your area, helping families save money while eating healthy.",
    industry: "consumer",
    status: "closed",
    score_overall: 3.1,
    score_problem: 3.5,
    score_payment: 2.8,
    score_differ: 3.2,
    evaluation_count: 8,
    expires_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    closed_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_BY_INDUSTRY = [
  { label: "SaaS", count: 5 },
  { label: "Fintech", count: 4 },
  { label: "Developer Tools", count: 3 },
  { label: "AI / ML", count: 2 },
  { label: "E-Commerce", count: 1 },
];

const MOCK_BY_EXPERIENCE = [
  { label: "Senior (5-10 years)", count: 6 },
  { label: "Mid-level (2-5 years)", count: 4 },
  { label: "Executive (10+ years)", count: 3 },
  { label: "Junior (0-2 years)", count: 2 },
];

// ─── EVALUATE IDEA MOCK ─────────────────────────────
const EVAL_IDEA: Idea = {
  ...MOCK_IDEA,
  id: "eval-1",
  title: "Automated Compliance Checker for Fintech Startups",
  problem:
    "Fintech startups spend months and thousands of dollars on regulatory compliance. Manual compliance checks are error-prone and slow, delaying product launches.",
  target_user:
    "Fintech founders and compliance officers at early-stage companies trying to launch financial products.",
  solution:
    "An automated platform that scans your product against regulatory requirements (PCI DSS, GDPR, KYC/AML) and generates compliance reports with actionable steps.",
  monetization:
    "SaaS model: $199/month for startups, $499/month for growth, custom enterprise pricing. One-time compliance audit add-on at $2,999.",
  industry: "fintech",
  ai_summary:
    "An automated regulatory compliance platform for fintech startups that scans products against PCI DSS, GDPR, and KYC/AML requirements, generating actionable reports.",
};

// ─── PAGE COMPONENT ──────────────────────────────────

function getSignalLabelLocal(score: number): "strong" | "weak" | "none" {
  if (score >= 6.5) return "strong";
  if (score >= 4.0) return "weak";
  return "none";
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");
  const te = await getTranslations("evaluate");
  const tc = await getTranslations("common");
  const ti = await getTranslations("industries");

  return (
    <div className="min-h-screen bg-warm-bg">
      {/* Demo header */}
      <div className="border-b bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">IdeaPulse</span>
            <Badge variant="warning">DEMO</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href="#evaluate" className="font-medium text-gray-600 hover:text-brand-600">Evaluate</a>
            <a href="#dashboard-list" className="font-medium text-gray-600 hover:text-brand-600">Dashboard</a>
            <a href="#detail" className="font-medium text-gray-600 hover:text-brand-600">Results</a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-16">

        {/* ═══════════════ SECTION 1: EVALUATE ═══════════════ */}
        <section id="evaluate">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">1</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{te("title")}</h2>
              <p className="text-sm text-gray-500">{te("subtitle")}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6 space-y-2">
            <ProgressBar value={12} max={15} label={te("progress", { count: 12, total: 15 })} />
            <p className="text-sm text-gray-500">{te("unlockHint", { remaining: 3 })}</p>
          </div>

          {/* Idea to evaluate */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-gray-900">{EVAL_IDEA.title}</h3>
                <Badge>{ti("fintech")}</Badge>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="mb-1 font-medium text-gray-500">Problem</p>
                  <p className="text-gray-700">{EVAL_IDEA.problem}</p>
                </div>
                <div>
                  <p className="mb-1 font-medium text-gray-500">Target User</p>
                  <p className="text-gray-700">{EVAL_IDEA.target_user}</p>
                </div>
                <div>
                  <p className="mb-1 font-medium text-gray-500">Solution</p>
                  <p className="text-gray-700">{EVAL_IDEA.solution}</p>
                </div>
                <div>
                  <p className="mb-1 font-medium text-gray-500">Monetization</p>
                  <p className="text-gray-700">{EVAL_IDEA.monetization}</p>
                </div>
              </div>
            </Card>

            <Card className="space-y-5">
              <h4 className="font-semibold text-gray-900">Your Evaluation</h4>
              {/* Q1 */}
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-gray-700">{te("q1Label")}</legend>
                <div className="flex flex-wrap gap-2">
                  {[5, 4, 3, 2, 1].map((v) => (
                    <span key={v} className={`inline-block rounded-lg border px-3 py-1.5 text-xs font-medium ${v === 4 ? "border-brand-600 bg-brand-600 text-white" : "border-gray-200 text-gray-600"}`}>
                      {te(`q1_${v}` as "q1_5")}
                    </span>
                  ))}
                </div>
              </fieldset>
              {/* Q2 */}
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-gray-700">{te("q2Label")}</legend>
                <div className="flex flex-wrap gap-2">
                  {[5, 4, 3, 2, 1].map((v) => (
                    <span key={v} className={`inline-block rounded-lg border px-3 py-1.5 text-xs font-medium ${v === 3 ? "border-brand-600 bg-brand-600 text-white" : "border-gray-200 text-gray-600"}`}>
                      {te(`q2_${v}` as "q2_5")}
                    </span>
                  ))}
                </div>
              </fieldset>
              {/* Q3 */}
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-gray-700">{te("q3Label")}</legend>
                <div className="flex flex-wrap gap-2">
                  {[5, 4, 3, 2, 1].map((v) => (
                    <span key={v} className={`inline-block rounded-lg border px-3 py-1.5 text-xs font-medium ${v === 5 ? "border-brand-600 bg-brand-600 text-white" : "border-gray-200 text-gray-600"}`}>
                      {te(`q3_${v}` as "q3_5")}
                    </span>
                  ))}
                </div>
              </fieldset>
              {/* Q4 */}
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-gray-700">{te("q4Label")}</legend>
                <div className="flex flex-wrap gap-2">
                  {[5, 4, 3, 2, 1].map((v) => (
                    <span key={v} className={`inline-block rounded-lg border px-3 py-1.5 text-xs font-medium ${v === 4 ? "border-brand-600 bg-brand-600 text-white" : "border-gray-200 text-gray-600"}`}>
                      {te(`q4_${v}` as "q4_5")}
                    </span>
                  ))}
                </div>
              </fieldset>
              {/* Comment */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">{te("comment")}</label>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-400 italic">
                  Great idea! The compliance space is ripe for automation...
                </div>
              </div>
              <button className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-500 transition-colors">
                {te("submitEvaluation")}
              </button>
            </Card>
          </div>
        </section>

        {/* ═══════════════ SECTION 2: DASHBOARD LIST ═══════════════ */}
        <section id="dashboard-list">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">2</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t("title")}</h2>
              <p className="text-sm text-gray-500">{t("subtitle")}</p>
            </div>
          </div>

          <div className="space-y-4">
            {MOCK_IDEAS.map((idea) => (
              <a key={idea.id} href="#detail">
                <Card className="flex items-center justify-between hover:border-brand-200 transition-colors cursor-pointer mb-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{idea.title}</h3>
                      <IdeaStatusBadge status={idea.status} scoreOverall={idea.score_overall} />
                    </div>
                    {idea.ai_summary && (
                      <p className="text-sm text-gray-600 line-clamp-1">{idea.ai_summary}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{t("evaluations", { count: idea.evaluation_count })}</span>
                      {idea.status === "active" && <TimeRemaining expiresAt={idea.expires_at} />}
                    </div>
                  </div>
                  {idea.score_overall !== null && (
                    <div className="ml-4 text-right">
                      <p className={`text-2xl font-bold ${idea.score_overall >= 6.5 ? "text-green-600" : idea.score_overall >= 4 ? "text-amber-600" : "text-red-600"}`}>
                        {idea.score_overall.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500">{t("overallScore")}</p>
                    </div>
                  )}
                </Card>
              </a>
            ))}
          </div>
        </section>

        {/* ═══════════════ SECTION 3: IDEA DETAIL ═══════════════ */}
        <section id="detail">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">3</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Validation Results</h2>
              <p className="text-sm text-gray-500">Detailed scoring breakdown for your idea</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{MOCK_IDEA.title}</h1>
                <IdeaStatusBadge status="active" scoreOverall={MOCK_SCORES.scoreOverall} />
              </div>
              <p className="mt-1 text-sm text-gray-600">{MOCK_IDEA.ai_summary}</p>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <span>{t("evaluations", { count: MOCK_SCORES.evaluationCount })}</span>
                <span>{t("confidence", { percent: Math.round(MOCK_SCORES.confidence * 100) })}</span>
                <TimeRemaining expiresAt={MOCK_IDEA.expires_at} />
              </div>
            </div>

            {/* Overall signal */}
            <Card className="text-center py-6">
              <p className="text-sm text-gray-500 uppercase tracking-wide">{t("overallScore")}</p>
              <p className="mt-1 text-5xl font-bold text-green-600">
                {MOCK_SCORES.scoreOverall.toFixed(1)}
              </p>
              <p className="mt-2 text-sm font-medium text-green-700">
                {t("signalStrong")}
              </p>
            </Card>

            {/* Dimension scores */}
            <div className="grid gap-4 sm:grid-cols-3">
              <ScoreCard label={t("problemScore")} score={MOCK_SCORES.scoreProblem} />
              <ScoreCard label={t("paymentScore")} score={MOCK_SCORES.scorePayment} />
              <ScoreCard label={t("differentiationScore")} score={MOCK_SCORES.scoreDiffer} />
            </div>

            {/* Comment themes */}
            <CommentThemes themes={MOCK_THEMES} />

            {/* Evaluator breakdown */}
            <EvaluatorBreakdown
              byIndustry={MOCK_BY_INDUSTRY}
              byExperience={MOCK_BY_EXPERIENCE}
              total={15}
            />
          </div>
        </section>

      </div>

      {/* Demo footer */}
      <div className="border-t bg-brand-50 py-6 text-center">
        <p className="text-sm text-brand-700 font-medium">
          This is a demo with mock data. <Link href="/" className="underline">Back to landing page</Link>
        </p>
      </div>
    </div>
  );
}
