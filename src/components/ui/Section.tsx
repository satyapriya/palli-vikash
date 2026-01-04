import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: "default" | "muted" | "primary" | "secondary";
}

const Section = ({ children, className, id, variant = "default" }: SectionProps) => {
  const variants = {
    default: "bg-background",
    muted: "bg-muted",
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
  };

  return (
    <section id={id} className={cn("py-16 md:py-24", variants[variant], className)}>
      <div className="container mx-auto px-4">{children}</div>
    </section>
  );
};

export default Section;
