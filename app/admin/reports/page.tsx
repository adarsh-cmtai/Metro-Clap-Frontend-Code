"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchReports } from '@/app/store/features/admin/reportsSlice';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Download, Calendar, Star, Loader2 } from 'lucide-react';

const COLORS = ['#fb923c', '#ef4444'];

export default function ReportsPage() {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((state) => state.adminReports);
  const { token } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (token && status === 'idle') {
      dispatch(fetchReports());
    }
  }, [token, status, dispatch]);

  if (status === 'loading' || status === 'idle') {
    return <div className="text-center py-10"><Loader2 className="w-8 h-8 animate-spin mx-auto text-red-500" /></div>;
  }

  if (status === 'failed' || !data) {
    return <div className="text-center py-10 text-red-500">{error || "Could not load report data."}</div>;
  }

  const repeatValue = data.customerRepeatData[1]?.value || 0;
  const totalCustomers = (data.customerRepeatData[0]?.value || 0) + repeatValue;
  const repeatRate = totalCustomers > 0 ? ((repeatValue / totalCustomers) * 100).toFixed(0) : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Reports & Analytics</h2>
          <p className="mt-1 text-gray-500">Analyze your business performance and growth.</p>
        </div>
        <div className="flex items-center space-x-2">
            <button className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600">
                <Download className="w-5 h-5 mr-2" />
                Export
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg text-gray-700">Revenue by City</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.revenueByCity} layout="vertical" margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={80} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: '#f9fafb' }} />
              <Bar dataKey="revenue" fill="#ef4444" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg text-gray-700">Bookings by Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.bookingsByDay} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="bookings" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col">
          <h3 className="font-semibold text-lg text-gray-700">Customer Repeat Rate</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data.customerRepeatData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5}>
                {data.customerRepeatData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-auto text-center">
             <div className="text-4xl font-bold text-red-500">{repeatRate}%</div>
             <p className="text-gray-500">Repeat Rate</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold text-lg text-gray-700 mb-4">Partner Performance</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Partner Name</th>
                        <th scope="col" className="px-6 py-3">Avg. Rating</th>
                        <th scope="col" className="px-6 py-3">Completed Bookings</th>
                    </tr>
                </thead>
                <tbody>
                    {data.topPartners.map(partner => (
                        <tr key={partner.name} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{partner.name}</td>
                            <td className="px-6 py-4"><div className="flex items-center"><Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" /> {partner.rating.toFixed(1)}</div></td>
                            <td className="px-6 py-4">{partner.completed}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}