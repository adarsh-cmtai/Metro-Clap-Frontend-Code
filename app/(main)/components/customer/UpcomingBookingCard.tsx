import { Phone, Star, Clock, XCircle } from 'lucide-react';
import { UpcomingBooking } from '@/types';
import { format } from 'date-fns';
import { useAppDispatch } from '@/app/store/hooks';
import { cancelBooking, rescheduleBooking } from '@/app/store/features/customer/bookingsSlice';
import toast from 'react-hot-toast';

export default function UpcomingBookingCard({ booking }: { booking: UpcomingBooking }) {
    const dispatch = useAppDispatch();
    const mainService = booking.items && booking.items.length > 0 ? booking.items[0] : null;
    const assignedPartner = booking.items.find(item => item.partnerId)?.partnerId;

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            dispatch(cancelBooking(booking._id));
        }
    };

    const handleReschedule = () => {
        const newDate = prompt("Enter new date (YYYY-MM-DD):");
        const newSlot = prompt("Enter new time slot (e.g., 10:00 AM - 11:00 AM):");
        if (newDate && newSlot) {
            dispatch(rescheduleBooking({ bookingId: booking._id, bookingDate: newDate, slotTime: newSlot }));
        } else {
            toast.error("Both date and time slot are required to reschedule.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-red-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Booking</h2>
            <div className="space-y-4">
                <div>
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-semibold text-lg text-red-600">{mainService?.serviceName || 'Service details unavailable'}</p>
                </div>
                <div className="border-t pt-4">
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-semibold text-gray-800">{format(new Date(booking.bookingDate), "PPP 'at' p")}</p>
                </div>
                <div className="border-t pt-4 flex items-center space-x-4">
                    <img src={assignedPartner?.avatarUrl || "https://i.pravatar.cc/150?u=partner"} alt="Partner" className="w-16 h-16 rounded-full"/>
                    <div>
                        <p className="text-sm text-gray-500">Assigned Partner</p>
                        {assignedPartner ? (
                            <>
                                <p className="font-semibold text-gray-800">{assignedPartner.name}</p>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                    {assignedPartner.rating.toFixed(1)}
                                </div>
                            </>
                        ) : (
                            <p className="font-semibold text-gray-800">Searching for partner...</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2">
                <a
                    href={assignedPartner?.mobileNumber ? `tel:${assignedPartner.mobileNumber}` : undefined}
                    onClick={(e) => !assignedPartner?.mobileNumber && e.preventDefault()}
                    className={`flex items-center justify-center p-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 ${!assignedPartner?.mobileNumber ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Phone className="w-4 h-4 mr-2" />Call
                </a>
                <button onClick={handleReschedule} className="flex items-center justify-center p-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200">
                    <Clock className="w-4 h-4 mr-2" />Reschedule
                </button>
                <button onClick={handleCancel} className="flex items-center justify-center p-2 text-sm text-red-600 hover:bg-red-50">
                    <XCircle className="w-4 h-4 mr-2" />Cancel
                </button>
            </div>
        </div>
    );
}