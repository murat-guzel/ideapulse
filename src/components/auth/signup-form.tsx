"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { signUp } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export function SignupForm() {
  const t = useTranslations("auth");
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | void, formData: FormData) => {
      return (await signUp(formData)) ?? {};
    },
    {} as { error?: string }
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {state?.error}
        </div>
      )}

      <Input
        id="email"
        name="email"
        type="email"
        label={t("email")}
        placeholder="you@example.com"
        required
        autoComplete="email"
      />

      <Input
        id="password"
        name="password"
        type="password"
        label={t("password")}
        placeholder="••••••••"
        required
        autoComplete="new-password"
        minLength={6}
      />

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "..." : t("signup")}
      </Button>

      <p className="text-center text-sm text-gray-600">
        {t("hasAccount")}{" "}
        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          {t("login")}
        </Link>
      </p>
    </form>
  );
}
