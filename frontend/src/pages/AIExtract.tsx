import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExtract } from '../hooks/useExtract';
import { useTasks } from '../hooks/useTasks';
import { useToast } from '../hooks/useToast';
import { MeetingNotesCard } from '../components/MeetingNotesCard';
import { AISummaryCard } from '../components/AISummaryCard';
import { TaskReviewList } from '../components/TaskReviewCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const AIExtract: FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const {
    extractedTasks,
    isExtracting,
    extractError,
    extractTasks,
    clearExtractedTasks,
    setExtractedTasks,
  } = useExtract();

  const { saveMultipleTasks, deleteTask } = useTasks();

  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleExtract = async (text: string) => {
    const data = await extractTasks(text);
    if (data && data.length > 0) {
      setIsReviewMode(true);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await saveMultipleTasks(extractedTasks);
      clearExtractedTasks();
      setIsReviewMode(false);
      addToast('AI tasks successfully persisted to database.', 'success');
      navigate('/tasks'); // Redirect to task list after saving
    } catch {
      // Toast message shown by hooks
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelReview = async () => {
    setIsDiscarding(true);
    try {
      // Discard extracted tasks from database (since backend persists them on extraction)
      for (const t of extractedTasks) {
        try {
          await deleteTask(t.id);
        } catch {
          // Ignore individual delete failures on cancel
        }
      }
      clearExtractedTasks();
      setIsReviewMode(false);
      addToast('Extracted tasks discarded.', 'info');
    } finally {
      setIsDiscarding(false);
    }
  };

  if (isExtracting || isDiscarding || isSaving) {
    const message = isExtracting
      ? 'AI is analyzing your meeting notes...'
      : isDiscarding
      ? 'Discarding extracted tasks...'
      : 'Saving tasks to SQLite...';

    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <LoadingSpinner size="lg" />
        <div>
          <h3 className="text-lg font-semibold text-brand-heading">{message}</h3>
          <p className="text-sm text-slate-500">Please do not navigate away or refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-brand-heading">AI Task Extraction</h2>
          <p className="text-sm text-slate-500 mt-1">
            Convert unstructured transcripts, notes, and tasks into formatted action items using Gemini 2.5.
          </p>
        </div>
      </div>

      {isReviewMode ? (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-brand-heading font-inter uppercase tracking-wider text-slate-400">
              Extraction Metrics
            </h3>
            <AISummaryCard tasks={extractedTasks} />
          </div>

          {/* Editable Review Cards */}
          <TaskReviewList
            tasks={extractedTasks}
            onTasksChange={setExtractedTasks}
            onSaveAll={handleSaveAll}
            onCancel={handleCancelReview}
            isSaving={isSaving}
          />
        </div>
      ) : (
        <div className="max-w-4xl">
          {extractError && (
            <div className="bg-rose-50 border border-rose-100 text-rose-800 text-sm p-4 rounded-lg mb-6">
              <strong>Extraction Error:</strong> {extractError}
            </div>
          )}

          <MeetingNotesCard onExtract={handleExtract} isLoading={isExtracting} />
        </div>
      )}
    </div>
  );
};
