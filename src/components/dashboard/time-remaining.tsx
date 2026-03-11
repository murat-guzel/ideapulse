"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { formatTimeRemaining } from "@/lib/utils";

interface TimeRemainingProps {
  expiresAt: string;
}

export function TimeRemaining({ expiresAt }: TimeRemainingProps) {
  const t = useTranslations("dashboard");
  const [time, setTime] = useState(() => formatTimeRemaining(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatTimeRemaining(expiresAt));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [expiresAt]);

  if (time.expired) {
    return (
      <span className="text-sm text-gray-500">{t("closed")}</span>
    );
  }

  return (
    <span className="text-sm font-medium text-brand-600">
      {t("timeRemaining", { hours: time.hours, minutes: time.minutes })}
    </span>
  );
}
