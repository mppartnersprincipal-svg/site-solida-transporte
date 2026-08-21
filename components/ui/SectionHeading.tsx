import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <Reveal
      className={cn(
        "mb-10 max-w-3xl sm:mb-14",
        align === "center" ? "mx-auto text-center" : "text-left"
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-brand-action">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "text-2xl font-bold sm:text-3xl lg:text-4xl text-balance",
          dark && "text-white"
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className={cn("mt-4 text-base sm:text-lg", dark ? "text-white/70" : "text-ink-muted")}>
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}
