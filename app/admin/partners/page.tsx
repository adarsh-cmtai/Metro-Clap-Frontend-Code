import PartnerTable from "@/components/admin/partners/PartnerTable";

export default function PartnerManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Partner Management</h2>
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors">
          Add New Partner
        </button>
      </div>
      <PartnerTable />
    </div>
  );
}