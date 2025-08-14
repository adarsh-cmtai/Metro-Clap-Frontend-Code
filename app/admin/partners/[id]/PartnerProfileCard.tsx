import { Partner } from "@/types";
import { Mail, Phone, Calendar, ShieldCheck, FileText, ExternalLink } from "lucide-react";
import { format } from 'date-fns';

const DetailItem = ({ label, value }: { label: string; value?: string | string[] }) => (
    <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-800">{Array.isArray(value) ? value.join(', ') : (value || 'N/A')}</p>
    </div>
);

export default function PartnerProfileCard({ partner }: { partner: Partner }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                <img src={partner.avatarUrl || `https://ui-avatars.com/api/?name=${partner.name}`} alt={partner.name} className="w-24 h-24 rounded-full" />
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <DetailItem label="Full Name" value={partner.name} />
                    <DetailItem label="Status" value={partner.status} />
                    <DetailItem label="Email" value={partner.email} />
                    <DetailItem label="Mobile" value={partner.mobileNumber} />
                    <DetailItem label="Rating" value={partner.rating?.toFixed(1) || 'N/A'} />
                    <DetailItem label="Joined On" value={format(new Date(partner.createdAt), 'PPP')} />
                    <DetailItem label="Skills" value={partner.partnerProfile?.skills} />
                    <DetailItem label="Serviceable Pincodes" value={partner.partnerProfile?.serviceablePincodes} />
                </div>
            </div>
            <div className="mt-4 pt-4 border-t">
                 <h4 className="font-semibold text-gray-700 mb-2">Documents</h4>
                 <ul className="flex flex-wrap gap-4">
                   {Object.entries(partner.partnerProfile?.documents || {}).map(([key, value]) => {
                        if (key.endsWith('Url') && value) {
                            const docName = key.replace('Url', '').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                            return (
                                <li key={key}>
                                    <a href={value as string} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 font-semibold hover:underline">
                                        <FileText className="w-4 h-4 mr-2"/> {docName} <ExternalLink className="w-3 h-3 ml-1"/>
                                    </a>
                                </li>
                            );
                        }
                        return null;
                   })}
                </ul>
            </div>
        </div>
    );
}