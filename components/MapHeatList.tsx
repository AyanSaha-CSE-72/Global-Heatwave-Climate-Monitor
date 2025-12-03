
import React from 'react';
import { GLOBAL_CITIES, TEXT } from '../constants';
import { Language, RiskLevel } from '../types';

interface MapHeatListProps {
  lang: Language;
}

export const MapHeatList: React.FC<MapHeatListProps> = ({ lang }) => {
  // Simulate heat data for cities based on random seed
  const getCityRisk = (name: string): RiskLevel => {
    const hash = name.length + new Date().getDay();
    if (hash % 4 === 0) return RiskLevel.EXTREME;
    if (hash % 3 === 0) return RiskLevel.HIGH;
    if (hash % 2 === 0) return RiskLevel.MODERATE;
    return RiskLevel.LOW;
  };

  const getBadgeColor = (risk: RiskLevel) => {
    switch(risk) {
      case RiskLevel.EXTREME: return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      case RiskLevel.HIGH: return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
      case RiskLevel.MODERATE: return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
        {TEXT.districtHeat[lang]}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
        {GLOBAL_CITIES.map((city) => {
          const risk = getCityRisk(city);
          return (
            <div key={city} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <span className="text-slate-700 dark:text-slate-300 font-medium">{city}</span>
              <span className={`px-2 py-1 rounded text-xs font-bold border ${getBadgeColor(risk)}`}>
                {risk}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
