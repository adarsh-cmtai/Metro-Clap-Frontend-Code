"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchAdminPartners } from "@/app/store/features/admin/adminPartnersSlice";
import { PartnerStatus } from "@/types";
import { Search, ChevronDown, Loader2 } from "lucide-react";

const StatusBadge = ({ status }: { status: PartnerStatus }) => {
  const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
  const statusClasses: Record<PartnerStatus, string> = {
    Approved: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Suspended: "bg-red-100 text-red-800",
  };
  return <span className={`${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};

export default function PartnerTable() {
  const dispatch = useAppDispatch();
  const { partners, status, error } = useAppSelector((state) => state.adminPartners);
  const { token } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const handler = setTimeout(() => {
      if (token) {
        dispatch(fetchAdminPartners({ search: searchQuery, status: statusFilter }));
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery, statusFilter, token, dispatch]);

  const isLoading = status === 'loading';

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <div className="relative w-full md:max-w-sm">
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <div className="relative w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none bg-gray-100 border border-gray-300 rounded-lg pl-4 pr-8 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">Mobile</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
                <tr><td colSpan={4} className="text-center py-10"><Loader2 className="animate-spin mx-auto text-red-500" /></td></tr>
            ) : error ? (
                <tr><td colSpan={4} className="text-center py-10 text-red-500">{error}</td></tr>
            ) : partners.length > 0 ? (
              partners.map((partner) => (
                <tr key={partner._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={partner.avatarUrl || `https://i.pravatar.cc/150?u=${partner._id}`} alt={partner.name} className="w-10 h-10 rounded-full mr-3" />
                      <div>
                          <p>{partner.name}</p>
                          <p className="text-xs text-gray-500 md:hidden">{partner.mobileNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">{partner.mobileNumber}</td>
                  <td className="px-6 py-4"><StatusBadge status={partner.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/partners/${partner._id}`} className="font-medium text-red-600 hover:underline">View</Link>
                  </td>
                </tr>
              ))
            ) : (
                <tr><td colSpan={4} className="text-center py-10">No partners found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}