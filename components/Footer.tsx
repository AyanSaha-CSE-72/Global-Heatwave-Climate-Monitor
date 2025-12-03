import React from 'react';
import { TEXT } from '../constants';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer className="mt-12 py-6 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center">
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
        {TEXT.builtBy[lang]}
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">
        &copy; {new Date().getFullYear()} AI Heatwave Project. All rights reserved.
      </p>
    </footer>
  );
};