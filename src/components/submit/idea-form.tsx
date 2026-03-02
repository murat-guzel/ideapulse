"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { submitIdea } from "@/lib/actions/idea";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { INDUSTRIES } from "@/lib/constants";
import { useRouter } from "@/i18n/navigation";

const STEPS = ["step1", "step2", "step3", "step4", "step5"] as const;

export function IdeaForm() {
  const t = useTranslations("submit");
  const ti = useTranslations("industries");
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formValues, setFormValues] = useState({
    title: "",
    problem: "",
    target_user: "",
    solution: "",
    monetization: "",
    industry: "",
  });

  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string; ideaId?: string }, formData: FormData) => {
      const result = await submitIdea(formData);
      if (result.ideaId) {
        router.push("/dashboard");
      }
      return result;
    },
    {}
  );

  function updateField(field: string, value: string) {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }

  const industryOptions = INDUSTRIES.map((ind) => ({
    value: ind,
    label: ti(ind),
  }));

  const canProceed = () => {
    switch (step) {
      case 0:
        return formValues.title.length >= 10 && formValues.problem.length >= 50;
      case 1:
        return formValues.target_user.length >= 20;
      case 2:
        return formValues.solution.length >= 50;
      case 3:
        return formValues.monetization.length >= 20 && formValues.industry !== "";
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex gap-2">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-indigo-600" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t(STEPS[step])}</CardTitle>
          <CardDescription>{t(`${STEPS[step]}Desc` as "step1Desc")}</CardDescription>
        </CardHeader>

        {state.error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {state.error}
          </div>
        )}

        {step === 0 && (
          <div className="space-y-4">
            <Input
              id="title"
              label={t("ideaTitle")}
              placeholder={t("ideaTitleHint")}
              value={formValues.title}
              onChange={(e) => updateField("title", e.target.value)}
              maxLength={120}
              minLength={10}
            />
            <Textarea
              id="problem"
              label={t("problem")}
              hint={t("problemHint")}
              value={formValues.problem}
              onChange={(e) => updateField("problem", e.target.value)}
              rows={4}
              maxLength={1000}
              minLength={50}
            />
          </div>
        )}

        {step === 1 && (
          <Textarea
            id="target_user"
            label={t("targetUser")}
            hint={t("targetUserHint")}
            value={formValues.target_user}
            onChange={(e) => updateField("target_user", e.target.value)}
            rows={3}
            maxLength={500}
            minLength={20}
          />
        )}

        {step === 2 && (
          <Textarea
            id="solution"
            label={t("solution")}
            hint={t("solutionHint")}
            value={formValues.solution}
            onChange={(e) => updateField("solution", e.target.value)}
            rows={4}
            maxLength={1000}
            minLength={50}
          />
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Textarea
              id="monetization"
              label={t("monetization")}
              hint={t("monetizationHint")}
              value={formValues.monetization}
              onChange={(e) => updateField("monetization", e.target.value)}
              rows={3}
              maxLength={500}
              minLength={20}
            />
            <Select
              id="industry"
              label={t("industry")}
              options={industryOptions}
              placeholder={t("industry")}
              value={formValues.industry}
              onChange={(e) => updateField("industry", e.target.value)}
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-gray-500">{t("ideaTitle")}</p>
              <p className="text-gray-900">{formValues.title}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">{t("problem")}</p>
              <p className="text-gray-700">{formValues.problem}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">{t("targetUser")}</p>
              <p className="text-gray-700">{formValues.target_user}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">{t("solution")}</p>
              <p className="text-gray-700">{formValues.solution}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">{t("monetization")}</p>
              <p className="text-gray-700">{formValues.monetization}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">{t("industry")}</p>
              <p className="text-gray-700">
                {formValues.industry && (ti.has(formValues.industry) ? ti(formValues.industry) : formValues.industry)}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between gap-3">
          {step > 0 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              {t("back" as "step1")}
            </Button>
          )}
          <div className="ml-auto">
            {step < 4 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                {t("next" as "step1")}
              </Button>
            ) : (
              <form action={formAction}>
                <input type="hidden" name="title" value={formValues.title} />
                <input type="hidden" name="problem" value={formValues.problem} />
                <input type="hidden" name="target_user" value={formValues.target_user} />
                <input type="hidden" name="solution" value={formValues.solution} />
                <input type="hidden" name="monetization" value={formValues.monetization} />
                <input type="hidden" name="industry" value={formValues.industry} />
                <Button type="submit" disabled={isPending}>
                  {isPending ? "..." : t("submitIdea")}
                </Button>
              </form>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
