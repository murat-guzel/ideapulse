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
        ? "text-emerald-600"
        : score >= 4
          ? "text-amber-600"
          : "text-red-600";

  const barColor =
    score === null
      ? "bg-gray-200"
      : score >= 6.5
        ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
        : score >= 4
          ? "bg-gradient-to-r from-amber-500 to-amber-400"
          : "bg-gradient-to-r from-red-500 to-red-400";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-gray-950/[0.03]">
      <p className="mb-2 text-[11px] font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </p>
      <p className={cn("text-3xl font-bold tracking-tight", color)}>
        {displayScore}
        <span className="text-sm font-normal text-gray-300">/{maxScore}</span>
      </p>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-gray-100">
        <div
          className={cn("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
