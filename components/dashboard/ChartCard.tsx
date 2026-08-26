import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

/** Card padrão das seções do dashboard: título, descrição e conteúdo. */
export function ChartCard({
  id,
  title,
  description,
  action,
  className,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal as="section" className={cn("scroll-mt-28", className)} y={16}>
      <div className="flex h-full flex-col rounded-2xl border border-line bg-white">
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <h2 id={id} className="text-base font-bold text-ink">
              {title}
            </h2>
            {description ? <p className="mt-0.5 text-sm text-ink-muted">{description}</p> : null}
          </div>
          {action}
        </div>
        <div className="flex-1 p-5">{children}</div>
      </div>
    </Reveal>
  );
}
