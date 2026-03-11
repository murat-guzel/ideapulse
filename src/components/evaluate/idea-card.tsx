import type { Idea } from "@/types/database";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

interface IdeaCardProps {
  idea: Idea;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-600/70">
      {children}
    </p>
  );
}

export function IdeaCard({ idea }: IdeaCardProps) {
  const ti = useTranslations("industries");

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm shadow-gray-950/[0.03] overflow-hidden">
      {/* Card header with accent bar */}
      <div className="border-b border-gray-50 bg-gradient-to-r from-brand-50/60 to-transparent px-6 py-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight text-gray-900">
            {idea.title}
          </h3>
          <Badge>{ti.has(idea.industry) ? ti(idea.industry) : idea.industry}</Badge>
        </div>
      </div>

      {/* Card body with grid layout */}
      <div className="grid gap-0 divide-y divide-gray-50 sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
        <div className="space-y-4 p-6">
          <div>
            <SectionLabel>Problem</SectionLabel>
            <p className="text-[13px] leading-relaxed text-gray-600">{idea.problem}</p>
          </div>
          <div>
            <SectionLabel>Target User</SectionLabel>
            <p className="text-[13px] leading-relaxed text-gray-600">{idea.target_user}</p>
          </div>
        </div>
        <div className="space-y-4 p-6">
          <div>
            <SectionLabel>Solution</SectionLabel>
            <p className="text-[13px] leading-relaxed text-gray-600">{idea.solution}</p>
          </div>
          <div>
            <SectionLabel>Monetization</SectionLabel>
            <p className="text-[13px] leading-relaxed text-gray-600">{idea.monetization}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
