import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";

export function EmptyState() {
  const t = useTranslations("evaluate");

  return (
    <Card className="py-12 text-center">
      <p className="text-lg font-medium text-gray-900">{t("noMoreIdeas")}</p>
      <p className="mt-2 text-sm text-gray-500">{t("noMoreIdeasDesc")}</p>
    </Card>
  );
}
