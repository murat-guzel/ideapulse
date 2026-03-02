import { cn } from "@/lib/utils";

interface ScoreCardProps {
  label: string;
  score: number | null;
  maxScore?: number;
}

export function ScoreCard({ label, score, maxScore = 10 }: ScoreCardProps) {
  const displayScore = score !== null ? score.toFixed(1) : "—";
  const percent = score !== null ? (score / maxScore) * 100 : 0;

  const color =
    score === null
      ? "text-gray-400"
      : score >= 6.5
        ? "text-green-600"
        : score >= 4
          ? "text-amber-600"
          : "text-red-600";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p className={cn("text-3xl font-bold", color)}>
        {displayScore}
        <span className="text-sm font-normal text-gray-400">/{maxScore}</span>
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            score !== null && score >= 6.5
              ? "bg-green-500"
              : score !== null && score >= 4
                ? "bg-amber-500"
                : "bg-red-500"
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
