
import React from 'react';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from 'recharts';
import { PredictionData, Language } from '../types';
import { TEXT } from '../constants';

interface PredictionChartProps {
  data: PredictionData[];
  lang: Language;
}

export const PredictionChart: React.FC<PredictionChartProps> = ({ data, lang }) => {
  
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(lang === 'EN' ? 'en-US' : 'bn-BD', {
      weekday: 'short',
      day: 'numeric'
    });
  };

  const formatTooltipDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(lang === 'EN' ? 'en-US' : 'bn-BD', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          {TEXT.aiPrediction[lang]}
        </h3>
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded dark:bg-blue-900 dark:text-blue-200">
          Model: Regression v1.2
        </span>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#94a3b8', fontSize: 12}} 
            dy={10}
            tickFormatter={formatDate}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#94a3b8', fontSize: 12}}
            domain={['dataMin - 2', 'dataMax + 2']}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelFormatter={formatTooltipDate}
            formatter={(value: number) => [`${value}°C`, lang === 'EN' ? 'Max Temp' : 'সর্বোচ্চ তাপমাত্রা']}
          />
          <Area 
            type="monotone" 
            dataKey="temp" 
            stroke="#f97316" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorTemp)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
