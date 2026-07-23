import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const CustomAlert = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    // Auto-cerrar después de 4 segundos
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      bg: 'bg-emerald-50 border-emerald-100',
      text: 'text-emerald-800',
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />
    },
    error: {
      bg: 'bg-rose-50 border-rose-100',
      text: 'text-rose-800',
      icon: <AlertCircle className="w-5 h-5 text-rose-500" />
    },
    info: {
      bg: 'bg-sky-50 border-sky-100',
      text: 'text-sky-800',
      icon: <Info className="w-5 h-5 text-sky-500" />
    }
  };

  const current = config[type] || config.info;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-55 w-[90%] max-w-sm animate-slide-up">
      <div className={`flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md ${current.bg} ${current.text}`}>
        <div className="shrink-0 mt-0.5">
          {current.icon}
        </div>
        <div className="flex-1 text-left">
          <p className="text-xs font-sans font-bold leading-normal">
            {message}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-all p-0.5 rounded-full hover:bg-black/5 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;
