import React from 'react';
import { BrewLog } from '../types';
import { Calendar, Coffee, Sliders, Droplet, Star, ArrowRight } from 'lucide-react';

interface Props {
  logs: BrewLog[];
  onSelectLog: (log: BrewLog) => void;
  onNewLog: () => void;
}

const BrewList: React.FC<Props> = ({ logs, onSelectLog, onNewLog }) => {
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-2xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Brew Journal</h1>
        <button 
          onClick={onNewLog}
          className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
        >
          + New Entry
        </button>
      </div>

      {sortedLogs.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 border-dashed">
          <Coffee className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-stone-600 dark:text-stone-400">No brews recorded yet</h3>
          <p className="text-stone-500 text-sm mt-1">Start your journey by adding your first brew.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedLogs.map(log => (
            <div 
              key={log.id}
              onClick={() => onSelectLog(log)}
              className="bg-white dark:bg-stone-900 p-4 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 hover:border-amber-500 dark:hover:border-amber-700 cursor-pointer transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-stone-800 dark:text-stone-100 text-lg">{log.profile.name}</h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(log.date).toLocaleDateString()} · {log.profile.roaster}
                  </p>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                  log.result.overallScore >= 8 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  log.result.overallScore >= 6 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                  'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300'
                }`}>
                  <Star className="w-3 h-3 fill-current" />
                  {log.result.overallScore}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-xs text-stone-600 dark:text-stone-400">
                <div className="flex items-center gap-1 bg-stone-50 dark:bg-stone-800/50 p-1.5 rounded">
                  <Sliders className="w-3 h-3" />
                  <span className="truncate">{log.config.method}</span>
                </div>
                <div className="flex items-center gap-1 bg-stone-50 dark:bg-stone-800/50 p-1.5 rounded">
                  <Droplet className="w-3 h-3" />
                  <span>1:{(log.config.waterAmount / log.config.dose).toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1 bg-stone-50 dark:bg-stone-800/50 p-1.5 rounded">
                  <span className="font-mono"> Grind: {log.config.grinderSetting}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrewList;