import { Address } from "@/types";
import { useAppDispatch } from "@/app/store/hooks";
import { deleteCustomerAddress } from "@/app/store/features/admin/adminCustomerDetailsSlice";
import { Home, Briefcase, MapPin, Edit, Trash2 } from "lucide-react";

export default function AddressList({ addresses = [] }: { addresses: Address[] }) {
    const dispatch = useAppDispatch();

    const icons = {
        Home: <Home className="w-5 h-5" />,
        Office: <Briefcase className="w-5 h-5" />,
        Other: <MapPin className="w-5 h-5" />,
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            dispatch(deleteCustomerAddress(id));
        }
    };

    return (
         <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Saved Addresses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map(addr => (
                    <div key={addr._id} className="border rounded-lg p-4 flex justify-between">
                        <div className="flex space-x-4">
                            <div className="text-red-500 mt-1">{icons[addr.type]}</div>
                            <div>
                                <p className="font-semibold">{addr.type}</p>
                                <p className="text-sm text-gray-600">{addr.line1}, {addr.line2}, {addr.city} - {addr.pincode}</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button className="p-2 text-gray-500 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(addr._id)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}