// --- START OF FILE app/admin/partners/applications/page.tsx ---

"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchApplications } from '@/app/store/features/admin/adminPartnerApplicationsSlice';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function PartnerApplicationsPage() {
    const dispatch = useAppDispatch();
    const { applications, status } = useAppSelector(state => state.adminPartnerApplications);

    useEffect(() => {
        dispatch(fetchApplications(''));
    }, [dispatch]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Partner Applications</h2>
                <p className="mt-1 text-gray-500">Review and approve new partner requests.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Company Name</th>
                                <th scope="col" className="px-6 py-3">Contact</th>
                                <th scope="col" className="px-6 py-3">City</th>
                                <th scope="col" className="px-6 py-3">Submitted On</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {status === 'loading' && <tr><td colSpan={5} className="text-center py-10"><Loader2 className="animate-spin mx-auto"/></td></tr>}
                            {applications.map(app => (
                                <tr key={app._id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{app.companyName}</td>
                                    <td className="px-6 py-4">{app.contacts[0]?.name} ({app.contacts[0]?.mobile})</td>
                                    <td className="px-6 py-4">{app.city}</td>
                                    <td className="px-6 py-4">{format(new Date(app.createdAt), 'PPP')}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/admin/partners/applications/${app._id}`} className="font-medium text-red-600 hover:underline">View Details</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// --- END OF FILE app/admin/partners/applications/page.tsx ---