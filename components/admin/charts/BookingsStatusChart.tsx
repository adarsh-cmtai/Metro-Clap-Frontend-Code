"use client";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ChartData { name: string; value: number; }
const COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#3b82f6"];

export default function BookingsStatusChart({ data }: { data: ChartData[] }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Bookings by Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value">
            {data.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}