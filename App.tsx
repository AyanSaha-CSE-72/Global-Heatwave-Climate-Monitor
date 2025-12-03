import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Dashboard } from './pages/Dashboard';
import { Research } from './pages/Research';
import { Alerts } from './pages/Alerts';
import { Admin } from './pages/Admin';
import { Language } from './types';

function App() {
  const [lang, setLang] = useState<Language>('EN');
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={`${isDark ? 'dark' : ''} min-h-screen flex flex-col`}>
      <div className="bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-200 text-slate-900 dark:text-slate-100">
        <HashRouter>
          <Navbar lang={lang} setLang={setLang} isDark={isDark} setIsDark={setIsDark} />
          
          <main className="container mx-auto px-4 py-8 flex-grow">
            <Routes>
              <Route path="/" element={<Dashboard lang={lang} />} />
              <Route path="/research" element={<Research lang={lang} />} />
              <Route path="/alerts" element={<Alerts lang={lang} />} />
              <Route path="/admin" element={<Admin lang={lang} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer lang={lang} />
        </HashRouter>
      </div>
    </div>
  );
}

export default App;