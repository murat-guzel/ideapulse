import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
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
    <Card className="space-y-4 text-center">
      <p className="text-lg font-medium text-gray-900">
        {t("gate", { remaining })}
      </p>
      <p className="text-sm text-gray-500">
        {t("gateDesc", { count: completed, total: EVAL_REQUIRED })}
      </p>
      <ProgressBar value={completed} max={EVAL_REQUIRED} />
      <Link href="/evaluate">
        <Button variant="primary">{t("gate", { remaining })}</Button>
      </Link>
    </Card>
  );
}
