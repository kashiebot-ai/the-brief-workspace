import { ReactNode } from 'react';
import { MoreVertical } from 'lucide-react';

interface WidgetProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  colSpan?: number;
  rowSpan?: number;
}

export default function Widget({ title, subtitle, children, colSpan = 1, rowSpan = 1 }: WidgetProps) {
  return (
    <div
      className="rounded-xl border bg-white p-5 shadow-sm"
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <button className="rounded-lg p-2 hover:bg-gray-100">
          <MoreVertical size={18} />
        </button>
      </div>
      <div className="h-full">{children}</div>
    </div>
  );
}