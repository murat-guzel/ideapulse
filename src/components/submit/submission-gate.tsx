import { useTranslations } from "next-intl";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { EVAL_REQUIRED } from "@/lib/constants";

interface SubmissionGateProps {
  completed: number;
}

export function SubmissionGate({ completed }: SubmissionGateProps) {
  const t = useTranslations("submit");
  const remaining = EVAL_REQUIRED - completed;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm shadow-gray-950/[0.03] text-center space-y-5">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-brand-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>
      <div>
        <p className="text-base font-semibold text-gray-900">
          {t("gate", { remaining })}
        </p>
        <p className="mt-1 text-[13px] text-gray-500">
          {t("gateDesc", { count: completed, total: EVAL_REQUIRED })}
        </p>
      </div>
      <div className="mx-auto max-w-xs">
        <ProgressBar value={completed} max={EVAL_REQUIRED} />
      </div>
      <Link href="/evaluate">
        <Button variant="primary" size="lg">
          {t("gate", { remaining })}
        </Button>
      </Link>
    </div>
  );
}
