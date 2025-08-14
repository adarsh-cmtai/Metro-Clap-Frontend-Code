// --- START OF FILE app/components/admin/bookings/BookingTable.tsx ---

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchBookings } from "@/app/store/features/admin/bookingsSlice";
import { Booking, BookingStatus } from "@/types";
import { Search, ChevronDown } from "lucide-react";

const StatusBadge = ({ status }: { status: BookingStatus }) => {
  const baseClasses = "px-2.5 py-1 text-xs font-semibold rounded-full";
  const statusClasses: Record<BookingStatus, string> = {
    Completed: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Cancelled: "bg-red-100 text-red-800",
    Confirmed: "bg-blue-100 text-blue-800",
    Searching: "bg-purple-100 text-purple-800",
  };
  return <span className={`${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};

export default function BookingTable() {
  const dispatch = useAppDispatch();
  const { bookings, status } = useAppSelector((state) => state.adminBookings);
  const { token } = useAppSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (token) {
        dispatch(fetchBookings({ 
            search: searchQuery, 
            status: statusFilter,
            startDate,
            endDate
        }));
    }
  }, [searchQuery, statusFilter, startDate, endDate, token, dispatch]);

  const isLoading = status === 'loading';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div className="relative">
          <input type="text" placeholder="Search by Booking ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg"/>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full appearance-none bg-gray-100 border rounded-lg pl-4 pr-8 py-2">
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Searching">Searching</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" />
        </div>
        <div className="flex items-center space-x-2">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2 border rounded-lg" />
            <span className="text-gray-500">-</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2 border rounded-lg" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Booking ID</th>
              <th scope="col" className="px-6 py-3">Customer & Partner</th>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
                <tr><td colSpan={5} className="text-center py-10">Loading bookings...</td></tr>
            ) : bookings.length > 0 ? (
                bookings.map((booking) => (
                    <tr key={booking._id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-gray-900">{booking.bookingId}</td>
                        <td className="px-6 py-4">
                            <div className="font-semibold">{booking.customerId.name}</div>
                            <div className="text-xs text-gray-500">to {booking.partnerId?.name || "N/A"}</div>
                        </td>
                        <td className="px-6 py-4">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4"><StatusBadge status={booking.status} /></td>
                        <td className="px-6 py-4 text-right">
                            <Link href={`/admin/bookings/${booking._id}`} className="font-medium text-red-600 hover:underline">View</Link>
                        </td>
                    </tr>
                ))
            ) : (
                <tr><td colSpan={5} className="text-center py-10 text-gray-500">No bookings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- END OF FILE app/components/admin/bookings/BookingTable.tsx ---