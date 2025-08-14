"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchAdminCustomers } from "@/app/store/features/admin/adminCustomersSlice";
import { Search, Loader2 } from "lucide-react";

export default function CustomerTable() {
  const dispatch = useAppDispatch();
  const { customers, status, error } = useAppSelector((state) => state.adminCustomers);
  const { token } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
        if (token) {
            dispatch(fetchAdminCustomers({ search: searchQuery }));
        }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, token, dispatch]);

  const isLoading = status === 'loading';

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="mb-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by name or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Customer</th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">Contact</th>
              <th scope="col" className="px-6 py-3">Total Bookings</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
                <tr><td colSpan={4} className="text-center py-10"><Loader2 className="animate-spin mx-auto text-red-500"/></td></tr>
            ) : error ? (
                <tr><td colSpan={4} className="text-center py-10 text-red-500">{error}</td></tr>
            ) : customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={customer.avatarUrl || `https://i.pravatar.cc/150?u=${customer._id}`} alt={customer.name} className="w-10 h-10 rounded-full mr-4" />
                      <div>
                        <span className="font-semibold">{customer.name}</span>
                        <p className="text-xs text-gray-500 md:hidden">{customer.mobileNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                      <div>{customer.mobileNumber}</div>
                      <div className="text-gray-400">{customer.email}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-center">{customer.totalBookings || 0}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/customers/${customer._id}`} className="font-medium text-red-600 hover:underline">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
                <tr><td colSpan={4} className="text-center py-10">No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}