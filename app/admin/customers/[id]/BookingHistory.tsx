import { useState } from 'react';
import { Booking, BookingStatus } from "@/types";
import { format } from "date-fns";
import Link from "next/link";

const StatusBadge = ({ status }: { status: BookingStatus }) => {
  const base = "px-2.5 py-1 text-xs font-semibold rounded-full";
  const styles: Record<BookingStatus, string> = {
    Completed: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Cancelled: "bg-red-100 text-red-800",
    Confirmed: "bg-blue-100 text-blue-800",
    Searching: "bg-purple-100 text-purple-800",
    "Partially Assigned": "bg-indigo-100 text-indigo-800",
  };
  return <span className={`${base} ${styles[status]}`}>{status}</span>;
};

export default function BookingHistory({ bookings = [] }: { bookings: Booking[] }) {
    const [filter, setFilter] = useState<BookingStatus | 'All'>('All');
    
    const filteredBookings = filter === 'All' ? bookings : bookings.filter(b => b.status === filter);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Booking History</h3>
            <div className="mb-4">
                <select value={filter} onChange={e => setFilter(e.target.value as any)} className="p-2 border rounded-lg">
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left text-gray-500">
                        <th className="py-2">Booking ID</th><th>Date</th><th>Status</th><th>Total</th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBookings.map(booking => (
                        <tr key={booking._id} className="border-t">
                            <td className="py-3 font-mono">{booking.bookingId}</td>
                            <td>{format(new Date(booking.bookingDate), 'PP')}</td>
                            <td><StatusBadge status={booking.status} /></td>
                            <td>₹{booking.totalPrice}</td>
                            <td className="text-right">
                                <Link href={`/admin/bookings/${booking._id}`} className="text-red-600 hover:underline">View</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}