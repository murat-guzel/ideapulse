import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { SignupForm } from "@/components/auth/signup-form";
import { Logo } from "@/components/ui/logo";

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
    <main className="flex min-h-screen items-center justify-center bg-warm-bg px-4">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex justify-center">
          <Logo size="md" />
        </div>
        <Card className="shadow-sm shadow-gray-950/[0.04]">
          <CardHeader>
            <CardTitle className="text-lg">{t("signup")}</CardTitle>
          </CardHeader>
          <SignupForm />
        </Card>
      </div>
    </main>
  );
}
