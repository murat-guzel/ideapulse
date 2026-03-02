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
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-gray-700">{label}</legend>
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
                "inline-block rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                "border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50",
                "peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white"
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
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="idea_id" value={ideaId} />

      {state.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      <RatingGroup
        name="q_problem_intensity"
        label={t("q1Label")}
        options={q1Options}
      />

      <RatingGroup
        name="q_would_pay"
        label={t("q2Label")}
        options={q2Options}
      />

      <RatingGroup
        name="q_differentiation"
        label={t("q3Label")}
        options={q3Options}
      />

      <RatingGroup
        name="q_overall_viability"
        label={t("q4Label")}
        options={q4Options}
      />

      <Textarea
        id="comment"
        name="comment"
        label={t("comment")}
        hint={t("commentHint", { max: MAX_COMMENT_LENGTH })}
        maxLength={MAX_COMMENT_LENGTH}
        rows={2}
        placeholder={t("comment")}
      />

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "..." : t("submitEvaluation")}
      </Button>
    </form>
  );
}
