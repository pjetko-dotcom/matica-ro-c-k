import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto">
      {/* Changed max-w-md to max-w-2xl for a wider look */}
      <div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] w-full max-w-2xl overflow-hidden animate-in zoom-in-95 fade-in slide-in-from-bottom-12 duration-500">
        <div className="px-8 py-5 flex justify-between items-center border-b-2 border-slate-50 bg-gradient-to-r from-slate-50 to-white">
          <h3 className="text-[11px] font-black text-slate-900 tracking-[0.3em] uppercase italic">{title}</h3>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-white border-2 border-slate-50 rounded-xl text-slate-300 hover:text-rose-500 transition-all hover:shadow-lg hover:-translate-y-0.5">
            <i className="fas fa-times text-base"></i>
          </button>
        </div>
        <div className="p-6 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;