import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { getSignalLabel } from "@/lib/scoring/engine";

interface IdeaStatusBadgeProps {
  status: string;
  scoreOverall: number | null;
}

export function IdeaStatusBadge({ status, scoreOverall }: IdeaStatusBadgeProps) {
  const t = useTranslations("dashboard");

  if (status === "active") {
    return <Badge variant="success">{t("active")}</Badge>;
  }

  if (status === "closed" && scoreOverall !== null) {
    const signal = getSignalLabel(scoreOverall);
    const variant =
      signal === "strong" ? "success" : signal === "weak" ? "warning" : "danger";
    const label =
      signal === "strong"
        ? t("signalStrong")
        : signal === "weak"
          ? t("signalWeak")
          : t("signalNone");

    return <Badge variant={variant}>{label}</Badge>;
  }

  return <Badge>{t("closed")}</Badge>;
}
