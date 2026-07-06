import type { FC, ReactNode } from 'react';
import { Navbar } from '../components/Navbar';
import { ToastContainer } from '../components/Toast';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-brand-background flex flex-col">
      {/* Top Header Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/60 py-6 text-center text-xs text-slate-400 font-medium tracking-wide uppercase">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>TaskPilot AI © {new Date().getFullYear()}</span>
          <span>Powered by FastAPI + React + Gemini LLM</span>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
};
