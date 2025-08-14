import { useState } from 'react';
import { SupportTicket } from "@/types";
import { useAppDispatch } from '@/app/store/hooks';
import { addAdminReply } from '@/app/store/features/admin/adminCustomerDetailsSlice';
import { format } from "date-fns";
import { ChevronDown, Send } from "lucide-react";

export default function SupportTickets({ tickets }: { tickets: SupportTicket[] }) {
    const dispatch = useAppDispatch();
    const [activeTicket, setActiveTicket] = useState<string | null>(null);
    const [reply, setReply] = useState('');

    const handleReply = (ticketId: string) => {
        if (!reply.trim()) return;
        dispatch(addAdminReply({ ticketId, message: reply }));
        setReply('');
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Support Tickets</h3>
            <div className="space-y-4">
                {tickets.map(ticket => (
                    <div key={ticket._id} className="border rounded-lg">
                        <button onClick={() => setActiveTicket(activeTicket === ticket._id ? null : ticket._id)} className="w-full flex justify-between items-center p-4 text-left">
                            <div>
                                <p className="font-semibold">{ticket.topic}</p>
                                <p className="text-xs text-gray-500">Opened on {format(new Date(ticket.createdAt), 'PP')}</p>
                            </div>
                            <ChevronDown className={`transform transition-transform ${activeTicket === ticket._id ? 'rotate-180' : ''}`} />
                        </button>
                        {activeTicket === ticket._id && (
                            <div className="p-4 border-t bg-gray-50">
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <p className="font-semibold text-sm">Customer:</p>
                                        <p>{ticket.message}</p>
                                    </div>
                                    {ticket.replies.map(r => (
                                        <div key={r._id} className={`p-3 rounded-lg ${r.sender === 'admin' ? 'bg-green-100' : 'bg-blue-100'}`}>
                                            <p className="font-semibold text-sm">{r.sender === 'admin' ? 'You' : 'Customer'}:</p>
                                            <p>{r.message}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex space-x-2">
                                    <input type="text" value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply..." className="flex-1 p-2 border rounded-lg" />
                                    <button onClick={() => handleReply(ticket._id)} className="p-2 bg-red-500 text-white rounded-lg"><Send/></button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}