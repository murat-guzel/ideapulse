import { cn } from "@/lib/utils";

interface LogoIconProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * IdeaPulse Logo — Abstract geometric pulse wave inside a rounded square.
 * Minimal, no lightbulb. Just a clean signal/pulse mark.
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
        "flex items-center justify-center rounded-[10px] bg-brand-600",
        sizeMap[size],
        className
      )}
    >
      <svg
        width={iconSize[size]}
        height={iconSize[size]}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Abstract pulse wave — minimal signal mark */}
        <path
          d="M2 12h4l2-5 3 10 3-10 2 5h6"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
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
