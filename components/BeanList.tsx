import React from 'react';
import { CoffeeBean } from '../types';
import { Plus, Archive, Coffee } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface Props {
  beans: CoffeeBean[];
  onSelectBean: (bean: CoffeeBean) => void;
  onAddBean: () => void;
  lang: 'es' | 'en';
}

const BeanList: React.FC<Props> = ({ beans, onSelectBean, onAddBean, lang }) => {
  const t = TRANSLATIONS[lang];
  const dateLocale = lang === 'es' ? 'es-ES' : 'en-US';

  return (
    <div className="pb-24 max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">{t.myCoffees}</h1>
           <p className="text-stone-500 dark:text-stone-400 mt-1">{t.manageStock}</p>
        </div>
        <button 
          onClick={onAddBean}
          className="w-full sm:w-auto bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-5 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-stone-800 dark:hover:bg-white transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus className="w-4 h-4" /> {t.addCoffee}
        </button>
      </div>

      {beans.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white dark:bg-stone-900 rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-800">
          <Coffee className="w-16 h-16 text-stone-200 dark:text-stone-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-stone-500 dark:text-stone-400">{t.noCoffees}</h3>
          <p className="text-stone-400 text-sm mt-2">{t.addFirst}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {beans.map(bean => {
             const recipeCount = bean.recipes.length;
             const lastBrew = recipeCount > 0 ? new Date(bean.recipes[bean.recipes.length - 1].date) : null;
             
             return (
              <div 
                key={bean.id}
                onClick={() => onSelectBean(bean)}
                className="bg-white dark:bg-stone-900 p-5 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 hover:border-amber-500 dark:hover:border-amber-600 cursor-pointer transition-all group relative overflow-hidden active:bg-stone-50 dark:active:bg-stone-800"
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider truncate max-w-[80%]">{bean.roaster}</span>
                    {bean.isArchived && <Archive className="w-4 h-4 text-stone-300" />}
                  </div>
                  
                  <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-1 leading-tight">{bean.name}</h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mb-4 line-clamp-1">{bean.origin} · {bean.process}</p>

                  <div className="flex items-center gap-4 text-xs font-medium text-stone-400 dark:text-stone-500 pt-4 border-t border-stone-100 dark:border-stone-800">
                    <span className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2 py-1 rounded">
                      {recipeCount} {recipeCount === 1 ? t.recipe : t.recipes}
                    </span>
                    {lastBrew && (
                      <span className="truncate">{t.last}: {lastBrew.toLocaleDateString(dateLocale)}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BeanList;