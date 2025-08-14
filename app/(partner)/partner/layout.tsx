import StatCard from '@/app/(pro)/components/pro/dashboard/StatCard';
import UpcomingJobItem from '@/app/(pro)/components/pro/dashboard/UpcomingJobItem';
import NewJobRequestItem from '@/app/(pro)/components/pro/dashboard/NewJobRequestItem';
import { DollarSign, Star, Zap, BarChart2 } from 'lucide-react';

const todayJobs = [
    { timeSlot: '02:00 PM - 04:00 PM', serviceName: 'AC Repair', customerName: 'Rohan Sharma', address: 'A-123, Sunshine Apartments, Mumbai' },
    { timeSlot: '05:00 PM - 06:00 PM', serviceName: 'Plumbing Checkup', customerName: 'Sunita Patil', address: 'B-45, Green Valley, Pune' },
];
const newRequests = [
    { serviceName: 'Full Home Deep Cleaning', location: 'Andheri West, Mumbai', earnings: 1500 },
];

export default function ProDashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome, Rajesh!</h1>
                <p className="text-gray-500 mt-1">Here is your dashboard for today.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Today's Earnings" value="₹1,250" Icon={DollarSign} color="bg-green-500" />
                <StatCard title="This Week's Earnings" value="₹8,400" Icon={DollarSign} color="bg-blue-500" />
                <StatCard title="My Rating" value="4.8" Icon={Star} color="bg-yellow-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Schedule</h2>
                        <div className="space-y-4">
                            {todayJobs.map((job, i) => <UpcomingJobItem key={i} job={job} />)}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">New Job Requests</h2>
                        <div className="space-y-4">
                            {newRequests.map((req, i) => <NewJobRequestItem key={i} request={req} />)}
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-lg text-gray-700 mb-4">Performance Overview</h3>
                        <ul className="space-y-4">
                            <li className="flex justify-between items-center">
                                <span className="flex items-center text-gray-600"><Zap className="w-5 h-5 mr-2 text-yellow-500"/>Acceptance Rate</span>
                                <span className="font-bold text-green-600">95%</span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="flex items-center text-gray-600"><BarChart2 className="w-5 h-5 mr-2 text-blue-500"/>Completion Rate</span>
                                <span className="font-bold text-green-600">100%</span>
                            </li>
                             <li className="flex justify-between items-center">
                                <span className="flex items-center text-gray-600"><Star className="w-5 h-5 mr-2 text-red-500"/>5-Star Ratings</span>
                                <span className="font-bold text-gray-800">82</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}