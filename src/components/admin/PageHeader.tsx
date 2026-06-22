import type { ReactNode } from "react";

interface PageHeaderProps {
  section: string;
  title: string;
  action?: ReactNode;
}

export function PageHeader({ section, title, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{section}</p>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900">{title}</h1>
      </div>
      {action}
    </div>
  );
}
