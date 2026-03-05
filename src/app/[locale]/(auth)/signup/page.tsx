import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { SignupForm } from "@/components/auth/signup-form";

export default async function SignupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tc = await getTranslations("common");
  const t = await getTranslations("auth");

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <p className="mb-1 text-sm font-semibold text-indigo-600">
            {tc("appName")}
          </p>
          <CardTitle>{t("signup")}</CardTitle>
        </CardHeader>
        <SignupForm />
      </Card>
    </main>
  );
}
