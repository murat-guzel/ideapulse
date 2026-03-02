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
        <h3 className="text-lg font-semibold text-gray-900">{idea.title}</h3>
        <Badge>{ti.has(idea.industry) ? ti(idea.industry) : idea.industry}</Badge>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <p className="mb-1 font-medium text-gray-500">Problem</p>
          <p className="text-gray-700">{idea.problem}</p>
        </div>
        <div>
          <p className="mb-1 font-medium text-gray-500">Target User</p>
          <p className="text-gray-700">{idea.target_user}</p>
        </div>
        <div>
          <p className="mb-1 font-medium text-gray-500">Solution</p>
          <p className="text-gray-700">{idea.solution}</p>
        </div>
        <div>
          <p className="mb-1 font-medium text-gray-500">Monetization</p>
          <p className="text-gray-700">{idea.monetization}</p>
        </div>
      </div>
    </Card>
  );
}
