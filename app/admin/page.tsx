"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchDashboardData } from "@/app/store/features/admin/dashboardSlice";
import StatCard from "@/components/admin/StatCard";
import { DollarSign, Bookmark, User, UserCheck, Bell } from "lucide-react";
import EarningsChart from "@/components/admin/charts/EarningsChart";
import BookingsStatusChart from "@/components/admin/charts/BookingsStatusChart";
import TopServicesChart from "@/components/admin/charts/TopServicesChart";

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((state) => state.adminDashboard);
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token && status === 'idle') {
      dispatch(fetchDashboardData());
    }
  }, [token, status, dispatch]);

  if (status === 'loading' || status === 'idle') {
    return <div className="text-center py-10">Loading Dashboard...</div>;
  }

  if (status === 'failed' || !data) {
    return <div className="text-center py-10 text-red-500">{error || 'Failed to load data. Please log in as an admin.'}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-full hover:bg-gray-200">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Earnings (Month)" value={`₹${data.totalEarningsMonth.toLocaleString('en-IN')}`} Icon={DollarSign} />
        <StatCard title="Total Bookings (Month)" value={data.totalBookingsMonth.toString()} Icon={Bookmark} />
        <StatCard title="New Customers (Month)" value={data.newCustomersMonth.toString()} Icon={User} />
        <StatCard title="New Partners (Month)" value={data.newPartnersMonth.toString()} Icon={UserCheck} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <EarningsChart />
        </div>
        <div>
            <BookingsStatusChart data={data.bookingsByStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <TopServicesChart data={data.topServices} />
        </div>
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                    <Link href="/admin/partners" className="flex justify-between items-center p-3 bg-yellow-100 rounded-lg text-yellow-800">
                        <span>Pending Partner Approvals</span>
                        <span className="font-bold bg-yellow-300 px-2 py-0.5 rounded-full">{data.pendingPartnerApprovals}</span>
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}