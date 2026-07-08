import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-crm-card border border-crm-border w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-crm-border">
          <h3 className="font-semibold text-base tracking-tight">{title}</h3>
          <button onClick={onClose} className="text-crm-textMuted hover:text-crm-textMain transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
// so i had create this for lucide animations