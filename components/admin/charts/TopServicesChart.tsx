"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartData { name: string; bookings: number; }

export default function TopServicesChart({ data }: { data: ChartData[] }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Services</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="bookings" fill="#ef4444" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}