import { Check, X } from 'lucide-react';
import { useAppDispatch } from '@/app/store/hooks';
import { acceptJobItem, rejectJobRequest } from '@/app/store/features/pro/proBookingsSlice';
import { ProNewRequest } from '@/types';

interface NewJobRequestItemProps {
    request: ProNewRequest;
}

export default function NewJobRequestItem({ request }: NewJobRequestItemProps) {
    const dispatch = useAppDispatch();

    const handleAccept = () => {
        if (request.bookingId && request.itemId) {
            dispatch(acceptJobItem({ bookingId: request.bookingId, itemId: request.itemId }));
        }
    };

    const handleDecline = () => {
        if (request.bookingId) {
            dispatch(rejectJobRequest(request.bookingId));
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                    <p className="font-semibold text-gray-800">{request.serviceName}</p>
                    <p className="text-sm text-gray-500">{request.location}</p>
                </div>
                <p className="font-bold text-lg text-green-600 mt-2 sm:mt-0">₹{request.earnings.toFixed(0)}</p>
            </div>
            <div className="flex space-x-2 mt-4">
                <button onClick={handleDecline} className="flex-1 flex items-center justify-center bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600"><X className="w-5 h-5 mr-2"/>Decline</button>
                <button onClick={handleAccept} className="flex-1 flex items-center justify-center bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600"><Check className="w-5 h-5 mr-2"/>Accept</button>
            </div>
        </div>
    );
}