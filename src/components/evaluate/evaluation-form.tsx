"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { submitEvaluation } from "@/lib/actions/evaluate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MAX_COMMENT_LENGTH } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface EvaluationFormProps {
  ideaId: string;
  onSuccess: () => void;
}

function RatingGroup({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: { value: number; label: string }[];
}) {
  return (
    <fieldset className="space-y-2.5">
      <legend className="text-sm font-medium text-gray-800">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label key={opt.value} className="group cursor-pointer">
            <input
              type="radio"
              name={name}
              value={opt.value}
              required
              className="peer sr-only"
            />
            <span
              className={cn(
                "inline-flex items-center rounded-xl border px-3.5 py-2 text-[13px] font-medium transition-all duration-200",
                "border-gray-150 text-gray-500 hover:border-brand-200 hover:bg-brand-50/50 hover:text-gray-700",
                "peer-checked:border-brand-500 peer-checked:bg-brand-600 peer-checked:text-white peer-checked:shadow-sm peer-checked:shadow-brand-600/20"
              )}
            >
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function EvaluationForm({ ideaId, onSuccess }: EvaluationFormProps) {
  const t = useTranslations("evaluate");

  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string; success?: boolean }, formData: FormData) => {
      const result = await submitEvaluation(formData);
      if (result.success) {
        onSuccess();
      }
      return result;
    },
    {}
  );

  const q1Options = [5, 4, 3, 2, 1].map((v) => ({
    value: v,
    label: t(`q1_${v}` as "q1_5"),
  }));

  const q2Options = [5, 4, 3, 2, 1].map((v) => ({
    value: v,
    label: t(`q2_${v}` as "q2_5"),
  }));

  const q3Options = [5, 4, 3, 2, 1].map((v) => ({
    value: v,
    label: t(`q3_${v}` as "q3_5"),
  }));

  const q4Options = [5, 4, 3, 2, 1].map((v) => ({
    value: v,
    label: t(`q4_${v}` as "q4_5"),
  }));

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="idea_id" value={ideaId} />

      {state.error && (
        <div className="rounded-xl bg-red-50 p-3.5 text-sm text-red-600 ring-1 ring-inset ring-red-100">
          {state.error}
        </div>
      )}

      <div className="space-y-5">
        <RatingGroup
          name="q_problem_intensity"
          label={t("q1Label")}
          options={q1Options}
        />

        <div className="border-t border-gray-50" />

        <RatingGroup
          name="q_would_pay"
          label={t("q2Label")}
          options={q2Options}
        />

        <div className="border-t border-gray-50" />

        <RatingGroup
          name="q_differentiation"
          label={t("q3Label")}
          options={q3Options}
        />

        <div className="border-t border-gray-50" />

        <RatingGroup
          name="q_overall_viability"
          label={t("q4Label")}
          options={q4Options}
        />
      </div>

      <div className="border-t border-gray-50 pt-5">
        <Textarea
          id="comment"
          name="comment"
          label={t("comment")}
          hint={t("commentHint", { max: MAX_COMMENT_LENGTH })}
          maxLength={MAX_COMMENT_LENGTH}
          rows={3}
          placeholder={t("comment")}
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t("submitEvaluation")}
          </span>
        ) : (
          t("submitEvaluation")
        )}
      </Button>
    </form>
  );
}
