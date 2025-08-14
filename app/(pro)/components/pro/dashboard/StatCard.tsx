import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  Icon: LucideIcon;
  color: string;
}

export default function StatCard({ title, value, Icon, color }: StatCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}