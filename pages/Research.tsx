import React, { useMemo } from 'react';
import { TEXT, MOCK_SATELLITE_DATA } from '../constants';
import { Language } from '../types';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ResearchProps {
  lang: Language;
}

export const Research: React.FC<ResearchProps> = ({ lang }) => {
  
  const chartData = useMemo(() => {
    return MOCK_SATELLITE_DATA.map(item => ({
      x: item.humidity,
      y: item.avgTemp,
      z: 1 // size
    }));
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">{TEXT.research[lang]} Mode</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          This section provides transparency into the AI Predictive Model. We utilize a regression analysis based on historical satellite data 
          combined with real-time API feeds to determine the Heat Index (HI). The model focuses on the correlation between 
          relative humidity and ambient temperature to predict "Feels Like" temperatures 7 days in advance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
             <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">Model Formula</h3>
             <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg font-mono text-sm text-slate-600 dark:text-slate-400">
               HI = T + 0.555 * ((e - 10)) <br/>
               where e = 6.11 * exp(5417.7530 * ((1/273.16) - (1/(273.15 + Td))))
             </div>
             <div className="mt-4">
               <h4 className="font-bold text-slate-700 dark:text-slate-300">Features Used:</h4>
               <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                 <li>Land Surface Temperature (LST) - Sentinel-3</li>
                 <li>Relative Humidity (2m)</li>
                 <li>Solar Radiation (UV Index)</li>
                 <li>Historical Heatwave Bias</li>
               </ul>
             </div>
          </div>

          <div className="h-[300px] w-full">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">Temp vs Humidity Correlation</h3>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="x" name="Humidity" unit="%" />
                <YAxis type="number" dataKey="y" name="Temp" unit="°C" domain={[20, 45]}/>
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px' }}/>
                <Legend />
                <Scatter name="Historical Data" data={chartData} fill="#f97316" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Raw Dataset Preview (Satellite JSON)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm">
                <th className="p-3">Date</th>
                <th className="p-3">Avg Temp (°C)</th>
                <th className="p-3">Humidity (%)</th>
                <th className="p-3">Source</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 dark:text-slate-300 text-sm">
              {MOCK_SATELLITE_DATA.slice(0, 5).map((row, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="p-3">{row.date}</td>
                  <td className="p-3">{row.avgTemp.toFixed(1)}</td>
                  <td className="p-3">{row.humidity.toFixed(1)}</td>
                  <td className="p-3">{row.recordedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-slate-400 mt-2 italic">Showing first 5 rows of {MOCK_SATELLITE_DATA.length} records.</p>
        </div>
      </div>
    </div>
  );
};