// --- START OF FILE app/pro/page.tsx ---

"use client"

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchProDashboard } from '@/app/store/features/pro/proDashboardSlice';
import StatCard from '@/app/(pro)/components/pro/dashboard/StatCard';
import UpcomingJobItem from '@/app/(pro)/components/pro/dashboard/UpcomingJobItem';
import NewJobRequestItem from '@/app/(pro)/components/pro/dashboard/NewJobRequestItem';
import { DollarSign, Star, Zap, BarChart2, Loader2 } from 'lucide-react';

export default function ProDashboardPage() {
    const dispatch = useAppDispatch();
    const { user, token } = useAppSelector(state => state.auth);
    const { data, status, error } = useAppSelector(state => state.proDashboard);

    useEffect(() => {
        if (token && status === 'idle') {
            dispatch(fetchProDashboard());
        }
    }, [token, status, dispatch]);

    if (status === 'loading' || status === 'idle') {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-10 h-10 animate-spin text-red-500" /></div>;
    }

    if (status === 'failed' || !data) {
        return <div className="text-center py-20 text-red-500">{error || "Could not load dashboard."}</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome, {user?.name}!</h1>
                <p className="text-gray-500 mt-1">Here is your dashboard for today.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Today's Earnings" value={`₹${data.todaysEarnings.toLocaleString()}`} Icon={DollarSign} color="bg-green-500" />
                <StatCard title="This Week's Earnings" value={`₹${data.weeksEarnings.toLocaleString()}`} Icon={DollarSign} color="bg-blue-500" />
                <StatCard title="My Rating" value={data.rating.toFixed(1)} Icon={Star} color="bg-yellow-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Schedule</h2>
                        <div className="space-y-4">
                            {data.todayJobs.length > 0 ? (
                                data.todayJobs.map((job, i) => <UpcomingJobItem key={i} job={job} />)
                            ) : (
                                <p className="text-gray-500">No jobs scheduled for today.</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">New Job Requests</h2>
                        <div className="space-y-4">
                             {data.newJobRequests.length > 0 ? (
                                data.newJobRequests.map((req, i) => <NewJobRequestItem key={i} request={req} />)
                            ) : (
                                <p className="text-gray-500">No new job requests at the moment.</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-lg text-gray-700 mb-4">Performance Overview</h3>
                        <ul className="space-y-4">
                            <li className="flex justify-between items-center">
                                <span className="flex items-center text-gray-600"><Zap className="w-5 h-5 mr-2 text-yellow-500"/>Acceptance Rate</span>
                                <span className="font-bold text-green-600">{data.performance.acceptanceRate}%</span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="flex items-center text-gray-600"><BarChart2 className="w-5 h-5 mr-2 text-blue-500"/>Completion Rate</span>
                                <span className="font-bold text-green-600">{data.performance.completionRate}%</span>
                            </li>
                             <li className="flex justify-between items-center">
                                <span className="flex items-center text-gray-600"><Star className="w-5 h-5 mr-2 text-red-500"/>5-Star Ratings</span>
                                <span className="font-bold text-gray-800">{data.performance.fiveStarRatings}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- END OF FILE app/pro/page.tsx ---