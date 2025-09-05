"use client";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative bg-neutral-900 rounded-2xl p-6 w-full max-w-md shadow-lg border border-neutral-700">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-white transition"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}