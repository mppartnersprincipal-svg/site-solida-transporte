import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline-light" | "whatsapp";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors cursor-pointer " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-action";

const variants: Record<Variant, string> = {
  primary: "bg-brand-action text-white hover:bg-brand-hover active:bg-brand-hover",
  secondary:
    "border border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-white",
  "outline-light":
    "border border-white/40 bg-transparent text-white hover:bg-white/10 focus-visible:outline-white",
  whatsapp:
    "bg-whatsapp text-white hover:bg-whatsapp-hover active:bg-whatsapp-hover focus-visible:outline-whatsapp",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 py-2.5 text-sm",
  lg: "min-h-12 px-7 py-3 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md") {
  return cn(base, variants[variant], sizes[size]);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button className={cn(buttonClasses(variant, size), className)} {...props} />
  );
}
