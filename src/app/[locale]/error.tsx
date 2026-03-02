"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");

  return (
    <main className="flex min-h-[50vh] items-center justify-center px-4">
      <Card className="max-w-md text-center">
        <p className="text-lg font-medium text-gray-900">{t("error")}</p>
        <Button className="mt-4" onClick={reset}>
          Try again
        </Button>
      </Card>
    </main>
  );
}
