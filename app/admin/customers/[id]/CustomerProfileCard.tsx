import { Customer } from "@/types";
import { Mail, Phone, Calendar } from "lucide-react";
import { format } from 'date-fns';

export default function CustomerProfileCard({ customer }: { customer: Customer }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-start space-x-6">
                <img src={customer.avatarUrl || `https://ui-avatars.com/api/?name=${customer.name}`} alt={customer.name} className="w-24 h-24 rounded-full" />
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800">{customer.name}</h2>
                    <div className="mt-2 space-y-1 text-gray-600">
                        <p className="flex items-center"><Mail className="w-4 h-4 mr-2" /> {customer.email || 'No email provided'}</p>
                        <p className="flex items-center"><Phone className="w-4 h-4 mr-2" /> {customer.mobileNumber}</p>
                        <p className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> Joined on {format(new Date(customer.createdAt), 'PPP')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}