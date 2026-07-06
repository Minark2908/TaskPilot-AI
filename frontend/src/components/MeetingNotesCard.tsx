import type { FC } from 'react';
import { useState } from 'react';
import { Sparkles, Trash2 } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

interface MeetingNotesCardProps {
  onExtract: (text: string) => Promise<void>;
  isLoading: boolean;
}

export const MeetingNotesCard: FC<MeetingNotesCardProps> = ({ onExtract, isLoading }) => {
  const [text, setText] = useState('');

  const handleExtract = async () => {
    if (text.trim().length < 10) return;
    await onExtract(text);
  };

  const handleClear = () => {
    setText('');
  };

  const isValid = text.trim().length >= 10;

  return (
    <div className="bg-white border border-slate-200/50 rounded-lg p-6 hover:shadow-[0_4px_12px_rgba(30,41,59,0.05)] transition-all duration-200">
      <div className="flex items-center gap-2.5 mb-4">
        <Sparkles className="h-4.5 w-4.5 text-primary" />
        <h2 className="text-base font-bold text-brand-heading font-serif">Meeting Notes</h2>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste meeting notes or task descriptions here (min. 10 characters)..."
        disabled={isLoading}
        rows={6}
        className="w-full p-4 border border-slate-200 rounded-sm bg-white text-brand-text placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-50 disabled:text-slate-500 font-sans text-sm resize-y transition-all duration-150"
      />

      <div className="flex items-center justify-between mt-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-inter">
          {text.trim().length} characters
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={handleClear}
            disabled={isLoading || !text}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-sm font-inter text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
          <button
            onClick={handleExtract}
            disabled={isLoading || !isValid}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-white hover:bg-primary-dark font-inter text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Extracting...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Extract Tasks</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
