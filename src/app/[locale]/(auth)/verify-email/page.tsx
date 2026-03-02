import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function VerifyEmailPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (params as unknown as { locale: string }).locale;
  setRequestLocale(locale);
  const t = useTranslations("auth");

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
