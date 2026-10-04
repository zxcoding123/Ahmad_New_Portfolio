import { techIcon, techIconColor } from "@/lib/tech-icons";
import { cn } from "@/lib/utils";

/** A tech tag with its logo beside the name. Tags without a known logo
 *  render as the name alone, so free-form tags like "UI/UX Design" still work. */
export function TechBadge({ name, className }: { name: string; className?: string }) {
  const icon = techIcon(name);

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      {icon && (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
          className="h-3 w-3 shrink-0"
          fill={techIconColor(icon) ?? "currentColor"}
        >
          <path d={icon.path} />
        </svg>
      )}
      {name}
    </span>
  );
}
