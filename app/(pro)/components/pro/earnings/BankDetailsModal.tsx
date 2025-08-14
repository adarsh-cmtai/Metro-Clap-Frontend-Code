"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { updateBankDetails } from '@/app/store/features/pro/proEarningsSlice';
import { X, Banknote, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface BankDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BankDetailsModal({ isOpen, onClose }: BankDetailsModalProps) {
  const dispatch = useAppDispatch();
  const { bankDetails, status } = useAppSelector(state => state.proEarnings);

  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [vpa, setVpa] = useState('');

  useEffect(() => {
    if (bankDetails) {
        setName(bankDetails.accountHolderName || '');
        setAccount(bankDetails.accountNumber || '');
        setIfsc(bankDetails.ifscCode || '');
        setVpa(bankDetails.vpa || '');
    }
  }, [bankDetails, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!((account && ifsc) || vpa)) {
        toast.error("Please provide either Bank Details or a UPI ID.");
        return;
    }

    const result = await dispatch(updateBankDetails({ 
        accountHolderName: name, 
        accountNumber: account, 
        ifscCode: ifsc,
        vpa: vpa
    }));
    if (updateBankDetails.fulfilled.match(result)) {
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"><X size={24} /></button>
        <div className="flex items-center mb-6">
            <Banknote className="w-6 h-6 mr-3 text-red-500" />
            <h3 className="text-xl font-bold">Payout Settings</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="accountHolder" className="block text-sm font-medium text-gray-700">Account Holder Name (Required)</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} name="accountHolder" id="accountHolder" required className="mt-1 w-full p-2 border rounded-md" />
            </div>
            <p className='text-center text-sm text-gray-500 font-semibold'>- OR -</p>
            <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">Account Number</label>
                <input type="text" value={account} onChange={e => setAccount(e.target.value)} name="accountNumber" id="accountNumber" className="mt-1 w-full p-2 border rounded-md" />
            </div>
             <div>
                <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700">IFSC Code</label>
                <input type="text" value={ifsc} onChange={e => setIfsc(e.target.value)} name="ifscCode" id="ifscCode" className="mt-1 w-full p-2 border rounded-md" />
            </div>
            <p className='text-center text-sm text-gray-500 font-semibold'>- OR -</p>
             <div>
                <label htmlFor="vpa" className="block text-sm font-medium text-gray-700">UPI ID (VPA)</label>
                <input type="text" value={vpa} onChange={e => setVpa(e.target.value)} name="vpa" id="vpa" className="mt-1 w-full p-2 border rounded-md" placeholder="yourname@bank" />
            </div>
            <div className="text-right pt-4">
                <button type="submit" disabled={status === 'loading'} className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 disabled:bg-red-300 flex items-center justify-center min-w-[150px]">
                    {status === 'loading' ? <Loader2 className="animate-spin" /> : 'Save Bank Details'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}