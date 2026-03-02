"use client";

import { useTranslations } from "next-intl";
import { ProgressBar } from "@/components/ui/progress-bar";
import { EVAL_REQUIRED } from "@/lib/constants";

interface ProgressTrackerProps {
  completed: number;
}

export function ProgressTracker({ completed }: ProgressTrackerProps) {
  const t = useTranslations("evaluate");
  const remaining = Math.max(0, EVAL_REQUIRED - completed);
  const isUnlocked = completed >= EVAL_REQUIRED;

  return (
    <div className="space-y-2">
      <ProgressBar
        value={Math.min(completed, EVAL_REQUIRED)}
        max={EVAL_REQUIRED}
        label={t("progress", { count: completed, total: EVAL_REQUIRED })}
      />
      {isUnlocked ? (
        <p className="text-sm font-medium text-green-600">{t("unlocked")}</p>
      ) : (
        <p className="text-sm text-gray-500">
          {t("unlockHint", { remaining })}
        </p>
      )}
    </div>
  );
}
