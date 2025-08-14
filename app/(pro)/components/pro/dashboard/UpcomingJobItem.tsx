import { Map, Play, CheckCircle } from 'lucide-react';

interface Job {
    timeSlot: string;
    serviceName: string;
    customerName: string;
    address: string;
}

export default function UpcomingJobItem({ job }: { job: Job }) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`;

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                <div>
                    <p className="font-bold text-lg text-gray-800">{job.serviceName}</p>
                    <p className="text-sm font-semibold text-red-600">{job.timeSlot}</p>
                    <p className="text-sm text-gray-600 mt-2">{job.customerName}</p>
                    <p className="text-xs text-gray-500">{job.address}</p>
                </div>
                <div className="flex space-x-2 mt-4 sm:mt-0 flex-shrink-0">
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"><Map className="w-5 h-5" /></a>
                    <button className="p-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"><Play className="w-5 h-5" /></button>
                    <button className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600"><CheckCircle className="w-5 h-5" /></button>
                </div>
            </div>
        </div>
    );
}