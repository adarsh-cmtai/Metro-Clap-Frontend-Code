import { RotateCw } from 'lucide-react';
import { BookAgainService } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export default function BookAgainCard({ item }: { item: BookAgainService }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-gray-800">{item.service.name}</h4>
            <p className="text-xs text-gray-500 mb-3">Last booked: {formatDistanceToNow(new Date(item.lastBooked))} ago</p>
            <button className="w-full flex items-center justify-center bg-red-50 text-red-600 font-semibold py-2 rounded-lg">
                <RotateCw className="w-4 h-4 mr-2" />
                Book Again
            </button>
        </div>
    );
}