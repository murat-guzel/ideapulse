"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { Idea } from "@/types/database";
import { getNextIdea } from "@/lib/actions/evaluate";
import { IdeaCard } from "./idea-card";
import { EvaluationForm } from "./evaluation-form";
import { ProgressTracker } from "./progress-tracker";
import { EmptyState } from "./empty-state";
import { EVAL_REQUIRED } from "@/lib/constants";

interface EvaluateClientProps {
  initialIdea: Idea | null;
  initialProgress: number;
}

export function EvaluateClient({
  initialIdea,
  initialProgress,
}: EvaluateClientProps) {
  const t = useTranslations("evaluate");
  const [currentIdea, setCurrentIdea] = useState<Idea | null>(initialIdea);
  const [progress, setProgress] = useState(initialProgress);
  const [showThankYou, setShowThankYou] = useState(false);

  const isUnlocked = progress >= EVAL_REQUIRED;

  const loadNextIdea = useCallback(async () => {
    setShowThankYou(true);
    setProgress((p) => p + 1);

    // Brief delay to show success message
    setTimeout(async () => {
      setShowThankYou(false);
      const { idea } = await getNextIdea();
      setCurrentIdea(idea);
    }, 1200);
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {t("title")}
        </h1>
        <p className="text-sm text-gray-500">{t("subtitle")}</p>
      </div>

      {/* Progress section */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-gray-950/[0.03]">
        <ProgressTracker completed={progress} />
      </div>

      {/* Main content */}
      {showThankYou ? (
        <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50/80 to-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-brand-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-900">{t("thankYou")}</p>
          <p className="mt-1 text-sm text-gray-500">
            {isUnlocked ? t("unlocked") : t("unlockHint", { remaining: Math.max(0, EVAL_REQUIRED - progress) })}
          </p>
        </div>
      ) : currentIdea ? (
        <div className="space-y-6">
          <IdeaCard idea={currentIdea} />
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-gray-950/[0.03]">
            <h2 className="mb-5 text-[15px] font-semibold text-gray-900">
              {t("yourEvaluation")}
            </h2>
            <EvaluationForm ideaId={currentIdea.id} onSuccess={loadNextIdea} />
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
