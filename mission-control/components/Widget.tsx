import { ReactNode } from 'react';
import { MoreVertical, Info } from 'lucide-react';

interface WidgetProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  colSpan?: number;
  rowSpan?: number;
  className?: string;
}

export default function Widget({ 
  title, 
  subtitle, 
  children, 
  colSpan = 1, 
  rowSpan = 1,
  className = ''
}: WidgetProps) {
  return (
    <div
      className={`group relative flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md ${className}`}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {subtitle && (
              <Info className="h-3.5 w-3.5 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
            )}
          </div>
          {subtitle && (
            <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        <button className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-5">
        {children}
      </div>
    </div>
  );
}
