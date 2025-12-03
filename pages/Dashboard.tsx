
import React, { useEffect, useState, useRef } from 'react';
import { TEXT } from '../constants';
import { Language, WeatherData, PredictionData, RiskLevel, AiReport, LocationData } from '../types';
import { fetchWeatherData, resolveLocation, searchLocations } from '../utils/weatherService';
import { fetchLocationReport } from '../utils/geminiService';
import { aiInstance } from '../utils/aiPredictor';
import { PredictionChart } from '../components/PredictionChart';
import { RiskMeter } from '../components/RiskMeter';
import { MapHeatList } from '../components/MapHeatList';
import { Thermometer, Droplets, Sun, Wind, Calendar, Clock, Search, Newspaper, MapPin, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

interface DashboardProps {
  lang: Language;
}

export const Dashboard: React.FC<DashboardProps> = ({ lang }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [prediction, setPrediction] = useState<PredictionData[]>([]);
  const [aiReport, setAiReport] = useState<AiReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState({ lat: 23.8103, lon: 90.4125, name: 'Dhaka, Bangladesh' });
  
  // Autocomplete states
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Initial Load & Lang Change
  useEffect(() => {
    loadWeatherData(currentLocation.lat, currentLocation.lon, currentLocation.name);
    
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [lang]);

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

  // Debounce Search for Autocomplete
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2 && !isSearching) {
        const results = await searchLocations(searchQuery);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, isSearching]);

  const loadWeatherData = async (lat: number, lon: number, name: string) => {
    setLoading(true);
    const current = await fetchWeatherData(lat, lon, name);
    setWeather(current);
    
    const preds = aiInstance.predict(current.temperature);
    setPrediction(preds);
    setLoading(false);

    // Trigger AI Report in background
    loadAiReport(name);
  };

  const loadAiReport = async (location: string) => {
    setReportLoading(true);
    const report = await fetchLocationReport(location, lang);
    setAiReport(report);
    setReportLoading(false);
  };

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    performSearch(searchQuery);
  };

  const performSearch = async (query: string) => {
    setIsSearching(true);
    setSearchError('');
    setShowSuggestions(false);
    
    try {
      const loc = await resolveLocation(query);
      if (loc) {
        updateLocation(loc);
      } else {
        setSearchError(lang === 'EN' ? 'Location not found.' : 'অবস্থান পাওয়া যায়নি।');
      }
    } catch (e) {
      setSearchError(lang === 'EN' ? 'Search failed.' : 'অনুসন্ধান ব্যর্থ হয়েছে।');
    } finally {
      setIsSearching(false);
    }
  };

  const updateLocation = async (loc: LocationData) => {
    const fullName = `${loc.name}${loc.state ? `, ${loc.state}` : ''}, ${loc.country}`;
    setSearchQuery(''); // Clear search on success or keep it? Usually clear or set to name. 
    // Let's clear it to show placeholder or keep it clean.
    // Actually, user might want to see what they searched. 
    setSearchQuery(''); 
    setCurrentLocation({ lat: loc.lat, lon: loc.lon, name: fullName });
    await loadWeatherData(loc.lat, loc.lon, fullName);
    setSuggestions([]);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(lang === 'EN' ? 'en-US' : 'bn-BD', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(lang === 'EN' ? 'en-US' : 'bn-BD', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (lang === 'BN') {
      if (hour < 12) return 'শুভ সকাল';
      if (hour < 17) return 'শুভ দুপুর';
      return 'শুভ সন্ধ্যা';
    }
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading && !weather) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
        <p className="text-slate-500 animate-pulse">Initializing Climate Systems...</p>
      </div>
    );
  }

  const currentRisk = prediction.length > 0 ? prediction[0].riskLevel : RiskLevel.LOW;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header & Global Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="w-full lg:w-auto">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            {getGreeting()}
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400 mt-2">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span className="text-lg capitalize">{formatDate(currentTime)}</span>
            </div>
             <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md text-slate-700 dark:text-slate-300 font-mono text-sm">
              <Clock size={16} />
              <span>{formatTime(currentTime)}</span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96 relative" ref={wrapperRef}>
          <form onSubmit={handleManualSearch} className="relative group">
            <input 
              type="text" 
              placeholder={TEXT.searchPlaceholder[lang]}
              value={searchQuery}
              disabled={isSearching}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 outline-none shadow-sm transition-all disabled:opacity-70"
            />
            <div className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-orange-500 transition-colors">
               {isSearching ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            </div>
            <button 
              type="submit" 
              disabled={isSearching || !searchQuery.trim()}
              className="absolute right-2 top-2 p-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500 hover:text-orange-500 disabled:opacity-0 transition-all"
            >
              <Search size={16} />
            </button>
          </form>
          
          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden max-h-64 overflow-y-auto">
              {suggestions.map((loc, idx) => (
                <button
                  key={`${loc.lat}-${loc.lon}-${idx}`}
                  onClick={() => updateLocation(loc)}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between group border-b border-slate-50 dark:border-slate-700/50 last:border-0"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{loc.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {[loc.state, loc.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 text-orange-500 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                </button>
              ))}
            </div>
          )}

          {searchError && (
            <div className="absolute mt-2 w-full flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg z-10">
              <AlertCircle size={14} />
              {searchError}
            </div>
          )}
        </div>
      </div>

      {/* Weather Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
            <Thermometer size={100} />
          </div>
          <div className="flex items-center gap-3 opacity-90 mb-2">
            <MapPin size={18} />
            <span className="text-sm font-bold uppercase tracking-wide">Selected Location</span>
          </div>
          <div className="text-4xl font-bold mt-2">{weather?.temperature}°C</div>
          <div className="text-sm font-medium opacity-90 mt-1 truncate pr-4">{weather?.location}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 text-blue-500 mb-2">
            <Droplets size={20} />
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Humidity</span>
          </div>
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{weather?.humidity}%</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 text-amber-500 mb-2">
            <Sun size={20} />
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">UV Index</span>
          </div>
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{weather?.uvIndex.toFixed(1)}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 text-teal-500 mb-2">
            <Wind size={20} />
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Wind Speed</span>
          </div>
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{weather?.windSpeed.toFixed(1)} km/h</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <PredictionChart data={prediction} lang={lang} />
        </div>
        
        {/* Risk & List */}
        <div className="flex flex-col gap-6">
            <RiskMeter risk={currentRisk} lang={lang} />
            <MapHeatList lang={lang} />
        </div>
      </div>

      {/* AI Reports Section (Powered by Gemini) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* News Report */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <Newspaper size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{TEXT.aiReportTitle[lang]}</h3>
          </div>
          
          {reportLoading ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              <Loader2 className="animate-spin mb-2" size={32} />
              <span className="text-sm">{TEXT.generating[lang]}</span>
            </div>
          ) : (
            <>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: aiReport?.newsSummary.replace(/\n/g, '<br/>') || '' }} />
              </div>
              {aiReport?.newsSources && aiReport.newsSources.length > 0 && (
                 <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                   <p className="text-xs font-bold text-slate-400 uppercase mb-2">Sources</p>
                   <div className="flex flex-wrap gap-2">
                     {aiReport.newsSources.slice(0, 3).map((src, i) => (
                       <a key={i} href={src.uri} target="_blank" rel="noreferrer" className="text-xs bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400 px-2 py-1 rounded hover:underline truncate max-w-[200px]">
                         {src.title || 'Source link'}
                       </a>
                     ))}
                   </div>
                 </div>
              )}
            </>
          )}
        </div>

        {/* Nearby Relief (Maps Grounding) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
              <MapPin size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{TEXT.nearbyTitle[lang]}</h3>
          </div>

           {reportLoading ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              <Loader2 className="animate-spin mb-2" size={32} />
              <span className="text-sm">{TEXT.generating[lang]}</span>
            </div>
          ) : (
             <>
               <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: aiReport?.reliefCenters.replace(/\n/g, '<br/>') || '' }} />
               </div>
                {aiReport?.reliefSources && aiReport.reliefSources.length > 0 && (
                 <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                   <p className="text-xs font-bold text-slate-400 uppercase mb-2">Map Links</p>
                   <div className="flex flex-wrap gap-2">
                     {aiReport.reliefSources.slice(0, 3).map((src, i) => (
                       <a key={i} href={src.uri} target="_blank" rel="noreferrer" className="text-xs bg-slate-100 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded hover:underline truncate max-w-[200px]">
                         {src.title || 'View on Maps'}
                       </a>
                     ))}
                   </div>
                 </div>
              )}
             </>
          )}
        </div>
      </div>
    </div>
  );
};