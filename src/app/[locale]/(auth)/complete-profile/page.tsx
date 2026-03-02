import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProfileForm } from "@/components/auth/profile-form";

export default function CompleteProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (params as unknown as { locale: string }).locale;
  setRequestLocale(locale);
  const t = useTranslations("profile");

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("subtitle")}</CardDescription>
        </CardHeader>
        <ProfileForm />
      </Card>
    </main>
  );
}
