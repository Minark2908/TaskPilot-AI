import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast';
import { AppLayout } from './layouts/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { AIExtract } from './pages/AIExtract';
import { TaskManagement } from './pages/TaskManagement';
import { TaskDetails } from './pages/TaskDetails';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/extract" element={<AIExtract />} />
            <Route path="/tasks" element={<TaskManagement />} />
            <Route path="/tasks/:taskId" element={<TaskDetails />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
