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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          {t("progress", { count: Math.min(completed, EVAL_REQUIRED), total: EVAL_REQUIRED })}
        </p>
        {isUnlocked ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {t("unlocked")}
          </span>
        ) : (
          <span className="text-xs text-gray-400">
            {t("unlockHint", { remaining })}
          </span>
        )}
      </div>
      <ProgressBar
        value={Math.min(completed, EVAL_REQUIRED)}
        max={EVAL_REQUIRED}
      />
    </div>
  );
}
