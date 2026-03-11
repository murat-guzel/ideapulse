"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { completeProfile } from "@/lib/actions/profile";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { INDUSTRIES, EXPERIENCE_LEVELS } from "@/lib/constants";

export function ProfileForm() {
  const t = useTranslations("profile");
  const ti = useTranslations("industries");

  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | void, formData: FormData) => {
      return (await completeProfile(formData)) ?? {};
    },
    {} as { error?: string }
  );

  const roleOptions = [
    { value: "founder", label: t("roleFounder") },
    { value: "validator", label: t("roleValidator") },
    { value: "both", label: t("roleBoth") },
  ];

  const industryOptions = INDUSTRIES.map((ind) => ({
    value: ind,
    label: ti(ind),
  }));

  const experienceOptions = [
    { value: "student", label: t("expStudent") },
    { value: "junior", label: t("expJunior") },
    { value: "mid", label: t("expMid") },
    { value: "senior", label: t("expSenior") },
    { value: "executive", label: t("expExecutive") },
  ];

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {state?.error}
        </div>
      )}

      <Input
        id="full_name"
        name="full_name"
        label={t("fullName")}
        placeholder="John Doe"
        required
      />

      <Select
        id="role"
        name="role"
        label={t("role")}
        options={roleOptions}
        placeholder={t("role")}
        required
        defaultValue=""
      />

      <Select
        id="industry"
        name="industry"
        label={t("industry")}
        options={industryOptions}
        placeholder={t("industry")}
        required
        defaultValue=""
      />

      <Select
        id="experience_level"
        name="experience_level"
        label={t("experience")}
        options={experienceOptions}
        placeholder={t("experience")}
        required
        defaultValue=""
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {t("interests")}
        </label>
        <p className="text-xs text-gray-500">{t("interestsHint")}</p>
        <div className="grid grid-cols-2 gap-2">
          {INDUSTRIES.map((ind) => (
            <label
              key={ind}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                name="interests"
                value={ind}
                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              {ti(ind)}
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "..." : t("complete")}
      </Button>
    </form>
  );
}
