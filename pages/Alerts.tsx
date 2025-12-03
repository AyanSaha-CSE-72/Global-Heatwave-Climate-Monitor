
import React, { useState, useEffect, useRef } from 'react';
import { TEXT } from '../constants';
import { Language, LocationData, UserRequest } from '../types';
import { searchLocations } from '../utils/weatherService';
import { Bell, CheckCircle, Search, MapPin, X, Loader2, Mail, Phone, MessageSquare, AlertCircle } from 'lucide-react';

interface AlertsProps {
  lang: Language;
}

export const Alerts: React.FC<AlertsProps> = ({ lang }) => {
  const [formData, setFormData] = useState({ name: '', contact: '', question: '' });
  const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS'>('IDLE');
  const [validationError, setValidationError] = useState('');
  
  // Search State
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // Debounce Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2 && !selectedLocation) {
        setIsSearching(true);
        const results = await searchLocations(query);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        setIsSearching(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, selectedLocation]);

  const handleSelectLocation = (loc: LocationData) => {
    setSelectedLocation(loc);
    setQuery(loc.name);
    setShowSuggestions(false);
  };

  const clearLocation = () => {
    setSelectedLocation(null);
    setQuery('');
    setSuggestions([]);
  };

  const validateContact = (contact: string): boolean => {
    // Simple Email Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Simple Phone Regex (Minimum 7 digits, allows +, spaces, dashes)
    const phoneRegex = /^(\+|0)?[\d\s-]{7,20}$/;
    
    return emailRegex.test(contact) || phoneRegex.test(contact);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!selectedLocation) return;

    if (!validateContact(formData.contact)) {
      setValidationError(lang === 'EN' 
        ? "Please enter a valid phone number or email address." 
        : "অনুগ্রহ করে একটি বৈধ ফোন নম্বর বা ইমেল ঠিকানা লিখুন।");
      return;
    }

    setStatus('SENDING');
    
    // Simulate API call and save to "Database" (LocalStorage for demo)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newRequest: UserRequest = {
      id: Date.now().toString(),
      name: formData.name,
      contact: formData.contact,
      location: selectedLocation,
      question: formData.question,
      status: 'PENDING',
      timestamp: Date.now()
    };

    // Save to local storage for Admin Panel to see
    const existing = JSON.parse(localStorage.getItem('userRequests') || '[]');
    localStorage.setItem('userRequests', JSON.stringify([newRequest, ...existing]));
    
    console.log("Registered for Alerts:", newRequest);
    setStatus('SUCCESS');
    setFormData({ name: '', contact: '', question: '' });
    clearLocation();
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in pb-12">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-100 dark:border-slate-700">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-4">
            <Bell size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{TEXT.subscribeText[lang]}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            {lang === 'EN' 
              ? "Receive instant notifications when heat intensity reaches critical levels in your selected city."
              : "আপনার নির্বাচিত শহরে তাপের তীব্রতা চরম পর্যায়ে পৌঁছালে তাৎক্ষণিক বিজ্ঞপ্তি পান।"
            }
          </p>
        </div>

        {status === 'SUCCESS' ? (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6 text-center animate-bounce-in">
            <CheckCircle className="mx-auto text-emerald-500 mb-2" size={48} />
            <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
              {lang === 'EN' ? 'Registration Successful!' : 'নিবন্ধন সফল হয়েছে!'}
            </h3>
            <p className="text-emerald-600 dark:text-emerald-400 mt-1">
              {lang === 'EN' ? 'You will receive alerts for the selected location.' : 'আপনি নির্বাচিত অবস্থানের জন্য সতর্কতা পাবেন।'}
            </p>
            <button 
              onClick={() => setStatus('IDLE')}
              className="mt-4 text-sm font-semibold underline text-emerald-700 dark:text-emerald-300"
            >
              {lang === 'EN' ? 'Register another' : 'অন্য একটি নিবন্ধন করুন'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {TEXT.name[lang]}
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                placeholder={lang === 'EN' ? "Ex: Ayan Saha" : "যেমন: আয়ন সাহা"}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Contact Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'EN' ? "Phone or Email" : "ফোন অথবা ইমেইল"}
              </label>
              <div className="relative">
                <input
                  required
                  type="text"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${validationError ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'} bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all`}
                  placeholder={lang === 'EN' ? "+8801XXX... or user@example.com" : "+৮৮০১XXX... অথবা user@example.com"}
                  value={formData.contact}
                  onChange={e => {
                    setFormData({ ...formData, contact: e.target.value });
                    if(validationError) setValidationError('');
                  }}
                />
                <div className="absolute left-3 top-3.5 text-slate-400">
                  {formData.contact.includes('@') ? <Mail size={18} /> : <Phone size={18} />}
                </div>
              </div>
              {validationError && (
                <div className="flex items-center gap-1 text-red-500 text-sm mt-1 animate-fade-in">
                  <AlertCircle size={14} />
                  <span>{validationError}</span>
                </div>
              )}
            </div>

            {/* Location Search Field */}
            <div ref={wrapperRef} className="relative">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {TEXT.district[lang]} (Global Search)
              </label>
              
              {!selectedLocation ? (
                <div className="relative">
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder={TEXT.searchPlaceholder[lang]}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                  />
                  <div className="absolute left-3 top-3.5 text-slate-400">
                     {isSearching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                  </div>

                  {/* Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden max-h-60 overflow-y-auto">
                      {suggestions.map((loc, idx) => (
                        <button
                          type="button"
                          key={`${loc.lat}-${loc.lon}-${idx}`}
                          onClick={() => handleSelectLocation(loc)}
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-3 border-b border-slate-50 dark:border-slate-700/50 last:border-0"
                        >
                          <MapPin size={16} className="text-orange-500 flex-shrink-0" />
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">{loc.name}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {[loc.state, loc.country].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 dark:bg-orange-800 p-2 rounded-full text-orange-600 dark:text-orange-200">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{selectedLocation.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {[selectedLocation.state, selectedLocation.country].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearLocation}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded-full transition-colors"
                    title="Change Location"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Question Field (New) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {TEXT.questionLabel[lang]}
              </label>
              <div className="relative">
                <textarea
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all h-24 resize-none"
                  placeholder={TEXT.questionPlaceholder[lang]}
                  value={formData.question}
                  onChange={e => setFormData({ ...formData, question: e.target.value })}
                />
                <div className="absolute left-3 top-3.5 text-slate-400">
                  <MessageSquare size={18} />
                </div>
              </div>
            </div>

            <button
              disabled={status === 'SENDING' || !selectedLocation}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-xl shadow-lg transform active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {status === 'SENDING' ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processing...</span>
                </>
              ) : (
                TEXT.submit[lang]
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
