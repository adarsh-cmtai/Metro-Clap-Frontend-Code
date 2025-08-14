// --- START OF FILE app/pro/earnings/page.tsx ---

"use client";

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchEarningsData, fetchBankDetails } from '@/app/store/features/pro/proEarningsSlice';
import { Download, Edit, TrendingUp, TrendingDown, ArrowRight, Loader2 } from 'lucide-react';
import BankDetailsModal from '@/app/(pro)/components/pro/earnings/BankDetailsModal';

export default function EarningsPage() {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector(state => state.auth);
    const { data, bankDetails, status, error } = useAppSelector(state => state.proEarnings);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (token && status === 'idle') {
            dispatch(fetchEarningsData());
            dispatch(fetchBankDetails());
        }
    }, [token, status, dispatch]);
    
    if (status === 'loading' || !data) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-10 h-10 animate-spin text-red-500" /></div>;
    }
    
    if (status === 'failed') {
        return <div className="text-center py-20 text-red-500">{error || "Could not load earnings."}</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Earnings & Payouts</h1>
                <p className="text-gray-500 mt-1">Track your earnings and manage your payout settings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center text-gray-500">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        <span>Total Earnings (All Time)</span>
                    </div>
                    <p className="text-4xl font-bold text-gray-800 mt-2">₹{data.totalEarnings.toLocaleString()}</p>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center text-gray-500">
                        <TrendingDown className="w-5 h-5 mr-2" />
                        <span>Last Payout</span>
                    </div>
                    <p className="text-4xl font-bold text-gray-800 mt-2">₹{data.lastPayout.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">on Nov 1, 2023</p>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center text-gray-500">
                        <ArrowRight className="w-5 h-5 mr-2" />
                        <span>Next Payout</span>
                    </div>
                    <p className="text-4xl font-bold text-gray-800 mt-2">₹{data.nextPayout.toLocaleString()}</p>
                     <p className="text-sm text-gray-400">on Dec 1, 2023</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                             <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
                             <button className="flex items-center text-sm font-semibold text-red-600">
                                 <Download className="w-4 h-4 mr-2" />
                                 Export History
                             </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Booking ID</th>
                                        <th scope="col" className="px-6 py-3">Total Bill</th>
                                        <th scope="col" className="px-6 py-3">Commission</th>
                                        <th scope="col" className="px-6 py-3">Your Earning</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.transactions.map(tx => (
                                        <tr key={tx.bookingId} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-mono text-gray-800">{tx.bookingId}</td>
                                            <td className="px-6 py-4">₹{tx.total.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-red-600">- ₹{tx.commission.toLocaleString()}</td>
                                            <td className="px-6 py-4 font-bold text-green-600">₹{tx.earning.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1">
                     <div className="bg-white p-6 rounded-lg shadow-sm">
                         <h2 className="text-xl font-bold text-gray-800 mb-4">Payout Settings</h2>
                         <div className="space-y-3">
                            {bankDetails && bankDetails.accountNumber ? (
                                <>
                                    <p className="font-semibold text-gray-700">**** **** **** {bankDetails.accountNumber.slice(-4)}</p>
                                    <p className="text-sm text-gray-500">{bankDetails.accountHolderName}</p>
                                </>
                            ) : (
                                <p className="text-sm text-gray-500">No bank details added yet.</p>
                            )}
                            <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center justify-center bg-gray-100 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-200 mt-2">
                                <Edit className="w-4 h-4 mr-2" />
                                {bankDetails && bankDetails.accountNumber ? 'Edit Bank Details' : 'Add Bank Details'}
                            </button>
                         </div>
                     </div>
                </div>
            </div>
            <BankDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}

// --- END OF FILE app/pro/earnings/page.tsx ---    