"use client";

import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface BreakdownItem {
  label: string;
  count: number;
}

interface EvaluatorBreakdownProps {
  byIndustry: BreakdownItem[];
  byExperience: BreakdownItem[];
  total: number;
}

function BarChart({ items, total }: { items: BreakdownItem[]; total: number }) {
  return (
    <div className="space-y-2">
      {items.map((item) => {
        const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;
        return (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-medium text-gray-900">
                {item.count} ({percent}%)
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-indigo-400"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function EvaluatorBreakdown({
  byIndustry,
  byExperience,
  total,
}: EvaluatorBreakdownProps) {
  const t = useTranslations("dashboard");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("evaluatorBreakdown")}</CardTitle>
      </CardHeader>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-medium text-gray-500 uppercase">
            {t("byIndustry")}
          </p>
          <BarChart items={byIndustry} total={total} />
        </div>
        <div>
          <p className="mb-3 text-xs font-medium text-gray-500 uppercase">
            {t("byExperience")}
          </p>
          <BarChart items={byExperience} total={total} />
        </div>
      </div>
    </Card>
  );
}
