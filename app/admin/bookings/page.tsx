import BookingTable from "@/components/admin/bookings/BookingTable";

export default function BookingManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Booking Management</h2>
        <p className="mt-1 text-gray-500">Monitor and manage all service bookings.</p>
      </div>
      <BookingTable />
    </div>
  );
}