import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        variant === "default" && "bg-gray-100 text-gray-600",
        variant === "success" && "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10",
        variant === "warning" && "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10",
        variant === "danger" && "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10",
        className
      )}
    >
      {children}
    </span>
  );
}
