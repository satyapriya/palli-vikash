import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

const SectionHeader = ({
  title,
  subtitle,
  description,
  align = "center",
  className,
}: SectionHeaderProps) => {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "text-center max-w-3xl mx-auto",
        className
      )}
    >
      {subtitle && (
        <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-3">
          {subtitle}
        </span>
      )}
      <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
