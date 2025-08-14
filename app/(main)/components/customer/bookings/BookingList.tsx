import BookingItem from './BookingItem';
import { CustomerBooking, BookingItem as BookingItemType } from '@/types';

interface BookingListProps {
  bookings: CustomerBooking[];
  onRate: (booking: CustomerBooking, item: BookingItemType) => void;
}

export default function BookingList({ bookings, onRate }: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No bookings found in this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <BookingItem key={booking._id} booking={booking} onRate={onRate} />
      ))}
    </div>
  );
}