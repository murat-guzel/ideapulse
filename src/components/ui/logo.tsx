import { cn } from "@/lib/utils";

interface LogoIconProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * IdeaPulse Logo — clean lightbulb + heartbeat pulse line.
 * "Idea" (lightbulb) + "Pulse" (heartbeat).
 */
export function LogoIcon({ size = "md", className }: LogoIconProps) {
  const sizeMap = {
    sm: "h-7 w-7",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const iconSize = { sm: 16, md: 18, lg: 22 };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-[10px] bg-gradient-to-br from-brand-500 to-brand-700 shadow-sm shadow-brand-600/20",
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
        {/* Lightbulb shape — subtle background */}
        <path
          d="M16 4C11.58 4 8 7.58 8 12c0 2.9 1.52 5.45 3.8 6.9.34.22.5.6.5 1v1.6c0 .28.22.5.5.5h6.4c.28 0 .5-.22.5-.5v-1.6c0-.4.16-.78.5-1C22.48 17.45 24 14.9 24 12c0-4.42-3.58-8-8-8z"
          fill="white"
          opacity="0.2"
        />
        {/* Pulse heartbeat line */}
        <path
          d="M5 16h5.5l2-4.5 3 9 3-9 2 4.5H26"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Bulb base */}
        <path
          d="M13 25h6M14 28h4"
          stroke="white"
          strokeWidth="1.5"
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
  const textSize = {
    sm: "text-[15px]",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoIcon size={size} />
      {showText && (
        <span
          className={cn(
            "font-semibold tracking-tight",
            textSize[size],
            textClassName
          )}
        >
          Idea
          <span className="text-brand-600">Pulse</span>
        </span>
      )}
    </div>
  );
}
