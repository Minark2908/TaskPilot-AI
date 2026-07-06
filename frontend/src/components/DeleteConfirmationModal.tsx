import type { FC } from 'react';
import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Task } from '../types';

interface DeleteConfirmationModalProps {
  task: Task;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isOpen: boolean;
}

export const DeleteConfirmationModal: FC<DeleteConfirmationModalProps> = ({
  task,
  onClose,
  onConfirm,
  isOpen,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px] p-4">
      <div className="bg-white border border-slate-200 rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Delete Task</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-slate-600 mb-4">
            Are you sure you want to delete the following task? This action cannot be undone.
          </p>
          <div className="bg-slate-50 border border-slate-100 rounded p-3 mb-6 text-sm text-slate-700 font-medium">
            {task.description}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 border border-slate-200 rounded font-inter text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-inter text-xs font-semibold uppercase tracking-wider rounded transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
