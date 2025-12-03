import React from 'react';
import { TEXT } from '../constants';
import { Language } from '../types';
import { NavLink } from 'react-router-dom';
import { Sun, Moon, Globe } from 'lucide-react';

interface NavbarProps {
  lang: Language;
  setLang: (l: Language) => void;
  isDark: boolean;
  setIsDark: (d: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ lang, setLang, isDark, setIsDark }) => {
  const toggleLang = () => setLang(lang === 'EN' ? 'BN' : 'EN');
  const toggleTheme = () => setIsDark(!isDark);

  const linkClass = ({ isActive }: { isActive: boolean }) => 
    `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-orange-500 font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-orange-400'}`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold">
            AI
          </div>
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600 hidden sm:block">
            {TEXT.appTitle[lang]}
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6">
            <NavLink to="/" className={linkClass}>{TEXT.dashboard[lang]}</NavLink>
            <NavLink to="/research" className={linkClass}>{TEXT.research[lang]}</NavLink>
            <NavLink to="/alerts" className={linkClass}>{TEXT.alerts[lang]}</NavLink>
            <NavLink to="/admin" className={linkClass}>{TEXT.admin[lang]}</NavLink>
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
            <button 
              onClick={toggleLang}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Language"
            >
              <span className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200">
                <Globe size={16} />
                {lang}
              </span>
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200"
              title="Toggle Theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className="md:hidden border-t border-slate-200 dark:border-slate-800 flex justify-around p-2 bg-white dark:bg-slate-900">
        <NavLink to="/" className={linkClass}>{TEXT.dashboard[lang]}</NavLink>
        <NavLink to="/research" className={linkClass}>{TEXT.research[lang]}</NavLink>
        <NavLink to="/alerts" className={linkClass}>{TEXT.alerts[lang]}</NavLink>
        <NavLink to="/admin" className={linkClass}>{TEXT.admin[lang]}</NavLink>
      </div>
    </nav>
  );
};