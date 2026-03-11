"use client";

import { useTranslations } from "next-intl";

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
    <div className="space-y-3">
      {items.map((item) => {
        const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;
        return (
          <div key={item.label} className="space-y-1.5">
            <div className="flex justify-between text-[12px]">
              <span className="font-medium text-gray-600">{item.label}</span>
              <span className="tabular-nums text-gray-400">
                {item.count} ({percent}%)
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-700"
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
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-gray-950/[0.03]">
      <h3 className="mb-5 text-[15px] font-semibold tracking-tight text-gray-900">
        {t("evaluatorBreakdown")}
      </h3>
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
            {t("byIndustry")}
          </p>
          <BarChart items={byIndustry} total={total} />
        </div>
        <div>
          <p className="mb-3 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
            {t("byExperience")}
          </p>
          <BarChart items={byExperience} total={total} />
        </div>
      </div>
    </div>
  );
}
