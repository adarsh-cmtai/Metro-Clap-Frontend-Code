import { AdminPartnerDetails } from "@/types";
import { format } from "date-fns";
import { Wallet, Clock, CheckCircle } from "lucide-react";

export default function PartnerEarnings({ earnings }: { earnings: AdminPartnerDetails['earnings'] }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Earnings Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-50 rounded-lg"><p className="text-sm text-green-700">Total Paid Out</p><p className="text-2xl font-bold text-green-800">₹{earnings.totalPaid.toFixed(2)}</p></div>
                <div className="p-4 bg-yellow-50 rounded-lg"><p className="text-sm text-yellow-700">Pending Payout</p><p className="text-2xl font-bold text-yellow-800">₹{earnings.pendingPayout.toFixed(2)}</p></div>
            </div>
            <h4 className="font-semibold mb-2">Payout History</h4>
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left text-gray-500">
                        <th className="py-2">Booking ID</th><th>Payout Date</th><th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {earnings.transactions.map((tx, i) => (
                        <tr key={i} className="border-t">
                            <td className="py-3 font-mono">{tx.bookingId}</td>
                            <td>{format(new Date(tx.date), 'PP')}</td>
                            <td className="font-semibold text-green-700">₹{tx.amount.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}