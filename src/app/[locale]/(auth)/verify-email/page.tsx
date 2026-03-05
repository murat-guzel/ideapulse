import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function VerifyEmailPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>{t("verifyEmail")}</CardTitle>
          <CardDescription>{t("verifyEmailDesc")}</CardDescription>
        </CardHeader>
      </Card>
    </main>
  );
}
