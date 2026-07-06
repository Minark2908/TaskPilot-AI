import type { FC } from 'react';import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToast, ToastMessage } from '../hooks/useToast';

export const Toast: FC<{ toast: ToastMessage }> = ({ toast }) => {
  const { removeToast } = useToast();

  const iconMap = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-rose-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  const bgMap = {
    success: 'bg-white border-emerald-100 shadow-emerald-500/5',
    error: 'bg-white border-rose-100 shadow-rose-500/5',
    info: 'bg-white border-blue-100 shadow-blue-500/5',
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border shadow-sm max-w-sm w-full animate-in slide-in-from-bottom duration-200 ${bgMap[toast.type]}`}
      role="alert"
    >
      <div className="flex-shrink-0">{iconMap[toast.type]}</div>
      <div className="flex-1 text-sm font-medium text-slate-700">{toast.message}</div>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const ToastContainer: FC = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-full max-w-xs md:max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
