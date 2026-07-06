import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { api } from '../services/api';
import { Send } from 'lucide-react';

export const Navbar: FC = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'AI Extract', path: '/extract' },
    { name: 'Task Management', path: '/tasks' },
  ];

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await api.get('/health');
        if (response.status === 200 && response.data.status === 'healthy') {
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      } catch {
        setIsOnline(false);
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-850 text-white shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-30 w-full font-inter">
      {/* Brand Logo & Name with Live Connection Indicator (Left) */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-8 w-8 rounded bg-primary text-white shadow-sm shadow-primary/20">
          <Send className="h-4 w-4 transform rotate-45" />
        </div>
        <span className="text-xs font-bold text-white tracking-wider uppercase flex items-center gap-2">
          TASKPILOT <span className="text-primary">AI</span>
          {isOnline === true && (
            <span className="relative flex h-1.5 w-1.5" title="Server Connection Live">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
          )}
          {isOnline === false && (
            <span className="relative flex h-1.5 w-1.5" title="Server Offline">
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
            </span>
          )}
        </span>
      </div>

      {/* Navigation Links (Right - Perfectly Aligned) */}
      <nav className="flex items-center gap-2 sm:gap-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
                isActive
                  ? 'bg-primary text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};
