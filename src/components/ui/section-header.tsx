import { ReactNode } from 'react';

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({ icon, title, description, className = '' }: SectionHeaderProps) {
  return (
    <div className={`flex items-center gap-3 py-2 ${className}`}>
      <div className="animate-float shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
