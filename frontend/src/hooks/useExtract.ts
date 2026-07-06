import { useState, useCallback } from 'react';
import { Task } from '../types';
import { taskService } from '../services/taskService';
import { useToast } from './useToast';

export const useExtract = () => {
  const [extractedTasks, setExtractedTasks] = useState<Task[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const { addToast } = useToast();

  const extractTasks = useCallback(async (text: string): Promise<Task[] | null> => {
    setIsExtracting(true);
    setExtractError(null);
    try {
      const data = await taskService.extractTasks(text);
      setExtractedTasks(data);
      addToast(`AI successfully extracted ${data.length} task(s).`, 'success');
      return data;
    } catch (err: any) {
      const msg = err.message || 'AI Task Extraction failed.';
      setExtractError(msg);
      addToast(msg, 'error');
      return null;
    } finally {
      setIsExtracting(false);
    }
  }, [addToast]);

  const clearExtractedTasks = useCallback(() => {
    setExtractedTasks([]);
    setExtractError(null);
  }, []);

  return {
    extractedTasks,
    isExtracting,
    extractError,
    extractTasks,
    clearExtractedTasks,
    setExtractedTasks,
  };
};
