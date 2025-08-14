"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [ { name: "Week 1", earnings: 4000 }, { name: "Week 2", earnings: 3000 }, { name: "Week 3", earnings: 5000 }, { name: "Week 4", earnings: 4500 }];

export default function EarningsChart() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Earnings This Month</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey="earnings" stroke="#ef4444" strokeWidth={2} /></LineChart>
      </ResponsiveContainer>
    </div>
  );
}