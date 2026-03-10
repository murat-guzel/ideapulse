import type { Idea } from "@/types/database";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface IdeaCardProps {
  idea: Idea;
}

export function IdeaCard({ idea }: IdeaCardProps) {
  const ti = useTranslations("industries");

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-semibold tracking-tight text-gray-900">{idea.title}</h3>
        <Badge>{ti.has(idea.industry) ? ti(idea.industry) : idea.industry}</Badge>
      </div>

      <div className="space-y-3 text-[13px]">
        <div>
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-gray-400">Problem</p>
          <p className="leading-relaxed text-gray-600">{idea.problem}</p>
        </div>
        <div>
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-gray-400">Target User</p>
          <p className="leading-relaxed text-gray-600">{idea.target_user}</p>
        </div>
        <div>
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-gray-400">Solution</p>
          <p className="leading-relaxed text-gray-600">{idea.solution}</p>
        </div>
        <div>
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-gray-400">Monetization</p>
          <p className="leading-relaxed text-gray-600">{idea.monetization}</p>
        </div>
      </div>
    </Card>
  );
}
