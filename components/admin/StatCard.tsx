import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  Icon: LucideIcon;
}

export default function StatCard({ title, value, Icon }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4">
      <div className="bg-red-100 p-3 rounded-full">
        <Icon className="w-6 h-6 text-red-500" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}