import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  pauseOnHover?: boolean;
  reverse?: boolean;
  vertical?: boolean;
  repeat?: number;
}

const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  (
    {
      className,
      children,
      pauseOnHover = false,
      reverse = false,
      vertical = false,
      repeat = 4,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group flex overflow-hidden [--duration:40s] [--gap:16px]",
          vertical ? "flex-col" : "flex-row",
          className
        )}
        {...props}
      >
        {Array.from({ length: repeat }).map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "flex shrink-0 items-center marquee-content",
              vertical
                ? "animate-marquee-vertical flex-col"
                : "animate-marquee flex-row",
              pauseOnHover && "group-hover:[animation-play-state:paused]",
              reverse && "[animation-direction:reverse]"
            )}
          >
            {children}
          </div>
        ))}
      </div>
    );
  }
);

Marquee.displayName = "Marquee";

export { Marquee };
