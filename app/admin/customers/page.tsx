import CustomerTable from "@/components/admin/customers/CustomerTable";

export default function CustomerManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Customer Management</h2>
        <p className="mt-1 text-gray-500">View, search, and manage all your customers.</p>
      </div>
      <CustomerTable />
    </div>
  );
}