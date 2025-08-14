import { useState } from 'react';
import { AdminPartnerDetails, ItemStatus } from "@/types";
import { format } from "date-fns";
import Link from "next/link";

const StatusBadge = ({ status }: { status: ItemStatus }) => {
  const base = "px-2.5 py-1 text-xs font-semibold rounded-full";
  const styles: Record<ItemStatus, string> = {
    Completed: "bg-green-100 text-green-800",
    'Pending Assignment': "bg-gray-100 text-gray-800",
    PendingPartnerConfirmation: "bg-orange-100 text-orange-800",
    Assigned: "bg-blue-100 text-blue-800",
    InProgress: "bg-yellow-100 text-yellow-800",
    CompletedByPartner: "bg-purple-100 text-purple-800",
    Cancelled: "bg-red-100 text-red-800",
  };
  return <span className={`${base} ${styles[status] || 'bg-gray-100'}`}>{status.replace(/([A-Z])/g, ' $1')}</span>;
};

export default function PartnerBookingHistory({ bookings }: { bookings: AdminPartnerDetails['bookings'] }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Job History</h3>
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left text-gray-500">
                        <th className="py-2">Booking ID</th><th>Customer</th><th>Date</th><th>Status</th><th>Earning</th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(job => (
                        <tr key={job.itemId} className="border-t">
                            <td className="py-3 font-mono">{job.bookingId}</td>
                            <td>{job.customerName}</td>
                            <td>{format(new Date(job.date), 'PP')}</td>
                            <td><StatusBadge status={job.status} /></td>
                            <td>₹{job.earning.toFixed(2)}</td>
                            <td className="text-right">
                                <Link href={`/admin/bookings/${job._id}`} className="text-red-600 hover:underline">View</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}