// --- START OF FILE app/admin/partners/applications/[id]/page.tsx ---

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchApplicationDetails, approveApplication, rejectApplication } from '@/app/store/features/admin/adminPartnerApplicationsSlice';
import { Loader2, Check, X, FileText } from 'lucide-react';

const DetailCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm"><h3 className="font-semibold text-lg mb-4 border-b pb-2">{title}</h3><div className="space-y-2 text-sm">{children}</div></div>
);
const DetailItem = ({ label, value }: { label: string, value?: string }) => (
    <p><strong>{label}:</strong> {value || 'N/A'}</p>
);

export default function ApplicationDetailsPage({ params }: { params: { id: string } }) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { singleApplication: app, status } = useAppSelector(state => state.adminPartnerApplications);

    useEffect(() => {
        dispatch(fetchApplicationDetails(params.id));
    }, [dispatch, params.id]);

    const handleApprove = async () => {
        const result = await dispatch(approveApplication(`${params.id}/approve`));
        if (approveApplication.fulfilled.match(result)) router.push('/admin/partners/applications');
    };

    const handleReject = async () => {
        const result = await dispatch(rejectApplication(`${params.id}/reject`));
        if (rejectApplication.fulfilled.match(result)) router.push('/admin/partners/applications');
    };

    if (status === 'loading' || !app) return <div className="text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto text-red-500" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Application Details</h2>
                    <p className="mt-1 text-gray-500">Reviewing application from <strong>{app.companyName}</strong></p>
                </div>
                {app.status === 'Pending' && (
                    <div className="flex space-x-2">
                        <button onClick={handleReject} className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600"><X className="w-4 h-4 mr-2"/>Reject</button>
                        <button onClick={handleApprove} className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600"><Check className="w-4 h-4 mr-2"/>Approve</button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <DetailCard title="Vendor Information">
                        <DetailItem label="Company Name" value={app.companyName} />
                        <DetailItem label="City" value={app.city} />
                        <DetailItem label="Aadhaar No" value={app.aadhaarNo} />
                        <DetailItem label="GST No" value={app.gstNo} />
                    </DetailCard>
                    <DetailCard title="Contact Person">
                        <DetailItem label="Name" value={app.contacts[0].name} />
                        <DetailItem label="Mobile" value={app.contacts[0].mobile} />
                        <DetailItem label="Email" value={app.contacts[0].email} />
                    </DetailCard>
                     <DetailCard title="Address">
                        <DetailItem label="Street" value={app.addresses[0].street} />
                        <DetailItem label="House/Apartment" value={`${app.addresses[0].house}, ${app.addresses[0].apartment}`} />
                        <DetailItem label="District" value={app.addresses[0].district} />
                        <DetailItem label="State & Pin" value={`${app.addresses[0].state} - ${app.addresses[0].pin}`} />
                    </DetailCard>
                </div>
                 <div className="space-y-6">
                    <DetailCard title="Offered Services">
                        <ul className="list-disc list-inside">
                            {app.services.map(s => <li key={s}>{s}</li>)}
                        </ul>
                    </DetailCard>
                    <DetailCard title="Uploaded Documents">
                        {Object.entries(app.documents).map(([key, value]) => value && (
                            <a href={value as string} target="_blank" rel="noopener noreferrer" key={key}
                                className="flex items-center p-2 bg-gray-50 hover:bg-gray-100 rounded-md">
                                <FileText className="w-4 h-4 mr-2 text-gray-500"/> {key.replace('Url', '')}
                            </a>
                        ))}
                    </DetailCard>
                </div>
            </div>
        </div>
    );
}

// --- END OF FILE app/admin/partners/applications/[id]/page.tsx ---