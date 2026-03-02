import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (params as unknown as { locale: string }).locale;
  setRequestLocale(locale);
  const tc = useTranslations("common");
  const t = useTranslations("auth");

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <p className="mb-1 text-sm font-semibold text-indigo-600">
            {tc("appName")}
          </p>
          <CardTitle>{t("login")}</CardTitle>
        </CardHeader>
        <LoginForm />
      </Card>
    </main>
  );
}
