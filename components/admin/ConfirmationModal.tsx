"use client";

import { AlertTriangle } from "lucide-react";
import Modal from "@/components/admin/Modal";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }: ConfirmationModalProps) {
  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose} size="md">
      <div className="text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
}
