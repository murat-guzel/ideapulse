import { cn } from "@/lib/utils";

interface ScoreCardProps {
  label: string;
  score: number | null;
  maxScore?: number;
}

export function ScoreCard({ label, score, maxScore = 10 }: ScoreCardProps) {
  const displayScore = score !== null ? score.toFixed(1) : "\u2014";
  const percent = score !== null ? (score / maxScore) * 100 : 0;

  const color =
    score === null
      ? "text-gray-400"
      : score >= 6.5
        ? "text-brand-600"
        : score >= 4
          ? "text-amber-600"
          : "text-red-500";

  const barColor =
    score === null
      ? "bg-gray-200"
      : score >= 6.5
        ? "bg-gradient-to-r from-brand-500 to-brand-400"
        : score >= 4
          ? "bg-gradient-to-r from-amber-500 to-amber-400"
          : "bg-gradient-to-r from-red-500 to-red-400";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-gray-950/[0.03]">
      <p className="mb-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      <div className="flex items-baseline gap-1.5">
        <p className={cn("text-4xl font-bold tracking-tighter", color)}>
          {displayScore}
        </p>
        <span className="text-sm font-normal text-gray-300">/{maxScore}</span>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className={cn("h-full rounded-full transition-all duration-700", barColor)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
