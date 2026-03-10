"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { signIn } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export function LoginForm() {
  const t = useTranslations("auth");
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | void, formData: FormData) => {
      return (await signIn(formData)) ?? {};
    },
    {} as { error?: string }
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-xl bg-red-50 p-3 text-[13px] text-red-600">
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
        autoComplete="current-password"
        minLength={6}
      />

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "..." : t("login")}
      </Button>

      <p className="text-center text-[13px] text-gray-500">
        {t("noAccount")}{" "}
        <Link href="/signup" className="font-medium text-brand-600 hover:text-brand-500">
          {t("signup")}
        </Link>
      </p>
    </form>
  );
}
