import { cn } from "@/lib/utils";

interface LogoIconProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * IdeaPulse Logo — a lightbulb with a pulse/heartbeat line through the center.
 * Represents "Idea" (lightbulb) + "Pulse" (heartbeat signal).
 */
export function LogoIcon({ size = "md", className }: LogoIconProps) {
  const sizeMap = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const iconSize = { sm: 14, md: 18, lg: 22 };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl bg-emerald-600",
        sizeMap[size],
        className
      )}
    >
      <svg
        width={iconSize[size]}
        height={iconSize[size]}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Lightbulb outer shape */}
        <path
          d="M16 3C11.03 3 7 7.03 7 12c0 3.2 1.67 6.01 4.19 7.61.37.24.61.65.61 1.09V22c0 .55.45 1 1 1h6.4c.55 0 1-.45 1-1v-1.3c0-.44.24-.85.61-1.09C23.33 18.01 25 15.2 25 12c0-4.97-4.03-9-9-9z"
          fill="white"
          opacity="0.25"
        />
        {/* Pulse line through the bulb */}
        <path
          d="M4 16h5l2.5-5 3 10 3-10 2.5 5H28"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Bulb base lines */}
        <path
          d="M12.5 26h7M13.5 29h5"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  textClassName?: string;
  className?: string;
}

export function Logo({
  size = "md",
  showText = true,
  textClassName,
  className,
}: LogoProps) {
  const textSize = { sm: "text-base", md: "text-lg", lg: "text-xl" };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoIcon size={size} />
      {showText && (
        <span
          className={cn(
            "font-bold tracking-tight",
            textSize[size],
            textClassName
          )}
        >
          IdeaPulse
        </span>
      )}
    </div>
  );
}
