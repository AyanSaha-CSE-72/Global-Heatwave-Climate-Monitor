import React from 'react';
import { RiskLevel, Language } from '../types';
import { TEXT } from '../constants';

interface RiskMeterProps {
  risk: RiskLevel;
  lang: Language;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ risk, lang }) => {
  const getRiskColor = (r: RiskLevel) => {
    switch (r) {
      case RiskLevel.LOW: return 'bg-emerald-500';
      case RiskLevel.MODERATE: return 'bg-amber-500';
      case RiskLevel.HIGH: return 'bg-orange-600';
      case RiskLevel.EXTREME: return 'bg-red-700';
      default: return 'bg-gray-400';
    }
  };

  const levels = [RiskLevel.LOW, RiskLevel.MODERATE, RiskLevel.HIGH, RiskLevel.EXTREME];
  const activeIndex = levels.indexOf(risk);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
        {TEXT.riskMeter[lang]}
      </h3>
      
      <div className="flex flex-col items-center">
        <div className={`w-32 h-32 rounded-full border-8 border-slate-100 dark:border-slate-700 flex items-center justify-center relative transition-all duration-500 ${getRiskColor(risk)}/10`}>
          <div className={`text-2xl font-bold ${getRiskColor(risk).replace('bg-', 'text-')}`}>
            {risk}
          </div>
          {/* Animated Pulse */}
          {activeIndex >= 2 && (
            <div className={`absolute inset-0 rounded-full ${getRiskColor(risk)} opacity-20 animate-ping`} />
          )}
        </div>

        <div className="w-full mt-6 grid grid-cols-4 gap-1">
          {levels.map((level, idx) => (
            <div key={level} className="flex flex-col items-center">
               <div 
                className={`w-full h-2 rounded-full transition-all duration-300 ${idx <= activeIndex ? getRiskColor(level) : 'bg-slate-200 dark:bg-slate-700'}`}
               />
               <span className="text-[10px] uppercase mt-1 text-slate-400 font-bold">{level.substring(0,3)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};